import { AiCitation, Locale } from "@/types/domain";

export interface LegalSourceChunk {
  sourceId: string;
  jurisdiction: "PT" | "ES" | "GLOBAL";
  topics: string[];
  title: string;
  effectiveDate: string;
  url: string;
  summary: Record<Locale, string>;
}

export const LEGAL_CORPUS: LegalSourceChunk[] = [
  {
    sourceId: "PT-AT-IMT-2026",
    jurisdiction: "PT",
    topics: ["imt", "imposto", "selo", "lisboa", "porto", "portugal", "taxa", "compra", "custo"],
    title: "Código do IMT e Imposto do Selo (Portugal Continente — Habitação Secundária/Investimento)",
    effectiveDate: "2026-01-01",
    url: "https://info.portaldasfinancas.gov.pt/",
    summary: {
      pt: "Em Portugal Continental, a aquisição de imóvel secundário ou para arrendamento paga IMT progressivo por escalões (1% a 8% marginal com parcela a abater até € 633.931, ou taxa única de 6%/7,5% acima, calculado sobre o maior valor entre escritura e VPT — confirmar tabela anual do Orçamento do Estado), acrescido de Imposto do Selo fixo de 0,8%.",
      en: "In mainland Portugal, secondary or investment properties pay progressive IMT brackets (1%–8% marginal with deduction, or flat 6%/7.5% at high tiers on the greater of deed price or VPT — confirm annual budget tables) plus 0.8% flat Stamp Duty (Imposto do Selo).",
      es: "En Portugal continental, la segunda vivienda o inversión paga IMT progresivo (1%–8% marginal o tipo único 6%/7,5% en tramos altos sobre el mayor entre escritura y VPT) más Impuesto de Timbre fijo del 0,8%.",
    },
  },
  {
    sourceId: "PT-AT-NIF-2026",
    jurisdiction: "PT",
    topics: ["nif", "fiscal", "representante", "procuracao", "conta", "banco", "portugal"],
    title: "Obtenção de NIF e Representação Fiscal para Não Residentes (Autoridade Tributária PT)",
    effectiveDate: "2026-01-01",
    url: "https://www.portaldasfinancas.gov.pt/",
    summary: {
      pt: "Qualquer comprador de imóvel em Portugal precisa de NIF (Número de Identificação Fiscal) antes do CPCV/escritura e abertura de conta. Residentes fora da UE/EEE normalmente necessitam nomear representante fiscal ou aderir às notificações eletrónicas conforme regras vigentes da AT (confirmar com advogado/solicitador local).",
      en: "Every property buyer in Portugal requires a NIF tax number prior to CPCV/deed and banking. Non-EU residents generally require a fiscal representative or electronic notification enrollment under current AT rules (confirm with local lawyer).",
      es: "Todo comprador en Portugal necesita NIF antes del contrato CPCV y la cuenta bancaria. Residentes extracomunitarios suelen requerir representante fiscal o notificaciones electrónicas según la AT.",
    },
  },
  {
    sourceId: "PT-IRN-CPCV-DD",
    jurisdiction: "PT",
    topics: ["cpcv", "contrato", "sinal", "certidao", "caderneta", "licenca", "due diligence", "escritura", "portugal"],
    title: "Registo Predial, CPCV e Due Diligence Imobiliária em Portugal (IRN / Código Civil)",
    effectiveDate: "2026-01-01",
    url: "https://justica.gov.pt/",
    summary: {
      pt: "Antes de assinar o CPCV (Contrato-Promessa de Compra e Venda) e pagar sinal (tipicamente 10%–20%), é essencial conferir Certidão Permanente do Registo Predial (hipotecas, penhoras), Caderneta Predial Urbana, Licença de Utilização/enquadramento urbanístico vigente, Certificado Energético e situação de condomínio.",
      en: "Before signing a Portuguese CPCV promissory contract and paying a deposit (typically 10%–20%), lawyers must verify the Land Registry Certificate (liens/mortgages), Tax Card (Caderneta), occupancy status, Energy Certificate, and HOA clearance.",
      es: "Antes de firmar un CPCV en Portugal y entregar señal (10%–20%), un abogado debe verificar la Certidão Permanente registral, Caderneta Predial, licencia de uso, certificado energético y deudas de comunidad.",
    },
  },
  {
    sourceId: "ES-AEAT-ITP-IVA",
    jurisdiction: "ES",
    topics: ["itp", "iva", "ajd", "imposto", "impuesto", "madrid", "catalunha", "barcelona", "valencia", "andaluzia", "malaga", "espanha", "espana"],
    title: "Tributação Autonómica na Compra de Imóvel em Espanha (ITP, IVA, AJD e Valor de Referencia Catastral)",
    effectiveDate: "2026-01-01",
    url: "https://sede.agenciatributaria.gob.es/",
    summary: {
      pt: "Na Espanha, imóveis usados pagam ITP autonómico sobre o maior valor entre o preço de escritura e o Valor de Referencia del Catastro: Madrid ~6%, Andaluzia ~7%, Comunidade Valenciana ~9% (11% acima de € 1M) e Catalunha ~10% a 13% progressivo (confirmar reduções locais). Imóvel novo (1ª transmissão) paga 10% de IVA nacional + AJD autonómico (0,5%–1,5%). Prazo geral: 30 dias úteis após escritura.",
      en: "In Spain, resale homes pay regional ITP on the higher of deed price or Cadastral Reference Value: Madrid ~6%, Andalusia ~7%, Valencia ~9% (11% >€1M), Catalonia ~10%–13% progressive. New builds pay 10% national VAT + regional AJD (0.5%–1.5%). Filing deadline is generally 30 business days post-deed.",
      es: "En España, la segunda mano tributa por ITP autonómico sobre el mayor valor entre escritura y Valor de Referencia Catastral: Madrid 6%, Andalucía 7%, Valencia 9% (11% >1M €), Cataluña 10%–13%. Obra nueva tributa 10% IVA + AJD autonómico (0,5%–1,5%). Plazo habitual: 30 días hábiles tras escritura.",
    },
  },
  {
    sourceId: "ES-NIE-REG-ARRAS",
    jurisdiction: "ES",
    topics: ["nie", "nota simple", "arras", "notaria", "registro", "procuracao", "poder", "espanha", "espana"],
    title: "NIE, Nota Simple e Contrato de Arras Penitenciales (Espanha)",
    effectiveDate: "2026-01-01",
    url: "https://www.registradores.org/",
    summary: {
      pt: "Estrangeiros precisam de NIE antes da escritura na Espanha (obtido em consulado ou na Espanha por procuração apostilada). Antes de assinar Contrato de Arras Penitenciales (sinal típico 10%, com perda do sinal em caso de desistência injustificada), deve-se emitir Nota Simple recente no Registro de la Propiedad, recibos de IBI e certificado de comunidade sem dívidas.",
      en: "Foreign buyers need a Spanish NIE prior to deed completion (via consulate or Spain via apostilled PoA). Before signing Arras Penitenciales (typically 10% earnest money), request a fresh Nota Simple from Registradores, IBI tax receipts, and HOA clearance.",
      es: "Los compradores extranjeros necesitan NIE antes de escriturar (consulado o España con poder apostillado). Antes de firmar Arras Penitenciales (habitualmente 10%), es imprescindible solicitar Nota Simple actualizada, últimos recibos de IBI y certificado de estar al corriente con la comunidad.",
    },
  },
  {
    sourceId: "CNG-AML-KYC-ORIGIN",
    jurisdiction: "GLOBAL",
    topics: ["aml", "kyc", "origem", "fundos", "dinheiro", "cambio", "transferencia", "bcb", "iof", "irpf", "cbe", "banco"],
    title: "Compliance AML/CFT (Lei 83/2017 PT · Ley 10/2010 ES) e Remessa Internacional BR→UE",
    effectiveDate: "2026-01-01",
    url: "https://www.bcb.gov.br/",
    summary: {
      pt: "Bancos e notários em Portugal e Espanha exigem comprovação documental rigorosa da origem lícita dos fundos (IRPF, balanços, extratos, contratos de venda) com antecedência mínima recomendada de 5–10 dias antes da escritura. Remessas do Brasil devem ocorrer por instituição autorizada pelo BCB com IOF/contrato de câmbio corretos e posterior declaração em IRPF e CBE (se aplicável).",
      en: "Portuguese and Spanish banks and notaries enforce strict AML source-of-funds verification (tax returns, bank statements, asset sale deeds). International wires should pass through regulated FX providers well ahead of closing and comply with origin-country tax reporting.",
      es: "Bancos y notarios en España y Portugal exigen acreditación estricta del origen lícito de fondos (Ley 10/2010 / Lei 83/2017). Las transferencias internacionales deben realizarse mediante entidades reguladas con antelación suficiente a la firma.",
    },
  },
  {
    sourceId: "CNG-SECURITY-ANTIBEC",
    jurisdiction: "GLOBAL",
    topics: ["iban", "pagar", "pagamento", "sinal", "deposito", "transferir", "pix", "wire", "golpe", "fraude", "email", "whatsapp"],
    title: "Política Obrigatória Anti-BEC e Verificação de IBAN (Casa na Gringa)",
    effectiveDate: "2026-01-01",
    url: "https://casanagringa.com/seguranca",
    summary: {
      pt: "REGRA DE SEGURANÇA CRÍTICA: A Casa na Gringa nunca fornece, confirma nem altera instruções bancárias (IBAN/SWIFT) por chat de IA, e-mail ou WhatsApp. Somente utilize dados exibidos no módulo 'Instruções Bancárias Verificadas' dentro do Cofre após confirmação dupla e verificação por vídeo.",
      en: "CRITICAL SECURITY RULE: Casa na Gringa NEVER provides, confirms, or changes wire/IBAN instructions via AI chat, email, or WhatsApp. Only transfer to accounts displayed inside the dual-signed Verified Payment panel in your Vault.",
      es: "REGLA CRÍTICA ANTI-FRAUDE: Casa na Gringa NUNCA envía ni modifica datos bancarios (IBAN) por chat IA, correo o WhatsApp. Utiliza únicamente el módulo de Instrucciones Verificadas dentro de tu Bóveda tras confirmación por vídeo.",
    },
  },
  {
    sourceId: "PT-ES-MORTGAGE-NONRES",
    jurisdiction: "GLOBAL",
    topics: ["financiamento", "credito", "hipoteca", "banco", "prestacao", "ltv", "juros", "euribor", "entrada"],
    title: "Crédito Habitação / Hipoteca para Não-Residentes (PT & ES)",
    effectiveDate: "2026-01-01",
    url: "https://clientebancario.bportugal.pt/",
    summary: {
      pt: "Em regra geral de mercado [a confirmar por perfil], bancos em Portugal e Espanha financiam tipicamente 60% a 75% do menor valor entre preço e avaliação bancária para não-residentes (taxa de esforço geralmente ≤ 30%–35% da renda líquida). Lembre-se de somar os impostos e custos (6%–13%) à entrada em capital próprio. A intermediação de crédito é feita exclusivamente via parceiros registados.",
      en: "As a general market benchmark [subject to underwriting], banks in Portugal and Spain typically lend 60%–75% LTV on the lower of price or appraisal to non-residents (debt-to-income generally ≤ 30%–35%). Taxes and closing fees (6%–13%) must also be funded in cash.",
      es: "Como referencia general de mercado, los bancos en España y Portugal suelen financiar entre el 60% y el 75% del menor valor entre compra y tasación para no residentes (ratio de endeudamiento ≤ 30%–35%). Impuestos y gastos se aportan en fondos propios.",
    },
  },
];

export function retrieveLegalChunks(query: string, maxResults = 3): LegalSourceChunk[] {
  const normalized = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const scored = LEGAL_CORPUS.map((chunk) => {
    let score = 0;
    for (const topic of chunk.topics) {
      if (normalized.includes(topic)) score += 3;
    }
    if (normalized.includes("portugal") && chunk.jurisdiction === "PT") score += 2;
    if ((normalized.includes("espanha") || normalized.includes("espana") || normalized.includes("spain")) && chunk.jurisdiction === "ES") {
      score += 2;
    }
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter((item) => item.score > 0).slice(0, maxResults).map((s) => s.chunk);
  return top.length > 0 ? top : LEGAL_CORPUS.slice(0, 2);
}

export function toCitations(chunks: LegalSourceChunk[]): AiCitation[] {
  return chunks.map((c) => ({
    sourceId: c.sourceId,
    title: c.title,
    jurisdiction: c.jurisdiction,
    effectiveDate: c.effectiveDate,
    url: c.url,
  }));
}
