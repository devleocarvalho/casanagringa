"use client";

import React, { useState } from "react";
import { Users, ShieldAlert, CheckCircle2, XCircle, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { CountryCode, CrmStage } from "@/types/domain";
import { SecurityGate } from "@/components/SecurityGate";
import { INTERNAL_STAFF_ROLES } from "@/lib/vaultValidation";

const STAGES: { code: CrmStage; label: string }[] = [
  { code: "new_lead", label: "Novos Leads" },
  { code: "qualified_mql", label: "Qualificados (MQL)" },
  { code: "sql_active_plan", label: "Plano Ativo / Doc" },
  { code: "property_selection", label: "Seleção & Visitas" },
  { code: "under_dd", label: "Due Diligence" },
  { code: "closed_won", label: "Escritura Concluída" },
];

export default function CrmPage() {
  const { locale, session, leads, addLead, moveLeadStage, hitlQueue, resolveHitl, docs, reviewVaultDocument } =
    useApp();
  const t = DICTIONARIES[locale];

  const [tab, setTab] = useState<"kanban" | "hitl">("kanban");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newBudget, setNewBudget] = useState(400000);
  const [newCountry, setNewCountry] = useState<CountryCode>("PT");

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    await addLead({
      name: newName,
      email: newEmail,
      origin: "Cadastro Manual CRM",
      countryTarget: newCountry,
      budgetEur: newBudget,
      segment: newCountry === "PT" ? "S1/S2" : "S3",
      stage: "new_lead",
      score: newBudget >= 350000 ? 72 : 48,
      assignedAdvisor: session.displayName,
    });
    setNewName("");
    setNewEmail("");
  };

  const pendingDocs = docs.filter((d) => d.status === "awaiting_review" || d.status === "pending");

  return (
    <SecurityGate requireMfa allowedRoles={INTERNAL_STAFF_ROLES}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B1F3A] text-white text-xs font-bold">
            <Users className="w-3.5 h-3.5 text-[#D9A15E]" /> CRM Proprietário · Papel: {session.role}
          </span>
          <h1 className="text-3xl font-bold mt-2">{t.crm.title}</h1>
          <p className="text-sm text-[#4A556E] mt-1">{t.crm.subtitle}</p>
        </div>

        <div className="flex rounded-full bg-white border border-[#E3DED3] p-1">
          <button
            type="button"
            onClick={() => setTab("kanban")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
              tab === "kanban" ? "bg-[#0B1F3A] text-white" : "text-[#6B7690]"
            }`}
          >
            {t.crm.kanbanTab} ({leads.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("hitl")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
              tab === "hitl" ? "bg-[#B8793A] text-white" : "text-[#6B7690]"
            }`}
          >
            {t.crm.hitlTab} ({hitlQueue.filter((h) => h.status === "pending").length + pendingDocs.length})
          </button>
        </div>
      </div>

      {tab === "kanban" ? (
        <div className="space-y-6">
          {/* Cadastro rápido de lead */}
          <form
            onSubmit={handleAddLead}
            className="bg-white rounded-2xl border border-[#E3DED3] p-4 shadow-sm flex flex-wrap items-end gap-3"
          >
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-bold text-[#1D3557] mb-1">Nome do Comprador</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex.: Roberto Mendes"
                className="w-full border border-[#E3DED3] rounded-lg px-3 py-1.5 text-sm"
                required
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-bold text-[#1D3557] mb-1">E-mail</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="roberto@email.com"
                className="w-full border border-[#E3DED3] rounded-lg px-3 py-1.5 text-sm"
                required
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-bold text-[#1D3557] mb-1">Destino</label>
              <select
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value as CountryCode)}
                className="w-full border border-[#E3DED3] rounded-lg px-3 py-1.5 text-sm bg-white"
              >
                <option value="PT">Portugal</option>
                <option value="ES">Espanha</option>
              </select>
            </div>
            <div className="w-40">
              <label className="block text-xs font-bold text-[#1D3557] mb-1">Orçamento (€)</label>
              <input
                type="number"
                step={25000}
                value={newBudget}
                onChange={(e) => setNewBudget(Number(e.target.value))}
                className="w-full border border-[#E3DED3] rounded-lg px-3 py-1.5 text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-[#B8793A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> {t.crm.addLeadBtn}
            </button>
          </form>

          {/* Kanban horizontal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {STAGES.map((st) => {
              const colLeads = leads.filter((l) => l.stage === st.code);
              return (
                <div key={st.code} className="bg-[#F1ECE2] rounded-2xl p-3 space-y-3 min-h-[260px]">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">
                      {st.label}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-white text-xs font-bold text-[#0B1F3A]">
                      {colLeads.length}
                    </span>
                  </div>
                  {colLeads.map((ld) => (
                    <div
                      key={ld.id}
                      className="bg-white rounded-xl border border-[#E3DED3] p-3 shadow-sm space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <b className="text-sm text-[#0B1F3A]">{ld.name}</b>
                        <span className="px-1.5 py-0.5 rounded bg-[#E4F2EE] text-[#14564B] font-bold">
                          {ld.score}
                        </span>
                      </div>
                      <div className="text-[#6B7690]">
                        {ld.countryTarget} · € {ld.budgetEur.toLocaleString("pt-BR")}
                      </div>
                      <div className="text-[11px] text-[#4A556E]">{ld.origin}</div>
                      <select
                        aria-label={`Mover etapa ${ld.name}`}
                        value={ld.stage}
                        onChange={(e) => void moveLeadStage(ld.id, e.target.value as CrmStage)}
                        className="w-full border border-[#E3DED3] rounded px-2 py-1 text-[11px] bg-[#FAF7F2]"
                      >
                        {STAGES.map((opt) => (
                          <option key={opt.code} value={opt.code}>
                            → {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Escalonamentos da IA (HITL) */}
          <div className="bg-white rounded-2xl border border-[#E3DED3] p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#B3392F]" /> Fila HITL dos Agentes IA
            </h2>
            <div className="space-y-3">
              {hitlQueue.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    item.status === "pending"
                      ? item.severity === "critical"
                        ? "bg-[#F9E3E0]/50 border-[#EBB9B3]"
                        : "bg-[#FBF1D9]/60 border-[#EBD392]"
                      : "bg-[#FAF7F2] border-[#E3DED3]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#0B1F3A]">
                      {item.id.toUpperCase()} · {item.clientName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#0B1F3A] text-white font-bold uppercase text-[10px]">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[#4A556E]">
                    <b>Motivo:</b> {item.reason}
                  </p>
                  <p className="italic text-[#26324A]">&ldquo;{item.userQuestion}&rdquo;</p>
                  {item.status === "pending" ? (
                    <button
                      type="button"
                      onClick={() =>
                        void resolveHitl(
                          item.id,
                          `Revisado e respondido por ${session.displayName} (${session.role})`
                        )
                      }
                      className="px-3.5 py-1.5 rounded-full bg-[#1F7A6B] text-white font-bold cursor-pointer"
                    >
                      {t.crm.resolveHitlBtn}
                    </button>
                  ) : (
                    <div className="text-[#14564B] font-semibold">✓ {item.resolutionNote}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Revisão Documental do Cofre */}
          <div className="bg-white rounded-2xl border border-[#E3DED3] p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold">Revisão Jurídica / AML de Documentos do Cofre</h2>
            {pendingDocs.length === 0 ? (
              <p className="text-sm text-[#6B7690]">Nenhum documento aguardando revisão no momento.</p>
            ) : (
              <div className="space-y-3">
                {pendingDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-[#E3DED3] bg-[#FAF7F2] text-xs space-y-2"
                  >
                    <div className="font-bold text-sm text-[#0B1F3A]">{doc.title}</div>
                    <div className="text-[#6B7690]">
                      Arquivo: {doc.fileName} (v{doc.version}) · SHA-256: {doc.sha256.slice(0, 14)}...
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          void reviewVaultDocument(
                            doc.id,
                            "approved",
                            "Conferido e aprovado em revisão humana AML/Jurídica"
                          )
                        }
                        className="px-3.5 py-1.5 rounded-full bg-[#1F7A6B] text-white font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aprovar Documento
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void reviewVaultDocument(
                            doc.id,
                            "rejected",
                            "Solicitada nova versão mais legível"
                          )
                        }
                        className="px-3.5 py-1.5 rounded-full bg-[#B3392F] text-white font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Rejeitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </SecurityGate>
  );
}
