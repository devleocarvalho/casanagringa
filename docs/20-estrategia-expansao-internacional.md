# 20 — Estratégia de Expansão Internacional · CASA NA GRINGA

| Campo | Valor |
|---|---|
| **Objetivo** | Definir o framework quantitativo de seleção de novos mercados (destinos e origens), o modelo operacional de *Country Pack*, sequência de expansão em 5 anos, investimento por país e critérios Go/No-Go |
| **Público** | Fundador(es), conselho, estratégia, jurídico, produto |
| **Status** | Rascunho v0.1 |
| **Data** | 16/11/2026 |
| **Contrato comum** | [00-premissas-e-decisoes.md](00-premissas-e-decisoes.md) |
| **Documentos relacionados** | [01-visao-estrategica.md](01-visao-estrategica.md) · [10-modelagem-dominio.md](10-modelagem-dominio.md) · [19-estrategia-compliance.md](19-estrategia-compliance.md) |

---

## 1. Disciplina de Expansão: "Profundidade Ibérica antes de Bandeiras no Mapa"

Expandir para múltiplos países cedo demais destrói margem e segurança jurídica. A Casa na Gringa consolida **Portugal + Espanha** nos primeiros 18–24 meses antes de ativar o 3º destino em 2030 (ou piloto em fim de 2029, se métricas baterem).

---

## 2. Scorecard Ponderado de Seleção de Destinos (0 a 5 por critério)

Pesos: Demanda Lusófona (25%) · Clareza/Segurança Jurídica Registral (20%) · Ticket & Pool de Comissão (20%) · Facilidade de Parcerias/Licença (15%) · Estabilidade Regulatória/Fiscal p/ Estrangeiros (10%) · Sinergia Pós-Venda/Aluguel (10%).

| Candidato | Demanda BR/PT (25%) | Segurança Jurídica (20%) | Ticket & Comissão (20%) | Parcerias / Licença (15%) | Estab. Regulatória (10%) | Pós-Venda (10%) | **Score Ponderado** | Horizonte |
|---|---|---|---|---|---|---|---|---|
| **Portugal** *(Base)* | 5,0 | 4,5 | 4,0 | 4,5 | 3,5 | 4,5 | **4,45** | **Ativo (A1)** |
| **Espanha** *(Base)* | 4,0 | 4,5 | 4,0 | 4,0 | 3,0 | 4,5 | **4,00** | **Ativo (A1)** |
| **EUA (Flórida — Orlando/Miami)** | 5,0 | 4,5 | 4,5 | 3,0 *(licença FL + LLC/FIRPTA complexa)* | 4,5 | 4,5 | **4,35** | **Candidato #3A (2030)** |
| **Itália (Milão / Norte / Cidadania)** | 3,5 | 4,0 | 4,0 | 3,5 | 4,0 | 3,5 | **3,78** | **Candidato #3B (2030)** |
| **Emirados Árabes (Dubai)** | 3,5 | 3,5 | 5,0 | 4,0 | 4,5 | 4,0 | **4,03** *(alto risco reputacional/AML se sem filtro)* | **Avaliar A4/A5** |
| **Grécia / Chipre** | 2,5 | 3,0 | 3,5 | 3,0 | 3,0 | 3,5 | **3,03** | **Não priorizar** |
| **Paraguai / Uruguai / Panamá** | 3,0 | 3,5 | 2,5 | 3,5 | 4,0 | 3,0 | **3,18** | **Baixo ticket vs. custo fixo** |

### Leitura Estratégica dos Candidatos #3
- **EUA (Flórida):** Maior mercado de brasileiros no exterior fora da Europa, porém exige infraestrutura jurídica/tributária completamente diferente (*title company*, *escrow*, estrutura LLC, FIRPTA, *common law*, licença DBPR da Flórida). Exige investimento maior (~€ 180–250k para entrada segura **[E]**).
- **Itália:** Mesmo ambiente jurídico da UE (SEPA, GDPR, *civil law*), forte demanda de brasileiros com cidadania italiana reconhecida e custos de entrada mais baixos (~€ 100–140k **[E]**). **Recomendação:** Itália como **Destino #3 rápido (UE)** ou **Flórida como Destino #3 de alto volume pós-Series A**.

---

## 3. Modelo de "Country Pack" (Playbook Repetível de Abertura)

Nenhum país entra em produção sem completar 100% do seu **Country Pack** (tempo estimado de preparação: **12–16 semanas**):

1. **Camada Jurídica & Fiscal (RAG):** Mapeamento de impostos de aquisição/posse, regras de visto/residência relacionadas, fluxo notarial, minutas-padrão e ingestão de fontes oficiais no RAG (validado por escritório local).
2. **Camada Produto & Simulador:** Cadastro das tabelas tributárias regionais na tabela `catalog.country_packs`, fluxos de documentos obrigatórios (equivalentes a NIF/NIE) e tradução da UI.
3. **Camada Rede Auditada (Mínimo Viável):** Pelo menos **2 imobiliárias licenciadas**, **2 escritórios de advocacia independentes**, **1 banco/intermediário de crédito** e **1 rota de câmbio** com contratos assinados e KYB aprovado.
4. **Camada Operacional:** 1 Gerente de País/Operações bilíngue local + 10 imóveis curados iniciais para lançamento.

---

## 4. Expansão de Mercados de Origem (Compradores Lusófonos)

| Onda | Origem dos Compradores | Racional & Cuidados Específicos |
|---|---|---|
| **A1–A2 (Atual)** | **Brasil** + **Portugal (residentes e brasileiros em PT)** | Base principal, idioma e fluxo cambial conhecidos. |
| **A2–A3 (2028–2029)** | **Diáspora Portuguesa** (Suíça, França, Luxemburgo, Reino Unido, EUA) | Alto poder aquisitivo em EUR/CHF/GBP, zero risco cambial negativo, compra em Portugal e Espanha. Aquisição via associações de emigrantes e mídia local. |
| **A3+ (2029+)** | **PALOP (Angola, Moçambique, Cabo Verde)** | Ticket alto (HNWI), forte laço cultural e educacional com Portugal. **Exige ativação somente após maturidade de compliance AML/EDD** (origem de fundos reforçada, sanções, controles cambiais locais de saída de divisas). |

---

## 5. Gate Go / No-Go para Abertura de Novo País

Só liberar orçamento de novo destino quando **todos** os critérios abaixo forem atendidos no mercado-base:
1. ≥ 60 fechamentos acumulados com processo padronizado;
2. Margem de contribuição ≥ 55% e caixa pós-lançamento garantindo ≥ 12 meses de runway;
3. NPS ≥ 60 e zero incidentes graves de compliance/fraude nos últimos 12 meses;
4. Pelo menos 1 sócio/líder local contratado para o novo país antes da abertura comercial.

---

*Fim do documento.*
