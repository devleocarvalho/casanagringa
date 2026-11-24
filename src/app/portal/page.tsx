"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Bell, Download, Trash2, Save, ShieldCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { BuyerProfile, CountryCode } from "@/types/domain";
import { SecurityGate } from "@/components/SecurityGate";

export default function PortalPage() {
  const {
    locale,
    session,
    updateBuyerProfile,
    updateConsents,
    tasks,
    toggleTaskStatus,
    notifications,
    markAllNotificationsRead,
    exportAllUserDataJson,
    requestDataErasure,
  } = useApp();
  const t = DICTIONARIES[locale];

  const [profile, setProfile] = useState<BuyerProfile>(session.buyerProfile);
  const [savedMsg, setSavedMsg] = useState(false);
  const [erasureMsg, setErasureMsg] = useState(false);

  const completedCount = tasks.filter((x) => x.status === "done").length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);

  const toggleCountry = (c: CountryCode) => {
    setProfile((prev) => {
      const exists = prev.targetCountries.includes(c);
      const next = exists
        ? prev.targetCountries.filter((x) => x !== c)
        : [...prev.targetCountries, c];
      return { ...prev, targetCountries: next.length ? next : [c] };
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBuyerProfile(profile);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3500);
  };

  const handleDownloadExport = () => {
    const json = exportAllUserDataJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `casanagringa-dsr-export-${session.uid}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleErasure = async () => {
    await requestDataErasure();
    setErasureMsg(true);
  };

  return (
    <SecurityGate requireMfa>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F2EE] text-[#14564B] text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> Processo #DEAL-2027-0042 · MFA {session.mfaVerified ? "Ativo" : "Pendente"}
          </span>
          <h1 className="text-3xl font-bold mt-2">{t.portal.title}</h1>
          <p className="text-sm text-[#4A556E] mt-1">{t.portal.subtitle}</p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/cofre"
            className="px-4 py-2 rounded-full bg-[#B8793A] text-white text-xs font-semibold hover:bg-[#9E652D]"
          >
            Abrir Cofre Documental →
          </Link>
        </div>
      </div>

      {/* Stepper das 7 Fases */}
      <div className="bg-white rounded-2xl border border-[#E3DED3] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Progresso Geral da Compra: {progressPct}%</h2>
          <span className="text-xs font-semibold text-[#6B7690]">
            {completedCount} de {tasks.length} marcos concluídos
          </span>
        </div>
        <div className="w-full h-2.5 bg-[#F1ECE2] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1F7A6B] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
          {t.phases.list.map((p, idx) => {
            const phaseTasks = tasks.filter((tk) => tk.phase === p.code);
            const allDone = phaseTasks.length > 0 && phaseTasks.every((tk) => tk.status === "done");
            const active = phaseTasks.some((tk) => tk.status === "in_progress");
            return (
              <div
                key={p.code}
                className={`p-3 rounded-xl border text-xs ${
                  allDone
                    ? "bg-[#E4F2EE] border-[#BFE0D8] text-[#14564B]"
                    : active
                      ? "bg-[#FBF1D9] border-[#EBD392] text-[#6B4A00]"
                      : "bg-[#FAF7F2] border-[#E3DED3] text-[#6B7690]"
                }`}
              >
                <div className="font-bold">
                  {allDone ? "✓ " : `${idx + 1}. `}
                  {p.label.replace(/^\d+\.\s*/, "")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Checklist Vivo + Perfil Comprador */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E3DED3] p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-bold">{t.portal.timelineTitle}</h2>
            <div className="space-y-2.5">
              {tasks.map((tk) => (
                <button
                  key={tk.id}
                  type="button"
                  onClick={() => void toggleTaskStatus(tk.id)}
                  className="w-full text-left p-3.5 rounded-xl border border-[#E3DED3] hover:bg-[#FAF7F2] transition flex items-start gap-3 cursor-pointer"
                >
                  {tk.status === "done" ? (
                    <CheckCircle2 className="w-5 h-5 text-[#1F7A6B] shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#B8793A] shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div
                      className={`text-sm font-semibold ${
                        tk.status === "done" ? "line-through text-[#6B7690]" : "text-[#0B1F3A]"
                      }`}
                    >
                      {tk.title[locale]}
                    </div>
                    <div className="text-xs text-[#6B7690] mt-0.5 flex flex-wrap gap-3">
                      <span>Fase: {tk.phase}</span>
                      <span>Responsável: {tk.owner}</span>
                      <span>Prazo SLA: {tk.dueDate}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Perfil do Comprador */}
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-2xl border border-[#E3DED3] p-6 shadow-sm space-y-4"
          >
            <h2 className="text-xl font-bold">{t.portal.profileTitle}</h2>
            <div className="flex flex-wrap gap-2">
              {(["PT", "ES"] as CountryCode[]).map((c) => {
                const on = profile.targetCountries.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCountry(c)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border cursor-pointer ${
                      on
                        ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                        : "bg-white text-[#4A556E] border-[#E3DED3]"
                    }`}
                  >
                    {c === "PT" ? "🇵🇹 Portugal" : "🇪🇸 Espanha"}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1D3557] mb-1">
                  Orçamento Máximo (EUR)
                </label>
                <input
                  type="number"
                  step={25000}
                  value={profile.budgetMaxEur}
                  onChange={(e) => setProfile({ ...profile, budgetMaxEur: Number(e.target.value) })}
                  className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1D3557] mb-1">
                  Capital Próprio / Entrada (EUR)
                </label>
                <input
                  type="number"
                  step={10000}
                  value={profile.equityAvailableEur}
                  onChange={(e) =>
                    setProfile({ ...profile, equityAvailableEur: Number(e.target.value) })
                  }
                  className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1D3557] mb-1">Objetivo</label>
                <select
                  value={profile.purpose}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      purpose: e.target.value as BuyerProfile["purpose"],
                    })
                  }
                  className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="hybrid">Moradia Futura + Renda</option>
                  <option value="investment">Investimento (Aluguel)</option>
                  <option value="residence">Mudança / Residência Imediata</option>
                  <option value="vacation">Segunda Casa / Férias</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1D3557] mb-1">
                  Residência Fiscal Atual
                </label>
                <select
                  value={profile.taxResidence}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      taxResidence: e.target.value as BuyerProfile["taxResidence"],
                    })
                  }
                  className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="BR">Brasil</option>
                  <option value="PT">Portugal</option>
                  <option value="ES">Espanha</option>
                  <option value="OTHER">Outro País</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#0B1F3A] text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#1D3557] cursor-pointer"
            >
              <Save className="w-4 h-4" /> {t.portal.saveProfileBtn}
            </button>
            {savedMsg && (
              <p className="text-xs font-bold text-[#1F7A6B]">
                ✓ Perfil salvo! Os percentuais de Match na aba Imóveis foram recalculados.
              </p>
            )}
          </form>
        </div>

        {/* Coluna Direita: Concierge + LGPD/GDPR */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E3DED3] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#B8793A]" /> {t.portal.conciergeTitle}
              </h2>
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="text-xs font-semibold text-[#0B1F3A] underline cursor-pointer"
              >
                Marcar lidas
              </button>
            </div>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    n.read
                      ? "bg-[#FAF7F2] border-[#E3DED3] text-[#4A556E]"
                      : "bg-[#FBF1D9] border-[#EBD392] text-[#6B4A00]"
                  }`}
                >
                  <div className="font-bold">{n.title[locale]}</div>
                  <p>{n.body[locale]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* LGPD / GDPR Privacy Controls */}
          <div className="bg-white rounded-2xl border border-[#E3DED3] p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold">{t.portal.privacyTitle}</h2>
            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF7F2]">
                <span>Processamento por IA (nunca treina modelos)</span>
                <input
                  type="checkbox"
                  checked={session.consents.aiProcessingAccepted}
                  onChange={(e) =>
                    void updateConsents({
                      ...session.consents,
                      aiProcessingAccepted: e.target.checked,
                    })
                  }
                  className="accent-[#1F7A6B]"
                />
              </label>
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF7F2]">
                <span>Alertas e conteúdo por e-mail</span>
                <input
                  type="checkbox"
                  checked={session.consents.marketingEmail}
                  onChange={(e) =>
                    void updateConsents({
                      ...session.consents,
                      marketingEmail: e.target.checked,
                    })
                  }
                  className="accent-[#1F7A6B]"
                />
              </label>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadExport}
                className="w-full py-2.5 rounded-full border border-[#0B1F3A] text-[#0B1F3A] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#FAF7F2] cursor-pointer"
              >
                <Download className="w-4 h-4" /> {t.portal.exportDataBtn}
              </button>
              <button
                type="button"
                onClick={() => void handleErasure()}
                className="w-full py-2.5 rounded-full border border-[#B3392F] text-[#B3392F] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#F9E3E0] cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> {t.portal.deleteRequestBtn}
              </button>
              {erasureMsg && (
                <p className="text-xs text-[#1F7A6B] font-semibold">
                  ✓ Protocolo DSR registrado na trilha imutável.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </SecurityGate>
  );
}
