import { Locale } from "@/types/domain";

export const DICTIONARIES: Record<
  Locale,
  {
    brand: {
      tagline: string;
      heroTitle: string;
      heroSubtitle: string;
      trustPill: string;
      ctaExplore: string;
      ctaSimulate: string;
      ctaConsult: string;
    };
    nav: {
      home: string;
      properties: string;
      simulators: string;
      portal: string;
      vault: string;
      assistants: string;
      crm: string;
      security: string;
      auth: string;
      account: string;
    };
    mode: {
      sandboxBanner: string;
      firebaseBanner: string;
      roleSwitcher: string;
    };
    phases: {
      title: string;
      subtitle: string;
      list: { code: string; label: string; desc: string }[];
    };
    home: {
      whyTitle: string;
      whyCards: { title: string; desc: string; badge: string }[];
      destinationsTitle: string;
      featuredTitle: string;
      plansTitle: string;
      plansSubtitle: string;
    };
    properties: {
      title: string;
      subtitle: string;
      countryAll: string;
      maxBudget: string;
      minDd: string;
      matchLabel: string;
      ddLabel: string;
      totalCostEst: string;
      scheduleVisit: string;
      simulateThis: string;
      askAi: string;
      transparencyTitle: string;
      ddBreakdownTitle: string;
    };
    simulators: {
      title: string;
      subtitle: string;
      disclaimer: string;
      countryLabel: string;
      regionLabel: string;
      priceLabel: string;
      conditionLabel: string;
      used: string;
      newBuild: string;
      primaryHome: string;
      secondaryHome: string;
      ltvLabel: string;
      yearsLabel: string;
      rateLabel: string;
      fxLabel: string;
      saveToCrm: string;
      savedSuccess: string;
      citiesTitle: string;
    };
    auth: {
      title: string;
      subtitle: string;
      emailLabel: string;
      passwordLabel: string;
      nameLabel: string;
      loginBtn: string;
      signupBtn: string;
      googleBtn: string;
      mfaTitle: string;
      mfaDesc: string;
      mfaCodeLabel: string;
      mfaVerifyBtn: string;
      consentTitle: string;
    };
    portal: {
      title: string;
      subtitle: string;
      profileTitle: string;
      saveProfileBtn: string;
      timelineTitle: string;
      conciergeTitle: string;
      privacyTitle: string;
      exportDataBtn: string;
      deleteRequestBtn: string;
    };
    vault: {
      title: string;
      subtitle: string;
      antiBecBanner: string;
      uploadTitle: string;
      categoryLabel: string;
      countryLabel: string;
      uploadBtn: string;
      docsTableTitle: string;
      shareBtn: string;
      revokeBtn: string;
      historyTitle: string;
      verifiedPayTitle: string;
    };
    ai: {
      title: string;
      subtitle: string;
      disclaimerBanner: string;
      escalateBtn: string;
      escalatedToast: string;
      placeholder: string;
      sendBtn: string;
      sourcesLabel: string;
    };
    crm: {
      title: string;
      subtitle: string;
      kanbanTab: string;
      hitlTab: string;
      addLeadBtn: string;
      resolveHitlBtn: string;
    };
    security: {
      title: string;
      subtitle: string;
      verifyBtn: string;
      chainValid: string;
      chainInvalid: string;
      auditTableTitle: string;
    };
  }
> = {
  pt: {
    brand: {
      tagline: "Lisboa · Cascais · Madrid · Barcelona · Patrimônio em Euro",
      heroTitle: "Seu patrimônio em Euro, com a tranquilidade jurídica e cambial que você exige.",
      heroSubtitle:
        "Imóveis selecionados em Portugal e Espanha com auditoria jurídica independente antes de qualquer sinal, remessa legalizada Brasil → Europa e acompanhamento exclusivo até a entrega das chaves.",
      trustPill: "Auditoria jurídica prévia · Remessa regulada · Compra remota ou presencial",
      ctaExplore: "Explorar Residências",
      ctaSimulate: "Simular em Euro e Real",
      ctaConsult: "Falar com Especialista",
    },
    nav: {
      home: "Início",
      properties: "Imóveis",
      simulators: "Simuladores",
      portal: "Meu Painel",
      vault: "Cofre",
      assistants: "Agentes IA",
      crm: "CRM & HITL",
      security: "Auditoria",
      auth: "Entrar (MFA)",
      account: "Conta Ativa",
    },
    mode: {
      sandboxBanner:
        "Modo Sandbox Local ativo (sem projeto Firebase configurado ainda) — todos os dados persistem no navegador para demonstração completa. Veja DEPLOY.md para publicar online.",
      firebaseBanner: "Conectado ao Firebase (Auth MFA + Cloud Firestore + Storage).",
      roleSwitcher: "Simular Papel RBAC:",
    },
    phases: {
      title: "Jornada Completa nas 7 Fases",
      subtitle: "Da primeira simulação à escritura e gestão patrimonial com cada etapa rastreada.",
      list: [
        { code: "discovery", label: "1. Descoberta", desc: "Comparador de cidades e simuladores de impostos PT/ES" },
        { code: "planning", label: "2. Planejamento", desc: "Perfil, orçamento, objetivos e estratégia financeira" },
        { code: "documentation", label: "3. Documentação", desc: "NIF/NIE, conta bancária, procuração e Apostila no Cofre" },
        { code: "search_selection", label: "4. Busca & Match", desc: "Imóveis curados sem duplicidade com Score de aderência" },
        { code: "due_diligence", label: "5. Due Diligence", desc: "Certidões, Nota Simple e parecer de advogado antes do sinal" },
        { code: "purchase", label: "6. Compra & Escritura", desc: "CPCV/Arras, câmbio regulado, IBAN verificado e escritura" },
        { code: "post_sale", label: "7. Pós-Venda", desc: "Reforma, gestão patrimonial, aluguel e dossiê fiscal" },
      ],
    },
    home: {
      whyTitle: "Por que o produto é Confiança, não só Anúncios",
      whyCards: [
        {
          title: "Due Diligence antes do Sinal",
          desc: "Nenhum processo avança para CPCV ou Arras sem conferência registral, urbanística e fiscal revisada por advogado parceiro independente.",
          badge: "Segurança Jurídica",
        },
        {
          title: "Proteção Anti-BEC (IBAN)",
          desc: "Golpes de alteração de IBAN por e-mail destroem sonhos. Dados bancários só existem no Cofre Verificado com dupla assinatura.",
          badge: "Segurança Financeira",
        },
        {
          title: "Transparência de Comissão",
          desc: "Você assina o Statement of Compensation antes da proposta. Valores pagos em planos/assessoria podem ser abatidos (Fee Offset).",
          badge: "Zero Surpresas",
        },
      ],
      destinationsTitle: "Destinos Iniciais Curados (Ano 1)",
      featuredTitle: "Imóveis com Pré-Auditoria Documental",
      plansTitle: "Planos Transparentes com Fee Offset",
      plansSubtitle: "No plano Plus, 100% de até 6 mensalidades vira crédito na Due Diligence ou na compra.",
    },
    properties: {
      title: "Portal de Imóveis Curados (PT & ES)",
      subtitle: "Ativos verificados por código predial/catastral, sem anúncios duplicados e com Score prévio de Due Diligence.",
      countryAll: "Todos os países",
      maxBudget: "Orçamento máximo (EUR)",
      minDd: "Score DD mínimo",
      matchLabel: "Match com Perfil",
      ddLabel: "Score DD",
      totalCostEst: "Custo total est. c/ impostos",
      scheduleVisit: "Solicitar Visita / Vídeo-Tour (CRM)",
      simulateThis: "Simular Compra & Crédito",
      askAi: "Consultar Agentes IA",
      transparencyTitle: "Transparência de Remuneração (Statement Prévia)",
      ddBreakdownTitle: "Conferência Documental Prévia",
    },
    simulators: {
      title: "Simuladores Financeiros & Comparador de Cidades",
      subtitle: "Calcule impostos reais de aquisição em Portugal e Espanha, simule crédito para não-residentes e converta para BRL.",
      disclaimer:
        "Valores estimativos baseados em regras públicas gerais (a confirmar). Não constitui aconselhamento financeiro ou tributário definitivo — valide com advogado/contador local.",
      countryLabel: "País de Destino",
      regionLabel: "Região / Regime",
      priceLabel: "Valor do Imóvel (EUR)",
      conditionLabel: "Condição / Finalidade",
      used: "Imóvel Usado (Segunda Mão)",
      newBuild: "Obra Nova (1ª Transmissão)",
      primaryHome: "Habitação Própria Permanente (PT)",
      secondaryHome: "Habitação Secundária / Investimento (PT)",
      ltvLabel: "Financiamento (% LTV)",
      yearsLabel: "Prazo (Anos)",
      rateLabel: "Taxa Juros Est. (% a.a.)",
      fxLabel: "Taxa Câmbio (BRL por € 1)",
      saveToCrm: "Salvar Simulação e Enviar para Consultor",
      savedSuccess: "Simulação salva no seu histórico e registrada como oportunidade no CRM!",
      citiesTitle: "Comparador Estratégico de Cidades (PT vs. ES)",
    },
    auth: {
      title: "Acesso Seguro Zero Trust",
      subtitle: "Autenticação protegida com MFA obrigatório e registro de consentimento LGPD/GDPR.",
      emailLabel: "E-mail",
      passwordLabel: "Senha",
      nameLabel: "Nome completo",
      loginBtn: "Entrar com E-mail",
      signupBtn: "Criar Conta Segura",
      googleBtn: "Continuar com Google",
      mfaTitle: "Segundo Fator Obrigatório (MFA TOTP)",
      mfaDesc: "Para proteger passaportes, comprovantes e dados bancários, confirme o código TOTP de 6 dígitos.",
      mfaCodeLabel: "Código de 6 dígitos (Autenticador)",
      mfaVerifyBtn: "Validar MFA e Liberar Acesso",
      consentTitle: "Consentimento Granular (Privacy by Design — LGPD & GDPR)",
    },
    portal: {
      title: "Painel do Comprador — Jornada 7 Fases",
      subtitle: "Acompanhe marcos, prazos, notificações do Concierge e calibre seu Perfil para Match automático.",
      profileTitle: "Perfil do Comprador (Calibragem de Match)",
      saveProfileBtn: "Atualizar Perfil & Recalcular Match",
      timelineTitle: "Checklist & Timeline Auditável da Compra",
      conciergeTitle: "Notificações Proativas do Concierge",
      privacyTitle: "Seus Direitos LGPD / GDPR",
      exportDataBtn: "Exportar Todos Meus Dados (JSON)",
      deleteRequestBtn: "Solicitar Exclusão / Anonimização",
    },
    vault: {
      title: "Cofre Documental Auditável",
      subtitle: "Upload versionado, hash SHA-256, compartilhamento com expiração e log imutável de acessos.",
      antiBecBanner:
        "ALERTA ANTI-BEC: A Casa na Gringa JAMAIS envia ou altera dados bancários (IBAN) por e-mail ou WhatsApp. Pague apenas contas exibidas no quadro verificado abaixo.",
      uploadTitle: "Enviar Novo Documento ou Nova Versão",
      categoryLabel: "Categoria do Documento",
      countryLabel: "País Aplicável",
      uploadBtn: "Enviar para o Cofre Criptografado",
      docsTableTitle: "Documentos do Dossiê",
      shareBtn: "Compartilhar c/ Advogado (7 dias)",
      revokeBtn: "Revogar Acesso",
      historyTitle: "Histórico Completo por Documento (Acesso, Edição, Download, Compartilhamento)",
      verifiedPayTitle: "Instruções Bancárias Verificadas (Dupla Assinatura Anti-BEC)",
    },
    ai: {
      title: "Central Multiagente Gemini + RAG Legal",
      subtitle: "Orquestrador inteligente roteando para 8 especialistas com fontes oficiais PT/ES e escalonamento humano.",
      disclaimerBanner:
        "LIMITES DA IA: Respostas baseadas em corpus documental curado com caráter estritamente informativo. Nenhum agente fornece parecer jurídico, financeiro ou tributário definitivo, nem informa/altera IBAN. Decisões críticas exigem revisão humana.",
      escalateBtn: "Escalonar para Especialista Humano (CRM)",
      escalatedToast: "Ticket Human-in-the-Loop criado no CRM para nosso time jurídico/consultivo!",
      placeholder: "Ex.: Quanto pago de ITP em Madrid ou IMT em Lisboa? Posso usar procuração? Como funciona o NIE?",
      sendBtn: "Enviar Pergunta",
      sourcesLabel: "Fontes consultadas no Country Pack:",
    },
    crm: {
      title: "CRM Interno & Mesa Human-in-the-Loop",
      subtitle: "Gestão de pipeline comercial, lead scoring, tarefas e aprovações críticas da IA e Cofre.",
      kanbanTab: "Pipeline Kanban",
      hitlTab: "Fila HITL & Revisão Documental",
      addLeadBtn: "+ Novo Lead Manual",
      resolveHitlBtn: "Aprovar / Resolver",
    },
    security: {
      title: "Auditoria Imutável (Hash-Chain) & Zero Trust",
      subtitle: "Verificação matemática de integridade dos registros de acesso, compartilhamento e transações.",
      verifyBtn: "Verificar Integridade SHA-256 Agora",
      chainValid: "CADEIA ÍNTEGRA: Todos os hashes encadeados conferem 100%.",
      chainInvalid: "ALERTA DE ADULTERAÇÃO DETECTADO NA CADEIA!",
      auditTableTitle: "Registro Cronológico Encadeado (Append-Only)",
    },
  },
  en: {
    brand: {
      tagline: "Lisbon · Cascais · Madrid · Barcelona · Euro Wealth",
      heroTitle: "Your European real estate legacy, with complete legal and FX peace of mind.",
      heroSubtitle:
        "Handpicked luxury residences in Portugal and Spain with independent legal due diligence before any deposit, compliant currency transfers, and private concierge guidance through closing.",
      trustPill: "Pre-deposit legal audit · Compliant FX · Remote or private visits",
      ctaExplore: "Explore Residences",
      ctaSimulate: "Simulate Total Costs",
      ctaConsult: "Speak with Concierge",
    },
    nav: {
      home: "Home",
      properties: "Properties",
      simulators: "Simulators",
      portal: "Client Portal",
      vault: "Vault",
      assistants: "AI Agents",
      crm: "CRM & HITL",
      security: "Audit",
      auth: "Sign In (MFA)",
      account: "Account",
    },
    mode: {
      sandboxBanner:
        "Local Sandbox Mode active (Firebase project not configured yet) — all state persists in your browser for full testing. See DEPLOY.md to go live.",
      firebaseBanner: "Connected to Firebase (MFA Auth + Cloud Firestore + Storage).",
      roleSwitcher: "Simulate RBAC Role:",
    },
    phases: {
      title: "7-Phase Guided Acquisition Journey",
      subtitle: "From initial cost simulation to deed and post-purchase asset management.",
      list: [
        { code: "discovery", label: "1. Discovery", desc: "City benchmarking and PT/ES tax calculators" },
        { code: "planning", label: "2. Planning", desc: "Buyer profile, budget, financing & residency goals" },
        { code: "documentation", label: "3. Documentation", desc: "NIF/NIE, bank account, PoA & Apostille in Vault" },
        { code: "search_selection", label: "4. Search & Match", desc: "Deduplicated curated listings with match scoring" },
        { code: "due_diligence", label: "5. Due Diligence", desc: "Land registry, Nota Simple & lawyer review pre-deposit" },
        { code: "purchase", label: "6. Closing & Deed", desc: "CPCV/Arras, regulated FX, verified IBAN & deed" },
        { code: "post_sale", label: "7. Post-Sale", desc: "Renovation, property admin, rentals & tax dossier" },
      ],
    },
    home: {
      whyTitle: "Why Our Core Product Is Trust, Not Listings",
      whyCards: [
        {
          title: "Mandatory Pre-Deposit Due Diligence",
          desc: "No process moves to binding contracts until an independent local lawyer clears registry, zoning, and tax records.",
          badge: "Legal Safety",
        },
        {
          title: "Anti-BEC IBAN Verification",
          desc: "Wire fraud via email compromises cross-border deals. Verified bank instructions live exclusively inside the dual-signed Vault.",
          badge: "Payment Safety",
        },
        {
          title: "Radical Fee Transparency",
          desc: "Review and sign our Statement of Compensation upfront. Eligible advisory/subscription fees offset closing charges.",
          badge: "Fee Offset",
        },
      ],
      destinationsTitle: "Initial Focus Markets (Year 1)",
      featuredTitle: "Pre-Audited Curated Properties",
      plansTitle: "Transparent Plans with Fee Offset",
      plansSubtitle: "On the Plus plan, 100% of up to 6 monthly fees credit directly toward Due Diligence or closing.",
    },
    properties: {
      title: "Curated Property Portal (Portugal & Spain)",
      subtitle: "Verified by cadastral/predial reference with zero duplicate listings and preliminary Due Diligence scores.",
      countryAll: "All countries",
      maxBudget: "Max budget (EUR)",
      minDd: "Min DD Score",
      matchLabel: "Profile Match",
      ddLabel: "DD Score",
      totalCostEst: "Est. total cost incl. taxes",
      scheduleVisit: "Request Visit / Live Video Tour",
      simulateThis: "Simulate Acquisition & Mortgage",
      askAi: "Ask Specialized AI Agents",
      transparencyTitle: "Compensation Transparency Statement",
      ddBreakdownTitle: "Preliminary Due Diligence Checks",
    },
    simulators: {
      title: "Cost & Mortgage Simulators + City Comparator",
      subtitle: "Estimate IMT/Stamp Duty in Portugal or regional ITP/VAT/AJD in Spain, model non-resident mortgages, and convert EUR to BRL.",
      disclaimer:
        "Illustrative estimates only (subject to verification). Not definitive financial or tax advice — confirm with a licensed local lawyer or tax advisor.",
      countryLabel: "Target Country",
      regionLabel: "Region / Tax Regime",
      priceLabel: "Property Price (EUR)",
      conditionLabel: "Condition / Usage",
      used: "Resale / Existing Property",
      newBuild: "New Build (First Sale)",
      primaryHome: "Primary Residence (PT)",
      secondaryHome: "Secondary Home / Investment (PT)",
      ltvLabel: "Mortgage LTV (%)",
      yearsLabel: "Term (Years)",
      rateLabel: "Est. Interest Rate (% p.a.)",
      fxLabel: "FX Rate (BRL per €1)",
      saveToCrm: "Save Simulation & Send to Advisor",
      savedSuccess: "Simulation saved and logged as a qualified lead in the CRM!",
      citiesTitle: "Strategic City Comparison (PT vs. ES)",
    },
    auth: {
      title: "Zero Trust Access",
      subtitle: "Protected by mandatory MFA and granular LGPD/GDPR privacy consent.",
      emailLabel: "Email address",
      passwordLabel: "Password",
      nameLabel: "Full name",
      loginBtn: "Sign In with Email",
      signupBtn: "Create Secure Account",
      googleBtn: "Continue with Google",
      mfaTitle: "Mandatory Multi-Factor Check (TOTP)",
      mfaDesc: "Verify your 6-digit authenticator code to access passports, tax files, and verified wire instructions.",
      mfaCodeLabel: "6-digit TOTP code",
      mfaVerifyBtn: "Verify MFA & Enter",
      consentTitle: "Granular Consent (Privacy by Design — LGPD & GDPR)",
    },
    portal: {
      title: "Buyer Dashboard — 7-Phase Timeline",
      subtitle: "Track milestones, legal deadlines, proactive Concierge alerts, and update your matching profile.",
      profileTitle: "Buyer Profile (AI Match Calibration)",
      saveProfileBtn: "Save Profile & Recalculate Match",
      timelineTitle: "Auditable Deal Checklist & Milestones",
      conciergeTitle: "Proactive Concierge Alerts",
      privacyTitle: "LGPD / GDPR Data Rights",
      exportDataBtn: "Export All My Data (JSON)",
      deleteRequestBtn: "Request Erasure / Anonymization",
    },
    vault: {
      title: "Auditable Document Vault",
      subtitle: "Versioned uploads, SHA-256 digests, expiring partner shares, and immutable access logs.",
      antiBecBanner:
        "ANTI-BEC WARNING: Casa na Gringa NEVER sends or changes bank/IBAN instructions via email or WhatsApp. Only trust the dual-signed panel below.",
      uploadTitle: "Upload Document or New Version",
      categoryLabel: "Document Category",
      countryLabel: "Country",
      uploadBtn: "Encrypt & Upload to Vault",
      docsTableTitle: "Stored Dossier Files",
      shareBtn: "Share w/ Lawyer (7 days)",
      revokeBtn: "Revoke Share",
      historyTitle: "Per-Document Audit History (Views, Edits, Downloads, Shares)",
      verifiedPayTitle: "Verified Payment Instructions (Dual-Signed Anti-BEC)",
    },
    ai: {
      title: "Gemini Multi-Agent Hub + Legal RAG",
      subtitle: "Smart orchestrator routing across 8 specialists backed by curated PT/ES sources and human escalation.",
      disclaimerBanner:
        "AI BOUNDARIES: Responses are informational only based on curated Country Packs. Agents never give definitive legal/tax/financial advice and never provide IBANs. Critical actions require human sign-off.",
      escalateBtn: "Escalate to Human Specialist (CRM)",
      escalatedToast: "Human-in-the-Loop ticket created in CRM for our legal/advisory team!",
      placeholder: "Ask about Madrid ITP vs Lisbon IMT, obtaining NIF/NIE remotely, mortgages, or anti-fraud checks...",
      sendBtn: "Send",
      sourcesLabel: "Cited Country Pack Sources:",
    },
    crm: {
      title: "Internal CRM & Human-in-the-Loop Desk",
      subtitle: "Manage buyer pipeline, lead scores, visits, and critical AI/Document approvals.",
      kanbanTab: "Pipeline Kanban",
      hitlTab: "HITL & Document Review Queue",
      addLeadBtn: "+ Add Manual Lead",
      resolveHitlBtn: "Approve / Resolve",
    },
    security: {
      title: "Immutable Audit Trail (Hash-Chain) & Zero Trust",
      subtitle: "Cryptographic verification proving zero tampering across vault access and deal events.",
      verifyBtn: "Verify SHA-256 Chain Integrity",
      chainValid: "CHAIN VERIFIED: 100% of linked event hashes match cleanly.",
      chainInvalid: "TAMPERING ALERT: Hash chain mismatch detected!",
      auditTableTitle: "Append-Only Chained Audit Ledger",
    },
  },
  es: {
    brand: {
      tagline: "Lisboa · Cascais · Madrid · Barcelona · Patrimonio en Euro",
      heroTitle: "Tu patrimonio en Euro, con la seguridad jurídica y fiscal que exiges.",
      heroSubtitle:
        "Propiedades exclusivas en Portugal y España con auditoría legal independiente antes de entregar arras, transferencia de divisas regulada y acompañamiento privado hasta recibir las llaves.",
      trustPill: "Auditoría registral previa · Divisa regulada · Compra remota o presencial",
      ctaExplore: "Explorar Residencias",
      ctaSimulate: "Simular Costes",
      ctaConsult: "Hablar con Concierge",
    },
    nav: {
      home: "Inicio",
      properties: "Inmuebles",
      simulators: "Simuladores",
      portal: "Mi Panel",
      vault: "Bóveda",
      assistants: "Agentes IA",
      crm: "CRM & HITL",
      security: "Auditoría",
      auth: "Acceder (MFA)",
      account: "Cuenta",
    },
    mode: {
      sandboxBanner:
        "Modo Sandbox Local activo (sin proyecto Firebase configurado aún) — los datos se guardan en el navegador para pruebas completas. Consulta DEPLOY.md para publicar.",
      firebaseBanner: "Conectado a Firebase (Auth MFA + Cloud Firestore + Storage).",
      roleSwitcher: "Simular Rol RBAC:",
    },
    phases: {
      title: "Viaje Guiado en 7 Fases",
      subtitle: "Desde la simulación de impuestos hasta la escritura y gestión posterior.",
      list: [
        { code: "discovery", label: "1. Descubrimiento", desc: "Comparador de ciudades y calculadoras PT/ES" },
        { code: "planning", label: "2. Planificación", desc: "Perfil, presupuesto, hipoteca y objetivos" },
        { code: "documentation", label: "3. Documentación", desc: "NIE/NIF, cuenta bancaria, poderes y Apostilla" },
        { code: "search_selection", label: "4. Búsqueda y Match", desc: "Inmuebles verificados sin duplicados" },
        { code: "due_diligence", label: "5. Due Diligence", desc: "Nota Simple, cargas y revisión legal antes de arras" },
        { code: "purchase", label: "6. Compra y Escritura", desc: "Arras/CPCV, divisa regulada, IBAN verificado" },
        { code: "post_sale", label: "7. Posventa", desc: "Reforma, administración, alquiler y dossier fiscal" },
      ],
    },
    home: {
      whyTitle: "Por qué el Producto es Confianza y no solo Anuncios",
      whyCards: [
        {
          title: "Due Diligence antes de Arras",
          desc: "Ninguna operación avanza a contrato vinculante sin verificación registral, catastral y urbanística firmada por abogado.",
          badge: "Seguridad Jurídica",
        },
        {
          title: "Protección Anti-BEC (IBAN)",
          desc: "Evitamos estafas de cambio de IBAN por correo. Los datos de pago viven únicamente en la Bóveda Verificada con doble firma.",
          badge: "Seguridad Financiera",
        },
        {
          title: "Transparencia de Honorarios",
          desc: "Declaración previa de honorarios antes de ofertar y compensación transparente (Fee Offset) en planes elegibles.",
          badge: "Cero Sorpresas",
        },
      ],
      destinationsTitle: "Mercados Iniciales (Año 1)",
      featuredTitle: "Inmuebles con Pre-Auditoría Documental",
      plansTitle: "Planes Transparentes con Fee Offset",
      plansSubtitle: "En el plan Plus, el 100% de hasta 6 cuotas se abona como crédito en la Due Diligence o cierre.",
    },
    properties: {
      title: "Portal de Inmuebles Curados (Portugal y España)",
      subtitle: "Verificados por referencia catastral/predial sin duplicidades y con puntuación previa de Due Diligence.",
      countryAll: "Todos los países",
      maxBudget: "Presupuesto máximo (EUR)",
      minDd: "Score DD mínimo",
      matchLabel: "Match con Perfil",
      ddLabel: "Score DD",
      totalCostEst: "Coste total est. c/ impuestos",
      scheduleVisit: "Solicitar Visita / Videotour",
      simulateThis: "Simular Compra e Hipoteca",
      askAi: "Consultar Agentes IA",
      transparencyTitle: "Declaración de Transparencia de Comisión",
      ddBreakdownTitle: "Comprobaciones Previas de Due Diligence",
    },
    simulators: {
      title: "Simuladores Financieros y Comparador de Ciudades",
      subtitle: "Calcula ITP autonómico / IVA+AJD en España o IMT en Portugal, simula hipotecas de no residentes y convierte EUR a BRL.",
      disclaimer:
        "Cálculo meramente orientativo (a confirmar). No constituye asesoramiento fiscal o legal definitivo — valida con abogado o asesor local.",
      countryLabel: "País de Destino",
      regionLabel: "Comunidad / Régimen",
      priceLabel: "Precio del Inmueble (EUR)",
      conditionLabel: "Estado / Uso",
      used: "Segunda Mano",
      newBuild: "Obra Nueva",
      primaryHome: "Vivienda Habitual (PT)",
      secondaryHome: "Segunda Residencia / Inversión (PT)",
      ltvLabel: "Hipoteca (% LTV)",
      yearsLabel: "Plazo (Años)",
      rateLabel: "Interés Est. (% anual)",
      fxLabel: "Tipo de Cambio (BRL por € 1)",
      saveToCrm: "Guardar Simulación y Enviar a Asesor",
      savedSuccess: "Simulación guardada y registrada en el CRM.",
      citiesTitle: "Comparador Estratégico de Ciudades (PT vs. ES)",
    },
    auth: {
      title: "Acceso Seguro Zero Trust",
      subtitle: "Protegido con MFA obligatorio y consentimiento granular RGPD / LGPD.",
      emailLabel: "Correo electrónico",
      passwordLabel: "Contraseña",
      nameLabel: "Nombre completo",
      loginBtn: "Entrar con Correo",
      signupBtn: "Crear Cuenta Segura",
      googleBtn: "Continuar con Google",
      mfaTitle: "Segundo Factor Obligatorio (MFA TOTP)",
      mfaDesc: "Confirma el código TOTP de 6 dígitos para acceder a documentos sensibles e instrucciones bancarias.",
      mfaCodeLabel: "Código de 6 dígitos",
      mfaVerifyBtn: "Validar MFA y Entrar",
      consentTitle: "Consentimiento Granular (Privacy by Design — RGPD & LGPD)",
    },
    portal: {
      title: "Panel del Comprador — 7 Fases",
      subtitle: "Sigue hitos, plazos, avisos del Concierge y calibra tu perfil para el Match IA.",
      profileTitle: "Perfil del Comprador",
      saveProfileBtn: "Guardar Perfil y Recalcular Match",
      timelineTitle: "Checklist e Hitos Auditables",
      conciergeTitle: "Notificaciones del Concierge",
      privacyTitle: "Derechos RGPD / LGPD",
      exportDataBtn: "Exportar Mis Datos (JSON)",
      deleteRequestBtn: "Solicitar Supresión",
    },
    vault: {
      title: "Bóveda Documental Auditable",
      subtitle: "Control de versiones, huella SHA-256, compartición con caducidad y registro inmutable.",
      antiBecBanner:
        "ALERTA ANTI-BEC: Casa na Gringa NUNCA envía ni modifica datos bancarios (IBAN) por correo o WhatsApp. Confía solo en el panel verificado.",
      uploadTitle: "Subir Documento o Nueva Versión",
      categoryLabel: "Categoría",
      countryLabel: "País",
      uploadBtn: "Cifrar y Subir a la Bóveda",
      docsTableTitle: "Documentos del Expediente",
      shareBtn: "Compartir c/ Abogado (7 días)",
      revokeBtn: "Revocar Acceso",
      historyTitle: "Historial Completo por Documento",
      verifiedPayTitle: "Instrucciones Bancarias Verificadas (Doble Firma)",
    },
    ai: {
      title: "Central Multiagente Gemini + RAG Legal",
      subtitle: "Orquestador entre 8 especialistas con fuentes oficiales PT/ES y escalado humano.",
      disclaimerBanner:
        "LÍMITES DE LA IA: Respuestas informativas basadas en corpus jurídico curado. No sustituyen asesoría legal/fiscal definitiva ni confirman IBAN.",
      escalateBtn: "Escalar a Especialista Humano (CRM)",
      escalatedToast: "Ticket Human-in-the-Loop registrado en el CRM.",
      placeholder: "Pregunta sobre ITP en Madrid, IMT en Lisboa, NIE, hipoteca o revisión de arras...",
      sendBtn: "Enviar",
      sourcesLabel: "Fuentes consultadas en el Country Pack:",
    },
    crm: {
      title: "CRM Interno y Mesa Human-in-the-Loop",
      subtitle: "Gestión de pipeline, lead scoring, visitas y aprobaciones de documentos/IA.",
      kanbanTab: "Pipeline Kanban",
      hitlTab: "Cola HITL y Revisión Documental",
      addLeadBtn: "+ Nuevo Lead",
      resolveHitlBtn: "Aprobar / Resolver",
    },
    security: {
      title: "Auditoría Inmutable (Hash-Chain) & Zero Trust",
      subtitle: "Comprobación matemática de integridad en accesos documentales y eventos.",
      verifyBtn: "Verificar Integridad SHA-256",
      chainValid: "CADENA ÍNTEGRA: Todos los hashes encadenados coinciden al 100%.",
      chainInvalid: "ALERTA: Discrepancia detectada en la cadena de auditoría.",
      auditTableTitle: "Registro Inmutable Encadenado",
    },
  },
};
