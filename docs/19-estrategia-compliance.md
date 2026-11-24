# 19 — Estratégia de Compliance · CASA NA GRINGA

| Campo | Valor |
|---|---|
| **Objetivo** | Definir o programa completo de conformidade regulatória (LGPD, GDPR, AML/CFT, mediação imobiliária PT/ES, intermediação de crédito, pagamentos/câmbio, e-signature, EU AI Act, proteção do consumidor, termos e governança) |
| **Público** | Fundador(es), DPO, Compliance Officer, jurídico externo (BR/PT/ES), CTO, investidores |
| **Status** | Rascunho v0.1 |
| **Data** | 16/11/2026 (referência nov/2026) |
| **Contrato comum** | [00-premissas-e-decisoes.md](00-premissas-e-decisoes.md) |
| **Documentos relacionados** | [05-seguranca.md](05-seguranca.md) · [06-arquitetura-ia.md](06-arquitetura-ia.md) · [14-plano-monetizacao.md](14-plano-monetizacao.md) · [21-riscos-criticos.md](21-riscos-criticos.md) |

> [!CAUTION]
> **Aviso Legal Obrigatório:** Este documento é um mapa estratégico e arquitetural de conformidade. **Não constitui parecer jurídico.** Todas as normas, prazos, registros, obrigações fiscais e cláusulas contratuais devem ser **verificadas e validadas com advogados locais devidamente inscritos (OAB no Brasil, Ordem dos Advogados em Portugal, Colegio de Abogados na Espanha) antes do lançamento comercial**.

---

## 1. Princípio Orientador: Compliance como Produto

Na Casa na Gringa, conformidade regulatória **não é burocracia de retaguarda** — é parte visível da proposta de valor. O cliente escolhe a plataforma exatamente porque tem medo de ilegalidades cambiais, fiscais, imobiliárias e golpes digitais. A arquitetura de compliance segue três pilares:
1. **Não praticar atividades reservadas sem licença** (advocacia, mediação imobiliária direta antes do AMI, crédito antes do registo, custódia de fundos).
2. **Privacy & Security by Design** desde a linha 1 do banco de dados.
3. **Evidência auditável automática** (logs imutáveis, consentimentos versionados, trilha AML).

---

## 2. Proteção de Dados e Privacidade: LGPD (Brasil) & GDPR/RGPD (União Europeia)

Como a plataforma atende residentes no Brasil (**LGPD — Lei n.º 13.709/2018 [F]**) e residentes ou transações na União Europeia (**GDPR — Regulamento (UE) 2016/679 [F]**, além das leis nacionais portuguesas e espanholas — verificar detalhes locais), aplica-se o **padrão mais restritivo entre os dois regimes** como baseline único.

### 2.1 Bases Legais por Finalidade
| Tratamento de Dados | Base Legal Principal | Observações Operacionais |
|---|---|---|
| Execução de jornada de compra, simuladores autenticados, cofre documental | **Execução de contrato / diligências pré-contratuais** | Coletar apenas dados estritamente necessários para a fase atual (minimização) |
| Verificação de identidade, prevenção à fraude e prevenção à lavagem de dinheiro (KYC/AML) | **Cumprimento de obrigação legal/regulatória** | Não pode ser revogada enquanto durar o prazo legal de retenção AML (5–10 anos conforme país — confirmar) |
| Compartilhamento de dossiê com parceiro específico (banco, advogado, corretor) | **Consentimento explícito e granular** (ou execução de solicitação direta do titular) | Nunca compartilhar em lote nem vender leads; cada parceiro recebe link com escopo mínimo e validade temporária |
| Uso de interações com IA para melhoria de produto | **Consentimento explícito (opt-in)** | Dados pessoais **nunca** treinam LLMs externos; avaliação interna só com dados anonimizados/sintéticos |
| Marketing, newsletter e alertas de imóveis | **Consentimento (opt-in)** | Opt-out em 1 clique; sem caixas pré-marcadas |

### 2.2 Governança, Papéis e Documentação Obrigatória
- **Encarregado / DPO:** Nomear DPO formal (pode ser DPO-as-a-Service na Fase 1, reportando ao conselho) com canal público `privacy@casanagringa.com`.
- **RoPA (Registro de Operações de Tratamento):** Mantido atualizado em repositório versionado (descrevendo categorias de titulares, dados, finalidades, terceiros, retenção e medidas de segurança).
- **DPIA / AIPD (Relatório de Impacto à Proteção de Dados):** Obrigatório antes de ir ao ar com: (i) cofre de passaportes e dados financeiros/fiscais, (ii) triagem AML/PEP, e (iii) processamento por agentes de IA.
- **Transferência Internacional de Dados (Brasil ⇄ União Europeia):**
  - Dados primários de transações em PT/ES residem em regiões da UE (`europe-southwest1` / `europe-west1`).
  - Quando dados trafegam entre entidade brasileira e entidade europeia (ou provedores EUA), implementar **Cláusulas Contratuais Padrão (SCCs)** da UE e cláusulas padrão/mecanismos da **ANPD** (Brasil — verificar normas vigentes da ANPD sobre transferência internacional).
- **Direitos dos Titulares (DSR — Data Subject Rights):**
  - Acesso e confirmação, retificação, **portabilidade/exportação estruturada em JSON/PDF** diretamente no painel (`/portal`), oposição e eliminação (respeitada a retenção obrigatória AML/fiscal).
  - **SLA legal vs. meta interna:** GDPR (1 mês, prorrogável em casos complexos — confirmar), LGPD (15 dias para confirmação/declaração completa — confirmar). **Meta interna da Casa na Gringa: responder em ≤ 5 dias úteis e concluir em ≤ 10 dias úteis.**

---

## 3. Prevenção à Lavagem de Dinheiro e Financiamento ao Terrorismo (AML/CFT)

O setor imobiliário internacional é classificado como de **alto risco para lavagem de capitais**. A Casa na Gringa deve cumprir rigorosamente os padrões equivalentes em Portugal (**Lei n.º 83/2017** e supervisão do **IMPIC / UIF** **[F — confirmar detalhes]**) e na Espanha (**Ley 10/2010** e supervisão do **SEPBLAC** **[F — confirmar detalhes]**).

### 3.1 Controles Obrigatórios (KYC / KYB / Origem de Fundos)
1. **KYC (Know Your Customer) Escalado por Risco:**
   - *Nível 1 (Cadastro básico/Simuladores):* Nome, e-mail, país de residência, MFA.
   - *Nível 2 (Visita presencial / Acesso ao Cofre / Proposta):* Verificação de identidade via provedor KYC com prova de vida (*liveness*), conferência de passaporte/CC/RG, verificação automática em listas de **Sanções Internacionais (ONU, UE, OFAC)** e **PEP (Pessoas Politicamente Expostas)**.
   - *Nível 3 (Diligência Reforçada — EDD):* Obrigatória para compras ≥ € 250 mil à vista, clientes PEP, transferências oriundas de jurisdições de risco ou estruturas via *offshores/holding* — exige identificação de **Beneficiário Efetivo (UBO)** e comprovação documental da **Origem Lícita dos Fundos** (IRPF, balanços, contratos de venda de ativo/empresa, extratos bancários).
2. **KYB (Know Your Business) para Parceiros:** Verificação de certidão permanente, licença AMI/AICAT, registo na Ordem, apólice de Seguro RC e ausência de sanções antes de ativar qualquer parceiro.
3. **Sinais de Alerta (Red Flags AML) Bloqueantes:** Recusa em identificar origem dos fundos, tentativa de pagamento em espécie acima dos limites legais (em PT/ES há limites estritos — confirmar valores vigentes), pagamento por terceiro sem vínculo justificado, pedido de subfaturação em escritura. **Qualquer sinal bloqueante escala imediatamente para o `compliance_officer` e impede prosseguimento na plataforma.**
4. **Retenção Legal:** Dossiês KYC/AML mantidos em armazenamento segregado WORM pelo prazo mínimo exigido por lei (tipicamente 7 anos em PT / 10 anos em ES — **confirmar prazos exatos com advogado local**).

---

## 4. Licenciamento Setorial (Imobiliário, Crédito, Pagamentos, Advocacia)

| Atividade | Portugal | Espanha | Estratégia Casa na Gringa (Fase 1 vs. Fase 2+) |
|---|---|---|---|
| **Mediação Imobiliária** | **Obrigatória licença AMI (IMPIC)** + Seguro RC mínimo € 150.000 + idoneidade **[F]** | Liberalizada nacionalmente, mas **registo obrigatório em regiões** como Catalunha (**AICAT**), Andaluzia e Valência; Madrid (**RAIN**) voluntário **[F]** | **A1:** Atuar em co-corretagem/indicação com agências licenciadas locais (elas assinam a mediação). **A2:** Solicitar licença **AMI** própria em PT. |
| **Intermediação de Crédito** | **Obrigatório registo no Banco de Portugal** (Lei n.º 35/2018) **[F]** | Regulada sob **LCCI** (Ley 5/2019) / registo Banco de España **[F — confirmar]** | **A1:** Apenas simulador educativo + redirecionamento consentido a intermediário registado. **A2:** Registo próprio como intermediário vinculado. |
| **Custódia de Fundos / Câmbio / Escrow** | Regulado pelo **BdP** (serviços de pagamento / PSD2) | Regulado pelo **Banco de España** | **Zero custódia pela Casa na Gringa.** Sinais e escrituras vão direto para conta escrow do advogado/notário ou conta do vendedor após verificação anti-BEC. |
| **Atos Jurídicos e Contratos** | Atos próprios reservados a **Advogados / Solicitadores** (Lei n.º 49/2004 — confirmar) | Reservado conforme competências do notário e *abogados* | Advogados independentes contratam diretamente com o cliente. A CNG fornece checklists, organização e IA informativa com disclaimers. |
| **Assinatura Eletrônica** | **eIDAS** (UE) / Chave Móvel Digital (QES para atos com força equivalente à manuscrita) | **eIDAS** (UE) / Cl@ve / Certificados FNMT | Usar provedor qualificado (eIDAS) para CPCV/contratos privados; assinatura brasileira (ICP-Brasil) aceita apenas nos termos da lei local ou mediante procuração pública apostilada (Haia). |

---

## 5. Conformidade com o EU AI Act (Regulamento de Inteligência Artificial da UE)

> **[Verificar classificação formal com advogado especialista em tecnologia na UE]**

1. **Classificação Alvo:** **Risco Limitado (Obrigações de Transparência)** — Art. 50 (a confirmar texto oficial consolidado).
2. **Como Evitamos Cair em "Alto Risco" (Anexo III):**
   - Os agentes **NÃO** realizam avaliação automatizada de solvência ou *credit scoring* vinculante de pessoas físicas para concessão de crédito (isso é feito exclusivamente pelos bancos parceiros).
   - Os agentes **NÃO** tomam decisões autônomas com efeitos jurídicos ou financeiros vinculantes; operam estritamente em modo **assistivo e informativo**, com revisão humana obrigatória (*Human-in-the-Loop*).
3. **Obrigações Implementadas no Produto:**
   - **Aviso explícito de IA:** Todo chat e documento gerado por IA exibe selo claro informando que o usuário interage com IA.
   - **Disclaimers padronizados:** Nunca substitui advogado, contador, notário ou consultor financeiro regulado.
   - **Supervisão humana e contestação:** Botão permanente "Falar com especialista humano" + registro de trilha de decisão e citações do RAG.

---

## 6. Proteção do Consumidor, Venda à Distância e Publicidade

- **Publicidade e Marketing Digital (BR/PT/ES):**
  - Proibido prometer "retorno garantido", "lucro certo com aluguel", "aprovação garantida de visto/nacionalidade" ou "isenção garantida de impostos" (risco CVM no Brasil e normas de defesa do consumidor na UE).
  - Simuladores devem exibir claramente **"Valores meramente estimativos para planejamento; confirme com advogado/contador antes de assinar"**.
  - Toda informação sobre **comissões e preços** em assinaturas deve incluir taxas totais (com ou sem IVA explicitado conforme público consumidor B2C — na UE preços B2C exibem IVA incluído ou regra explícita; **validar exibição fiscal por país**).
- **Direito de Arrependimento (Venda à Distância):** Contratos de assinatura digital B2C na UE e no Brasil (CDC) garantem direito de arrependimento (tipicamente 14 dias na UE e 7 dias no Brasil — confirmar exceções para serviços já integralmente executados com consentimento expresso prévio).
- **Documentação Legal Pública Obrigatória antes do Go-Live:**
  1. Termos e Condições de Uso (PT/EN/ES).
  2. Política de Privacidade Unificada (LGPD + GDPR).
  3. Política de Cookies com banner de consentimento *opt-in* real (sem *dark patterns*).
  4. Política de Transparência de Remuneração (*Statement of Compensation* modelo).
  5. Canal de Reclamações / Livro de Reclamações Eletrónico em Portugal (obrigatório para empresas em PT — **confirmar aplicabilidade**).

---

## 7. Programa de Compliance e Checklist de Lançamento (Pré-Go-Live)

### 7.1 Pilares de Governança Contínua
- **Código de Ética e Política Anticorrupção & Antissuborno** (zero tolerância a pagamentos de facilitação, "por fora" ou subfaturação de escritura).
- **Canal de Denúncias (*Whistleblowing*):** Anônimo, acessível a clientes, funcionários e parceiros (alinhado à Diretiva UE de Denunciantes quando aplicável).
- **Treinamento Obrigatório:** Anual/semestral para todo time interno e *onboarding* de parceiros sobre LGPD/GDPR, AML/Red Flags, segurança anti-BEC e limites da IA.
- **Auditoria Periódica:** Revisão trimestral de amostragem de processos, acessos ao cofre e pareceres de parceiros.

### 7.2 Checklist de Compliance para Lançamento (Fase 1)
- [ ] Validação jurídica do modelo de co-corretagem (PT e ES) e contrato sem *fee splitting* com advogados.
- [ ] Publicação dos Termos de Uso, Política de Privacidade (LGPD/GDPR) e Política de Cookies em PT/EN/ES.
- [ ] Nomeação de ponto focal de privacidade / DPO e criação do RoPA v1 + DPIA do Cofre Documental e IA.
- [ ] Contrato de processamento de dados (DPA) assinado com Google Cloud / Firebase, Stripe, provedor KYC e e-signature.
- [ ] Disclaimers legais e limites de atuação integrados nos prompts e interface de todos os 8 agentes de IA e simuladores.
- [ ] Apólice de Seguro de Responsabilidade Civil Profissional contratada.
- [ ] Fluxo AML/KYC ativo antes de qualquer etapa de reserva ou proposta de imóvel.

---

*Fim do documento.*
