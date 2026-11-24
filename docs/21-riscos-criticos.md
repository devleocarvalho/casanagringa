# 21 — Riscos Críticos e Mitigação · CASA NA GRINGA

| Campo | Valor |
|---|---|
| **Objetivo** | Mapear os riscos existenciais, operacionais, jurídicos, de fraude, tecnológicos e de mercado; definir KRIs (indicadores de alerta), mitigações preventivas, planos de contingência e realizar um *pré-mortem* honesto |
| **Público** | Fundador(es), conselho, Compliance Officer, CTO, investidores |
| **Status** | Rascunho v0.1 |
| **Data** | 16/11/2026 (referência nov/2026) |
| **Contrato comum** | [00-premissas-e-decisoes.md](00-premissas-e-decisoes.md) |
| **Documentos relacionados** | [01-visao-estrategica.md](01-visao-estrategica.md) · [05-seguranca.md](05-seguranca.md) · [06-arquitetura-ia.md](06-arquitetura-ia.md) · [19-estrategia-compliance.md](19-estrategia-compliance.md) |

---

## 1. Matriz de Riscos (Probabilidade × Impacto)

Escala: Probabilidade (1=Rara a 5=Muito Alta) × Impacto (1=Baixo a 5=Existencial). Score = P × I.

| ID | Risco | Categoria | P | I | Score | Prioridade | Dono |
|---|---|---|---|---|---|---|---|
| **R-01** | **Golpe de alteração de IBAN / BEC (Business Email Compromise)** em sinal ou escritura | Fraude / Financeiro | 4 | 5 | **20** | **Crítica** | CTO + Ops |
| **R-02** | **Enquadramento regulatório adverso** (mediação/crédito sem licença ou *fee splitting* com advogado) | Regulatório | 3 | 5 | **15** | **Crítica** | CEO + Jurídico |
| **R-03** | **Crise de liquidez / descasamento de caixa** (ciclo de 5–8 meses até comissão) | Financeiro | 4 | 4 | **16** | **Crítica** | CEO / CFO |
| **R-04** | **Alucinação ou erro jurídico/fiscal da IA** induzindo cliente a prejuízo | IA / Responsabilidade | 3 | 5 | **15** | **Crítica** | CTO / Head IA |
| **R-05** | **Vazamento de dados sensíveis do Cofre** (passaportes, IRPF, extratos — LGPD/GDPR) | Segurança / Privacidade | 2 | 5 | **10** | **Alta** | CTO / DPO |
| **R-06** | **Imóvel com ônus oculto, irregularidade urbanística ou fraude documental do vendedor** | Operacional / Jurídico | 3 | 4 | **12** | **Alta** | Ops + Legal |
| **R-07** | **Falha ética, fraude ou abandono de parceiro local** (corretor/advogado desvia cliente ou erra DD) | Parceiros / Reputação | 3 | 4 | **12** | **Alta** | Head Parceiros |
| **R-08** | **Choque regulatório/político nos países-alvo** (ex.: impostos p/ não-UE em ES, regras de nacionalidade/aluguel em PT) | Mercado / Político | 3 | 4 | **12** | **Alta** | CEO |
| **R-09** | **Risco cambial extremo (disparada EUR/BRL)** congelando demanda S1 (brasileiros no Brasil) | Macroeconômico | 3 | 3 | **9** | **Média-Alta** | Growth / CFO |
| **R-10** | **Concentração excessiva em 1 fornecedor** (ex.: único provedor KYC, nuvem ou 1 agência parceira) | Operacional / Tech | 3 | 3 | **9** | **Média** | CTO / Ops |
| **R-11** | **Escassez de talento bilíngue com rigor jurídico-operacional** e custo fixo prematuro | Pessoas | 3 | 3 | **9** | **Média** | CEO |
| **R-12** | **Desalinhamento do modelo inicial ("marketplace de anúncios" vs. "plataforma de confiança")** | Estratégico | 3 | 4 | **12** | **Alta** | CEO / CPO |

---

## 2. Ficha Detalhada dos Riscos Críticos e Planos de Ação

### R-01 — Golpe de Fraude Financeira / BEC (Alteração de IBAN)
- **Cenário:** Hacker compromete e-mail do advogado, corretor ou vendedor e envia ao comprador um PDF falso alterando o IBAN para pagamento de sinal (CPCV/Arras de € 40 mil–€ 100 mil). Como a marca vende "segurança", **1 único golpe destrói a reputação da empresa**.
- **Gatilho / KRI:** Qualquer envio de instrução bancária fora do Cofre Verificado; tentativa de alteração de IBAN de última hora; e-mail sem assinatura DKIM/DMARC rígida.
- **Mitigação Preventiva:**
  1. **Política Zero IBAN por E-mail/WhatsApp:** A plataforma deixa explícito desde o onboarding que dados de pagamento só são válidos dentro do **Cofre Verificado** após autenticação MFA.
  2. **Regra Out-of-Band:** Toda instrução de transferência ≥ € 5.000 exige confirmação por chamada de vídeo gravada ou 2 assinaturas internas + código de confirmação do destinatário.
  3. **Trava na IA:** Os agentes de IA são programados (regra G10) para **jamais gerar ou confirmar IBAN em texto livre**; apenas apontam o cofre.
- **Contingência:** Protocolo imediato de acionamento bancário (*recall* SWIFT/SEPA em < 2h), bloqueio de acessos, notificação policial/CSIRT e acionamento de seguro Cyber/RC.

### R-02 — Enquadramento Regulatório Adverso
- **Cenário:** Autoridade (IMPIC em PT, AICAT/Consumo em ES, BdP ou Ordem dos Advogados) interpreta que a Casa na Gringa exerce mediação imobiliária, crédito ou advocacia sem licença/registo.
- **KRI:** Queixa formal de concorrente ou cliente; divergência entre contrato de marketing e contrato operacional.
- **Mitigação Preventiva:** Contratos revisados localmente antes do M1; atuação em A1 estritamente como plataforma tecnológica + co-corretagem sob responsabilidade da imobiliária detentora de AMI/AICAT; contratação direta entre cliente e advogado; pedido de licença AMI própria planejado para o início do A2.
- **Contingência:** Suspensão imediata da linha afetada na jurisdição, transição imediata de operação para parceiro licenciado full-service sob revisão jurídica.

### R-03 — Crise de Liquidez / Descasamento de Caixa
- **Cenário:** Equipe consome caixa nos meses 1–5 enquanto as primeiras escrituras demoram 6–8 meses ou atrasam por burocracia bancária.
- **KRI:** Runway < 4 meses; média de ciclo de conversão > 240 dias; taxa de queda de negócios pós-CPCV > 15%.
- **Mitigação Preventiva:** Manter time enxuto (modelo *concierge-first* sem escritórios caros); cobrar **Diagnóstico, Due Diligence e Assinaturas** antecipadamente para subsidiar o CAC; priorizar **S2 (residentes em PT)** nos primeiros 6 meses porque fecham em 3,5–5 meses (metade do tempo de S1).
- **Contingência:** Congelar contratações e mídia paga; focar 100% em fechar pipeline avançado; ativar modelo puramente consultivo/fee-for-service de ciclo curto.

### R-04 — Alucinação Jurídica/Fiscal da IA
- **Cenário:** Agente de IA cita alíquota de IMT/ITP desatualizada, inventa isenção fiscal ou garante elegibilidade de visto, levando o cliente a assinar contrato com prejuízo.
- **KRI:** Taxa de alucinação > 1% em testes semanais (*golden sets*); reclamação de cliente citando resposta do chat.
- **Mitigação Preventiva:** RAG restrito ao corpus curado por advogados com metadado de vigência; verificador de citação forçada; disclaimers permanentes na UI e no texto; **escalonamento automático (HITL)** ao detectar termos como "posso assinar?", "qual imposto exato vou pagar?", "revisar cláusula".
- **Contingência:** Desativação instantânea via *feature flag* (Remote Config) do agente específico para modo "somente triagem + encaminhamento humano" em < 5 minutos.

### R-05 — Vazamento de Dados do Cofre Documental (LGPD/GDPR)
- **Cenário:** Acesso indevido a passaportes, declarações de IR e comprovantes bancários de clientes HNWI.
- **KRI:** Anomalia de downloads em massa no SIEM; tentativa de acesso fora do escopo RBAC/ABAC.
- **Mitigação Preventiva:** MFA obrigatório; criptografia AES-256 com CMEK; RLS no Postgres e Security Rules estritas no Firestore/Storage; URLs assinadas de curta duração (≤ 5 min) e marca d'água dinâmica em visualizações; trilha imutável hash-chain.
- **Contingência:** Runbook de incidentes (doc 05): contenção < 1h, análise forense, notificação à CNPD/AEPD (GDPR) em **≤ 72 horas** e à ANPD/titulares conforme LGPD.

### R-06 & R-07 — Imóvel Irregular ou Desvio/Falha de Parceiro
- **Cenário:** Parceiro oculta defeito registral para fechar venda ou tenta contornar a plataforma (*circumvention*) negociando direto com o cliente.
- **KRI:** Taxa de reprovação tardia (pós-CPCV) > 2%; reclamação de tempo de resposta > 24h; cliente somem após visita.
- **Mitigação Preventiva:** KYC/KYB do parceiro; remuneração do revisor de DD desvinculada do fechamento; cláusula contratual de não-elusão e auditoria de comissão; cliente assina termo explicando que a proteção e garantia de processo da Casa na Gringa só valem dentro da plataforma e do Cofre Verificado.
- **Contingência:** Descredenciamento imediato do parceiro, realocação do cliente em 24h para parceiro reserva (mínimo 2 por praça crítica).

### R-08 & R-09 — Choques Político-Regulatórios e Câmbio
- **Cenário:** Espanha eleva imposto para compradores extra-UE ou Euro dispara frente ao Real, secando demanda de brasileiros em S1.
- **KRI:** Queda > 30% em buscas/MQLs de origem BR ou proposta legislativa aprovada em comissão parlamentar.
- **Mitigação Preventiva:** Atuar em dois países desde o início (PT + ES) e dois públicos (quem já ganha em EUR — S2/S4/S5 — e quem ganha em BRL — S1). Se S1 desacelerar por câmbio, redirecionar verba de aquisição para S2 (residentes em Portugal).

---

## 3. Análise Crítica de Riscos nas Premissas do Fundador

1. **Risco da "Super-Plataforma Prematura":** Tentar construir os 8 agentes autônomos, 12 linhas de receita e integração bancária completa antes de fechar os primeiros 10 clientes manualmente. *Antídoto:* O SaaS MVP entra no ar enxuto para provar captura de leads, confiança no cofre, simuladores e gestão de jornada no CRM, enquanto a validação jurídica/bancária acontece via fluxo humano assistido.
2. **Risco de Prometer "Garantia Total":** O marketing nunca deve usar a expressão "garantia absoluta" ou "risco zero" — o termo correto e defensável é **"processo auditável com verificação independente e transparência radical"**.
3. **Risco de Ignorar o Efeito Rede Local:** No mercado imobiliário europeu, quem controla o inventário exclusivo controla parte do jogo. Se as imobiliárias locais enxergarem a Casa na Gringa como ameaça, não dividirão comissão. *Antídoto:* Posicionar-se para as imobiliárias locais como o **canal que traz o comprador estrangeiro já qualificado, com NIF, pré-aprovado em KYC e com advogado pronto**, acelerando o fechamento delas.

---

## 4. Pré-Mortem: "Estamos em Novembro de 2027 e a Casa na Gringa Falhou. Por Quê?"

| Causa Provável da Falha | Sinal Precoce que Foi Ignorado no M1–M6 | Como Evitar Agora |
|---|---|---|
| 1. **Passamos 6 meses polindo software e IA e fechamos só 2 imóveis** | Baixo volume de entrevistas reais e foco excessivo em features sem pipeline comercial ativo | Meta semanal de conversas com compradores reais desde a Semana 2 (doc 22) |
| 2. **Um cliente caiu em golpe ou comprou imóvel com dívida** | Pressa para aprovar o 1º negócio; pulamos conferência completa por advogado independente | Regra inegociável: nenhuma recomendação de CPCV sem checklist DD assinado por `legal_reviewer` |
| 3. **Clientes usaram nossos simuladores/IA grátis e fecharam direto com outro corretor** | Não criamos gancho de valor que exigisse o Cofre e o *Fee Offset* | Vincular crédito da assinatura/DD e proteção anti-fraude exclusivamente ao fechamento rastreado na plataforma |
| 4. **Queimamos caixa adquirindo leads frios no Instagram no Brasil** | CPL barato, mas taxa de conversão para compra real < 0,5% e ciclo > 12 meses | Qualificação financeira no funil (S1 comprovado) + priorização de S2 (brasileiros já em PT) e indicações de contadores/advogados |

---

*Fim do documento.*
