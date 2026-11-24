# 09 — Diagramas de Sistema · CASA NA GRINGA

| Campo | Valor |
|---|---|
| **Objetivo** | Consolidar os diagramas visuais (Mermaid) de arquitetura, sequência dos fluxos críticos, máquinas de estado, implantação no Google Cloud/Firebase, fluxo de dados e arquitetura orientada a eventos |
| **Público** | Engenharia, arquitetura, segurança, produto, auditoria técnica |
| **Status** | Rascunho v0.1 |
| **Data** | 16/11/2026 |
| **Contrato comum** | [00-premissas-e-decisoes.md](00-premissas-e-decisoes.md) |
| **Documentos relacionados** | [04-arquitetura.md](04-arquitetura.md) · [05-seguranca.md](05-seguranca.md) · [06-arquitetura-ia.md](06-arquitetura-ia.md) · [08-banco-de-dados.md](08-banco-de-dados.md) · [10-modelagem-dominio.md](10-modelagem-dominio.md) |

---

## 1. Arquitetura de Containers (C4 — Nível 2)

```mermaid
flowchart TB
    User["Comprador / Familiar / Parceiro / Consultor"] -->|"HTTPS / TLS 1.3"| CDN["Cloud CDN + Cloud Armor WAF"]
    CDN --> WEB["Next.js App (App Hosting / Cloud Run)<br/>PT / EN / ES + Simuladores + Cofre UI + CRM"]
    WEB -->|"Auth JWT + MFA"| IDP["Firebase Auth / Identity Platform"]
    WEB -->|"REST / GraphQL / Server Actions"| API["Core API (NestJS Cloud Run)<br/>CRM, Deals, Vault, DD, Fin, Audit"]
    WEB <-->|"Tempo real / Chat / Notificações"| FS[("Cloud Firestore")]
    API -->|"SQL + RLS + pgvector"| PG[("Cloud SQL Postgres 17")]
    API -->|"Signed URLs + CMEK"| GCS[("Cloud Storage (Cofre & WORM)")]
    API -->|"Outbox CDC"| PUB["Cloud Pub/Sub"]
    PUB --> AI["Multi-Agent & RAG Service<br/>(Python/FastAPI + Gemini/Vertex AI)"]
    PUB --> DOCAI["Worker Document AI + DLP + Malware Scan"]
    PUB --> NOTIF["Worker Concierge (E-mail / WhatsApp / Push)"]
    PUB --> BQ[("BigQuery Analytics")]
    API --> ESIGN["Provedor e-Signature / KYC / Stripe"]
```

---

## 2. Sequência 1 — Login com MFA Obrigatório e Verificação Zero Trust

```mermaid
sequenceDiagram
    autonumber
    actor U as Comprador
    participant W as Next.js Client
    participant FA as Firebase Identity Platform
    participant API as Core API / Policy Engine
    participant AUD as Audit Hash-Chain

    U->>W: Informa e-mail e senha (ou Google Sign-In)
    W->>FA: signInWithEmailAndPassword()
    FA-->>W: auth/multi-factor-auth-required (resolver TOTP/WebAuthn)
    W-->>U: Solicita código 6 dígitos (App Autenticador)
    U->>W: Digita código TOTP
    W->>FA: resolver.resolveSignIn(assertion)
    FA-->>W: ID Token JWT (claim firebase.sign_in_second_factor = totp)
    W->>API: GET /api/portal/me (Bearer JWT + App Check token)
    API->>API: Valida assinatura JWT, App Check, IP/país & RBAC
    API->>AUD: Registra LOGIN_MFA_SUCCESS (SHA-256 chain)
    API-->>W: Perfil, permissões e sessão autorizada
```

---

## 3. Sequência 2 — Upload Seguro no Cofre, Document AI e Compartilhamento com Parceiro

```mermaid
sequenceDiagram
    autonumber
    actor C as Comprador
    participant UI as Cofre UI
    participant API as Vault Service
    participant GCS as Cloud Storage (CMEK)
    participant DAI as Document AI + Scanner
    participant LEG as Advogado Parceiro (legal_reviewer)
    participant AUD as Audit Log + WORM

    C->>UI: Seleciona Passaporte / Comprovante Origem Fundos
    UI->>API: POST /vault/upload-intent (metadados + sha256)
    API->>API: Verifica consentimento + tamanho + tipo MIME
    API-->>UI: Signed PUT URL (expira em 120s)
    UI->>GCS: Upload direto criptografado (TLS 1.3 + AES-256 CMEK)
    GCS-->>DAI: Evento Object Finalize
    DAI->>DAI: Scan antimalware + OCR + extração de validade (sem treinar LLM)
    DAI->>API: Atualiza metadados e status = awaiting_human_review
    API->>AUD: Registra UPLOAD + AI_SCANNED (hash encadeado)
    C->>UI: Autoriza compartilhamento granular com Advogado (7 dias)
    UI->>API: POST /vault/share (consent_record_id, expires_at)
    API->>AUD: Registra SHARE_GRANTED
    LEG->>API: Solicita visualização do documento
    API->>API: Policy Engine checa RBAC + ABAC (deal_id + consent + MFA recente)
    API-->>LEG: Signed GET URL (60s) + watermark dinâmico
    API->>AUD: Registra VIEW (com watermark_id e ip_hash)
```

---

## 4. Sequência 3 — Match por IA e Chat Multiagente com Limites e HITL

```mermaid
sequenceDiagram
    autonumber
    actor C as Comprador
    participant CHAT as Chat Assistentes UI
    participant GUARD as Model Armor + DLP
    participant ORQ as Orquestrador Gemini
    participant RAG as Corpus Legal PT/ES (pgvector)
    participant HITL as Fila HITL / CRM
    actor ADV as Advogado / Consultor Humano

    C->>CHAT: "Posso assinar esse CPCV em Lisboa hoje e mandar € 60 mil para o IBAN que o corretor mandou por e-mail?"
    CHAT->>GUARD: Sanitiza PII + detecta risco crítico (CPCV + IBAN!)
    GUARD->>ORQ: Encaminha com flag RISK_R3_BEC_AND_CONTRACT
    ORQ->>RAG: Busca regras oficiais CPCV Portugal & política anti-BEC
    RAG-->>ORQ: Chunks verificados (Código Civil PT / Ordem Advogados - a confirmar)
    ORQ-->>GUARD: Resposta com disclaimer + alerta antifraude IBAN + escalonamento
    GUARD-->>CHAT: Exibe resposta + bloqueio visual "NUNCA transfira para IBAN enviado por e-mail"
    ORQ->>HITL: Cria ticket urgente de revisão humana no CRM
    HITL-->>ADV: Notifica consultor e advogado parceiro (SLA < 2h)
```

---

## 5. Sequência 4 — Due Diligence, Compra, Escritura e Pagamento Seguro (Anti-BEC)

```mermaid
sequenceDiagram
    autonumber
    actor C as Comprador
    participant WF as Deal Workflow (Saga)
    participant LEG as Advogado Parceiro
    participant COMP as Compliance Officer
    participant PAY as Verified Payment Vault
    participant ESIGN as Assinatura eIDAS/Notário

    C->>WF: Seleciona imóvel e contrata Due Diligence
    WF->>LEG: Abre checklist DD (Certidão Permanente, Caderneta, Licença, Ônus)
    LEG-->>WF: Emite Parecer DD Aprovado + Score 94/100
    WF->>COMP: Valida KYC/AML + Origem de Fundos do comprador
    COMP-->>WF: AML Aprovado
    WF->>C: Apresenta Statement of Compensation (comissão transparente)
    C->>ESIGN: Assina Statement + CPCV / Contrato de Arras
    WF->>PAY: Solicita instrução bancária de sinal (escrow/vendedor)
    LEG->>PAY: Cadastra IBAN + comprovante titularidade (Assinatura 1)
    COMP->>PAY: Valida titularidade + trava HMAC (Assinatura 2)
    PAY-->>C: Exibe IBAN verificado dentro do Cofre + pede confirmação em vídeo (OOB)
    C->>PAY: Confirma em chamada gravada e remete via fintech câmbio regulada
    WF->>ESIGN: Agenda Escritura Pública → Transição para Fase 7 (Pós-venda)
```

---

## 6. Máquinas de Estado (`stateDiagram-v2`)

### 6.1 Estados da Transação (7 Fases)

```mermaid
stateDiagram-v2
    [*] --> Discovery: Cadastro / Simulador
    Discovery --> Planning: Onboarding Perfil Completo
    Planning --> Documentation: Plano Selecionado / Lead Qualificado
    Documentation --> SearchSelection: NIF/NIE + KYC Base OK
    SearchSelection --> DueDiligence: Imóvel Selecionado + Taxa DD
    DueDiligence --> Purchase: DD Aprovada + AML OK + Statement Assinado
    DueDiligence --> SearchSelection: DD Reprovada (Risco Crítico)
    Purchase --> PostSale: Escritura Lavrada & Registrada
    Purchase --> Cancelled: Desistência / Crédito Negado
    PostSale --> [*]: Gestão Ativa / Revenda
```

### 6.2 Estados de um Documento no Cofre

```mermaid
stateDiagram-v2
    [*] --> pending_upload
    pending_upload --> uploaded: Upload GCS + SHA-256
    uploaded --> ai_screening: Malware Clean
    uploaded --> revoked: Malware Detected
    ai_screening --> awaiting_human_review: OCR + Campos Extraídos
    awaiting_human_review --> approved: Advogado / Compliance Aprova
    awaiting_human_review --> rejected: Ilegível / Vencido / Divergente
    rejected --> uploaded: Nova Versão Enviada
    approved --> expired: Passou validade
    approved --> revoked: Titular revoga / DSR
```

### 6.3 Ciclo de Vida do Lead no CRM

```mermaid
stateDiagram-v2
    [*] --> new_lead: Simulador / Chat / Formulário
    new_lead --> qualified_mql: Lead Score >= 40
    qualified_mql --> diagnostic_scheduled: Agenda Diagnóstico
    diagnostic_scheduled --> sql_active_plan: Assina Plano ou Contrata DD
    sql_active_plan --> property_selection: Shortlist + Visitas
    property_selection --> under_dd: Proposta Aceita
    under_dd --> closed_won: Escritura Concluída
    new_lead --> lost: Sem aderência / < €150k / Desistência
    qualified_mql --> lost: Inativo > 60d
```

---

## 7. Diagrama de Implantação no Google Cloud & Firebase (Multi-Região Fase 2+)

```mermaid
flowchart TB
    subgraph Global["Camada Global / Borda"]
        DNS["Cloud DNS (casanagringa.com)"]
        ARM["Cloud Armor WAF + Cloud CDN"]
        IDP["Identity Platform (MFA Global)"]
    end

    subgraph EU["Região Primária UE (europe-southwest1 Madrid / europe-west1 Bélgica)"]
        AH["Firebase App Hosting / Cloud Run (Next.js + NestJS)"]
        AI_EU["Cloud Run Python AI (Vertex AI Gemini EU)"]
        SQL_EU[("Cloud SQL Postgres HA (Dados UE/PT/ES)")]
        GCS_EU[("GCS Dual-Region EU (Cofre + WORM)")]
        KMS_EU["Cloud KMS UE (CMEK)"]
    end

    subgraph BR["Célula Brasil (southamerica-east1 São Paulo — Fase 2+)"]
        RUN_BR["Cloud Run Edge BR (Atendimento / Conteúdo)"]
        SQL_BR[("Cloud SQL BR (Dados estritos LGPD BR)")]
    end

    DNS --> ARM --> AH
    AH <--> IDP
    AH <--> SQL_EU
    AH <--> GCS_EU
    AH <--> AI_EU
    SQL_EU --- KMS_EU
    GCS_EU --- KMS_EU
    ARM -.->|"Tráfego BR Fase 2"| RUN_BR --- SQL_BR
```

---

*Fim do documento.*
