# 17 — Estratégia de SEO, Conteúdo YMYL e GEO (AI Overviews) · CASA NA GRINGA

| Campo | Valor |
|---|---|
| **Objetivo** | Estruturar a máquina de aquisição orgânica trilíngue (PT-BR, PT-PT, EN, ES), arquitetura técnica de URLs/hreflang, clusters editoriais, SEO programático, Schema.org, rigor E-E-A-T para YMYL, GEO (otimização para respostas de IA) e calendário de 42 pautas |
| **Público** | Growth, conteúdo, engenharia frontend, SEO, jurídico (revisores E-E-A-T) |
| **Status** | Rascunho v0.1 |
| **Data** | 16/11/2026 |
| **Contrato comum** | [00-premissas-e-decisoes.md](00-premissas-e-decisoes.md) |
| **Documentos relacionados** | [16-estrategia-crescimento.md](16-estrategia-crescimento.md) · [18-estrategia-aquisicao.md](18-estrategia-aquisicao.md) |

---

## 1. Arquitetura Técnica de SEO Multilíngue e Hreflang

Como atendemos Brasil (`pt-BR`), Portugal (`pt-PT`), Espanha (`es-ES`) e público internacional (`en`), o roteamento Next.js deve impedir duplicação de conteúdo e direcionar cada região corretamente:

```
casanagringa.com/pt-br/...   (Padrão x-default / brasileiros no BR e exterior)
casanagringa.com/pt-pt/...   (Variante lexical Portugal: "crédito habitação", "arrendamento", "freguesia")
casanagringa.com/es/...      (Espanhol: vendedores/parceiros e compradores hispanofalantes)
casanagringa.com/en/...      (Inglês: investidores internacionais e parceiros)
```

### Requisitos Técnicos Obrigatórios
1. **Tags `<link rel="alternate" hreflang="...">` recíprocas** em todas as páginas + `x-default` apontando para `/pt-br/`.
2. **Core Web Vitals (Meta Google):** LCP < 1,8 s, INP < 150 ms, CLS < 0,05 (SSR/ISR no Next.js App Hosting, imagens `next/image` AVIF/WebP).
3. **Structured Data (Schema.org JSON-LD):**
   - `RealEstateListing` + `Offer` + `PostalAddress` nas páginas de imóveis;
   - `FAQPage` e `HowTo` nos guias processuais (NIF, NIE, escritura);
   - `WebApplication` / `FinancialProduct` (educativo) nos simuladores;
   - `Person` / `Organization` vinculando autor e **revisor jurídico** (`reviewedBy`) para fortalecer E-E-A-T!

---

## 2. E-E-A-T para Conteúdo YMYL e GEO (Otimização para Respostas de IA)

Compra de imóveis, impostos e câmbio enquadram-se em **YMYL (*Your Money or Your Life*)**. Conteúdo genérico gerado por IA sem revisão sofre desclassificação nos motores de busca.

### Protocolo Editorial E-E-A-T
- Todo artigo jurídico/fiscal exibe **dupla autoria:** *Redação Casa na Gringa* + **Selo "Revisado tecnicamente por [Nome, OAB/OA/ICAM nº X] em DD/MM/AAAA"**.
- Inclusão obrigatória de **links para fontes primárias** (`portaldasfinancas.gov.pt`, `dre.pt`, `agenciatributaria.es`, `boe.es`, `bcb.gov.br`).
- **GEO (Generative Engine Optimization):** Cada artigo começa com um **Resumo Direto de 40–60 palavras** e **tabelas comparativas estruturadas** (custos, prazos, taxas), facilitando a citação da `casanagringa.com` pelo Google AI Overviews, Perplexity e assistentes de IA.

---

## 3. Clusters Estratégicos & SEO Programático

| Cluster Pilar | Intenção de Busca | Exemplos de Palavras-Chave Alvo (PT/ES/EN) | Conversão Esperada |
|---|---|---|---|
| **C1 — Custos & Impostos (Alta Intenção)** | Fundo/Meio de funil | *quanto custa comprar imovel em portugal*, *IMT portugal tabela*, *ITP madrid catalunha estrangeiro*, *impostos compra casa espanha* | Simulador PT/ES |
| **C2 — Burocracia & Documentação** | Fundo/Meio de funil | *como tirar NIF portugal brasileiro*, *como tirar NIE espanha para comprar imovel*, *procuracao comprar casa exterior apostila haia* | Onboarding + Cofre |
| **C3 — Crédito & Câmbio** | Meio/Fundo de funil | *financiamento imobiliario em portugal para nao residentes*, *hipoteca espanha no residentes*, *enviar dinheiro brasil portugal comprar imovel IOF* | Diagnóstico + Parceiros |
| **C4 — Segurança & Anti-Golpes** | Diferencial de marca | *golpe compra imovel portugal*, *due diligence imobiliaria portugal*, *nota simple espanha como verificar dividas*, *golpe alteracao IBAN* | Autoridade + DD |
| **C5 — Cidades & Bairros (Programático)** | Topo/Meio de funil | */pt-br/guia/portugal/lisboa/campo-de-ourique*, */pt-br/guia/espanha/valencia/ruzafa* | Comparador + Portal |

---

## 4. Calendário Editorial dos Primeiros 6 Meses (45 Pautas Priorizadas)

*(Ritmo: ~2 artigos de alta profundidade/semana + páginas programáticas de cidades)*

| Mês | Pautas de Conteúdo Pilar & Guias Práticos |
|---|---|
| **M1 (Sem 1–4)** | 1. Guia completo: comprar imóvel em Portugal sendo brasileiro (passo a passo 2027) · 2. Tabela IMT e Imposto do Selo em Portugal: quanto separar além do preço · 3. Como tirar o NIF português à distância com segurança · 4. Guia completo: comprar imóvel na Espanha sendo brasileiro ou português · 5. ITP, IVA e AJD na Espanha: diferenças entre Madrid, Barcelona, Valência e Andaluzia · 6. Como obter o NIE espanhol para compra de imóvel · 7. Checklist anti-golpes: os 10 erros mais caros ao comprar fora |
| **M2 (Sem 5–8)** | 8. Financiamento em Portugal para não residentes: LTV, entrada e documentos · 9. Hipoteca na Espanha para estrangeiros: o que bancos exigem · 10. Como transferir dinheiro do Brasil para comprar imóvel na Europa (câmbio, IOF, BCB) · 11. O que é Due Diligence imobiliária e por que fazer antes do sinal · 12. Certidão Permanente e Caderneta Predial: como ler sem cair em armadilhas · 13. Nota Simple e Catastro na Espanha: verificando hipotecas e embargos · 14. Procuração pública e Apostila de Haia para comprar imóvel sem viajar |
| **M3 (Sem 9–12)** | 15. CPCV em Portugal: cláusulas de proteção que todo comprador deve exigir · 16. Contrato de Arras Penitenciales na Espanha: riscos de perder o sinal · 17. Comprar na Pessoa Física vs. Empresa (Lda./S.L.) em Portugal e Espanha · 18. Declaração no IRPF e CBE (Banco Central) de imóvel no exterior · 19. Lisboa vs. Porto vs. Braga: onde investir ou morar em 2027 · 20. Madrid vs. Valência vs. Málaga: comparativo de preços, impostos e aluguel · 21. Golpe do IBAN falso (BEC): como proteger seu sinal de € 50 mil+ · 22. Tradução juramentada na Espanha vs. Portugal: quando é obrigatória |
| **M4 (Sem 13–16)** | 23. Comprar imóvel na planta (*off-plan*) em Portugal e Espanha: garantias bancárias · 24. Aluguel de longa duração vs. Alojamento Local (PT) / VUT (ES): o que a lei permite · 25. Custos anuais de manter um imóvel na Europa (IMI, IBI, IRNR Modelo 210, condomínio) · 26. Comprar imóvel dá visto ou cidadania? Mitos após o fim do Golden Visa · 27. Seguro de vida e multirriscos no crédito habitação europeu · 28. Casamento em comunhão parcial ou separação: impacto na escritura no exterior · 29. Abertura de conta bancária em Portugal e Espanha para estrangeiros · 30. Como funciona o *Statement of Compensation* (transparência de comissão) |
| **M5 (Sem 17–20)** | 31. Guia bairro: Cascais e Estoril para famílias brasileiras · 32. Guia bairro: Foz do Douro e Boavista (Porto) · 33. Guia bairro: Salamanca e Chamberí (Madrid) · 34. Guia bairro: Eixample e Poblenou (Barcelona) · 35. Guia bairro: Ruzafa e Ensanche (Valência) · 36. Reforma e obras em prédios históricos europeus: licenças camarárias · 37. Planejamento sucessório básico de imóvel na UE vs. Brasil *(visão geral)* · 38. Quanto custa mobiliar e equipar um T2 em Lisboa ou Madrid |
| **M6 (Sem 21–24)** | 39. Estudo de caso #1: como conduzimos uma escritura remota segura do Brasil a Lisboa · 40. Guia Algarve (Lagos, Tavira, Vilamoura) para aposentadoria e renda · 41. Guia Costa del Sol (Málaga, Marbella) · 42. Portugueses comprando na Espanha: vantagens fiscais e cuidados na fronteira · 43. Como avaliar o certificado energético (A–F) e custo de climatização · 44. Relatório Semestral Casa na Gringa: prazos reais de bancos e notários em 2027 · 45. Glossário jurídico-imobiliário PT-BR ⇄ PT-PT ⇄ ES |

---

## 5. Estratégia de Link Building & KPIs

- **Digital PR Baseado em Dados:** Publicação trimestral do *Índice Casa na Gringa de Burocracia e Custos de Compra Estrangeira* para veículos no Brasil (Valor, InfoMoney, Exame) e Portugal (Idealista News, Eco, Dinheiro Vivo).
- **Guest Content & Parcerias:** Artigos cruzados com blogs de contabilidade internacional, escolas de negócios e comunidades de expatriados.
- **KPIs de SEO:** Impressões orgânicas, cliques não-marca, posição média em palavras-chave de fundo de funil (Top 3 em 12 meses), e **Receita Atribuída ao Orgânico** (meta: ≥ 45% dos fechamentos a partir de M15).

---

*Fim do documento.*
