# 15 — Plano Financeiro 24 Meses (Jan/2027 – Dez/2028) · CASA NA GRINGA

| Campo | Valor |
|---|---|
| **Objetivo** | Apresentar o modelo financeiro mensal de 24 meses para uma operação inicialmente enxuta: premissas macro, receitas por linha, COGS, headcount, OPEX, DRE trimestral, fluxo de caixa, necessidade de capital, cenários, sensibilidade e unit economics |
| **Público** | Fundador(es), investidores pré-seed/seed, CFO/financeiro |
| **Status** | Rascunho v0.1 |
| **Data** | 16/11/2026 (M1 = jan/2027) |
| **Contrato comum** | [00-premissas-e-decisoes.md](00-premissas-e-decisoes.md) |
| **Anexos executáveis** | Planilha CSV: [anexos/plano-financeiro-24m.csv](anexos/plano-financeiro-24m.csv) · Script gerador: [anexos/gerar_plano_financeiro.py](anexos/gerar_plano_financeiro.py) |

> [!IMPORTANT]
> **Aviso:** Todos os valores abaixo são **estimativas de planejamento [E — a validar]** geradas de forma determinística pelo script Python anexo. Nota de reconciliação com [01-visao-estrategica.md](01-visao-estrategica.md): o cenário operacional detalhado aqui adota equipe inicial **enxuta** (2 → 8 FTE em A1 e 9 → 18 FTE em A2 com custo médio ponderado BR+PT de € 4.800/mês), mantendo os mesmos 20 fechamentos (A1) e 90 fechamentos (A2) — o que reduz o *burn* anual frente ao orçamento máximo ilustrado na visão macro.

---

## 1. Premissas Macroeconômicas e Operacionais (Cenário Base) [E]

| Premissa | Valor Base | Justificativa / Nota |
|---|---|---|
| **Ticket médio de imóvel** | € 400.000 | Foco ≥ € 250 mil em Lisboa, Porto, Cascais, Madrid, Valência |
| **Câmbio de referência** | € 1 = R$ 6,30 | Referência de planejamento para faturamento/conversão BRL |
| **Ciclo de conversão (lead → escritura)** | 4 a 7 meses | Primeiros fechamentos só ocorrem a partir de **M5 (mai/2027)** |
| **Taxa líquida média de comissão CNG** | **2,2% (A1)** · **3,0% (A2)** | A1 em co-corretagem (split); A2 com licença AMI própria em PT |
| **ARPU Assinaturas pagas (ponderado)** | € 170/mês | Mix entre Essencial (€ 79), Plus (€ 249) e Private (€ 790) |
| **Custo médio por FTE (BR + PT ponderado)** | € 4.800/mês | Inclui encargos; fundadores retiram mínimo nos primeiros meses |
| **Caixa inicial M0 + Captações Base** | € 100k (anjo/fundador) + **€ 500k Pré-Seed (M1)** + **€ 2,2M Seed (M13)** | *Alternativa Bootstrapped:* ver §5 (operação sem Seed) |

---

## 2. Resumo Anual e DRE Trimestral (Cenário Base — EUR)

### 2.1 Consolidado Ano 1 (2027) vs. Ano 2 (2028)

| Indicador | Ano 1 (M01–M12) | Ano 2 (M13–M24) | Variação |
|---|---|---|---|
| **MQLs acumulados** | 1.955 | 7.450 | +281% |
| **Assinantes pagos (fim do ano)** | 35 | 136 | +289% |
| **Fechamentos (Escrituras)** | **20** | **90** | +350% |
| **GMV Transacionado** | **€ 8.000.000** | **€ 36.000.000** | +350% |
| **Receita Total** | **€ 321.980** *(~R$ 2,03M)* | **€ 1.933.010** *(~R$ 12,18M)* | +500% |
| **COGS (Custos Diretos Variáveis)** | (€ 110.246) | (€ 641.618) | — |
| **Lucro Bruto (Margem Bruta %)** | **€ 211.734 (65,8%)** | **€ 1.291.392 (66,8%)** | +1,0 p.p. |
| **OPEX Total (Pessoal, Mkt, Tech, Legal, G&A)** | (€ 431.526) | (€ 1.310.404) | +204% |
| **EBITDA** | **–€ 219.792** | **–€ 19.012** *(break-even em Q7)* | +91% |
| **Caixa Mínimo / Caixa Final** | € 380.208 / € 380.208 | € 2.531.422 / € 2.561.196 | — |

### 2.2 DRE Trimestral (Q1 2027 a Q8 2028 — em EUR)

| Linha (EUR) | Q1'27 | Q2'27 | Q3'27 | Q4'27 | Q1'28 | Q2'28 | Q3'28 | Q4'28 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Fechamentos | 0 | 3 | 7 | 10 | 15 | 21 | 25 | 29 |
| **Receita Bruta** | **6.070** | **50.220** | **108.130** | **157.560** | **303.900** | **438.120** | **541.360** | **649.630** |
| (–) COGS | (2.919) | (17.728) | (36.552) | (53.047) | (99.437) | (144.433) | (180.047) | (217.701) |
| **Lucro Bruto** | **3.151** | **32.492** | **71.578** | **104.513** | **204.463** | **293.687** | **361.313** | **431.929** |
| (–) OPEX Total | (57.354) | (85.692) | (122.598) | (165.882) | (239.270) | (302.154) | (360.158) | (408.822) |
| **EBITDA** | **–54.203** | **–53.200** | **–51.020** | **–61.369** | **–34.807** | **–8.467** | **+1.155** | **+23.107** |
| **Caixa Final** | **545.797** | **492.597** | **441.577** | **380.208** | **2.545.401** | **2.536.934** | **2.538.089** | **2.561.196** |

---

## 3. Detalhamento Mensal Completo (M01 a M24 — em EUR)

*(Fonte exata: [anexos/plano-financeiro-24m.csv](anexos/plano-financeiro-24m.csv))*

| Mês | MQLs | Assin. | Fech. | GMV | Rec. Comiss. | Rec. DD/Ass. | Rec. Assin. | Rec. Fin/FX/Ref | Pós-Venda + B2B | **Receita Total** | COGS | OPEX | **EBITDA** | FTE | **Caixa Final** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| **M01** | 30 | 0 | 0 | 0 | 0 | 780 | 0 | 0 | 0 | **780** | 390 | 16.810 | **–16.420** | 2 | **583.580** |
| **M02** | 45 | 0 | 0 | 0 | 0 | 1.650 | 0 | 0 | 0 | **1.650** | 825 | 17.340 | **–16.515** | 2 | **567.065** |
| **M03** | 65 | 2 | 0 | 0 | 0 | 3.300 | 340 | 0 | 0 | **3.640** | 1.704 | 23.204 | **–21.268** | 3 | **545.797** |
| **M04** | 90 | 4 | 0 | 0 | 0 | 3.300 | 680 | 0 | 0 | **3.980** | 1.759 | 24.278 | **–22.057** | 3 | **523.740** |
| **M05** | 115 | 7 | 1 | 400k | 8.800 | 4.950 | 1.190 | 1.800 | 0 | **16.740** | 5.909 | 30.164 | **–19.333** | 4 | **504.407** |
| **M06** | 140 | 10 | 2 | 800k | 17.600 | 6.600 | 1.700 | 3.600 | 0 | **29.500** | 10.060 | 31.250 | **–11.810** | 4 | **492.597** |
| **M07** | 170 | 14 | 2 | 800k | 17.600 | 6.600 | 2.380 | 3.600 | 0 | **30.180** | 10.169 | 37.658 | **–17.647** | 5 | **474.950** |
| **M08** | 200 | 18 | 2 | 800k | 17.600 | 8.250 | 3.060 | 3.600 | 0 | **32.510** | 11.103 | 39.266 | **–17.859** | 5 | **457.091** |
| **M09** | 230 | 22 | 3 | 1,2M | 26.400 | 9.900 | 3.740 | 5.400 | 0 | **45.440** | 15.280 | 45.674 | **–15.514** | 6 | **441.577** |
| **M10** | 260 | 26 | 3 | 1,2M | 26.400 | 9.900 | 4.420 | 5.400 | 240 | **46.360** | 15.524 | 52.082 | **–21.246** | 7 | **420.331** |
| **M11** | 290 | 30 | 3 | 1,2M | 26.400 | 11.550 | 5.100 | 5.400 | 480 | **48.930** | 16.592 | 53.690 | **–21.352** | 7 | **398.979** |
| **M12** | 320 | 35 | 4 | 1,6M | 35.200 | 13.200 | 5.950 | 7.200 | 720 | **62.270** | 20.931 | 60.110 | **–18.771** | 8 | **380.208** |
| **M13** | 360 | 42 | 4 | 1,6M | 48.000 | 14.850 | 7.140 | 11.200 | 960 | **82.150** | 26.993 | 72.774 | **–17.617** | 9 | **2.562.591** |
| **M14** | 400 | 50 | 5 | 2,0M | 60.000 | 16.500 | 8.500 | 14.000 | 1.200 | **100.200** | 32.642 | 79.750 | **–12.192** | 10 | **2.550.399** |
| **M15** | 450 | 58 | 6 | 2,4M | 72.000 | 18.150 | 9.860 | 16.800 | 4.740 | **121.550** | 39.802 | 86.746 | **–4.998** | 11 | **2.545.401** |
| **M16** | 500 | 66 | 6 | 2,4M | 72.000 | 19.800 | 11.220 | 16.800 | 6.120 | **125.940** | 41.519 | 93.742 | **–9.321** | 12 | **2.536.080** |
| **M17** | 540 | 74 | 7 | 2,8M | 84.000 | 23.100 | 12.580 | 19.600 | 7.860 | **147.140** | 48.694 | 100.718 | **–2.272** | 13 | **2.533.808** |
| **M18** | 580 | 82 | 8 | 3,2M | 96.000 | 23.100 | 13.940 | 22.400 | 9.600 | **165.040** | 54.220 | 107.694 | **+3.126** | 14 | **2.536.934** |
| **M19** | 620 | 90 | 8 | 3,2M | 96.000 | 26.400 | 15.300 | 22.400 | 11.220 | **171.320** | 56.895 | 114.670 | **–245** | 15 | **2.536.689** |
| **M20** | 660 | 98 | 8 | 3,2M | 96.000 | 26.400 | 16.660 | 22.400 | 12.840 | **174.300** | 57.921 | 121.646 | **–5.267** | 16 | **2.531.422** |
| **M21** | 710 | 106 | 9 | 3,6M | 108.000 | 29.700 | 18.020 | 25.200 | 14.820 | **195.740** | 65.231 | 123.842 | **+6.667** | 16 | **2.538.089** |
| **M22** | 760 | 115 | 9 | 3,6M | 108.000 | 31.350 | 19.550 | 25.200 | 16.440 | **200.540** | 67.109 | 130.850 | **+2.581** | 17 | **2.540.670** |
| **M23** | 810 | 125 | 10 | 4,0M | 120.000 | 33.000 | 21.250 | 28.000 | 18.660 | **220.910** | 73.783 | 137.870 | **+9.257** | 18 | **2.549.927** |
| **M24** | 860 | 136 | 10 | 4,0M | 120.000 | 36.300 | 23.120 | 28.000 | 20.760 | **228.180** | 76.809 | 140.102 | **+11.269** | 18 | **2.561.196** |

---

## 4. Cenários (Conservador, Base, Otimista) e Análise de Sensibilidade

| Indicador (24 Meses Acumulados) | Conservador (50% fech.) | **Base** | Otimista (140% fech.) |
|---|---|---|---|
| Fechamentos A1 + A2 | 10 + 45 = **55** | 20 + 90 = **110** | 28 + 126 = **154** |
| Receita Acumulada 24m | ~€ 1,15M | **€ 2,25M** | ~€ 3,15M |
| Burn Operacional A1 (sem captação) | –€ 280k *(freia contratações)* | **–€ 220k** | –€ 120k |
| Mês de Break-Even Operacional | M28–M30 | **M18 / Q7 (M19–21)** | M14 |

### Sensibilidade do EBITDA de A2 às Alavancas Críticas
- **–€ 50.000 no ticket médio** (€ 400k → € 350k): reduz receita de A2 em ~10% (~€ 190k) → exige +12 fechamentos ou +€ 15/mês em assinaturas para compensar.
- **+60 dias no ciclo de venda:** desloca € 250k de receita de A1 para A2 → exige +€ 150k de colchão de capital de giro no M1–M6.

---

## 5. Necessidade de Capital, Uso dos Recursos e Modo Bootstrapped

### 5.1 Opção A — Caminho Venture (Pré-Seed + Seed — Conforme Modelo Base)
- **Pré-Seed (M1): € 500.000** — *Uso de recursos:* 45% Pessoal/Produto enxuto, 20% Marketing & Conteúdo SEO, 20% Jurídico/Compliance/Licenças/Seguros, 15% Reserva de liquidez até M12.
- **Seed (M13): € 2.200.000** — *Uso de recursos:* 40% Expansão de equipe comercial/ops PT+ES+BR, 25% Aquisição & Marca, 20% Engenharia/Segurança (ISO 27001, App, Temporal), 15% Capital regulatório (AMI/BdP) e reserva para Destino #3.

### 5.2 Opção B — Modo Bootstrapped (Sem Investidor Externo no M1)
Como hoje o estágio é "sem capital definido":
- Fundadores iniciam com pró-labore zero/mínimo (€ 1.500) até os primeiros fechamentos, usando o **SaaS serverless no Firebase** (custo < € 150/mês no plano Blaze no início!) e **parceiros sob sucesso**.
- Custo fixo mínimo mensal nos primeiros 4 meses: **€ 4.500–€ 7.000/mês** (necessidade de caixa próprio inicial para 6 meses = **~€ 45.000–€ 60.000**), recuperável com **3 fechamentos + 8 DDs** no primeiro ano!

---

*Fim do documento.*
