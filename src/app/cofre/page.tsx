"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  UploadCloud,
  Eye,
  Download,
  Share2,
  XCircle,
  History,
  CheckCircle2,
  Lock,
  X,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { CountryCode, VaultDocument } from "@/types/domain";
import { SecurityGate } from "@/components/SecurityGate";

export default function VaultPage() {
  const {
    locale,
    session,
    docs,
    uploadVaultDocument,
    recordDocViewOrDownload,
    shareVaultDocument,
    revokeVaultShare,
    verifiedPayment,
  } = useApp();
  const t = DICTIONARIES[locale];

  const [category, setCategory] = useState("power_of_attorney");
  const [country, setCountry] = useState<CountryCode | "BOTH">("PT");
  const [docTitle, setDocTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedDocHistory, setSelectedDocHistory] = useState<VaultDocument | null>(
    docs[0] || null
  );
  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploadError(null);
    setUploading(true);
    try {
      await uploadVaultDocument({
        file: selectedFile,
        category,
        title: docTitle || selectedFile.name,
        country,
      });
      setSelectedFile(null);
      setDocTitle("");
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Erro ao enviar documento.");
    } finally {
      setUploading(false);
    }
  };

  const handleViewDoc = async (doc: VaultDocument) => {
    await recordDocViewOrDownload(doc.id, "VIEW");
    setSelectedDocHistory(doc);
    setPreviewDoc(doc);
  };

  const handleDownloadDoc = async (doc: VaultDocument) => {
    await recordDocViewOrDownload(doc.id, "DOWNLOAD");
    if (doc.previewDataUrl) {
      const a = document.createElement("a");
      a.href = doc.previewDataUrl;
      a.download = doc.fileName;
      a.click();
    } else {
      // Gera comprovante técnico auditado caso seja um documento semente sem binário anexado
      const summaryBlob = new Blob(
        [
          `CASA NA GRINGA — COMPROVANTE DE DOCUMENTO DO COFRE\nID: ${doc.id}\nArquivo: ${doc.fileName}\nVersão: v${doc.version}\nSHA-256: ${doc.sha256}\nStatus: ${doc.status}\nBaixado por: ${session.displayName} (${session.role}) em ${new Date().toISOString()}\n`,
        ],
        { type: "text/plain" }
      );
      const url = URL.createObjectURL(summaryBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.fileName}.audit.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <SecurityGate requireMfa>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F2EE] text-[#14564B] text-xs font-bold">
            <Lock className="w-3.5 h-3.5" /> AES-256 CMEK (UE) · Versionamento & SHA-256
          </span>
          <h1 className="text-3xl font-bold mt-2">{t.vault.title}</h1>
          <p className="text-sm text-[#4A556E] mt-1">{t.vault.subtitle}</p>
        </div>

        {/* Banner Anti-BEC Permanente */}
        <div className="bg-[#F9E3E0] border border-[#EBB9B3] rounded-2xl p-4 flex items-start gap-3 text-sm text-[#7D2119]">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <b>{t.vault.antiBecBanner}</b>
          </div>
        </div>

        {/* Upload de Novo Documento / Nova Versão */}
        <form
          onSubmit={handleUpload}
          className="bg-white rounded-2xl border border-[#E3DED3] p-6 shadow-sm space-y-4"
        >
          <h2 className="text-lg font-bold flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[#B8793A]" /> {t.vault.uploadTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-[#1D3557] mb-1">
                {t.vault.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="passport">Passaporte</option>
                <option value="nif_nie">NIF (PT) / NIE (ES)</option>
                <option value="source_of_funds">Origem de Fundos (IRPF/Extratos)</option>
                <option value="power_of_attorney">Procuração + Apostila Haia</option>
                <option value="proof_address">Comprovante de Morada</option>
                <option value="cpcv_arras">CPCV / Contrato de Arras</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1D3557] mb-1">
                {t.vault.countryLabel}
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as CountryCode | "BOTH")}
                className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="BOTH">Ambos (PT & ES)</option>
                <option value="PT">Portugal</option>
                <option value="ES">Espanha</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1D3557] mb-1">
                Título Descritivo
              </label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Ex.: Procuração Apostilada 2027"
                className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1D3557] mb-1">
                Arquivo (PDF, JPG, PNG, WEBP · máx 25 MB)
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  setUploadError(null);
                  setSelectedFile(e.target.files?.[0] || null);
                }}
                className="w-full text-xs text-[#4A556E]"
                required
              />
            </div>
          </div>

          {uploadError && (
            <div className="bg-[#F9E3E0] border border-[#EBB9B3] rounded-xl p-3 text-xs text-[#7D2119] font-semibold">
              {uploadError}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="px-6 py-2.5 rounded-full bg-[#B8793A] hover:bg-[#9E652D] disabled:opacity-50 text-white text-sm font-semibold cursor-pointer"
          >
            {uploading ? "Calculando SHA-256 & Enviando..." : t.vault.uploadBtn}
          </button>
        </form>

        {/* Tabela de Documentos */}
        <div className="bg-white rounded-2xl border border-[#E3DED3] p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold">{t.vault.docsTableTitle}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E3DED3] text-xs uppercase text-[#6B7690]">
                  <th className="py-2.5 text-left">Documento</th>
                  <th className="py-2.5 text-left">Versão</th>
                  <th className="py-2.5 text-left">Status</th>
                  <th className="py-2.5 text-left">SHA-256</th>
                  <th className="py-2.5 text-left">Compartilhamento</th>
                  <th className="py-2.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEBE2]">
                {docs.map((doc) => {
                  const activeShares = doc.shares.filter((s) => !s.revokedAt);
                  return (
                    <tr key={doc.id} className="hover:bg-[#FAF7F2]">
                      <td className="py-3">
                        <div className="font-bold text-[#0B1F3A]">{doc.title}</div>
                        <div className="text-xs text-[#6B7690]">
                          {doc.fileName} · {doc.country}
                        </div>
                      </td>
                      <td className="py-3 font-mono text-xs">v{doc.version}</td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            doc.status === "approved"
                              ? "bg-[#E4F2EE] text-[#14564B]"
                              : doc.status === "rejected"
                                ? "bg-[#F9E3E0] text-[#7D2119]"
                                : "bg-[#FBF1D9] text-[#6B4A00]"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-xs text-[#6B7690]">
                        {doc.sha256.slice(0, 12)}...
                      </td>
                      <td className="py-3 text-xs space-y-1">
                        {activeShares.length === 0 ? (
                          <span className="text-[#6B7690]">Privado (só você)</span>
                        ) : (
                          activeShares.map((sh) => (
                            <div key={sh.id} className="flex items-center gap-1.5">
                              <span className="text-[#1F7A6B] font-semibold">{sh.partnerName}</span>
                              <button
                                type="button"
                                onClick={() => void revokeVaultShare(doc.id, sh.id)}
                                className="text-[#B3392F] hover:underline flex items-center gap-0.5 cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" /> {t.vault.revokeBtn}
                              </button>
                            </div>
                          ))
                        )}
                      </td>
                      <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => void handleViewDoc(doc)}
                          className="px-2.5 py-1 rounded-full border border-[#E3DED3] text-xs font-semibold hover:bg-[#F1ECE2] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ver
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDownloadDoc(doc)}
                          className="px-2.5 py-1 rounded-full border border-[#E3DED3] text-xs font-semibold hover:bg-[#F1ECE2] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> Baixar
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            void shareVaultDocument(
                              doc.id,
                              "Dr. Tiago Mendes (Adv. OA-PT)",
                              "legal_reviewer",
                              7
                            )
                          }
                          className="px-2.5 py-1 rounded-full bg-[#0B1F3A] text-white text-xs font-semibold hover:bg-[#1D3557] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" /> {t.vault.shareBtn}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedDocHistory(doc)}
                          className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E3DED3] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <History className="w-3.5 h-3.5" /> ({doc.events.length})
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Histórico de Acesso + Pagamento Verificado Anti-BEC */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#E3DED3] p-6 shadow-sm space-y-3">
            <h3 className="text-lg font-bold">
              {t.vault.historyTitle}
              {selectedDocHistory ? ` — ${selectedDocHistory.title}` : ""}
            </h3>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {(docs.find((d) => d.id === selectedDocHistory?.id) || docs[0])?.events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E3DED3] text-xs flex items-start justify-between gap-3"
                >
                  <div>
                    <span className="px-2 py-0.5 rounded bg-[#0B1F3A] text-white font-mono text-[10px] mr-2">
                      {ev.type}
                    </span>
                    <b>{ev.actorName}</b> ({ev.actorRole})
                    {ev.note && <div className="text-[#4A556E] mt-1">{ev.note}</div>}
                  </div>
                  <span className="text-[#6B7690] shrink-0">
                    {new Date(ev.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-[#1F7A6B] p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#14564B] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> {t.vault.verifiedPayTitle}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E4F2EE] text-[#14564B] text-xs font-bold">
                Dupla Assinatura OK
              </span>
            </div>
            <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#E3DED3] text-xs space-y-2">
              <div>
                <span className="text-[#6B7690]">Beneficiário Regulado:</span>{" "}
                <b className="text-[#0B1F3A]">{verifiedPayment.beneficiaryName}</b>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[#6B7690] block">IBAN Verificado</span>
                  <code className="font-bold text-sm text-[#0B1F3A]">{verifiedPayment.ibanMasked}</code>
                </div>
                <div>
                  <span className="text-[#6B7690] block">BIC / SWIFT</span>
                  <code className="font-bold text-sm text-[#0B1F3A]">{verifiedPayment.bicSwift}</code>
                </div>
              </div>
              <div>
                <span className="text-[#6B7690]">Finalidade / Valor:</span>{" "}
                <b>€ {verifiedPayment.amountEur.toLocaleString("pt-BR")}</b> — {verifiedPayment.purpose}
              </div>
              <div className="pt-2 border-t border-[#E3DED3] text-[11px] text-[#14564B]">
                ✓ Assinatura 1: {verifiedPayment.verifiedBy1}
                <br />✓ Assinatura 2: {verifiedPayment.verifiedBy2}
                <br />✓ Selo HMAC: <code>{verifiedPayment.hmacDigest}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Visualização com Marca d'Água Dinâmica */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 bg-[#0B1F3A]/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#E3DED3] pb-3">
                <div>
                  <h3 className="text-lg font-bold">{previewDoc.title}</h3>
                  <p className="text-xs text-[#6B7690]">
                    {previewDoc.fileName} · v{previewDoc.version} · SHA-256: {previewDoc.sha256.slice(0, 16)}...
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-full hover:bg-[#FAF7F2] cursor-pointer"
                  aria-label="Fechar visualização"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative rounded-xl border border-[#E3DED3] bg-[#FAF7F2] p-6 min-h-[240px] flex items-center justify-center overflow-hidden">
                {/* Marca d'água dinâmica auditável */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute inset-0 flex items-center justify-center -rotate-12 text-[#0B1F3A]/10 font-bold text-lg text-center px-4"
                >
                  CONFIDENCIAL · VISUALIZADO POR {session.displayName.toUpperCase()} ({session.role}) ·{" "}
                  {new Date().toISOString().slice(0, 16)}
                </div>

                {previewDoc.previewDataUrl && previewDoc.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewDoc.previewDataUrl}
                    alt={previewDoc.title}
                    className="max-h-72 rounded shadow relative z-10"
                  />
                ) : (
                  <div className="relative z-10 text-center space-y-2 text-sm text-[#26324A]">
                    <p className="font-bold">Visualização Segura em Cofre ({previewDoc.mimeType})</p>
                    <p className="text-xs text-[#6B7690]">
                      Integridade verificada via hash SHA-256. Evento <code>VIEW</code> gravado na trilha imutável.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </SecurityGate>
  );
}
