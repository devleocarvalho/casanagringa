"use client";

import React from "react";
import Link from "next/link";
import { Lock, ShieldAlert } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types/domain";

interface SecurityGateProps {
  requireMfa?: boolean;
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}

export function SecurityGate({
  requireMfa = true,
  allowedRoles,
  children,
}: SecurityGateProps) {
  const { session, locale, firebaseReady, switchSandboxRole } = useApp();

  if (requireMfa && !session.mfaVerified) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border-2 border-[#B8793A] p-8 text-center space-y-4 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-[#FBF1D9] text-[#B8793A] grid place-items-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">
            {locale === "pt"
              ? "Verificação MFA Obrigatória (Zero Trust)"
              : locale === "es"
                ? "Verificación MFA Obligatoria"
                : "Mandatory MFA Verification"}
          </h1>
          <p className="text-sm text-[#4A556E] leading-relaxed">
            {locale === "pt"
              ? "Para proteger passaportes, comprovantes financeiros e registros auditáveis, finalize a verificação em duas etapas antes de acessar esta área."
              : locale === "es"
                ? "Para proteger documentos sensibles y registros auditables, completa el segundo factor MFA antes de continuar."
                : "To protect passports, financial records, and audit trails, complete 2-step MFA verification before entering."}
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B1F3A] text-white text-sm font-semibold hover:bg-[#1D3557]"
          >
            <Lock className="w-4 h-4 text-[#D9A15E]" />
            {locale === "pt" ? "Autenticar com MFA" : "Verify MFA"}
          </Link>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border-2 border-[#B3392F] p-8 text-center space-y-4 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-[#F9E3E0] text-[#B3392F] grid place-items-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#7D2119]">
            Acesso Restrito por Papel (RBAC)
          </h1>
          <p className="text-sm text-[#4A556E] leading-relaxed">
            Seu papel atual (<code>{session.role}</code>) não possui autorização para esta mesa operacional. Apenas{" "}
            <code>{allowedRoles.join(", ")}</code> podem acessar e aprovar registros aqui.
          </p>
          {!firebaseReady && (
            <div className="pt-2 space-y-2">
              <p className="text-xs text-[#6B7690]">
                No Modo Sandbox, você pode simular um papel autorizado abaixo para testar o CRM/HITL:
              </p>
              <button
                type="button"
                onClick={() => switchSandboxRole(allowedRoles[0])}
                className="px-5 py-2.5 rounded-full bg-[#0B1F3A] text-white text-xs font-semibold cursor-pointer hover:bg-[#1D3557]"
              >
                Simular papel {allowedRoles[0]} agora
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
