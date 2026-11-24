"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, AlertOctagon, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { verifyAuditChain } from "@/lib/auditChain";
import { SecurityGate } from "@/components/SecurityGate";

export default function SecurityAuditPage() {
  const { locale, auditLogs, session } = useApp();
  const t = DICTIONARIES[locale];

  const [verifyResult, setVerifyResult] = useState<{
    valid: boolean;
    checkedCount: number;
    brokenSeq?: number;
  } | null>(null);

  const handleVerifyChain = async () => {
    const res = await verifyAuditChain(auditLogs);
    setVerifyResult(res);
  };

  return (
    <SecurityGate requireMfa>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F2EE] text-[#14564B] text-xs font-bold">
            <Lock className="w-3.5 h-3.5" /> Append-Only Hash-Chain + WORM Readiness
          </span>
          <h1 className="text-3xl font-bold mt-2">{t.security.title}</h1>
          <p className="text-sm text-[#4A556E] mt-1">{t.security.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => void handleVerifyChain()}
          className="px-5 py-2.5 rounded-full bg-[#1F7A6B] hover:bg-[#14564B] text-white text-sm font-semibold flex items-center gap-2 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" /> {t.security.verifyBtn}
        </button>
      </div>

      {verifyResult && (
        <div
          className={`rounded-2xl border p-4 text-sm font-bold flex items-center gap-2.5 ${
            verifyResult.valid
              ? "bg-[#E4F2EE] border-[#BFE0D8] text-[#14564B]"
              : "bg-[#F9E3E0] border-[#EBB9B3] text-[#7D2119]"
          }`}
        >
          {verifyResult.valid ? (
            <>
              <CheckCircle2 className="w-5 h-5" /> {t.security.chainValid} ({verifyResult.checkedCount}{" "}
              eventos verificados)
            </>
          ) : (
            <>
              <AlertOctagon className="w-5 h-5" /> {t.security.chainInvalid} (Seq #
              {verifyResult.brokenSeq})
            </>
          )}
        </div>
      )}

      {/* KPIs Zero Trust */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E3DED3] p-5">
          <div className="text-xs font-bold uppercase text-[#6B7690]">Eventos Encadeados</div>
          <div className="font-serif-brand text-3xl font-bold text-[#0B1F3A] mt-1">
            {auditLogs.length}
          </div>
          <div className="text-xs text-[#1F7A6B] mt-1">SHA-256 determinístico</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E3DED3] p-5">
          <div className="text-xs font-bold uppercase text-[#6B7690]">Cobertura MFA</div>
          <div className="font-serif-brand text-3xl font-bold text-[#1F7A6B] mt-1">
            {session.mfaVerified ? "100%" : "Pendente"}
          </div>
          <div className="text-xs text-[#6B7690] mt-1">Identity Platform / TOTP</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E3DED3] p-5">
          <div className="text-xs font-bold uppercase text-[#6B7690]">Política Anti-BEC</div>
          <div className="font-serif-brand text-3xl font-bold text-[#0B1F3A] mt-1">Ativa</div>
          <div className="text-xs text-[#6B7690] mt-1">Dupla assinatura + Bloqueio IA</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E3DED3] p-5">
          <div className="text-xs font-bold uppercase text-[#6B7690]">Residência / Privacidade</div>
          <div className="font-serif-brand text-3xl font-bold text-[#0B1F3A] mt-1">UE · LGPD</div>
          <div className="text-xs text-[#6B7690] mt-1">Exportação & DSR integrados</div>
        </div>
      </div>

      {/* Tabela Cronológica de Auditoria */}
      <div className="bg-white rounded-2xl border border-[#E3DED3] p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold">{t.security.auditTableTitle}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#E3DED3] text-[#6B7690] uppercase">
                <th className="py-2.5 text-left">Seq</th>
                <th className="py-2.5 text-left">Data/Hora (UTC)</th>
                <th className="py-2.5 text-left">Ator (Papel)</th>
                <th className="py-2.5 text-left">Ação</th>
                <th className="py-2.5 text-left">Resumo</th>
                <th className="py-2.5 text-left">Prev Hash</th>
                <th className="py-2.5 text-left">Entry Hash (SHA-256)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEBE2]">
              {[...auditLogs].reverse().map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF7F2]">
                  <td className="py-2.5 font-mono font-bold text-[#0B1F3A]">#{log.seq}</td>
                  <td className="py-2.5 whitespace-nowrap text-[#6B7690]">
                    {log.timestamp.replace("T", " ").slice(0, 19)}
                  </td>
                  <td className="py-2.5">
                    <b>{log.actorName}</b>{" "}
                    <span className="px-1.5 py-0.5 rounded bg-[#F1ECE2] text-[10px]">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="py-2.5 font-mono font-semibold text-[#1F7A6B]">{log.action}</td>
                  <td className="py-2.5 text-[#26324A]">{log.summary}</td>
                  <td className="py-2.5 font-mono text-[#6B7690]">{log.prevHash.slice(0, 10)}...</td>
                  <td className="py-2.5 font-mono font-bold text-[#0B1F3A]">
                    {log.entryHash.slice(0, 14)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </SecurityGate>
  );
}
