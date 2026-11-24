import { UserRole } from "@/types/domain";

export const ALLOWED_VAULT_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_VAULT_FILE_BYTES = 25 * 1024 * 1024; // 25 MB

export function validateVaultFile(file: {
  name: string;
  type: string;
  size: number;
}): { ok: boolean; error?: string } {
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".svg") || file.type === "image/svg+xml") {
    return {
      ok: false,
      error: "Arquivos SVG são bloqueados por segurança (risco de XSS). Envie PDF, JPG, PNG ou WEBP.",
    };
  }

  if (file.size <= 0 || file.size > MAX_VAULT_FILE_BYTES) {
    return {
      ok: false,
      error: "O arquivo deve ter entre 1 byte e 25 MB.",
    };
  }

  const allowedExt = /\.(pdf|jpe?g|png|webp)$/i.test(lower);
  const allowedMime = ALLOWED_VAULT_MIME_TYPES.includes(
    file.type as (typeof ALLOWED_VAULT_MIME_TYPES)[number]
  );

  if (!allowedMime && !allowedExt) {
    return {
      ok: false,
      error: "Formato não permitido. Envie apenas PDF, JPG, PNG ou WEBP.",
    };
  }

  return { ok: true };
}

export const INTERNAL_STAFF_ROLES: UserRole[] = [
  "advisor",
  "legal_reviewer",
  "compliance_officer",
  "admin",
];

export const DOC_REVIEW_ROLES: UserRole[] = [
  "legal_reviewer",
  "compliance_officer",
  "admin",
];

export function canAccessInternalCrm(role: UserRole): boolean {
  return INTERNAL_STAFF_ROLES.includes(role);
}

export function canReviewDocuments(role: UserRole): boolean {
  return DOC_REVIEW_ROLES.includes(role);
}
