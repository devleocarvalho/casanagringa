# 18 — Estratégia de Aquisição, CRM e Vendas Consultivas · CASA NA GRINGA

| Campo | Valor |
|---|---|
| **Objetivo** | Definir ICP, matriz de canais de aquisição paga e orgânica, modelo de Lead Scoring, playbooks de vendas consultivas, SLAs do CRM, metas de CAC por canal, scripts de objeções e compliance publicitário |
| **Público** | Growth, marketing de performance, vendas/consultores, operações |
| **Status** | Rascunho v0.1 |
| **Data** | 16/11/2026 |
| **Contrato comum** | [00-premissas-e-decisoes.md](00-premissas-e-decisoes.md) |
| **Documentos relacionados** | [15-plano-financeiro-24-meses.md](15-plano-financeiro-24-meses.md) · [16-estrategia-crescimento.md](16-estrategia-crescimento.md) · [17-estrategia-seo.md](17-estrategia-seo.md) |

---

## 1. Ideal Customer Profile (ICP) e Matriz de Canais

| Segmento | ICP Resumido | Canais Primários | CAC Alvo / Fechamento [E] |
|---|---|---|---|
| **S2 (Brasileiros em Portugal)** | Renda familiar UE ≥ € 4.500/mês; entrada ≥ € 60k; compra € 250k–€ 450k em ≤ 6m | Google Search PT, Instagram/YouTube geolocalizado PT, comunidades locais, eventos Lisboa/Porto | **€ 2.800–€ 3.500** |
| **S1 (Brasileiros no Brasil)** | Patrimônio líquido ≥ R$ 5M; liquidez imediata ≥ € 150k; compra € 450k–€ 2M | Parcerias B2B (contadores/private bankers/advogados), YouTube, LinkedIn, Google Search BR, eventos SP/RJ | **€ 5.000–€ 6.500** |
| **S3/S4 (Espanha)** | Investidor ou executivo; entrada ≥ € 120k; foco Madrid, Valência, Barcelona, Málaga | SEO, Google Search, webinars fiscais ES, parcerias empresariais PT/BR | **€ 4.500–€ 5.500** |

---

## 2. Alocação de Verba de Mídia e Canais (M1–M12 — € 89 mil total no Ano 1 [E])

- **45% Google Search (Alta Intenção):** Campanhas estritas (*exact/phrase match*) para palavras de fundo de funil ("comprar casa portugal impostos", "financiamento imovel lisboa brasileiro", "custo compra apartamento madrid") apontando direto para os **Simuladores**.
- **25% YouTube & Instagram Educativo (Autoridade & Confiança):** Vídeos curtos e profundos desmontando mitos, analisando escrituras reais (anonimizadas) e comparando bairros. Remarketing específico para quem usou simulador.
- **20% Parcerias, Webinars & Eventos Presenciais (SP, Lisboa, Porto):** Jantares/workshops para até 30 convidados via escritórios de contabilidade e câmbio parceiros (CAC efetivo muito baixo por taxa de conversão alta).
- **10% LinkedIn Ads & Testes:** Segmentação por cargos C-level/sócios em São Paulo, Rio, Campinas, Curitiba e Lisboa.

---

## 3. Sistema de Lead Scoring (0 a 100 pontos — Automatizado no CRM)

| Critério / Sinal | Pontos |
|---|---|
| Orçamento declarado ≥ € 350 mil (ou entrada ≥ € 100 mil) | **+30** |
| Horizonte de compra ≤ 6 meses | **+20** |
| Já possui NIF/NIE ou residência/renda na UE | **+15** |
| Completou Onboarding de Perfil + Simulação no SaaS | **+15** |
| Interagiu ≥ 5 min com Agente Financeiro/Jurídico ou favoritou ≥ 3 imóveis | **+10** |
| Origem por indicação de parceiro ou cliente | **+10** |
| *Score < 40:* Nutrição automática por IA/Conteúdo · *Score 40–69:* Convite para Diagnóstico € 390 · *Score ≥ 70:* Contato ativo de Consultor Sênior em **< 2h úteis** | |

---

## 4. Pipeline do CRM e SLAs Operacionais

1. **`new_lead` (Novo Lead):** Enriquecimento automático com resultado do simulador. SLA: boas-vindas em < 5 min (Concierge).
2. **`qualified_mql` (Qualificado ≥ 40 pts):** Convite para agendar Diagnóstico Estratégico (ou call exploratória de 15 min para S1 ≥ € 500k). SLA contato: < 2h úteis.
3. **`diagnostic_scheduled` (Diagnóstico Agendado):** Envio de pré-checklist; coleta de objetivos.
4. **`sql_active_plan` (Cliente Ativo — Plano / DD / Mandato):** Abertura do Cofre Documental + Timeline 7 Fases.
5. **`property_selection` (Busca & Visitas):** Envio de shortlist curada com Score DD prévio + agendamento de visitas.
6. **`under_dd` (Proposta / Due Diligence):** Declaração de remuneração assinada + parecer jurídico.
7. **`closed_won` (Escritura Concluída):** Handoff imediato para Pós-Venda + coleta de NPS D+15.

---

## 5. Playbook de Vendas Consultivas & Tratamento de Objeções

| Objeção Típica do Cliente | Resposta Estruturada (Baseada em Confiança) |
|---|---|
| **"Por que vou pagar assinatura ou diagnóstico se imobiliária atende de graça?"** | "A imobiliária tradicional trabalha de graça para você porque o contrato dela é com o vendedor — o incentivo dela é fechar rápido. Na Casa na Gringa, você tem due diligence independente e **100% da sua assinatura Plus/Assessoria vira crédito (*Fee Offset*) no fechamento**, ou seja, você não paga duas vezes." |
| **"Tenho medo de mandar meu passaporte e IR pela internet."** | "Por isso construímos nosso Cofre sobre arquitetura Zero Trust com MFA obrigatório, criptografia AES-256 na UE e histórico imutável onde você vê data, hora e quem acessou cada arquivo, além de controlar quando o acesso do parceiro expira." |
| **"Vocês garantem que eu consiga o financiamento / visto?"** | "Nenhuma empresa séria pode garantir aprovação de banco ou órgão de imigração. O que garantimos é pré-análise rigorosa antes de você dar qualquer sinal, para você não perder dinheiro em reservas impossíveis." |
| **"Já conheço um corretor amigo em Lisboa/Madrid."** | "Ótimo! Podemos trabalhar apenas na camada de **Due Diligence independente, coordenação jurídica/câmbio e cofre documental**, ou fazer co-corretagem formal com seu corretor se ele for licenciado (AMI/AICAT)." |

---

## 6. Compliance de Marketing (Regras Obrigatórias)

- **Proibido:** Promessas de rentabilidade fixa ("12% ao ano em euro garantido"), apelo de "visto fácil", fotos de imóveis fictícios sem identificação de referência real ou uso de depoimentos sem termo de autorização LGPD/GDPR.
- **Obrigatório:** Todo anúncio ou landing page de simulador deve conter rodapé informando natureza estimativa e ausência de aconselhamento financeiro/jurídico definitivo.

---

*Fim do documento.*
