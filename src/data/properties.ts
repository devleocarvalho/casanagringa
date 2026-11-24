import { BuyerProfile, CuratedProperty, Locale } from "@/types/domain";

export const CURATED_PROPERTIES: CuratedProperty[] = [
  {
    id: "prop-pt-lis-0042",
    canonicalRef: "CNG-PT-LIS-0042",
    country: "PT",
    regionCode: "PT-CONT",
    city: "Lisboa",
    neighborhood: "Campo de Ourique",
    propertyType: "apartment",
    condition: "used",
    priceEur: 420000,
    areaSqm: 88,
    bedrooms: 2,
    bathrooms: 2,
    energyRating: "B",
    ddScore: 94,
    estYieldPct: 4.6,
    imageSrc: "/images/parallax-lisboa-terrace.jpg",
    mapPos: { x: 24, y: 52 },
    partnerBroker: "Atlântico Prime Mediação Imobiliária",
    partnerLicense: "AMI #18420 (IMPIC)",
    commissionDisclosure: {
      pt: "Co-corretagem 50/50 com parceiro AMI (comissão paga pelo vendedor, teto 5% + IVA). Fee Offset ativo para assinantes Plus.",
      en: "50/50 co-brokerage with licensed AMI partner (seller-paid, capped at 5% + VAT). Plus Fee Offset applies.",
      es: "Co-corretaje 50/50 con socio AMI (pagado por el vendedor, máx. 5% + IVA). Fee Offset activo.",
    },
    checks: [
      { label: { pt: "Certidão Permanente sem ônus", en: "Clean Land Registry", es: "Registro sin cargas" }, status: "pass" },
      { label: { pt: "Caderneta Predial confere com área", en: "Tax & area records match", es: "Catastro coincide" }, status: "pass" },
      { label: { pt: "Licença de Utilização validada", en: "Occupancy license verified", es: "Licencia de uso validada" }, status: "pass" },
      { label: { pt: "Ata condomínio 2026 em conferência", en: "2026 HOA minutes under review", es: "Acta comunidad en revisión" }, status: "warning" },
    ],
    translations: {
      pt: {
        title: "Apartamento T2 Luminoso em Campo de Ourique",
        subtitle: "Prédio reabilitado · Varanda sul · Financiável até 75%",
        description: "Imóvel pré-auditado no coração de Campo de Ourique, a 5 min do Jardim da Parada, com cozinha equipada, vidros duplos acústicos e histórico documental verificado.",
        ddSummary: "Documentação predial limpa; única pendência menor é confirmação da última ata de condomínio antes do CPCV.",
      },
      en: {
        title: "Bright 2-Bedroom Apartment in Campo de Ourique",
        subtitle: "Refurbished building · South balcony · Mortgage eligible",
        description: "Pre-audited apartment in walkable Campo de Ourique, featuring acoustic double glazing, full kitchen, and verified title records.",
        ddSummary: "Clean title registry; only minor item is verifying latest HOA minutes prior to CPCV.",
      },
      es: {
        title: "Piso T2 Luminoso en Campo de Ourique",
        subtitle: "Edificio rehabilitado · Balcón sur · Financiable",
        description: "Inmueble pre-auditado en Campo de Ourique con doble acristalamiento acústico e historial registral verificado.",
        ddSummary: "Registro limpio; solo resta confirmar la última acta de comunidad antes del contrato.",
      },
    },
  },
  {
    id: "prop-es-mad-0108",
    canonicalRef: "CNG-ES-MAD-0108",
    country: "ES",
    regionCode: "ES-MD",
    city: "Madrid",
    neighborhood: "Chamberí (Almagro)",
    propertyType: "apartment",
    condition: "used",
    priceEur: 485000,
    areaSqm: 96,
    bedrooms: 3,
    bathrooms: 2,
    energyRating: "C",
    ddScore: 91,
    estYieldPct: 4.8,
    imageSrc: "/images/prop-madrid-interior.jpg",
    mapPos: { x: 64, y: 40 },
    partnerBroker: "Castellana Partners API",
    partnerLicense: "API Madrid #2091 · RAIN",
    commissionDisclosure: {
      pt: "Co-corretagem com agência Madrid (vendedor cobre comissão padrão 4%). Economia de imposto com ITP Madrid 6%.",
      en: "Co-brokerage with Madrid agency (4% standard seller commission). Benefits from Madrid's 6% ITP tax.",
      es: "Co-corretaje con agencia de Madrid (vendedor asume 4%). Ventaja fiscal del ITP Madrid al 6%.",
    },
    checks: [
      { label: { pt: "Nota Simple atualizada sem cargas", en: "Clean Nota Simple", es: "Nota Simple libre de cargas" }, status: "pass" },
      { label: { pt: "IBI e comunidade em dia", en: "IBI & HOA paid", es: "IBI y comunidad al día" }, status: "pass" },
      { label: { pt: "ITE do edifício favorável", en: "Building inspection passed", es: "ITE favorable" }, status: "pass" },
    ],
    translations: {
      pt: {
        title: "Apartamento 3 Quartos Reformado em Chamberí",
        subtitle: "Bairro clássico · ITP Madrid 6% · Alta liquidez de aluguel",
        description: "Planta funcional com 3 dormitórios em rua tranquila de Chamberí, próximo ao metrô Alonso Martínez e escolas internacionais.",
        ddSummary: "Nota Simple obtida sem hipotecas nem embargos; Valor de Referência Catastral alinhado ao preço.",
      },
      en: {
        title: "Renovated 3-Bedroom Flat in Chamberí",
        subtitle: "Prime Madrid · 6% ITP regime · Strong long-term rental",
        description: "Functional 3-bedroom layout on a quiet Chamberí street near metro Alonso Martínez and top schools.",
        ddSummary: "Nota Simple free of liens; cadastral reference value aligned with asking price.",
      },
      es: {
        title: "Piso Reformado de 3 Dormitorios en Chamberí",
        subtitle: "Zona prime · ITP Madrid 6% · Alta demanda de alquiler",
        description: "Vivienda luminosa en calle tranquila de Chamberí junto a metro Alonso Martínez.",
        ddSummary: "Nota Simple sin cargas ni embargos; Valor de Referencia Catastral alineado.",
      },
    },
  },
  {
    id: "prop-pt-opo-0019",
    canonicalRef: "CNG-PT-OPO-0019",
    country: "PT",
    regionCode: "PT-CONT",
    city: "Porto",
    neighborhood: "Boavista / Foco",
    propertyType: "apartment",
    condition: "used",
    priceEur: 365000,
    areaSqm: 112,
    bedrooms: 3,
    bathrooms: 2,
    energyRating: "B-",
    ddScore: 96,
    estYieldPct: 5.1,
    imageSrc: "/images/parallax-lisboa-terrace.jpg",
    mapPos: { x: 26, y: 26 },
    partnerBroker: "Douro Confiança Imobiliária",
    partnerLicense: "AMI #14902 (IMPIC)",
    commissionDisclosure: {
      pt: "Co-corretagem AMI 50/50. Sem taxas extras para o comprador.",
      en: "50/50 AMI co-brokerage. Zero hidden buyer surcharge.",
      es: "Co-corretaje AMI 50/50 sin cargos ocultos.",
    },
    checks: [
      { label: { pt: "Certidão Permanente verificada", en: "Land Registry clear", es: "Registro verificado" }, status: "pass" },
      { label: { pt: "Garagem e arrecadação averbadas", en: "Garage & storage registered", es: "Garaje y trastero inscritos" }, status: "pass" },
      { label: { pt: "Condomínio sem dívidas", en: "Zero HOA debt", es: "Sin deudas de comunidad" }, status: "pass" },
    ],
    translations: {
      pt: {
        title: "T3 Amplo com Garagem na Boavista",
        subtitle: "112 m² · Ideal para família (S2) · Forte yield de locação",
        description: "Excelente custo por m² no Porto, próximo à Avenida da Boavista, escolas e metro Casa da Música.",
        ddSummary: "Score 96/100: toda a documentação técnica e predial conferida e aprovada.",
      },
      en: {
        title: "Spacious 3-Bedroom w/ Garage in Boavista",
        subtitle: "112 sqm · Family-ready · 5.1% est. gross yield",
        description: "Strong price-per-sqm value in Porto near Boavista Avenue and international schools.",
        ddSummary: "Score 96/100: complete legal and registry files verified clean.",
      },
      es: {
        title: "Amplio Piso T3 con Garaje en Boavista",
        subtitle: "112 m² · Ideal familias · Rentabilidad est. 5,1%",
        description: "Excelente relación superficie-precio en Oporto cerca de la Avenida da Boavista.",
        ddSummary: "Puntuación 96/100: documentación registral y catastral completa.",
      },
    },
  },
  {
    id: "prop-es-vlc-0054",
    canonicalRef: "CNG-ES-VLC-0054",
    country: "ES",
    regionCode: "ES-VC",
    city: "Valência",
    neighborhood: "Ruzafa",
    propertyType: "penthouse",
    condition: "used",
    priceEur: 315000,
    areaSqm: 84,
    bedrooms: 2,
    bathrooms: 1,
    energyRating: "D",
    ddScore: 81,
    estYieldPct: 5.6,
    imageSrc: "/images/parallax-lisboa-terrace.jpg",
    mapPos: { x: 75, y: 54 },
    partnerBroker: "Mediterráneo Seguro Inmuebles",
    partnerLicense: "RAICV #0842 (Com. Valenciana)",
    commissionDisclosure: {
      pt: "Co-corretagem com parceiro registado RAICV. ITP Valência 9%.",
      en: "Co-brokerage with RAICV-registered partner. Valencia ITP 9%.",
      es: "Co-corretaje con agencia RAICV. ITP Comunidad Valenciana 9%.",
    },
    checks: [
      { label: { pt: "Nota Simple sem embargos", en: "Clean Nota Simple", es: "Nota Simple sin cargas" }, status: "pass" },
      { label: { pt: "Cédula de habitabilidad vigente", en: "Habitability cert active", es: "Cédula de habitabilidad vigente" }, status: "pass" },
      { label: { pt: "Derrama de fachada em votação", en: "Facade repair assessment pending", es: "Derrama de fachada en curso" }, status: "warning" },
    ],
    translations: {
      pt: {
        title: "Ático com Terraço ensolarado em Ruzafa",
        subtitle: "Terraço 22 m² · Aluguel média duração · Alta procura",
        description: "Cobertura charmosa no bairro mais desejado de Valência por expatriados e nômades digitais de alta renda.",
        ddSummary: "Alerta transparente: condomínio avalia obra de fachada (~€ 2.400 por fração) — negociável no preço.",
      },
      en: {
        title: "Sunny Penthouse w/ Terrace in Ruzafa",
        subtitle: "22 sqm terrace · Strong mid-term rental yield",
        description: "Bright top-floor flat in Valencia's vibrant Ruzafa district.",
        ddSummary: "Transparent caveat: HOA is voting on a facade repair (~€2,400 share) — negotiable before Arras.",
      },
      es: {
        title: "Ático con Terraza Soleada en Ruzafa",
        subtitle: "Terraza de 22 m² · Alta rentabilidad media estancia",
        description: "Ático luminoso en el corazón de Ruzafa, muy demandado por residentes internacionales.",
        ddSummary: "Aviso transparente: comunidad estudia derrama de fachada (~2.400 €) negociable en arras.",
      },
    },
  },
  {
    id: "prop-pt-cas-0071",
    canonicalRef: "CNG-PT-CAS-0071",
    country: "PT",
    regionCode: "PT-CONT",
    city: "Cascais",
    neighborhood: "Guia / Costa da Guia",
    propertyType: "house",
    condition: "new_build",
    priceEur: 890000,
    areaSqm: 210,
    bedrooms: 4,
    bathrooms: 4,
    energyRating: "A",
    ddScore: 95,
    estYieldPct: 4.1,
    imageSrc: "/images/hero-cascais-villa.jpg",
    mapPos: { x: 18, y: 54 },
    partnerBroker: "Atlântico Prime Mediação Imobiliária",
    partnerLicense: "AMI #18420 (IMPIC)",
    commissionDisclosure: {
      pt: "Co-corretagem com promotor e agência AMI (vendedor remunera). Elegível Plano Private.",
      en: "Developer & AMI co-brokerage (seller-funded). Private Plan eligible.",
      es: "Co-corretaje con promotor y agencia AMI (pagado por vendedor).",
    },
    checks: [
      { label: { pt: "Alvará e Licença de Utilização emitidos", en: "Construction & occupancy permits issued", es: "Licencia de obra y uso emitidas" }, status: "pass" },
      { label: { pt: "Garantia estrutural de construtor 5 anos", en: "5-yr builder warranty", es: "Garantía constructora" }, status: "pass" },
      { label: { pt: "Certificação energética Classe A", en: "Class A Energy Cert", es: "Certificado Energético A" }, status: "pass" },
    ],
    translations: {
      pt: {
        title: "Moradia Contemporânea V4 na Costa da Guia",
        subtitle: "Obra Nova Classe A · Piscina privativa · Escolas internacionais a 8 min",
        description: "Casa de arquitetura contemporânea ideal para famílias S1 em relocation para Cascais, pronta a escriturar.",
        ddSummary: "Empreendimento concluído com alvarás finais e seguro construtivo auditados.",
      },
      en: {
        title: "Contemporary 4-Bed Villa in Costa da Guia",
        subtitle: "New Build Class A · Private pool · 8 min to international schools",
        description: "Turnkey modern villa tailored for relocating families seeking Cascais lifestyle and safety.",
        ddSummary: "Completed build with verified final occupancy licenses and structural warranty.",
      },
      es: {
        title: "Chalet Contemporáneo V4 en Costa da Guia",
        subtitle: "Obra Nueva Clase A · Piscina privada · Cerca de colegios",
        description: "Vivienda lista para escriturar en una de las zonas residenciales más seguras de Cascais.",
        ddSummary: "Licencia de primera ocupación y garantías constructivas verificadas.",
      },
    },
  },
  {
    id: "prop-es-bcn-0092",
    canonicalRef: "CNG-ES-BCN-0092",
    country: "ES",
    regionCode: "ES-CT",
    city: "Barcelona",
    neighborhood: "Eixample Esquerra",
    propertyType: "apartment",
    condition: "new_build",
    priceEur: 590000,
    areaSqm: 102,
    bedrooms: 3,
    bathrooms: 2,
    energyRating: "A",
    ddScore: 93,
    estYieldPct: 4.5,
    imageSrc: "/images/prop-madrid-interior.jpg",
    mapPos: { x: 84, y: 31 },
    partnerBroker: "Catalunya Verificada Real Estate",
    partnerLicense: "AICAT #9412 (Obrigatório)",
    commissionDisclosure: {
      pt: "Agência registada obrigatoriamente no AICAT (Catalunha). Obra nova sujeita a IVA 10% + AJD 1,5%.",
      en: "Mandatory AICAT-registered partner. New build subject to 10% VAT + 1.5% AJD.",
      es: "Agencia inscrita en AICAT. Obra nueva sujeta a IVA 10% + AJD 1,5%.",
    },
    checks: [
      { label: { pt: "Registro AICAT da agência validado", en: "AICAT agency license verified", es: "Registro AICAT validado" }, status: "pass" },
      { label: { pt: "Aval bancário de obra nova confirmado", en: "Bank guarantee for new build", es: "Aval bancario confirmado" }, status: "pass" },
      { label: { pt: "Cédula de habitabilidade incluída", en: "Habitability certificate included", es: "Cédula de habitabilidad incluida" }, status: "pass" },
    ],
    translations: {
      pt: {
        title: "Apartamento Obra Nova no Eixample Esquerra",
        subtitle: "Eficiência A · Regime IVA 10% + AJD · Terraço interno",
        description: "Unidade nova em edifício reabilitado integralmente com elevador, aerotermia e garantia legal espanhola.",
        ddSummary: "Documentação integral validada por agência AICAT e advogado local.",
      },
      en: {
        title: "New-Build 3-Bed Flat in Eixample Esquerra",
        subtitle: "Class A efficiency · 10% VAT + AJD regime",
        description: "Newly delivered residence in fully restored Eixample building with aerothermal climate control.",
        ddSummary: "Full AICAT agency compliance and developer guarantees verified.",
      },
      es: {
        title: "Piso de Obra Nueva en Eixample Esquerra",
        subtitle: "Eficiencia A · IVA 10% + AJD · Aerotermia",
        description: "Vivienda a estrenar en finca rehabilitada integralmente en el centro de Barcelona.",
        ddSummary: "Cumplimiento AICAT y documentación de obra nueva verificada.",
      },
    },
  },
  {
    id: "prop-es-agp-0115",
    canonicalRef: "CNG-ES-AGP-0115",
    country: "ES",
    regionCode: "ES-AN",
    city: "Málaga",
    neighborhood: "Soho / Centro",
    propertyType: "apartment",
    condition: "used",
    priceEur: 375000,
    areaSqm: 90,
    bedrooms: 2,
    bathrooms: 2,
    energyRating: "C",
    ddScore: 89,
    estYieldPct: 5.4,
    imageSrc: "/images/parallax-lisboa-terrace.jpg",
    mapPos: { x: 52, y: 74 },
    partnerBroker: "Andalucía Trust Homes",
    partnerLicense: "Registo Junta de Andalucía #AN-3318",
    commissionDisclosure: {
      pt: "Parceiro registado na Andaluzia. ITP regional 7%.",
      en: "Andalusia-registered brokerage partner. 7% regional ITP.",
      es: "Socio inscrito en Registro de Andalucía. ITP del 7%.",
    },
    checks: [
      { label: { pt: "Nota Simple limpa", en: "Clean Nota Simple", es: "Nota Simple limpia" }, status: "pass" },
      { label: { pt: "Estatuto do condomínio revisado", en: "HOA bylaws reviewed", es: "Estatutos revisados" }, status: "pass" },
    ],
    translations: {
      pt: {
        title: "T2 Moderno no Soho de Málaga",
        subtitle: "Hub tecnológico · ITP Andaluzia 7% · Perto da marina",
        description: "Localização estratégica no polo tecnológico e cultural de Málaga, com excelente demanda corporativa de média duração.",
        ddSummary: "Registro limpo e estatuto do condomínio verificado quanto a regras de locação.",
      },
      en: {
        title: "Modern 2-Bed Flat in Málaga Soho",
        subtitle: "Tech hub · 7% Andalusia ITP · Walk to marina",
        description: "Prime position in Málaga's arts & tech hub with strong corporate mid-term rental demand.",
        ddSummary: "Clean registry and HOA bylaws reviewed for rental compliance.",
      },
      es: {
        title: "Piso Moderno de 2 Dormitorios en el Soho",
        subtitle: "Hub tecnológico · ITP Andalucía 7%",
        description: "Ubicación estratégica junto al puerto y centro histórico de Málaga.",
        ddSummary: "Nota Simple limpia y estatutos comunitarios revisados.",
      },
    },
  },
  {
    id: "prop-pt-far-0123",
    canonicalRef: "CNG-PT-FAR-0123",
    country: "PT",
    regionCode: "PT-CONT",
    city: "Algarve (Vilamoura)",
    neighborhood: "Marina / Pinhal",
    propertyType: "apartment",
    condition: "used",
    priceEur: 455000,
    areaSqm: 105,
    bedrooms: 2,
    bathrooms: 2,
    energyRating: "B",
    ddScore: 92,
    estYieldPct: 5.0,
    imageSrc: "/images/hero-cascais-villa.jpg",
    mapPos: { x: 24, y: 78 },
    partnerBroker: "Algarve Transparente Mediação",
    partnerLicense: "AMI #19204 (IMPIC)",
    commissionDisclosure: {
      pt: "Co-corretagem AMI 50/50 com transparência total.",
      en: "50/50 AMI co-brokerage with upfront Fee Statement.",
      es: "Co-corretaje AMI 50/50 con total transparencia.",
    },
    checks: [
      { label: { pt: "Registo Predial limpo", en: "Clean Land Registry", es: "Registro limpio" }, status: "pass" },
      { label: { pt: "Certificado Energético B", en: "Energy Cert B", es: "Certificado B" }, status: "pass" },
    ],
    translations: {
      pt: {
        title: "T2 com Vista Jardim junto à Marina de Vilamoura",
        subtitle: "Condomínio fechado · Piscina · Lazer e renda em EUR",
        description: "Apartamento amplo em condomínio consolidado de Vilamoura, próximo a campos de golfe e clínica internacional.",
        ddSummary: "Caderneta, certidão e situação de condomínio conferidas.",
      },
      en: {
        title: "2-Bedroom Garden Residence near Vilamoura Marina",
        subtitle: "Gated condo · Pool · Lifestyle & EUR income",
        description: "Spacious apartment in a well-managed Vilamoura complex near golf courses and marina.",
        ddSummary: "Registry, tax card, and HOA status verified clean.",
      },
      es: {
        title: "Apartamento T2 junto a la Marina de Vilamoura",
        subtitle: "Urbanización privada · Piscina",
        description: "Amplia vivienda en complejo consolidado del Algarve.",
        ddSummary: "Documentación registral y de comunidad verificada.",
      },
    },
  },
];

export interface CityBenchmark {
  id: string;
  country: "PT" | "ES";
  city: string;
  avgPriceSqmEur: number;
  estGrossYield: string;
  taxLabel: string;
  docIdRequired: string;
  avgDaysToClose: string;
  idealFor: Record<Locale, string>;
}

export const CITY_BENCHMARKS: CityBenchmark[] = [
  {
    id: "lisboa",
    country: "PT",
    city: "Lisboa",
    avgPriceSqmEur: 5400,
    estGrossYield: "4,2% – 4,8%",
    taxLabel: "IMT progressivo + 0,8% IS",
    docIdRequired: "NIF (5–15 dias)",
    avgDaysToClose: "60–90 dias",
    idealFor: {
      pt: "Famílias S1/S2, liquidez patrimonial, serviços e escolas",
      en: "Relocating families, capital preservation, international schools",
      es: "Familias, liquidez patrimonial y colegios internacionales",
    },
  },
  {
    id: "porto",
    country: "PT",
    city: "Porto",
    avgPriceSqmEur: 3600,
    estGrossYield: "4,8% – 5,5%",
    taxLabel: "IMT progressivo + 0,8% IS",
    docIdRequired: "NIF (5–15 dias)",
    avgDaysToClose: "55–85 dias",
    idealFor: {
      pt: "Compradores S2 c/ financiamento e melhor relação preço/m²",
      en: "Resident buyers with mortgage & strong price-per-sqm value",
      es: "Compradores con hipoteca y mejor relación calidad-precio",
    },
  },
  {
    id: "madrid",
    country: "ES",
    city: "Madrid",
    avgPriceSqmEur: 5100,
    estGrossYield: "4,3% – 5,0%",
    taxLabel: "ITP 6% (usado) / IVA 10%+AJD 0,75%",
    docIdRequired: "NIE (20–45 dias)",
    avgDaysToClose: "60–95 dias",
    idealFor: {
      pt: "Menor imposto de transmissão da Espanha urbana, executivos e renda",
      en: "Lowest urban transfer tax in Spain, executives & capital growth",
      es: "Menor ITP urbano de España, ejecutivos y alta liquidez",
    },
  },
  {
    id: "valencia",
    country: "ES",
    city: "Valência",
    avgPriceSqmEur: 3100,
    estGrossYield: "5,2% – 6,0%",
    taxLabel: "ITP 9% (11% > €1M)",
    docIdRequired: "NIE (20–45 dias)",
    avgDaysToClose: "60–95 dias",
    idealFor: {
      pt: "Renda média duração, qualidade de vida e ticket € 250k–450k",
      en: "Mid-term yield, coastal lifestyle & €250k–450k entry point",
      es: "Rentabilidad media estancia, calidad de vida y tickets medios",
    },
  },
  {
    id: "malaga",
    country: "ES",
    city: "Málaga",
    avgPriceSqmEur: 3700,
    estGrossYield: "5,0% – 5,8%",
    taxLabel: "ITP 7% (Andaluzia)",
    docIdRequired: "NIE (20–45 dias)",
    avgDaysToClose: "65–100 dias",
    idealFor: {
      pt: "Tecnologia, clima ameno e ITP moderado de 7%",
      en: "Tech hub growth, year-round climate & 7% regional ITP",
      es: "Polo tecnológico, clima y 7% ITP autonómico",
    },
  },
];

export function computePropertyMatch(
  property: CuratedProperty,
  profile: BuyerProfile
): { score: number; reasons: string[] } {
  let score = 55;
  const reasons: string[] = [];

  if (profile.targetCountries.includes(property.country)) {
    score += 18;
    reasons.push(property.country);
  } else {
    score -= 15;
  }

  if (property.priceEur <= profile.budgetMaxEur) {
    score += 15;
    reasons.push("Budget OK");
  } else if (property.priceEur <= profile.budgetMaxEur * 1.12) {
    score += 4;
  } else {
    score -= 18;
  }

  if (property.ddScore >= 90) {
    score += 8;
    reasons.push(`DD ${property.ddScore}`);
  }

  if (profile.purpose === "investment" && property.estYieldPct >= 5.0) {
    score += 6;
    reasons.push(`Yield ${property.estYieldPct}%`);
  }

  if (
    profile.targetCities.some((c) =>
      property.city.toLowerCase().includes(c.toLowerCase())
    )
  ) {
    score += 6;
    reasons.push(property.city);
  }

  return {
    score: Math.max(40, Math.min(99, score)),
    reasons,
  };
}
