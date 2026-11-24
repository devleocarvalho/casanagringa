# 12 — Wireframes, Design System e Benchmark de Layout · CASA NA GRINGA

| Campo | Valor |
|---|---|
| **Objetivo** | Documentar o sistema de design, mapa de navegação, benchmark visual de portais líderes (Idealista, Fotocasa, Zillow, QuintoAndar, Properstar, Savills, Sotheby's, Engel & Völkers) e catalogar os **15 wireframes HTML interativos** em `docs/wireframes/` |
| **Público** | CPO, designers UI/UX, engenheiros frontend, stakeholders |
| **Status** | Rascunho v0.1 |
| **Data** | 16/11/2026 |
| **Contrato comum** | [00-premissas-e-decisoes.md](00-premissas-e-decisoes.md) |
| **Índice interativo** | [wireframes/index.html](wireframes/index.html) · CSS: [wireframes/styles.css](wireframes/styles.css) |

---

## 1. Benchmark de Layout e Padrões Visuais de Mercado

Para evitar reinventar a roda na descoberta imobiliária — e ao mesmo tempo destacar que **o produto é confiança**, não só anúncios — combinamos os melhores padrões de dois mundos:

| Referência | O que Adotamos | O que Rejeitamos / Diferenciamos |
|---|---|---|
| **Idealista / Fotocasa** | Layout *split-view* (lista à esquerda + mapa interativo com pins de preço à direita), filtros objetivos (preço/m², tipologia), clareza geográfica. | Poluição de banners, anúncios duplicados do mesmo imóvel, zero transparência jurídica sobre o ativo. |
| **Zillow** | Barra de busca hero limpa e aspiracional, cálculo instantâneo de prestação mensal embutido no card/detalhe, microcopy acessível. | Foco exclusivo no mercado doméstico EUA e ausência de jornada documental transfronteiriça. |
| **QuintoAndar** | Linguagem humana e direta, agendamento de visita em 3 cliques, sensação de processo digital fluido do início ao fim. | Adaptação completa para alto patrimônio internacional, múltiplos países e câmbio. |
| **Sotheby's / Savills / Engel & Völkers** | Estética editorial sóbria (tipografia serifada elegante para títulos, espaço em branco generoso, paleta refinada) que transmite credibilidade a clientes de ticket ≥ € 300 mil. | Opacidade de taxas, atendimento lento/offline sem painel de auditoria nem simuladores transparentes. |
| **Properstar / Kyero** | Suporte multilíngue e conversão de moedas em tempo real para compradores estrangeiros. | Qualidade irregular de parceiros; na Casa na Gringa todo imóvel recebe **Score de Due Diligence** e **Selo de Transparência**. |

---

## 2. Design System ("Confiança Atlântica")

Implementado no CSS compartilhado [wireframes/styles.css](wireframes/styles.css) e replicado no SaaS Next.js + Tailwind:

| Token | Valor Hex | Aplicação |
|---|---|---|
| `--c-ink` (Azul Atlântico) | `#0B1F3A` | Títulos, cabeçalhos, sidebar, botões primários — autoridade e solidez bancária |
| `--c-bg` (Areia Clara) | `#FAF7F2` | Fundo editorial quente — acolhimento e sofisticação longe da frieza genérica |
| `--c-surface` (Branco Puro) | `#FFFFFF` | Cartões, formulários, tabelas, chat |
| `--c-accent` (Terracota/Ouro) | `#B8793A` | CTAs estratégicos, destaques de etapa atual e planos premium |
| `--c-trust` (Verde Confiança) | `#1F7A6B` | Selos verificados, Due Diligence aprovada, alertas de segurança válidos |
| `--c-warn` / `--c-danger` | `#C98A12` / `#B3392F` | Alertas de prazo, bloqueios AML e avisos anti-BEC |
| **Tipografia** | Serif (`Georgia` / `Newsreader`) + Sans (`Inter` / `Plus Jakarta`) | Contraste entre sofisticação patrimonial (títulos) e legibilidade funcional (tabelas, números tabulares, formulários) |

---

## 3. Mapa de Telas & Índice dos 15 Wireframes HTML

Todos os arquivos em `docs/wireframes/` são autocontidos (HTML5 + CSS local `styles.css`, sem CDN externo):

| # | Arquivo | Tela | Zona do Produto |
|---|---|---|---|
| — | [wireframes/index.html](wireframes/index.html) | Hub de navegação entre os 15 wireframes | Índice Geral |
| 01 | [01-home.html](wireframes/01-home.html) | Home institucional + Busca Hero + Selo Zero Trust + Fases + Destinos | Site Público |
| 02 | [02-busca-imoveis.html](wireframes/02-busca-imoveis.html) | Portal de imóveis com filtros, Match %, Score DD e mapa interativo | Descoberta |
| 03 | [03-detalhe-imovel.html](wireframes/03-detalhe-imovel.html) | Detalhe do imóvel + Score Risco DD + Breakdown de impostos + Agendar visita | Descoberta / Seleção |
| 04 | [04-comparador-cidades.html](wireframes/04-comparador-cidades.html) | Comparador lado a lado (Lisboa, Porto, Madrid, Valência, Málaga) | Descoberta |
| 05 | [05-simulador-financeiro.html](wireframes/05-simulador-financeiro.html) | Simulador de custos totais PT/ES (IMT/ITP/IVA) + Financiamento + EUR↔BRL | Planejamento |
| 06 | [06-onboarding-perfil.html](wireframes/06-onboarding-perfil.html) | Wizard de perfil do comprador + calibração do Match IA + consentimento | Planejamento |
| 07 | [07-dashboard-cliente.html](wireframes/07-dashboard-cliente.html) | Painel do cliente com stepper das 7 fases, timeline viva, pendências e Concierge | Portal do Cliente |
| 08 | [08-cofre-documentos.html](wireframes/08-cofre-documentos.html) | Cofre documental com checklist, versões, compartilhamento e histórico auditável | Documentação |
| 09 | [09-chat-agentes-ia.html](wireframes/09-chat-agentes-ia.html) | Chat multiagente Gemini com seletor dos 8 agentes, citações RAG, disclaimer e HITL | Assistentes IA |
| 10 | [10-crm-lista-leads.html](wireframes/10-crm-lista-leads.html) | CRM interno: Kanban do pipeline, lead scoring e SLAs | Backoffice CRM |
| 11 | [11-crm-cliente-360.html](wireframes/11-crm-cliente-360.html) | Ficha 360° do cliente, linha do tempo, visitas, tarefas e compliance | Backoffice CRM |
| 12 | [12-painel-auditoria-seguranca.html](wireframes/12-painel-auditoria-seguranca.html) | Trilha imutável (hash-chain), alertas antifraude/BEC e DSR LGPD/GDPR | Segurança & Audit |
| 13 | [13-agendamento-assessoria-premium.html](wireframes/13-agendamento-assessoria-premium.html) | Agendamento de diagnóstico estratégico e roteiro de visitas presenciais/vídeo | Comercial / Visitas |
| 14 | [14-planos-assinatura.html](wireframes/14-planos-assinatura.html) | Comparativo Explorer / Essencial / Plus / Private + política Fee Offset | Monetização |
| 15 | [15-portal-parceiro.html](wireframes/15-portal-parceiro.html) | Portal do parceiro auditado (advogado/corretor): pareceres DD e documentos compartilhados | Ecossistema B2B |

---

*Fim do documento.*
