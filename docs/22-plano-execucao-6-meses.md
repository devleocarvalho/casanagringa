# 22 — Plano de Execução dos Primeiros 6 Meses (Jan–Jun/2027) · CASA NA GRINGA

| Campo | Valor |
|---|---|
| **Objetivo** | Detalhar a execução prática semana a semana e mês a mês dos primeiros 6 meses para uma **equipe enxuta sem capital definido**, cobrindo validação, jurídico/parcerias, MVP SaaS online, orçamento mínimo, OKRs, RACI e critérios Go/No-Go |
| **Público** | Fundador(es), primeiros colaboradores, investidores-anjo/pré-seed |
| **Status** | Rascunho v0.1 |
| **Data** | 16/11/2026 (M1 = jan/2027; ajustável conforme data de partida) |
| **Contrato comum** | [00-premissas-e-decisoes.md](00-premissas-e-decisoes.md) |
| **Documentos relacionados** | [13-roadmap-produto.md](13-roadmap-produto.md) · [15-plano-financeiro-24-meses.md](15-plano-financeiro-24-meses.md) · [21-riscos-criticos.md](21-riscos-criticos.md) |

---

## 1. Filosofia dos Primeiros 180 Dias: "Concierge-First + SaaS Enxuto no Ar"

Sem equipe grande e sem capital garantido, o maior erro seria ficar 6 meses programando no escuro. A regra é **execução paralela em 3 trilhas desde a Semana 1**:
1. **Trilha Produto & Tech:** Colocar o SaaS MVP no ar (`casanagringa.com` via Firebase App Hosting) nas primeiras 4–6 semanas para capturar leads, simular custos e gerenciar documentos/CRM.
2. **Trilha Parceiros & Jurídico:** Fechar contratos de co-corretagem (PT + ES) e parcerias com 2 advogados independentes, 1 intermediário de crédito e 1 provedor de câmbio — sem custo fixo mensal, remunerados por demanda/êxito.
3. **Trilha Tração & Primeiras Receitas:** Entrevistar 30 compradores reais, gerar caixa imediato via Diagnósticos Estratégicos (€ 390) e Due Diligences (€ 1.490) e fechar os primeiros **5 imóveis até M6**.

---

## 2. Cronograma Mês a Mês (M1 a M6)

### Mês 1 (Jan/2027) — Fundação, Validação e Deploy Inicial
- **Semana 1:** Registro definitivo do domínio `casanagringa.com` + e-mails corporativos (SPF/DKIM/DMARC); abertura de consulta jurídica para modelo de co-corretagem PT/ES e termos LGPD/GDPR; início de 15 entrevistas com brasileiros em Lisboa/Porto e em São Paulo.
- **Semana 2:** Criação do projeto Firebase/GCP (região UE), ativação de Auth MFA, Firestore, Storage e deploy do **MVP SaaS v0.1** (Home PT/EN/ES, Simuladores PT/ES, Onboarding, CRM interno).
- **Semana 3:** Publicação dos primeiros 5 guias SEO âncora (IMT, NIF, NIE, custos Espanha, checklist anti-golpes); ativação de canal YouTube/Instagram educativo; assinatura de NDA e termos iniciais com 2 imobiliárias AMI (Lisboa e Porto) e 2 advogados (PT e ES).
- **Semana 4:** Liberação do Cofre Documental e Chat dos Agentes Gemini com disclaimers; início de captação orgânica + € 1.500 em testes de busca Google Ads (palavras de alta intenção).
- **Meta M1:** SaaS online; 30 leads MQLs; 15 entrevistas concluídas; 2 parceiros AMI + 2 advogados em onboarding.

### Mês 2 (Fev/2027) — Primeiros Diagnósticos Pagos & Curadoria de Imóveis
- **Semana 5–6:** Curadoria manual dos primeiros **20 imóveis reais** em parceria com as imobiliárias AMI/AICAT (Lisboa, Cascais, Porto, Madrid, Valência), já com Score DD preliminar e simulação de impostos; publicação dos Termos de Uso e Política de Privacidade revisados.
- **Semana 7–8:** Venda dos primeiros **Diagnósticos Estratégicos (€ 390)**; operação dos primeiros 3 dossiês no Cofre (NIF/NIE + checklist documentos); calibração do CRM e do lead scoring com dados reais de objeções.
- **Meta M2:** 45 novos MQLs; 4 diagnósticos pagos realizados; 1º acordo de co-corretagem ES (Madrid/Valência) e 1º acordo com intermediário de crédito BdP.

### Mês 3 (Mar/2027) — Primeira Due Diligence & Estruturação Pré-Seed
- **Semana 9–10:** Execução das primeiras **Due Diligences completas** em parceria com advogado revisor; lançamento de 2 webinars ao vivo ("Como comprar imóvel em Portugal e Espanha sem cair em golpes") em parceria com contador BR-PT.
- **Semana 11–12:** Lançamento do plano piloto **Essencial / Plus** no SaaS para compradores ativos; consolidação dos primeiros números de CAC/funil e abertura de conversas para **Pré-Seed (€ 400k–€ 600k)** caso haja necessidade de acelerar equipe (ou decisão de seguir *bootstrapped* com fluxo de caixa de DDs).
- **Meta M3:** 65 MQLs; 3 DDs pagas; 2 assinantes pagos iniciais; primeiros 2 clientes em fase de proposta/reserva.

### Mês 4 (Abr/2027) — Primeiras Reservas (CPCV/Arras) & Segurança Avançada
- **Semana 13–14:** Acompanhamento dos primeiros contratos CPCV (PT) e Arras (ES) com *Statement of Compensation* assinado; implementação do fluxo **Anti-BEC (dupla conferência de IBAN)**; ativação de *rev share* com parceiro de câmbio para as primeiras remessas de sinal.
- **Semana 15–16:** Expansão do conteúdo SEO programático (15 páginas de bairros/cidades PT/ES); contratação do **Consultor Imobiliário Sênior PT** (modelo híbrido fixo enxuto + comissão) para liberar tempo do fundador.
- **Meta M4:** 90 MQLs; 4 imóveis sob reserva/CPCV; 1º *referral* cambial/crédito mapeado.

### Mês 5 (Mai/2027) — Primeiro Fechamento (Escritura), Pentest e Automação
- **Semana 17–18:** **Primeira Escritura Concluída (Marco histórico!)**; registro do 1º estudo de caso e depoimento verificável em vídeo/texto (com consentimento); início da migração dos dados críticos para Cloud SQL Postgres + WORM.
- **Semana 19–20:** Execução do **Pentest externo #1** sobre o SaaS e correção de quaisquer achados médios/altos; integração de assinatura eletrônica (eIDAS/DocuSign) no fluxo de propostas.
- **Meta M5:** **1º fechamento (escritura)**; 115 MQLs; 7 assinantes ativos; Pentest sem vulnerabilidades críticas abertas.

### Mês 6 (Jun/2027) — Consolidação, Gate M6 e Decisão de Escala
- **Semana 21–22:** Fechamento da 2ª e 3ª escrituras; lançamento oficial do fluxo de pós-venda v1 (entrega de chaves + dossiê IRPF/CBE + indicação de gestão de aluguel).
- **Semana 23–24:** Auditoria trimestral de compliance e revisão de NPS dos primeiros compradores; comitê **Go/No-Go de M6** para decidir velocidade de contratações de H2 2027 e alocação de capital.
- **Meta M6 (Acumulada):** ≥ 5 fechamentos (ou ≥ 3 fechamentos + ≥ 4 em CPCV garantido conforme ciclo); ≥ 12 parceiros auditados; NPS ≥ 60; 0 incidentes de fraude.

---

## 3. Equipe Enxuta e Orçamento Mensal (M1–M6) [E]

*(Alinhado com `docs/anexos/gerar_plano_financeiro.py` — Cenário Base c/ Pré-Seed € 500k ou versão Bootstrapped alternativa)*

| Item | M1–M2 | M3–M4 | M5–M6 | Observação |
|---|---|---|---|---|
| **Equipe (FTE)** | 2 (Fundadores) | 3 (+1 Dev/Ops) | 4 (+1 Consultor PT) | Se *bootstrapped* puro, fundadores operam com pró-labore mínimo (€ 1.500) até M4 |
| **Pessoal / Pró-labore** | € 9.600/mês | € 14.400/mês | € 19.200/mês | Custo ponderado BR+PT (se *bootstrapped*: ~€ 4–6k/mês) |
| **Marketing / Tráfego** | € 1.500–2.000 | € 3.000–4.000 | € 5.000–6.000 | Google Search de alta intenção + conteúdo |
| **Tech / Cloud / Gemini / Domínio** | € 700 | € 900 | € 1.100 | Firebase Blaze + Gemini API + SaaS |
| **Jurídico / Contábil / Seguros** | € 3.200 | € 3.200 | € 3.200 (+Pentest ~€ 4k M5) | Revisão contratual PT/ES/BR + DPO + RC |
| **G&A / Visitas / Viagens** | € 1.800 | € 1.800 | € 1.800 | Deslocamentos locais e ferramentas |
| **Despesa Total Mensal (Base)** | **~€ 17 mil** | **~€ 24 mil** | **~€ 31 mil** | *Modo Bootstrapped Ultra-Enxuto possível a ~€ 6–9k/mês* |

---

## 4. Matriz RACI dos Primeiros 6 Meses

*(R = Responsável pela execução · A = Aprovador final · C = Consultado · I = Informado)*

| Atividade Crítica | CEO / Produto | CTO / Tech | Ops / Consultor | Advogado Parceiro | Compliance / DPO |
|---|---|---|---|---|---|
| Arquitetura SaaS, Segurança & IA | I | **R / A** | C | C (disclaimers) | **C** |
| Curadoria de Country Pack (PT/ES) | **A** | C | **R** | **R (validação legal)** | C |
| Captação de Parceiros (AMI / Bancos) | **R / A** | I | **R** | C | **C (KYB)** |
| Atendimento / Venda Consultiva / Visitas | **A** | I | **R** | I | I |
| Parecer de Due Diligence do Imóvel | I | I | C | **R / A** | **I** |
| Liberação de Instrução Bancária (Anti-BEC) | I | C (sistema) | C | **R (Assinatura 1)** | **A (Assinatura 2)** |
| Aprovação de Campanhas e Termos LGPD | **A** | C | I | C | **R** |

---

## 5. Rituais Operacionais & OKRs (Q1–Q2 2027)

### Rituais Semanais
- **Segunda (09h, 45 min) — Comitê de Pipeline & Travas:** revisão do Kanban CRM, prazos de clientes ativos e gargalos com bancos/notários.
- **Quarta (14h, 30 min) — Revisão de Produto & IA:** análise de conversas anônimas da IA, taxa de escalonamento HITL e bugs.
- **Sexta (16h, 30 min) — Auditoria de Segurança & Caixa:** verificação de `audit_logs`, consentimentos, recebíveis e queima de caixa.

### OKRs do Primeiro Semestre (M1–M6)
1. **Objetivo 1: Provar Confiança Operacional**
   - *KR1:* 100% dos imóveis negociados com Parecer DD emitido antes do CPCV/Arras.
   - *KR2:* **0 incidentes** de fraude, vazamento ou erro de instrução bancária.
   - *KR3:* NPS ≥ 60 entre clientes de Diagnóstico, DD e Compra.
2. **Objetivo 2: Validar Máquina de Aquisição & Receita**
   - *KR1:* 480 MQLs gerados nos 6 meses (≥ 40% orgânicos/indicação até M6).
   - *KR2:* ≥ 15 pacotes de Due Diligence/Assessoria ou Assinaturas vendidas.
   - *KR3:* ≥ 3 a 5 escrituras concluídas ou em etapa final irreversível até M6.
3. **Objetivo 3: Estruturar Ecossistema Auditado**
   - *KR1:* ≥ 8 parceiros ativos em PT (Lisboa, Porto, Algarve) e ≥ 4 em ES (Madrid, Barcelona, Valência).
   - *KR2:* SLA médio de resposta de parceiros ≤ 24h úteis.

---

## 6. Critérios Go / No-Go no Marco de 6 Meses (M6)

| Cenário no Fim de M6 | Evidência Observada | Decisão Recomendada |
|---|---|---|
| **GO (Acelerar)** | ≥ 5 fechamentos/CPCVs sólidos, CAC real ≤ € 5k, parceiros pagando co-corretagem sem atrito, NPS ≥ 60 | Captar Seed / ampliar marketing BR e entrar com pedido de licença AMI própria |
| **AJUSTE (Otimizar)** | Muitos diagnósticos pagos (€ 390), mas baixa conversão para compra (clientes travam em crédito ou imóveis caros) | Focar segmento S2 (já residentes em PT) e empacotar produto "Crédito + NIF + Compra" antes de escalar S1 |
| **PIVÔ / NO-GO** | Clientes usam simuladores/IA mas recusam pagar assessoria/DD e somem para fechar direto com corretores locais | Pivotar para **B2B SaaS / Infraestrutura de Confiança e DD** vendida diretamente para imobiliárias e bancos europeus |

---

*Fim do documento.*
