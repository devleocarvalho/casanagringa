import { AuditLogEntry } from "@/types/domain";

export const GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

export async function sha256Hex(message: string): Promise<string> {
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.subtle) {
    const encoded = new TextEncoder().encode(message);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  throw new Error("WebCrypto subtle SHA-256 is unavailable in this environment");
}

export async function computeFileSha256(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.subtle) {
    const digest = await globalThis.crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return "0".repeat(64);
}

export function buildAuditCanonicalPayload(entry: Omit<AuditLogEntry, "entryHash">): string {
  return [
    entry.seq,
    entry.id,
    entry.timestamp,
    entry.actorUid,
    entry.actorRole,
    entry.action,
    entry.resourceType,
    entry.resourceId,
    entry.summary,
    entry.prevHash,
  ].join("|");
}

export async function createChainedAuditEntry(
  prevLogs: AuditLogEntry[],
  input: Omit<AuditLogEntry, "seq" | "id" | "timestamp" | "prevHash" | "entryHash">
): Promise<AuditLogEntry> {
  const sorted = [...prevLogs].sort((a, b) => a.seq - b.seq);
  const last = sorted[sorted.length - 1];
  const seq = last ? last.seq + 1 : 1;
  const prevHash = last ? last.entryHash : GENESIS_HASH;
  const id = `aud_${seq}_${Math.random().toString(36).slice(2, 8)}`;
  const timestamp = new Date().toISOString();

  const partial: Omit<AuditLogEntry, "entryHash"> = {
    seq,
    id,
    timestamp,
    ...input,
    prevHash,
  };
  const entryHash = await sha256Hex(buildAuditCanonicalPayload(partial));
  return { ...partial, entryHash };
}

export async function verifyAuditChain(
  logs: AuditLogEntry[]
): Promise<{ valid: boolean; checkedCount: number; brokenSeq?: number }> {
  const sorted = [...logs].sort((a, b) => a.seq - b.seq);
  let expectedPrev = GENESIS_HASH;
  for (const item of sorted) {
    if (item.prevHash !== expectedPrev) {
      return { valid: false, checkedCount: sorted.length, brokenSeq: item.seq };
    }
    const { entryHash, ...rest } = item;
    const recomputed = await sha256Hex(buildAuditCanonicalPayload(rest));
    if (recomputed !== entryHash) {
      return { valid: false, checkedCount: sorted.length, brokenSeq: item.seq };
    }
    expectedPrev = item.entryHash;
  }
  return { valid: true, checkedCount: sorted.length };
}
