import { Locale } from "@/types/domain";

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /ignore\s+todas\s+as\s+instru[cç][oõ]es/i,
  /(reveal|show|print|display|mostre|exiba)\s+(your\s+)?(system\s+prompt|instru[cç][oõ]es\s+internas|api\s*key)/i,
  /act\s+as\s+system|developer\s+mode|jailbreak|dan\s+mode/i,
  /<\s*script\b/i,
];

export function detectPromptInjection(input: string): { blocked: boolean; reason?: string } {
  for (const rx of INJECTION_PATTERNS) {
    if (rx.test(input)) {
      return {
        blocked: true,
        reason: "Tentativa de manipulação de instruções (Prompt Injection) bloqueada pela camada de segurança.",
      };
    }
  }
  return { blocked: false };
}

/**
 * Redação DLP determinística na saída da IA:
 * Garante que mesmo se um LLM tentar escrever um IBAN ou dado bancário semelhante,
 * o valor seja substituído por aviso seguro antes de chegar ao usuário.
 */
export function sanitizeAiOutputDlp(text: string): { text: string; redactedIban: boolean } {
  // Padrão internacional de IBAN (ex.: PT50 0035 1234 5678 9012 3456 7 ou ES91...)
  const ibanRegex = /\b[A-Z]{2}\d{2}(?:\s?[A-Z0-9]{4}){2,7}(?:\s?[A-Z0-9]{1,4})?\b/g;
  let redactedIban = false;
  const sanitized = text.replace(ibanRegex, () => {
    redactedIban = true;
    return "[IBAN REDIGIDO POR SEGURANÇA — CONSULTE O COFRE VERIFICADO]";
  });
  return { text: sanitized, redactedIban };
}

export function getInjectionRefusalMessage(locale: Locale): string {
  if (locale === "en") {
    return "🛡️ Security guardrail triggered: I cannot process requests attempting to override safety boundaries or inspect internal prompts. Please ask your real estate, legal, tax, or relocation question directly.";
  }
  if (locale === "es") {
    return "🛡️ Bloqueo de seguridad activado: No puedo procesar solicitudes que intenten anular las reglas internas. Por favor, formula directamente tu consulta inmobiliaria, fiscal o jurídica.";
  }
  return "🛡️ Barreira de segurança ativada: Não posso processar solicitações que tentem alterar instruções internas ou contornar regras de segurança. Faça sua dúvida imobiliária, jurídica, fiscal ou de relocation normalmente.";
}

// Rate limiter simples em memória por janela deslizante (proteção contra abuso de cota)
const requestBuckets = new Map<string, number[]>();

export function checkRateLimit(clientKey: string, maxPerMinute = 20): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const windowStart = now - 60_000;
  const timestamps = (requestBuckets.get(clientKey) || []).filter((t) => t > windowStart);

  if (timestamps.length >= maxPerMinute) {
    requestBuckets.set(clientKey, timestamps);
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  requestBuckets.set(clientKey, timestamps);
  return { allowed: true, remaining: maxPerMinute - timestamps.length };
}
