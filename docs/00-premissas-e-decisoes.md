# CASA NA GRINGA — Premissas e Decisões (contrato comum a todos os documentos)

> Este arquivo é a fonte única de verdade para consistência entre os documentos. Se um documento divergir daqui, este arquivo prevalece.

## 1. Empresa
- **Nome:** Casa na Gringa (CASANAGRINGA) — domínio **casanagringa.com**
- **Proposta de valor:** "Seu imóvel no exterior com menos burocracia e com segurança do início ao fim."
- **Produto central:** confiança (segurança jurídica, financeira, documental e operacional). O imóvel é o veículo.
- **Idiomas da plataforma:** Português (PT-BR e PT-PT como variantes), Inglês, Espanhol. i18n desde o dia 1.
- **Natureza:** plataforma de confiança = consultoria internacional + marketplace + concierge premium + plataforma tech + gestora documental.

## 2. Decisões tomadas com o fundador (nov/2026)
| Tema | Decisão |
|---|---|
| Origem dos clientes (inicial) | **Brasil e Portugal** (e depois PALOP: Angola, Moçambique, Cabo Verde) |
| Destinos de compra (primeiros 12 meses) | **Portugal e Espanha** (NIF/NIE; jurídico e idioma próximos). Expansão: EUA (Flórida), Emirados (Dubai), Itália, Grécia — ver doc de expansão |
| Segmento | Público com capital (alta renda / HNWI-affluent, ticket médio de imóvel ≥ € 250 mil; foco € 300 mil–€ 2 mi) |
| Estágio | **Ideia, sem equipe nem capital definidos** → plano com equipe enxuta, pré-seed/seed, execução faseada |
| Entrega | Documentos Markdown em `docs/`, diagramas Mermaid, wireframes HTML em `docs/wireframes/` |
| Data de referência | Nov/2026. M1 = jan/2027 (ajustável). Moeda dos planos: EUR (com BRL como referência) |

## 3. Premissas questionadas e posição recomendada
1. **Firebase como banco principal → arquitetura híbrida.** Firebase/Google Cloud para Auth (Identity Platform), tempo real, notificações, Storage, Hosting e Functions; **Cloud SQL for PostgreSQL** (evoluindo para AlloyDB) como sistema de registro transacional (transações, comissões, contratos, RBAC/ABAC, CRM); **log de auditoria append-only com encadeamento de hash (hash-chain) + armazenamento WORM** (Cloud Storage com Bucket Lock / retention) + BigQuery para análise. Firestore apenas para dados de sessão, chat, notificações e estado de UI em tempo real.
2. **Busca:** Fase 1 **Vertex AI Search** (managed, Google) ou Typesense/Meilisearch para simplicidade; **OpenSearch** só quando houver volume (> 100 mil imóveis) ou necessidade de busca geoespacial/facetada avançada. Busca vetorial: **pgvector** (Postgres) no início → Vertex AI Vector Search depois.
3. **IA que "conhece toda a legislação":** impossível ser garantido por LLM. Solução: **RAG sobre base legal curada, versionada e por jurisdição** (PT, ES), com citação de fonte e data de vigência, revisada por advogados locais parceiros; o agente informa limites e **nunca dá aconselhamento jurídico/financeiro/fiscal definitivo**; decisões críticas exigem **human-in-the-loop**.
4. **Escopo de destinos:** 2 países no início para qualidade > quantidade; cada país exige "Country Pack" (base legal, fluxos, parceiros, custos, tributos, checklists).
5. **Regulatório:** possível enquadramento como mediação imobiliária (PT: licença AMI/IMPIC; ES: regulada por comunidade autónoma / API/GIPE — verificar), intermediação de crédito (PT: Banco de Portugal), e regras AML/CFT (PT: Lei 83/2017; ES: Lei 10/2010). Estrutura inicial: **parcerias com imobiliárias licenciadas locais** + conta de cliente apenas via parceiro regulado (escrow/advogado/notário). A plataforma **não custodia fundos de clientes** na fase 1.

## 4. Stack recomendada (resumo — detalhada em `04-arquitetura.md`)
- **Frontend web:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui; i18n com next-intl; hospedagem Firebase App Hosting ou Cloud Run (+ Cloud CDN). App mobile na Fase 2 (React Native/Expo, mesma base de design system).
- **Backend:** TypeScript (NestJS) em Cloud Run (modular monolith → serviços por domínio quando necessário); Python (FastAPI) para serviços de IA/ML; Cloud Functions para eventos.
- **Dados:** Cloud SQL Postgres (sistema de registro), Firestore (tempo real), Cloud Storage (documentos, CMEK), BigQuery (analytics/auditoria), Redis (Memorystore) cache.
- **Mensageria/eventos:** Pub/Sub + Cloud Tasks + Workflows/Temporal (orquestração das etapas da compra).
- **Identidade:** Firebase Auth / Identity Platform com MFA obrigatório (TOTP/passkeys/WebAuthn; SMS apenas fallback), App Check.
- **IA:** Gemini (Vertex AI) — Gemini Pro para raciocínio, Flash para tarefas rápidas; Agent Development Kit (ADK)/orquestrador multiagente; RAG (Vertex AI RAG Engine / pgvector); Document AI para OCR/classificação de documentos; Model Armor/guardrails.
- **Segurança:** Zero Trust (BeyondCorp/IAP), VPC Service Controls, Cloud KMS (CMEK), Secret Manager, Cloud Armor (WAF), SCC + Chronicle/SIEM, DLP API, assinatura eletrônica (integração DocuSign/Adobe Sign/ Chave Móvel Digital/ ICP-Brasil / eIDAS).
- **Infra:** Google Cloud (região europe-west1 Bélgica / europe-southwest1 Madrid / europe-west4; dados de clientes UE em UE; réplica sul-americana para clientes BR conforme LGPD), Terraform, GitHub Actions, ambientes dev/staging/prod segregados em projetos GCP distintos.
- **CRM:** módulo nativo proprietário (clientes, leads, pipeline, tarefas, agenda/visitas, comunicação omnicanal) integrado ao núcleo — não CRM de terceiros para dados sensíveis.
- **Observabilidade:** OpenTelemetry, Cloud Logging/Monitoring, Sentry.

## 5. Papéis (RBAC) de referência
`client`, `client_family_member`, `advisor` (consultor humano), `legal_reviewer` (advogado parceiro), `tax_reviewer`, `broker_partner`, `bank_partner`, `notary_partner`, `compliance_officer`, `ops_manager`, `support_agent`, `finance_admin`, `platform_admin` (break-glass), `auditor` (somente leitura).

## 6. Agentes de IA (8 + orquestrador)
Imobiliário, Financeiro, Jurídico, Tributário, Relocation, Concierge Internacional, Compliance, Due Diligence + **Orquestrador/Roteador**. Todos: limites declarados, citação de fontes, disclaimers, log de cada interação/tool-call, escalonamento humano obrigatório em decisões críticas.

## 7. Monetização (9+ fontes)
Comissão de compra/venda (explicada e transparente), assessoria premium (com agenda e visitas), due diligence documental, financiamento (intermediação via parceiros), indicação de parceiros (referral), administração de imóveis, gestão de aluguel, planos de assinatura, concierge internacional, leads qualificados B2B, serviços financeiros/câmbio (rev share), marketplace de serviços.

## 8. Princípios (ordem de prioridade)
1 Segurança · 2 Privacidade · 3 Transparência · 4 Rastreabilidade · 5 Escalabilidade · 6 Automação · 7 Experiência do cliente · 8 Riqueza de detalhes nos procedimentos · 9 Prazos.

## 9. Convenções dos documentos
- Idioma: Português (Brasil) com termos técnicos em inglês quando padrão de mercado.
- Diagramas: Mermaid (`flowchart`, `sequenceDiagram`, `erDiagram`, `stateDiagram-v2`, `classDiagram`).
- Valores financeiros: premissas explícitas, cenários conservador/base/otimista; marcar claramente o que é **estimativa a validar**.
- Todo dado legal/regulatório/tributário deve ser marcado **"verificar com advogado/contador local antes de uso"** e citar a norma quando conhecida (sem inventar números de artigos; na dúvida, escrever "a confirmar").
- Cada documento começa com: título, objetivo, público, status (rascunho v0.1), data.
- Nomes de arquivo: ver `00-INDICE.md`.
