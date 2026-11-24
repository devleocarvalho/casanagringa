import { AgentType, AiCitation, Locale } from "@/types/domain";
import { retrieveLegalChunks, toCitations } from "./legalRag";
import {
  detectPromptInjection,
  getInjectionRefusalMessage,
  sanitizeAiOutputDlp,
} from "./guardrails";

export interface AgentMeta {
  id: AgentType;
  label: Record<Locale, string>;
  roleDesc: Record<Locale, string>;
  limits: Record<Locale, string>;
}

export const AI_AGENTS: AgentMeta[] = [
  {
    id: "orchestrator",
    label: { pt: "🎯 Orquestrador (Auto)", en: "🎯 Orchestrator (Auto)", es: "🎯 Orquestador (Auto)" },
    roleDesc: {
      pt: "Classifica sua dúvida, detecta riscos críticos e aciona o especialista certo.",
      en: "Routes your question to the right specialist and flags critical risks.",
      es: "Clasifica tu consulta, detecta riesgos y activa al especialista adecuado.",
    },
    limits: {
      pt: "Não substitui especialistas humanos.",
      en: "Does not replace human specialists.",
      es: "No sustituye a especialistas humanos.",
    },
  },
  {
    id: "real_estate",
    label: { pt: "🏠 Agente Imobiliário", en: "🏠 Real Estate Agent", es: "🏠 Agente Inmobiliario" },
    roleDesc: {
      pt: "Compara bairros, preços/m², liquidez de aluguel e aderência ao seu perfil.",
      en: "Compares neighborhoods, price/sqm, rental liquidity, and profile fit.",
      es: "Compara barrios, precios/m², demanda y encaje con tu perfil.",
    },
    limits: {
      pt: "Não avalia imóveis presencialmente nem garante valorização.",
      en: "Cannot inspect properties in person or guarantee appreciation.",
      es: "No realiza visitas presenciales ni garantiza revalorización.",
    },
  },
  {
    id: "financial",
    label: { pt: "💶 Agente Financeiro", en: "💶 Financial Agent", es: "💶 Agente Financiero" },
    roleDesc: {
      pt: "Explica cenários de financiamento para não-residentes, LTV, prestação e câmbio.",
      en: "Explains non-resident mortgage scenarios, LTV, payments, and FX flows.",
      es: "Explica escenarios de hipoteca para no residentes, LTV, cuotas y divisas.",
    },
    limits: {
      pt: "Não aprova crédito nem dá recomendação de investimento definitiva.",
      en: "Does not approve loans or provide definitive investment advice.",
      es: "No aprueba préstamos ni da asesoría financiera definitiva.",
    },
  },
  {
    id: "legal",
    label: { pt: "⚖️ Agente Jurídico (RAG)", en: "⚖️ Legal Agent (RAG)", es: "⚖️ Agente Jurídico (RAG)" },
    roleDesc: {
      pt: "Explica contratos (CPCV, Arras), procuração, NIF/NIE e fluxo notarial com fontes.",
      en: "Explains CPCV, Arras, PoA, NIF/NIE, and notary steps using cited sources.",
      es: "Explica contratos (Arras, CPCV), poderes, NIE/NIF y notaría con fuentes.",
    },
    limits: {
      pt: "Caráter informativo; nunca substitui advogado inscrito na OA/ICAM/OAB.",
      en: "Informational only; never replaces a licensed local attorney.",
      es: "Solo informativo; nunca sustituye a un abogado colegiado.",
    },
  },
  {
    id: "tax",
    label: { pt: "🧾 Agente Tributário", en: "🧾 Tax Agent", es: "🧾 Agente Tributario" },
    roleDesc: {
      pt: "Detalha estimativas de IMT, Imposto do Selo, ITP regional, IVA/AJD, IMI/IBI.",
      en: "Breaks down estimated IMT, Stamp Duty, regional ITP, VAT/AJD, and annual taxes.",
      es: "Detalla estimaciones de ITP autonómico, IVA/AJD, IMT e impuestos anuales.",
    },
    limits: {
      pt: "Não realiza planejamento fiscal vinculante; valide sempre com contador.",
      en: "Not binding tax planning; confirm every figure with a tax advisor.",
      es: "No es planificación fiscal vinculante; valida con asesor fiscal.",
    },
  },
  {
    id: "relocation",
    label: { pt: "✈️ Relocation", en: "✈️ Relocation Agent", es: "✈️ Agente Relocation" },
    roleDesc: {
      pt: "Orienta sobre mudança, escolas, saúde, abertura de conta e instalação pós-chaves.",
      en: "Guides family move, schools, healthcare, utilities, and post-closing setup.",
      es: "Orienta sobre mudanza, colegios, sanidad, suministros e instalación.",
    },
    limits: {
      pt: "Não garante concessão de vistos ou autorizações de residência.",
      en: "Cannot guarantee visa or residency permit approvals.",
      es: "No garantiza concesión de visados ni autorizaciones.",
    },
  },
  {
    id: "concierge",
    label: { pt: "🔔 Concierge Internacional", en: "🔔 International Concierge", es: "🔔 Concierge Internacional" },
    roleDesc: {
      pt: "Acompanha prazos das 7 fases, lembra vencimentos e organiza agendamentos.",
      en: "Tracks 7-phase milestones, document expirations, and advisor scheduling.",
      es: "Supervisa plazos de las 7 fases, vencimientos y citas.",
    },
    limits: {
      pt: "Coordenação operacional; decisões críticas vão para consultor humano.",
      en: "Operational coordination; critical decisions escalate to human advisors.",
      es: "Coordinación operativa; decisiones críticas pasan a asesores humanos.",
    },
  },
  {
    id: "compliance",
    label: { pt: "🛡️ Compliance & Anti-BEC", en: "🛡️ Compliance & Anti-BEC", es: "🛡️ Compliance & Anti-BEC" },
    roleDesc: {
      pt: "Orienta sobre KYC, origem lícita de fundos, LGPD/GDPR e prevenção a golpes.",
      en: "Guides KYC, source-of-funds AML rules, GDPR/LGPD, and fraud prevention.",
      es: "Orienta sobre KYC, blanqueo de capitales, RGPD y prevención de estafas.",
    },
    limits: {
      pt: "Jamais confirma ou envia IBAN por chat.",
      en: "Never sends or confirms IBAN/wire instructions in chat.",
      es: "Nunca envía ni confirma IBAN por chat.",
    },
  },
  {
    id: "due_diligence",
    label: { pt: "🔍 Due Diligence", en: "🔍 Due Diligence Agent", es: "🔍 Agente Due Diligence" },
    roleDesc: {
      pt: "Explica certidões, Nota Simple, caderneta, ônus e riscos urbanísticos.",
      en: "Explains registry extracts, liens, occupancy licenses, and HOA risks.",
      es: "Explica Nota Simple, catastro, cargas y riesgos urbanísticos.",
    },
    limits: {
      pt: "Pré-análise educativa; parecer vinculante é exclusivo do advogado revisor.",
      en: "Preliminary educational check; binding DD sign-off requires a lawyer.",
      es: "Preanálisis informativo; el dictamen vinculante es exclusivo del abogado.",
    },
  },
];

const DISCLAIMERS: Record<Locale, string> = {
  pt: "Aviso obrigatório: Sou uma IA assistiva da Casa na Gringa. Esta resposta tem caráter exclusivamente informativo baseada em nosso corpus curado e NÃO constitui aconselhamento jurídico, financeiro ou tributário definitivo. Nunca transfira recursos usando dados bancários fora do Cofre Verificado.",
  en: "Mandatory notice: I am an assistive AI from Casa na Gringa. This answer is informational only based on our curated corpus and does NOT constitute definitive legal, financial, or tax advice. Never wire funds using bank details outside the Verified Vault.",
  es: "Aviso obligatorio: Soy una IA asistiva de Casa na Gringa. Esta respuesta es meramente informativa basada en nuestro corpus curado y NO constituye asesoramiento jurídico, financiero o fiscal definitivo. Nunca transfieras fondos fuera de la Bóveda Verificada.",
};

export function detectCriticalTriggers(text: string): {
  antiBecAlert: boolean;
  hitlTriggered: boolean;
  hitlReason?: string;
  routedAgent: AgentType;
} {
  const norm = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const antiBecAlert = /(iban|transferir|transferencia|sinal|deposito|conta bancaria|swift|wire|pix|mandar dinheiro)/.test(
    norm
  );
  const contractOrTaxCritical = /(assinar|assinatura|cpcv|arras|escritura|posso comprar|isencao|irpf|cbe|multa|embargo|penhora|fraude|golpe|subfatur)/.test(
    norm
  );

  let routedAgent: AgentType = "concierge";
  if (antiBecAlert || /(aml|kyc|origem de fundos|lgpd|gdpr|pep)/.test(norm)) {
    routedAgent = "compliance";
  } else if (/(nota simple|certidao|caderneta|licenca|onus|hipoteca|due diligence)/.test(norm)) {
    routedAgent = "due_diligence";
  } else if (/(imt|itp|iva|ajd|imposto|tributo|imposto do selo|imi|ibi|irnr)/.test(norm)) {
    routedAgent = "tax";
  } else if (/(cpcv|arras|procuracao|nif|nie|lei|advogado|notario|escritura)/.test(norm)) {
    routedAgent = "legal";
  } else if (/(financiamento|credito|hipoteca|ltv|euribor|prestacao|juros|cambio)/.test(norm)) {
    routedAgent = "financial";
  } else if (/(escola|mudanca|visto|residencia|relocation|saude)/.test(norm)) {
    routedAgent = "relocation";
  } else if (/(bairro|cidade|imovel|lisboa|porto|madrid|valencia|barcelona|malaga|yield|aluguel)/.test(norm)) {
    routedAgent = "real_estate";
  }

  const hitlTriggered = antiBecAlert || contractOrTaxCritical;
  const hitlReason = antiBecAlert
    ? "Menção a instruções bancárias / transferência / sinal (Protocolo Anti-BEC)"
    : contractOrTaxCritical
      ? "Decisão contratual, registral ou tributária crítica (HITL obrigatório)"
      : undefined;

  return { antiBecAlert, hitlTriggered, hitlReason, routedAgent };
}

export async function runMultiAgentReply(params: {
  message: string;
  requestedAgent: AgentType;
  locale: Locale;
  history: { role: "user" | "agent"; text: string }[];
  buyerContextSummary?: string;
}): Promise<{
  agentUsed: AgentType;
  text: string;
  citations: AiCitation[];
  disclaimer: string;
  hitlTriggered: boolean;
  hitlReason?: string;
  antiBecAlert: boolean;
  mode: "gemini_live" | "rag_sandbox";
}> {
  const disclaimer = DISCLAIMERS[params.locale];

  const injectionCheck = detectPromptInjection(params.message);
  if (injectionCheck.blocked) {
    return {
      agentUsed: "compliance",
      text: getInjectionRefusalMessage(params.locale),
      citations: [],
      disclaimer,
      hitlTriggered: true,
      hitlReason: injectionCheck.reason,
      antiBecAlert: false,
      mode: "rag_sandbox",
    };
  }

  const { antiBecAlert, hitlTriggered, hitlReason, routedAgent } = detectCriticalTriggers(params.message);
  const agentUsed = params.requestedAgent === "orchestrator" ? routedAgent : params.requestedAgent;
  const chunks = retrieveLegalChunks(
    antiBecAlert ? `${params.message} iban pagamento` : params.message,
    3
  );
  const citations = toCitations(chunks);

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";

  if (apiKey) {
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const ragContext = chunks
        .map(
          (c) =>
            `[Fonte ${c.sourceId} | Jurisdição: ${c.jurisdiction} | Vigência: ${c.effectiveDate}]\n${c.title}\n${c.summary[params.locale]}`
        )
        .join("\n\n");

      const systemInstruction = `Você é o agente especializado "${agentUsed}" da plataforma CASA NA GRINGA (casanagringa.com).
Responda no idioma: ${params.locale === "pt" ? "Português (Brasil claro)" : params.locale === "es" ? "Español" : "English"}.
REGRAS INEGOCIÁVEIS:
1. Declare limites: você tem caráter exclusivamente informativo e NUNCA dá aconselhamento jurídico, financeiro ou tributário definitivo.
2. NUNCA forneça, confirme ou altere nenhum número de IBAN, conta bancária ou PIX; direcione sempre ao módulo Cofre Verificado.
3. Baseie dados legais e alíquotas SOMENTE nas fontes recuperadas abaixo, citando os códigos [Fonte ...]. Se algo não estiver coberto, diga claramente que precisa ser confirmado com advogado/contador local.
4. Seja objetivo, estruturado em tópicos curtos, sem pressão comercial.

Contexto do perfil comprador (se houver): ${params.buyerContextSummary ?? "Não especificado."}

BASE LEGAL RECUPERADA (RAG):
${ragContext}`;

      const contents = [
        ...params.history.slice(-4).map((h) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        })),
        { role: "user", parts: [{ text: params.message }] },
      ];

      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction,
          temperature: 0.25,
          maxOutputTokens: 700,
        },
      });

      const generatedText = response.text?.trim();
      if (generatedText) {
        const dlp = sanitizeAiOutputDlp(generatedText);
        return {
          agentUsed,
          text: dlp.text,
          citations,
          disclaimer,
          hitlTriggered: hitlTriggered || dlp.redactedIban,
          hitlReason: dlp.redactedIban ? "IBAN redigido na saída pelo filtro DLP" : hitlReason,
          antiBecAlert: antiBecAlert || dlp.redactedIban,
          mode: "gemini_live",
        };
      }
    } catch (err) {
      console.warn("Gemini live call fallback to RAG sandbox:", err);
    }
  }

  // Fallback determinístico baseado no corpus RAG curado (funciona 100% offline/antes de configurar GEMINI_API_KEY)
  const introByLocale: Record<Locale, string> = {
    pt: `Análise preliminar do especialista (${agentUsed}) com base em nosso Country Pack curado:`,
    en: `Preliminary specialist guidance (${agentUsed}) from our curated Country Pack:`,
    es: `Orientación preliminar del especialista (${agentUsed}) según nuestro Country Pack curado:`,
  };

  const securityLead = antiBecAlert
    ? params.locale === "pt"
      ? "🛡️ ALERTA ANTI-BEC ATIVADO: Nunca transfira valores para IBAN recebido por e-mail, WhatsApp ou chat. Confira exclusivamente o quadro 'Instruções Bancárias Verificadas' no Cofre.\n\n"
      : params.locale === "es"
        ? "🛡️ ALERTA ANTI-BEC ACTIVADA: Nunca transfieras a un IBAN recibido por correo o WhatsApp. Utiliza únicamente el módulo verificado en tu Bóveda.\n\n"
        : "🛡️ ANTI-BEC ALERT: Never wire funds to an IBAN received via email or WhatsApp. Only use the dual-signed Verified Payment module inside your Vault.\n\n"
    : "";

  const body = chunks
    .map((c) => `• **${c.title}** [${c.sourceId}]: ${c.summary[params.locale]}`)
    .join("\n\n");

  const nextStepByLocale: Record<Locale, string> = {
    pt: hitlTriggered
      ? "\n\n👤 Próximo passo recomendado: Como sua dúvida envolve decisão contratual, tributária ou pagamento, recomendamos acionar o botão de **Escalonamento Humano** abaixo para revisão por advogado/consultor."
      : "\n\n💡 Dica: Você pode simular números exatos na aba Simuladores ou enviar documentos prévios no Cofre.",
    en: hitlTriggered
      ? "\n\n👤 Recommended next step: Since your question involves contracts, taxes, or payments, trigger **Escalate to Human Specialist** below."
      : "\n\n💡 Tip: Model exact numbers in Simulators or upload pre-checks to your Vault.",
    es: hitlTriggered
      ? "\n\n👤 Siguiente paso recomendado: Al involucrar contratos, impuestos o pagos, pulsa **Escalar a Especialista Humano** abajo."
      : "\n\n💡 Consejo: Simula cifras exactas en Simuladores o sube documentos en la Bóveda.",
  };

  return {
    agentUsed,
    text: `${securityLead}${introByLocale[params.locale]}\n\n${body}${nextStepByLocale[params.locale]}`,
    citations,
    disclaimer,
    hitlTriggered,
    hitlReason,
    antiBecAlert,
    mode: "rag_sandbox",
  };
}
