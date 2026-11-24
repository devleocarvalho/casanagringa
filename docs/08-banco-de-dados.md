# 08 — Banco de Dados Completo (PostgreSQL + Firestore + Índices de Busca) · CASA NA GRINGA

| Campo | Valor |
|---|---|
| **Objetivo** | Especificar o modelo físico completo em **PostgreSQL 17** (DDL SQL com schemas, tipos ENUM, ~56 tabelas, PKs/FKs, constraints, índices B-Tree/GIN/HNSW, particionamento e **Row-Level Security — RLS**), além da estrutura de coleções **Firestore** (tempo real) e esquema do **Índice de Busca** |
| **Público** | Engenheiros backend, DBAs, arquitetos de dados, engenheiros de segurança |
| **Status** | Rascunho v0.1 |
| **Data** | 16/11/2026 |
| **Contrato comum** | [00-premissas-e-decisoes.md](00-premissas-e-decisoes.md) |
| **Documentos relacionados** | [04-arquitetura.md](04-arquitetura.md) · [05-seguranca.md](05-seguranca.md) · [07-arquitetura-de-dados.md](07-arquitetura-de-dados.md) · [10-modelagem-dominio.md](10-modelagem-dominio.md) |

---

## 1. Visão Geral da Persistência Poliglota

| Camada | Tecnologia | Papel |
|---|---|---|
| **Sistema de Registro (SSOT)** | **Cloud SQL for PostgreSQL 17** (+ `pgcrypto`, `pgvector`, `pg_trgm`) | Transações, CRM, imóveis, documentos (metadados), workflow 7 fases, DD, parceiros, comissões, consentimentos, AI logs, trilha imutável |
| **Tempo Real & UI Reativa** | **Cloud Firestore** | Sessões de chat ao vivo, notificações do Concierge, status ao vivo da timeline e presença |
| **Cofre Binário & WORM** | **Cloud Storage (CMEK / Bucket Lock)** | Arquivos PDF/imagens cifrados e exportações imutáveis de auditoria |
| **Busca Avançada** | **Vertex AI Search / Typesense → OpenSearch** | Facetas, filtros combinados, relevância textual PT/EN/ES e busca geoespacial |

---

## 2. DDL Completo — PostgreSQL 17 (Schemas Modulares)

> Convenções: chaves primárias UUID v7 (geradas na aplicação para ordenação temporal); timestamps sempre `TIMESTAMPTZ`; valores monetários em `BIGINT` (centavos) ou `NUMERIC(14,2)` + `currency CHAR(3)`; `soft delete` apenas onde permitido por LGPD/GDPR (com cripto-exclusão nas colunas PII quando expirado).

### 2.1 Extensões, Schemas e Tipos ENUM

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE SCHEMA IF NOT EXISTS iam;
CREATE SCHEMA IF NOT EXISTS crm;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS deal;
CREATE SCHEMA IF NOT EXISTS vault;
CREATE SCHEMA IF NOT EXISTS dd;
CREATE SCHEMA IF NOT EXISTS fin;
CREATE SCHEMA IF NOT EXISTS ai;
CREATE SCHEMA IF NOT EXISTS audit;

-- Tipos de domínio principais
CREATE TYPE iam.role_type AS ENUM (
  'client', 'client_family_member', 'advisor', 'legal_reviewer', 'tax_reviewer',
  'broker_partner', 'bank_partner', 'notary_partner', 'compliance_officer',
  'ops_manager', 'support_agent', 'finance_admin', 'platform_admin', 'auditor'
);

CREATE TYPE iam.locale_code AS ENUM ('pt-BR', 'pt-PT', 'en-US', 'es-ES');
CREATE TYPE iam.kyc_status AS ENUM ('unverified', 'pending', 'verified_l2', 'verified_edd', 'rejected', 'expired');
CREATE TYPE catalog.country_code AS ENUM ('PT', 'ES');
CREATE TYPE catalog.property_purpose AS ENUM ('residence', 'investment', 'vacation', 'hybrid');
CREATE TYPE deal.phase_code AS ENUM (
  'discovery', 'planning', 'documentation', 'search_selection',
  'due_diligence', 'purchase', 'post_sale'
);
CREATE TYPE deal.deal_status AS ENUM ('active', 'on_hold', 'completed', 'cancelled', 'blocked_compliance');
CREATE TYPE vault.doc_status AS ENUM (
  'pending_upload', 'uploaded', 'ai_screening', 'awaiting_human_review',
  'approved', 'rejected', 'expired', 'revoked'
);
CREATE TYPE dd.risk_level AS ENUM ('low', 'medium', 'high', 'critical_blocker');
CREATE TYPE ai.agent_type AS ENUM (
  'orchestrator', 'real_estate', 'financial', 'legal', 'tax',
  'relocation', 'concierge', 'compliance', 'due_diligence'
);
```

### 2.2 Schema `iam` — Identidade, MFA, Sessões, Papéis e Consentimentos (7 tabelas)

```sql
-- 1. Usuários (espelha Firebase Identity Platform uid)
CREATE TABLE iam.users (
  id                UUID PRIMARY KEY,
  firebase_uid      TEXT NOT NULL UNIQUE,
  email             TEXT NOT NULL UNIQUE,
  full_name         TEXT NOT NULL,
  phone_e164        TEXT,
  preferred_locale  iam.locale_code NOT NULL DEFAULT 'pt-BR',
  origin_country    CHAR(2) NOT NULL DEFAULT 'BR',
  mfa_enforced      BOOLEAN NOT NULL DEFAULT TRUE,
  mfa_enrolled      BOOLEAN NOT NULL DEFAULT FALSE,
  kyc_level         iam.kyc_status NOT NULL DEFAULT 'unverified',
  status            TEXT NOT NULL CHECK (status IN ('active', 'suspended', 'locked', 'anonymized')) DEFAULT 'active',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  anonymized_at     TIMESTAMPTZ
);

-- 2. Atribuição RBAC (um usuário pode ter escopos por jurisdição)
CREATE TABLE iam.user_roles (
  id                UUID PRIMARY KEY,
  user_id           UUID NOT NULL REFERENCES iam.users(id) ON DELETE CASCADE,
  role              iam.role_type NOT NULL,
  jurisdiction      CHAR(2), -- NULL = global, 'PT', 'ES', 'BR'
  granted_by        UUID REFERENCES iam.users(id),
  granted_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at        TIMESTAMPTZ,
  UNIQUE (user_id, role, jurisdiction)
);

-- 3. Dados fiscais/identidade criptografados em coluna (nível restrito)
CREATE TABLE iam.user_sensitive_ids (
  user_id           UUID PRIMARY KEY REFERENCES iam.users(id) ON DELETE CASCADE,
  cpf_enc           BYTEA, -- Cifrado via KMS/Envelope
  nif_pt_enc        BYTEA,
  nie_es_enc        BYTEA,
  passport_hash     TEXT,  -- SHA-256 + salt para detecção de duplicidade sem expor número
  passport_country  CHAR(2),
  passport_exp_date DATE,
  kms_key_version   TEXT NOT NULL,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Chaves de criptografia por cliente (suporte a crypto-shredding)
CREATE TABLE iam.tenant_encryption_keys (
  user_id           UUID PRIMARY KEY REFERENCES iam.users(id),
  wrapped_kek       BYTEA NOT NULL,
  kms_resource_uri  TEXT NOT NULL,
  status            TEXT NOT NULL CHECK (status IN ('active', 'rotated', 'shredded')) DEFAULT 'active',
  rotated_at        TIMESTAMPTZ,
  shredded_at       TIMESTAMPTZ
);

-- 5. Dispositivos e sessões confiáveis
CREATE TABLE iam.user_sessions (
  id                UUID PRIMARY KEY,
  user_id           UUID NOT NULL REFERENCES iam.users(id) ON DELETE CASCADE,
  device_fp_hash    TEXT NOT NULL,
  ip_country        CHAR(2),
  mfa_verified_at   TIMESTAMPTZ,
  last_seen_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at        TIMESTAMPTZ,
  revoke_reason     TEXT
);

-- 6. Registro imutável de consentimentos LGPD/GDPR (append-only)
CREATE TABLE iam.consent_records (
  id                UUID PRIMARY KEY,
  user_id           UUID NOT NULL REFERENCES iam.users(id),
  purpose           TEXT NOT NULL CHECK (purpose IN (
                      'terms_of_service', 'privacy_policy', 'marketing_email',
                      'marketing_whatsapp', 'ai_processing', 'partner_data_share', 'cookies_analytics'
                    )),
  policy_version    TEXT NOT NULL,
  granted           BOOLEAN NOT NULL,
  partner_id        UUID, -- Preenchido quando consentimento específico para compartilhar com parceiro
  scope_json        JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_hash           TEXT NOT NULL,
  captured_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Solicitações de Direitos dos Titulares (DSR - acesso, exportação, exclusão)
CREATE TABLE iam.data_subject_requests (
  id                UUID PRIMARY KEY,
  user_id           UUID NOT NULL REFERENCES iam.users(id),
  request_type      TEXT NOT NULL CHECK (request_type IN ('export', 'rectify', 'erase', 'restrict', 'portability')),
  status            TEXT NOT NULL CHECK (status IN ('open', 'in_review', 'completed', 'rejected_legal_hold')) DEFAULT 'open',
  due_at            TIMESTAMPTZ NOT NULL,
  handled_by        UUID REFERENCES iam.users(id),
  resolution_note   TEXT,
  export_bucket_uri TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at      TIMESTAMPTZ
);
```

### 2.3 Schema `crm` — Leads, Perfil Comprador, Pipeline, Tarefas, Visitas e Comunicação (8 tabelas)

```sql
-- 8. Perfil detalhado do comprador (Fase 2 - Planejamento + Match IA)
CREATE TABLE crm.buyer_profiles (
  id                  UUID PRIMARY KEY,
  user_id             UUID NOT NULL UNIQUE REFERENCES iam.users(id),
  segment_code        TEXT CHECK (segment_code IN ('S1_BR_IN_BR', 'S2_BR_IN_PT', 'S3_INV_ES', 'S4_PT_ES', 'S5_DIASPORA', 'S6_PALOP', 'EXPLORER')),
  target_countries    catalog.country_code[] NOT NULL DEFAULT ARRAY['PT']::catalog.country_code[],
  target_cities       TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  purpose             catalog.property_purpose NOT NULL DEFAULT 'residence',
  budget_min_eur      NUMERIC(14,2),
  budget_max_eur      NUMERIC(14,2),
  equity_available_eur NUMERIC(14,2),
  needs_mortgage      BOOLEAN NOT NULL DEFAULT FALSE,
  target_horizon_mo   INT CHECK (target_horizon_mo BETWEEN 1 AND 60),
  residency_goal      TEXT,
  tax_residence       CHAR(2) NOT NULL DEFAULT 'BR',
  preferences_json    JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Leads e oportunidades no pipeline comercial
CREATE TABLE crm.leads (
  id                  UUID PRIMARY KEY,
  user_id             UUID REFERENCES iam.users(id),
  full_name           TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone_e164          TEXT,
  origin_source       TEXT NOT NULL, -- 'seo', 'simulator_pt', 'simulator_es', 'youtube', 'referral_partner', 'ads'
  utm_json            JSONB NOT NULL DEFAULT '{}'::jsonb,
  stage               TEXT NOT NULL CHECK (stage IN (
                        'new_lead', 'qualified_mql', 'diagnostic_scheduled',
                        'sql_active_plan', 'property_selection', 'under_dd', 'closed_won', 'lost'
                      )) DEFAULT 'new_lead',
  lead_score          INT NOT NULL DEFAULT 0 CHECK (lead_score BETWEEN 0 AND 100),
  assigned_advisor_id UUID REFERENCES iam.users(id),
  estimated_budget_eur NUMERIC(14,2),
  lost_reason         TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Histórico de pontuação (Lead Scoring explicável)
CREATE TABLE crm.lead_score_events (
  id                  UUID PRIMARY KEY,
  lead_id             UUID NOT NULL REFERENCES crm.leads(id) ON DELETE CASCADE,
  signal_name         TEXT NOT NULL,
  points_delta        INT NOT NULL,
  metadata_json       JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Interações omnicanal (ligações, reuniões, WhatsApp verificado, e-mails)
CREATE TABLE crm.interactions (
  id                  UUID PRIMARY KEY,
  lead_id             UUID REFERENCES crm.leads(id),
  user_id             UUID REFERENCES iam.users(id),
  deal_id             UUID, -- FK adicionada após deal.deals
  channel             TEXT NOT NULL CHECK (channel IN ('video_call', 'whatsapp', 'email', 'phone', 'in_person', 'platform_note')),
  direction           TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound', 'internal')),
  author_id           UUID REFERENCES iam.users(id),
  summary             TEXT NOT NULL,
  recording_uri       TEXT,
  occurred_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Tarefas operacionais de consultores e equipe
CREATE TABLE crm.tasks (
  id                  UUID PRIMARY KEY,
  deal_id             UUID,
  lead_id             UUID REFERENCES crm.leads(id),
  assigned_to         UUID NOT NULL REFERENCES iam.users(id),
  title               TEXT NOT NULL,
  description         TEXT,
  priority            TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status              TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'blocked', 'done', 'cancelled')) DEFAULT 'todo',
  due_at              TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Agenda de assessorias e visitas a imóveis (presencial ou vídeo ao vivo)
CREATE TABLE crm.appointments (
  id                  UUID PRIMARY KEY,
  client_user_id      UUID NOT NULL REFERENCES iam.users(id),
  advisor_id          UUID NOT NULL REFERENCES iam.users(id),
  property_id         UUID,
  deal_id             UUID,
  appointment_type    TEXT NOT NULL CHECK (appointment_type IN ('strategic_diagnostic', 'remote_video_tour', 'in_person_visit', 'legal_briefing', 'bank_meeting')),
  status              TEXT NOT NULL CHECK (status IN ('scheduled', 'confirmed', 'completed', 'no_show', 'cancelled')) DEFAULT 'scheduled',
  starts_at           TIMESTAMPTZ NOT NULL,
  ends_at             TIMESTAMPTZ NOT NULL,
  location_or_url     TEXT,
  visit_report_json   JSONB,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Parceiros externos (imobiliárias AMI/AICAT, advogados, bancos, câmbio)
CREATE TABLE crm.partners (
  id                  UUID PRIMARY KEY,
  legal_name          TEXT NOT NULL,
  trade_name          TEXT NOT NULL,
  partner_type        TEXT NOT NULL CHECK (partner_type IN ('brokerage', 'law_firm', 'tax_firm', 'credit_intermediary', 'bank', 'fx_provider', 'relocation', 'property_mgmt')),
  country             CHAR(2) NOT NULL,
  regions             TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  license_number      TEXT, -- Ex.: Número AMI, AICAT, Registo BdP, Ordem
  license_verified    BOOLEAN NOT NULL DEFAULT FALSE,
  insurance_policy_ref TEXT,
  insurance_valid_to  DATE,
  kyb_status          TEXT NOT NULL CHECK (kyb_status IN ('pending', 'approved', 'suspended', 'terminated')) DEFAULT 'pending',
  sla_response_hours  INT NOT NULL DEFAULT 24,
  avg_nps             NUMERIC(4,1),
  contract_signed_at  DATE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Usuários vinculados a empresas parceiras
CREATE TABLE crm.partner_members (
  partner_id          UUID NOT NULL REFERENCES crm.partners(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES iam.users(id) ON DELETE CASCADE,
  is_primary_contact  BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (partner_id, user_id)
);
```

### 2.4 Schema `catalog` — Country Packs, Imóveis Curados, Cidades, Impostos e Favoritos (8 tabelas)

```sql
-- 16. Country Packs versionados (regras legais, prazos, tributos por país/região)
CREATE TABLE catalog.country_packs (
  id                  UUID PRIMARY KEY,
  country             catalog.country_code NOT NULL,
  region_code         TEXT, -- Ex.: 'PT-CONT', 'ES-MD', 'ES-CT', 'ES-AN', 'ES-VC'
  version             TEXT NOT NULL,
  status              TEXT NOT NULL CHECK (status IN ('draft', 'legal_approved', 'active', 'superseded')),
  tax_rules_json      JSONB NOT NULL, -- Escalões IMT, ITP, IVA, AJD, Imposto do Selo
  workflow_template_json JSONB NOT NULL,
  effective_from      DATE NOT NULL,
  effective_to        DATE,
  approved_by_legal   UUID REFERENCES iam.users(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (country, region_code, version)
);

-- 17. Guia de Cidades e Bairros (para comparador e SEO programático)
CREATE TABLE catalog.locations (
  id                  UUID PRIMARY KEY,
  country             catalog.country_code NOT NULL,
  region_code         TEXT NOT NULL,
  city_name           TEXT NOT NULL,
  neighborhood_name   TEXT,
  slug                TEXT NOT NULL UNIQUE,
  avg_price_m2_eur    NUMERIC(10,2),
  est_gross_yield_pct NUMERIC(5,2),
  avg_closing_days    INT,
  foreign_friendly_score INT CHECK (foreign_friendly_score BETWEEN 0 AND 100),
  metrics_json        JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. Imóveis (Golden Record deduplicado)
CREATE TABLE catalog.properties (
  id                  UUID PRIMARY KEY,
  canonical_ref       TEXT NOT NULL UNIQUE, -- Ex.: CNG-PT-LIS-0042
  country             catalog.country_code NOT NULL,
  region_code         TEXT NOT NULL,
  location_id         UUID REFERENCES catalog.locations(id),
  partner_broker_id   UUID REFERENCES crm.partners(id),
  external_feed_id    TEXT,
  cadastral_hash      TEXT, -- Hash da matriz predial / referencia catastral para deduplicação MDM
  property_type       TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'penthouse', 'townhouse', 'commercial', 'land')),
  condition_type      TEXT NOT NULL CHECK (condition_type IN ('used', 'new_build', 'off_plan', 'renovated')),
  price_eur           NUMERIC(14,2) NOT NULL,
  area_sqm            NUMERIC(8,2) NOT NULL,
  bedrooms            INT NOT NULL,
  bathrooms           INT NOT NULL,
  energy_rating       TEXT,
  dd_pre_score        INT CHECK (dd_pre_score BETWEEN 0 AND 100), -- Score prévio de documentação
  est_rental_yield_pct NUMERIC(5,2),
  lat                 NUMERIC(9,6),
  lng                 NUMERIC(9,6),
  geo_precision       TEXT NOT NULL CHECK (geo_precision IN ('exact_verified', 'neighborhood')) DEFAULT 'neighborhood',
  status              TEXT NOT NULL CHECK (status IN ('draft', 'curating', 'published', 'reserved', 'sold', 'archived')) DEFAULT 'curating',
  transparency_fee_note TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. Traduções multilíngues de imóveis e locais (PT-BR, PT-PT, EN, ES)
CREATE TABLE catalog.property_translations (
  property_id         UUID NOT NULL REFERENCES catalog.properties(id) ON DELETE CASCADE,
  locale              iam.locale_code NOT NULL,
  title               TEXT NOT NULL,
  description         TEXT NOT NULL,
  neighborhood_notes  TEXT,
  PRIMARY KEY (property_id, locale)
);

-- 20. Mídias de imóveis (fotos, plantas, vídeos)
CREATE TABLE catalog.property_media (
  id                  UUID PRIMARY KEY,
  property_id         UUID NOT NULL REFERENCES catalog.properties(id) ON DELETE CASCADE,
  media_type          TEXT NOT NULL CHECK (media_type IN ('photo', 'floorplan', 'video', 'virtual_tour')),
  storage_uri         TEXT NOT NULL,
  phash               TEXT, -- Perceptual hash para deduplicação
  sort_order          INT NOT NULL DEFAULT 0,
  verified_recent     BOOLEAN NOT NULL DEFAULT FALSE
);

-- 21. Imóveis favoritos por cliente
CREATE TABLE catalog.saved_properties (
  user_id             UUID NOT NULL REFERENCES iam.users(id) ON DELETE CASCADE,
  property_id         UUID NOT NULL REFERENCES catalog.properties(id) ON DELETE CASCADE,
  notes               TEXT,
  saved_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, property_id)
);

-- 22. Match calculado entre perfil do comprador e imóvel (explicável)
CREATE TABLE catalog.property_matches (
  user_id             UUID NOT NULL REFERENCES iam.users(id) ON DELETE CASCADE,
  property_id         UUID NOT NULL REFERENCES catalog.properties(id) ON DELETE CASCADE,
  match_score         INT NOT NULL CHECK (match_score BETWEEN 0 AND 100),
  explanation_json    JSONB NOT NULL, -- Pesos: orçamento, localização, yield, risco DD
  computed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, property_id)
);

-- 23. Simulações financeiras salvas pelo usuário
CREATE TABLE catalog.cost_simulations (
  id                  UUID PRIMARY KEY,
  user_id             UUID REFERENCES iam.users(id),
  country             catalog.country_code NOT NULL,
  region_code         TEXT NOT NULL,
  property_id         UUID REFERENCES catalog.properties(id),
  inputs_json         JSONB NOT NULL,
  breakdown_json      JSONB NOT NULL,
  country_pack_version TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.5 Schema `deal` — Transação, Workflow das 7 Fases, Checklists, Propostas e Outbox (7 tabelas)

```sql
-- 24. Processo de compra / transação (coração do negócio)
CREATE TABLE deal.deals (
  id                  UUID PRIMARY KEY,
  deal_code           TEXT NOT NULL UNIQUE, -- Ex.: DEAL-2027-0012
  client_user_id      UUID NOT NULL REFERENCES iam.users(id),
  property_id         UUID REFERENCES catalog.properties(id),
  country             catalog.country_code NOT NULL,
  region_code         TEXT NOT NULL,
  country_pack_id     UUID NOT NULL REFERENCES catalog.country_packs(id),
  current_phase       deal.phase_code NOT NULL DEFAULT 'discovery',
  status              deal.deal_status NOT NULL DEFAULT 'active',
  lead_advisor_id     UUID REFERENCES iam.users(id),
  legal_reviewer_id   UUID REFERENCES iam.users(id),
  partner_broker_id   UUID REFERENCES crm.partners(id),
  target_closing_date DATE,
  agreed_price_eur    NUMERIC(14,2),
  financing_amount_eur NUMERIC(14,2) DEFAULT 0,
  started_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at           TIMESTAMPTZ,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Adiciona FKs pendentes no CRM
ALTER TABLE crm.interactions ADD CONSTRAINT fk_inter_deal FOREIGN KEY (deal_id) REFERENCES deal.deals(id);
ALTER TABLE crm.tasks ADD CONSTRAINT fk_task_deal FOREIGN KEY (deal_id) REFERENCES deal.deals(id);
ALTER TABLE crm.appointments ADD CONSTRAINT fk_appt_deal FOREIGN KEY (deal_id) REFERENCES deal.deals(id);
ALTER TABLE crm.appointments ADD CONSTRAINT fk_appt_prop FOREIGN KEY (property_id) REFERENCES catalog.properties(id);

-- 25. Marcos de cada uma das 7 fases por processo
CREATE TABLE deal.deal_phases (
  id                  UUID PRIMARY KEY,
  deal_id             UUID NOT NULL REFERENCES deal.deals(id) ON DELETE CASCADE,
  phase               deal.phase_code NOT NULL,
  status              TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'blocked', 'completed', 'skipped')) DEFAULT 'pending',
  sla_due_at          TIMESTAMPTZ,
  started_at          TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  UNIQUE (deal_id, phase)
);

-- 26. Itens do checklist dinâmico por processo
CREATE TABLE deal.checklist_items (
  id                  UUID PRIMARY KEY,
  deal_id             UUID NOT NULL REFERENCES deal.deals(id) ON DELETE CASCADE,
  phase               deal.phase_code NOT NULL,
  item_code           TEXT NOT NULL, -- Ex.: 'PT_NIF', 'ES_NIE', 'BANK_ACCOUNT', 'HAIA_APOSTILLE'
  title_i18n_json     JSONB NOT NULL,
  owner_role          iam.role_type NOT NULL,
  is_mandatory        BOOLEAN NOT NULL DEFAULT TRUE,
  status              TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'awaiting_review', 'done', 'waived')) DEFAULT 'todo',
  due_date            DATE,
  linked_document_id  UUID,
  completed_by        UUID REFERENCES iam.users(id),
  completed_at        TIMESTAMPTZ,
  UNIQUE (deal_id, item_code)
);

-- 27. Participantes e permissões contextuais (suporte a ABAC)
CREATE TABLE deal.deal_participants (
  deal_id             UUID NOT NULL REFERENCES deal.deals(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES iam.users(id) ON DELETE CASCADE,
  role_in_deal        iam.role_type NOT NULL,
  can_view_vault      BOOLEAN NOT NULL DEFAULT FALSE,
  consent_record_id   UUID REFERENCES iam.consent_records(id),
  access_expires_at   TIMESTAMPTZ,
  added_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (deal_id, user_id, role_in_deal)
);

-- 28. Propostas e histórico de negociações (rastreabilidade total)
CREATE TABLE deal.offers (
  id                  UUID PRIMARY KEY,
  deal_id             UUID NOT NULL REFERENCES deal.deals(id) ON DELETE CASCADE,
  property_id         UUID NOT NULL REFERENCES catalog.properties(id),
  offer_version       INT NOT NULL,
  offered_price_eur   NUMERIC(14,2) NOT NULL,
  earnest_money_eur   NUMERIC(14,2) NOT NULL, -- Sinal / Arras
  conditions_json     JSONB NOT NULL, -- Ex.: sujeito a aprovação de crédito, prazo escritura
  status              TEXT NOT NULL CHECK (status IN ('draft', 'submitted', 'countered', 'accepted', 'rejected', 'expired')) DEFAULT 'draft',
  compensation_stmt_signed BOOLEAN NOT NULL DEFAULT FALSE,
  created_by          UUID NOT NULL REFERENCES iam.users(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (deal_id, offer_version)
);

-- 29. Envelopes de assinatura eletrônica (CPCV, Arras, Procuração, Statement)
CREATE TABLE deal.esign_envelopes (
  id                  UUID PRIMARY KEY,
  deal_id             UUID NOT NULL REFERENCES deal.deals(id) ON DELETE CASCADE,
  provider            TEXT NOT NULL, -- 'docusign', 'eidas_qes', 'cmd_pt', 'icp_br'
  external_envelope_id TEXT NOT NULL,
  doc_type            TEXT NOT NULL,
  status              TEXT NOT NULL CHECK (status IN ('created', 'sent', 'partially_signed', 'completed', 'voided', 'declined')),
  signed_doc_id       UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at        TIMESTAMPTZ
);

-- 30. Transactional Outbox para publicação confiável no Pub/Sub
CREATE TABLE deal.outbox_events (
  id                  UUID PRIMARY KEY,
  aggregate_type      TEXT NOT NULL,
  aggregate_id        UUID NOT NULL,
  event_type          TEXT NOT NULL,
  payload_json        JSONB NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at        TIMESTAMPTZ
);
CREATE INDEX idx_outbox_unpublished ON deal.outbox_events (created_at) WHERE published_at IS NULL;
```

### 2.6 Schema `vault` — Cofre Documental, Versões, Compartilhamentos e Histórico (5 tabelas)

```sql
-- 31. Documento lógico no Cofre
CREATE TABLE vault.documents (
  id                  UUID PRIMARY KEY,
  owner_user_id       UUID NOT NULL REFERENCES iam.users(id),
  deal_id             UUID REFERENCES deal.deals(id),
  doc_category        TEXT NOT NULL CHECK (doc_category IN (
                        'passport', 'nif_nie', 'proof_address', 'income_tax', 'source_of_funds',
                        'bank_statement', 'power_of_attorney', 'apostille_translation',
                        'property_registry', 'caderneta_catastro', 'energy_cert',
                        'cpcv_arras', 'deed_escritura', 'other'
                      )),
  title               TEXT NOT NULL,
  current_version     INT NOT NULL DEFAULT 1,
  status              vault.doc_status NOT NULL DEFAULT 'uploaded',
  classification      TEXT NOT NULL CHECK (classification IN ('confidential', 'restricted')) DEFAULT 'restricted',
  client_side_e2e     BOOLEAN NOT NULL DEFAULT FALSE,
  expires_on          DATE,
  retention_until     DATE NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 32. Versões físicas do arquivo no GCS (append-only)
CREATE TABLE vault.document_versions (
  id                  UUID PRIMARY KEY,
  document_id         UUID NOT NULL REFERENCES vault.documents(id) ON DELETE CASCADE,
  version_num         INT NOT NULL,
  gcs_bucket          TEXT NOT NULL,
  gcs_object_path     TEXT NOT NULL,
  mime_type           TEXT NOT NULL,
  size_bytes          BIGINT NOT NULL CHECK (size_bytes > 0),
  sha256_hex          CHAR(64) NOT NULL,
  malware_scan_status TEXT NOT NULL CHECK (malware_scan_status IN ('pending', 'clean', 'quarantined')) DEFAULT 'pending',
  ai_extraction_json  JSONB,
  uploaded_by         UUID NOT NULL REFERENCES iam.users(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (document_id, version_num)
);

-- 33. Compartilhamentos granulares com parceiros/familiares (ABAC)
CREATE TABLE vault.document_shares (
  id                  UUID PRIMARY KEY,
  document_id         UUID NOT NULL REFERENCES vault.documents(id) ON DELETE CASCADE,
  shared_with_user_id UUID NOT NULL REFERENCES iam.users(id),
  consent_record_id   UUID NOT NULL REFERENCES iam.consent_records(id),
  permission          TEXT NOT NULL CHECK (permission IN ('view_watermarked', 'download_authorized')),
  granted_by          UUID NOT NULL REFERENCES iam.users(id),
  granted_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at          TIMESTAMPTZ NOT NULL,
  revoked_at          TIMESTAMPTZ
);

-- 34. Revisões humanas de documento
CREATE TABLE vault.document_reviews (
  id                  UUID PRIMARY KEY,
  document_id         UUID NOT NULL REFERENCES vault.documents(id) ON DELETE CASCADE,
  version_num         INT NOT NULL,
  reviewer_id         UUID NOT NULL REFERENCES iam.users(id),
  decision            TEXT NOT NULL CHECK (decision IN ('approved', 'rejected', 'needs_clarification')),
  notes               TEXT NOT NULL,
  reviewed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 35. Histórico completo por documento (acesso, edição, download, compartilhamento)
CREATE TABLE vault.document_events (
  id                  UUID PRIMARY KEY,
  document_id         UUID NOT NULL REFERENCES vault.documents(id),
  version_num         INT,
  actor_user_id       UUID NOT NULL REFERENCES iam.users(id),
  event_type          TEXT NOT NULL CHECK (event_type IN (
                        'upload', 'new_version', 'view', 'download',
                        'edit_metadata', 'share_granted', 'share_revoked',
                        'ai_scanned', 'human_reviewed', 'deleted'
                      )),
  justification       TEXT,
  ip_hash             TEXT NOT NULL,
  watermark_id        TEXT,
  occurred_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.7 Schema `dd` — Due Diligence, Compliance/AML e Segurança Anti-BEC (6 tabelas)

```sql
-- 36. Relatórios de Due Diligence do Imóvel
CREATE TABLE dd.due_diligence_reports (
  id                  UUID PRIMARY KEY,
  deal_id             UUID NOT NULL REFERENCES deal.deals(id),
  property_id         UUID NOT NULL REFERENCES catalog.properties(id),
  status              TEXT NOT NULL CHECK (status IN ('open', 'in_analysis', 'awaiting_legal_signoff', 'approved', 'approved_with_caveats', 'rejected_high_risk')) DEFAULT 'open',
  overall_score       INT CHECK (overall_score BETWEEN 0 AND 100),
  overall_risk        dd.risk_level,
  ai_pre_summary      TEXT,
  legal_reviewer_id   UUID REFERENCES iam.users(id),
  signed_report_doc_id UUID REFERENCES vault.documents(id),
  approved_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 37. Itens de verificação da DD (ônus, hipoteca, licença habitabilidade, condomínio, IMI/IBI)
CREATE TABLE dd.dd_checks (
  id                  UUID PRIMARY KEY,
  report_id           UUID NOT NULL REFERENCES dd.due_diligence_reports(id) ON DELETE CASCADE,
  check_code          TEXT NOT NULL,
  category            TEXT NOT NULL CHECK (category IN ('registry', 'tax', 'urbanism', 'condo', 'tenancy', 'seller_kyc')),
  status              TEXT NOT NULL CHECK (status IN ('pending', 'pass', 'warning', 'fail')) DEFAULT 'pending',
  risk_level          dd.risk_level NOT NULL DEFAULT 'low',
  finding_notes       TEXT,
  evidence_doc_id     UUID REFERENCES vault.documents(id),
  verified_by         UUID REFERENCES iam.users(id),
  verified_at         TIMESTAMPTZ
);

-- 38. Triagens KYC / AML / Sanções / PEP
CREATE TABLE dd.aml_screenings (
  id                  UUID PRIMARY KEY,
  user_id             UUID NOT NULL REFERENCES iam.users(id),
  deal_id             UUID REFERENCES deal.deals(id),
  provider            TEXT NOT NULL,
  external_check_id   TEXT NOT NULL,
  pep_hit             BOOLEAN NOT NULL DEFAULT FALSE,
  sanctions_hit       BOOLEAN NOT NULL DEFAULT FALSE,
  adverse_media_hit   BOOLEAN NOT NULL DEFAULT FALSE,
  source_of_funds_ok  BOOLEAN NOT NULL DEFAULT FALSE,
  risk_tier           TEXT NOT NULL CHECK (risk_tier IN ('low', 'medium', 'high', 'blocked')),
  decision_by         UUID REFERENCES iam.users(id),
  decision_note       TEXT,
  screened_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 39. Instruções bancárias verificadas (Anti-BEC / Proibição de IBAN por e-mail)
CREATE TABLE dd.verified_payment_instructions (
  id                  UUID PRIMARY KEY,
  deal_id             UUID NOT NULL REFERENCES deal.deals(id),
  beneficiary_name    TEXT NOT NULL,
  beneficiary_role    TEXT NOT NULL CHECK (beneficiary_role IN ('lawyer_escrow', 'notary_account', 'seller_verified', 'tax_authority')),
  iban_enc            BYTEA NOT NULL,
  iban_last4          CHAR(4) NOT NULL,
  bic_swift           TEXT NOT NULL,
  expected_amount_eur NUMERIC(14,2) NOT NULL,
  purpose_code        TEXT NOT NULL, -- 'earnest_cpcv', 'closing_balance', 'tax_imt_itp'
  verified_by_1       UUID NOT NULL REFERENCES iam.users(id),
  verified_by_2       UUID NOT NULL REFERENCES iam.users(id),
  client_oob_confirmed BOOLEAN NOT NULL DEFAULT FALSE, -- Out-of-band video/voice check
  hmac_signature      TEXT NOT NULL,
  status              TEXT NOT NULL CHECK (status IN ('active', 'used', 'superseded', 'frozen_alert')) DEFAULT 'active',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 40. Alertas de fraude e segurança operacional
CREATE TABLE dd.fraud_alerts (
  id                  UUID PRIMARY KEY,
  user_id             UUID REFERENCES iam.users(id),
  deal_id             UUID REFERENCES deal.deals(id),
  alert_type          TEXT NOT NULL, -- 'iban_change_attempt', 'impossible_travel', 'bulk_download', 'tampered_pdf'
  severity            TEXT NOT NULL CHECK (severity IN ('medium', 'high', 'critical')),
  signals_json        JSONB NOT NULL,
  status              TEXT NOT NULL CHECK (status IN ('open', 'investigating', 'confirmed_fraud', 'false_positive')) DEFAULT 'open',
  assigned_officer_id UUID REFERENCES iam.users(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at         TIMESTAMPTZ
);

-- 41. Registro de decisões críticas com exigência HITL
CREATE TABLE dd.hitl_approvals (
  id                  UUID PRIMARY KEY,
  deal_id             UUID REFERENCES deal.deals(id),
  entity_type         TEXT NOT NULL,
  entity_id           UUID NOT NULL,
  trigger_reason      TEXT NOT NULL,
  requested_by_agent  ai.agent_type,
  assigned_role       iam.role_type NOT NULL,
  assigned_user_id    UUID REFERENCES iam.users(id),
  status              TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'escalated')) DEFAULT 'pending',
  decision_notes      TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  decided_at          TIMESTAMPTZ
);
```

### 2.8 Schema `fin` — Assinaturas, Faturamento, Comissões, *Fee Offset* e Pós-Venda (8 tabelas)

```sql
-- 42. Planos e assinaturas SaaS
CREATE TABLE fin.subscriptions (
  id                  UUID PRIMARY KEY,
  user_id             UUID NOT NULL REFERENCES iam.users(id),
  plan_code           TEXT NOT NULL CHECK (plan_code IN ('explorer', 'essencial', 'plus', 'private')),
  billing_cycle       TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
  price_eur_cents     BIGINT NOT NULL,
  stripe_customer_id  TEXT,
  stripe_sub_id       TEXT UNIQUE,
  status              TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'cancelled', 'trialing')),
  accumulated_credit_cents BIGINT NOT NULL DEFAULT 0, -- Crédito acumulável para Fee Offset!
  current_period_end  TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 43. Faturas e pagamentos à plataforma (nunca custódia de imóvel!)
CREATE TABLE fin.invoices (
  id                  UUID PRIMARY KEY,
  user_id             UUID NOT NULL REFERENCES iam.users(id),
  deal_id             UUID REFERENCES deal.deals(id),
  line_item_type      TEXT NOT NULL CHECK (line_item_type IN (
                        'subscription', 'strategic_diagnostic', 'premium_advisory',
                        'due_diligence', 'post_sale_mgmt', 'concierge'
                      )),
  amount_net_cents    BIGINT NOT NULL,
  vat_cents           BIGINT NOT NULL DEFAULT 0,
  currency            CHAR(3) NOT NULL DEFAULT 'EUR',
  status              TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'void', 'refunded')),
  stripe_invoice_id   TEXT,
  paid_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 44. Declaração prévia de remuneração assinada (Statement of Compensation)
CREATE TABLE fin.compensation_statements (
  id                  UUID PRIMARY KEY,
  deal_id             UUID NOT NULL REFERENCES deal.deals(id),
  commission_model    TEXT NOT NULL CHECK (commission_model IN ('seller_cobroke', 'buyers_fee', 'hybrid')),
  estimated_gross_pct NUMERIC(5,2) NOT NULL,
  fee_offset_cents    BIGINT NOT NULL DEFAULT 0,
  partner_split_json  JSONB NOT NULL,
  accepted_by_client  BOOLEAN NOT NULL DEFAULT FALSE,
  accepted_at         TIMESTAMPTZ,
  envelope_id         UUID REFERENCES deal.esign_envelopes(id)
);

-- 45. Comissões, referrals e receitas transacionais a receber/recebidas
CREATE TABLE fin.commissions (
  id                  UUID PRIMARY KEY,
  deal_id             UUID NOT NULL REFERENCES deal.deals(id),
  revenue_stream      TEXT NOT NULL CHECK (revenue_stream IN (
                        'brokerage_commission', 'mortgage_referral', 'fx_rev_share', 'partner_referral'
                      )),
  payer_partner_id    UUID REFERENCES crm.partners(id),
  gross_amount_cents  BIGINT NOT NULL,
  partner_share_cents BIGINT NOT NULL DEFAULT 0,
  fee_offset_applied_cents BIGINT NOT NULL DEFAULT 0,
  net_cng_cents       BIGINT NOT NULL,
  status              TEXT NOT NULL CHECK (status IN ('projected', 'invoiced', 'received', 'disputed')) DEFAULT 'projected',
  expected_date       DATE,
  received_at         TIMESTAMPTZ
);

-- 46. Contratos de pós-venda (administração de imóvel e gestão de aluguel)
CREATE TABLE fin.post_sale_contracts (
  id                  UUID PRIMARY KEY,
  deal_id             UUID REFERENCES deal.deals(id),
  property_id         UUID NOT NULL REFERENCES catalog.properties(id),
  owner_user_id       UUID NOT NULL REFERENCES iam.users(id),
  service_type        TEXT NOT NULL CHECK (service_type IN ('property_admin', 'rental_management', 'renovation_coord')),
  monthly_fee_cents   BIGINT DEFAULT 0,
  rental_pct          NUMERIC(4,2) DEFAULT 0,
  status              TEXT NOT NULL CHECK (status IN ('active', 'paused', 'terminated')),
  started_at          DATE NOT NULL,
  ended_at            DATE
);

-- 47. Locações e repasses (fase 7)
CREATE TABLE fin.rental_leases (
  id                  UUID PRIMARY KEY,
  post_sale_id        UUID NOT NULL REFERENCES fin.post_sale_contracts(id),
  tenant_name_enc     BYTEA NOT NULL,
  monthly_rent_cents  BIGINT NOT NULL,
  lease_start         DATE NOT NULL,
  lease_end           DATE,
  status              TEXT NOT NULL CHECK (status IN ('active', 'ended', 'delinquent'))
);

-- 48. Manutenções, reformas e vistorias pós-compra
CREATE TABLE fin.property_work_orders (
  id                  UUID PRIMARY KEY,
  post_sale_id        UUID NOT NULL REFERENCES fin.post_sale_contracts(id),
  title               TEXT NOT NULL,
  vendor_partner_id   UUID REFERENCES crm.partners(id),
  quote_cents         BIGINT,
  approved_by_owner   BOOLEAN NOT NULL DEFAULT FALSE,
  status              TEXT NOT NULL CHECK (status IN ('open', 'quoted', 'approved', 'in_progress', 'completed')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 49. Notificações multicanal do Concierge (registro persistente)
CREATE TABLE fin.concierge_notifications (
  id                  UUID PRIMARY KEY,
  user_id             UUID NOT NULL REFERENCES iam.users(id),
  deal_id             UUID REFERENCES deal.deals(id),
  channel             TEXT NOT NULL CHECK (channel IN ('in_app', 'email', 'whatsapp', 'push')),
  category            TEXT NOT NULL, -- 'deadline', 'doc_pending', 'fraud_alert', 'phase_change'
  title               TEXT NOT NULL,
  body                TEXT NOT NULL,
  sent_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at             TIMESTAMPTZ
);
```

### 2.9 Schema `ai` — RAG Jurídico Curado, Sessões, Mensagens, Tool Calls e Evals (5 tabelas)

```sql
-- 50. Documentos-fonte do corpus legal curado (Country Pack RAG)
CREATE TABLE ai.legal_sources (
  id                  UUID PRIMARY KEY,
  jurisdiction        catalog.country_code NOT NULL,
  region_code         TEXT,
  topic               TEXT NOT NULL, -- 'imt', 'itp', 'nif', 'nie', 'cpcv', 'arras', 'aml', 'mortgage'
  title               TEXT NOT NULL,
  official_url        TEXT NOT NULL,
  version             TEXT NOT NULL,
  effective_from      DATE NOT NULL,
  effective_to        DATE,
  tier                TEXT NOT NULL CHECK (tier IN ('T1_statute', 'T2_agency_guide', 'T3_internal_sop')),
  reviewed_by_lawyer  UUID NOT NULL REFERENCES iam.users(id),
  reviewed_at         TIMESTAMPTZ NOT NULL
);

-- 51. Chunks vetorizados com pgvector (768 ou 1536 dims conforme modelo embedding)
CREATE TABLE ai.legal_chunks (
  id                  UUID PRIMARY KEY,
  source_id           UUID NOT NULL REFERENCES ai.legal_sources(id) ON DELETE CASCADE,
  locator             TEXT NOT NULL, -- Ex.: 'Art. 17.º CIMT' ou 'Secção 3.2'
  locale              iam.locale_code NOT NULL DEFAULT 'pt-PT',
  content             TEXT NOT NULL,
  content_tsv         TSVECTOR GENERATED ALWAYS AS (to_tsvector('portuguese', content)) STORED,
  embedding           VECTOR(768) NOT NULL
);
CREATE INDEX idx_legal_chunks_tsv ON ai.legal_chunks USING GIN (content_tsv);
CREATE INDEX idx_legal_chunks_vec ON ai.legal_chunks USING HNSW (embedding vector_cosine_ops);

-- 52. Sessões de conversa multiagente
CREATE TABLE ai.conversations (
  id                  UUID PRIMARY KEY,
  user_id             UUID NOT NULL REFERENCES iam.users(id),
  deal_id             UUID REFERENCES deal.deals(id),
  active_agent        ai.agent_type NOT NULL DEFAULT 'orchestrator',
  locale              iam.locale_code NOT NULL DEFAULT 'pt-BR',
  consent_verified    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 53. Mensagens, citações RAG, disclaimers e gatilhos HITL
CREATE TABLE ai.messages (
  id                  UUID PRIMARY KEY,
  conversation_id     UUID NOT NULL REFERENCES ai.conversations(id) ON DELETE CASCADE,
  sender_role         TEXT NOT NULL CHECK (sender_role IN ('user', 'agent', 'human_advisor', 'system')),
  agent_type          ai.agent_type,
  model_name          TEXT,
  prompt_version      TEXT,
  content_redacted    TEXT NOT NULL, -- PII mascarado
  citations_json      JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{source_id, locator, title, effective_from}]
  disclaimer_included BOOLEAN NOT NULL DEFAULT TRUE,
  hitl_escalated      BOOLEAN NOT NULL DEFAULT FALSE,
  hitl_approval_id    UUID REFERENCES dd.hitl_approvals(id),
  tokens_in           INT DEFAULT 0,
  tokens_out          INT DEFAULT 0,
  latency_ms          INT DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 54. Avaliações automatizadas e humanas da IA (Evals)
CREATE TABLE ai.agent_evaluations (
  id                  UUID PRIMARY KEY,
  message_id          UUID REFERENCES ai.messages(id),
  eval_suite          TEXT NOT NULL, -- 'golden_pt_legal', 'anti_bec', 'citation_fidelity'
  groundedness_score  NUMERIC(4,3),
  hallucination_flag  BOOLEAN NOT NULL DEFAULT FALSE,
  evaluator_notes     TEXT,
  evaluated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.10 Schema `audit` — Trilha Imutável com Hash-Chain + Âncoras WORM (2 tabelas = 56 tabelas no total)

```sql
-- 55. Log de auditoria encadeado por SHA-256 (append-only)
CREATE TABLE audit.audit_logs (
  seq_id              BIGINT GENERATED ALWAYS AS IDENTITY,
  id                  UUID NOT NULL,
  occurred_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actor_user_id       UUID,
  actor_role          TEXT NOT NULL,
  action              TEXT NOT NULL,
  resource_type       TEXT NOT NULL,
  resource_id         TEXT NOT NULL,
  ip_hash             TEXT NOT NULL,
  trace_id            TEXT,
  payload_json        JSONB NOT NULL DEFAULT '{}'::jsonb,
  prev_hash           CHAR(64) NOT NULL,
  entry_hash          CHAR(64) NOT NULL,
  PRIMARY KEY (seq_id, occurred_at)
) PARTITION BY RANGE (occurred_at);

-- Partição exemplo
CREATE TABLE audit.audit_logs_2027 PARTITION OF audit.audit_logs
  FOR VALUES FROM ('2027-01-01') TO ('2028-01-01');

-- Bloqueio absoluto de UPDATE e DELETE no banco
CREATE OR REPLACE FUNCTION audit.prevent_mutation() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'audit.audit_logs is append-only and immutable';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_immutable
  BEFORE UPDATE OR DELETE ON audit.audit_logs
  FOR EACH ROW EXECUTE FUNCTION audit.prevent_mutation();

-- 56. Âncoras de lote exportadas para GCS Bucket Lock (WORM)
CREATE TABLE audit.worm_batches (
  id                  UUID PRIMARY KEY,
  from_seq_id         BIGINT NOT NULL,
  to_seq_id           BIGINT NOT NULL,
  last_entry_hash     CHAR(64) NOT NULL,
  merkle_root_hex     CHAR(64) NOT NULL,
  gcs_worm_uri        TEXT NOT NULL,
  sealed_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3. Row-Level Security (RLS) no PostgreSQL

Exemplo aplicado às tabelas críticas (`vault.documents`, `deal.deals`, `crm.buyer_profiles`):

```sql
ALTER TABLE deal.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault.documents ENABLE ROW LEVEL SECURITY;

-- Sessão de API injeta: SET LOCAL app.current_user_id = '...'; SET LOCAL app.current_role = '...';
CREATE POLICY deals_isolation ON deal.deals
  USING (
    client_user_id = current_setting('app.current_user_id', true)::UUID
    OR lead_advisor_id = current_setting('app.current_user_id', true)::UUID
    OR legal_reviewer_id = current_setting('app.current_user_id', true)::UUID
    OR current_setting('app.current_role', true) IN ('compliance_officer', 'ops_manager', 'auditor')
  );

CREATE POLICY vault_docs_abac ON vault.documents
  USING (
    owner_user_id = current_setting('app.current_user_id', true)::UUID
    OR current_setting('app.current_role', true) IN ('compliance_officer', 'auditor')
    OR EXISTS (
      SELECT 1 FROM vault.document_shares s
      WHERE s.document_id = vault.documents.id
        AND s.shared_with_user_id = current_setting('app.current_user_id', true)::UUID
        AND s.revoked_at IS NULL
        AND s.expires_at > NOW()
    )
  );
```

---

## 4. Estrutura de Coleções Firestore (Tempo Real e MVP Firebase)

Para o **MVP online publicado no Firebase App Hosting** e sincronização em tempo real na interface:

| Coleção Firestore | Finalidade | Campos Principais |
|---|---|---|
| `users/{uid}` | Perfil básico, papel RBAC, preferências de idioma, flags MFA e consentimentos | `email`, `displayName`, `role`, `locale`, `mfaEnrolled`, `buyerProfile`, `consents` |
| `properties/{propertyId}` | Catálogo curado de imóveis PT/ES | `title`, `country`, `city`, `priceEur`, `areaSqm`, `bedrooms`, `ddScore`, `riskLevel`, `yieldPct`, `status`, `translations` |
| `deals/{dealId}` | Processo ativo da jornada nas 7 fases + checklist + timeline | `clientUid`, `propertyId`, `country`, `currentPhase`, `phases[]`, `checklist[]`, `advisorUid`, `updatedAt` |
| `vault_documents/{docId}` | Metadados dos arquivos no Storage + versões + histórico de compartilhamento | `ownerUid`, `dealId`, `category`, `fileName`, `version`, `status`, `storagePath`, `sha256`, `shares[]` |
| `audit_logs/{logId}` | Espelho auditável imutável com `prevHash` e `entryHash` SHA-256 | `seq`, `actorUid`, `actorRole`, `action`, `resourceType`, `resourceId`, `prevHash`, `entryHash`, `createdAt` |
| `crm_leads/{leadId}` | Pipeline CRM interno (leads dos simuladores, imóveis, escalonamentos IA) | `name`, `email`, `origin`, `stage`, `score`, `countryTarget`, `budgetEur`, `assignedAdvisor`, `notes[]` |
| `ai_conversations/{convId}/messages/{msgId}` | Histórico de chat com os 8 agentes Gemini + citações + flag HITL | `sender`, `agentType`, `text`, `citations[]`, `disclaimer`, `hitlEscalated`, `createdAt` |
| `concierge_notifications/{notifId}` | Alertas proativos do Concierge por usuário | `userUid`, `dealId`, `type`, `title`, `message`, `read`, `createdAt` |

*Regras de segurança detalhadas em `firestore.rules` (geradas exclusivamente via subagente `firestore-rules-author`).*

---

## 5. Esquema do Índice de Busca (Vertex AI Search / Typesense / OpenSearch)

```json
{
  "name": "properties_v1",
  "fields": [
    { "name": "id", "type": "string" },
    { "name": "country", "type": "string", "facet": true },
    { "name": "region_code", "type": "string", "facet": true },
    { "name": "city", "type": "string", "facet": true },
    { "name": "neighborhood", "type": "string", "facet": true },
    { "name": "property_type", "type": "string", "facet": true },
    { "name": "condition_type", "type": "string", "facet": true },
    { "name": "price_eur", "type": "float", "facet": true, "sort": true },
    { "name": "area_sqm", "type": "float", "sort": true },
    { "name": "bedrooms", "type": "int32", "facet": true },
    { "name": "dd_pre_score", "type": "int32", "facet": true, "sort": true },
    { "name": "est_rental_yield_pct", "type": "float", "sort": true },
    { "name": "location_geo", "type": "geopoint" },
    { "name": "title_pt", "type": "string" },
    { "name": "title_en", "type": "string" },
    { "name": "title_es", "type": "string" },
    { "name": "embedding", "type": "float[]", "num_dim": 768 }
  ]
}
```

---

*Fim do documento.*
