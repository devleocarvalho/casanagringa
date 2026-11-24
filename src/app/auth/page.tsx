"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, KeyRound, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";

export default function AuthPage() {
  const router = useRouter();
  const { locale, session, loginEmail, signupEmail, loginGoogle, verifyMfaCode, logout } = useApp();
  const t = DICTIONARIES[locale];

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("marcelo@casanagringa.com");
  const [password, setPassword] = useState("SegurancaZeroTrust2027!");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [aiAccepted, setAiAccepted] = useState(true);
  const [marketingAccepted, setMarketingAccepted] = useState(false);

  const [mfaStep, setMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState("482910");
  const [error, setError] = useState<string | null>(null);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup") {
      if (!termsAccepted) {
        setError("O aceite dos Termos de Uso e Política de Privacidade é obrigatório.");
        return;
      }
      const res = await signupEmail(name || "Novo Comprador", email, password, {
        termsAccepted,
        aiProcessingAccepted: aiAccepted,
        marketingEmail: marketingAccepted,
        partnerAutoShare: false,
        updatedAt: new Date().toISOString(),
      });
      if (res.error) {
        setError(res.error);
        return;
      }
      setMfaStep(true);
    } else {
      const res = await loginEmail(email, password);
      if (res.error) {
        setError(res.error);
        return;
      }
      setMfaStep(true);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    const res = await loginGoogle();
    if (res.error) {
      setError(res.error);
      return;
    }
    setMfaStep(true);
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await verifyMfaCode(mfaCode);
    if (!res.ok) {
      setError(res.error || "Código inválido.");
      return;
    }
    router.push("/portal");
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-[#E3DED3] shadow-lg p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F2EE] text-[#14564B] text-xs font-bold">
            <Lock className="w-3.5 h-3.5" /> Zero Trust · Identity Platform + TOTP
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold">{t.auth.title}</h1>
          <p className="text-sm text-[#4A556E]">{t.auth.subtitle}</p>
        </div>

        {session.mfaVerified && !mfaStep ? (
          <div className="space-y-4">
            <div className="bg-[#E4F2EE] border border-[#BFE0D8] rounded-xl p-4 text-sm text-[#14564B] space-y-1">
              <div className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Sessão Verificada com MFA
              </div>
              <p>Usuário: <b>{session.displayName}</b> ({session.email})</p>
              <p>Papel RBAC: <code>{session.role}</code> · Modo: <code>{session.authMode}</code></p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/portal")}
                className="flex-1 py-2.5 rounded-full bg-[#0B1F3A] text-white text-sm font-semibold cursor-pointer"
              >
                Ir para Meu Painel
              </button>
              <button
                type="button"
                onClick={() => {
                  void logout();
                  setMfaStep(false);
                }}
                className="px-5 py-2.5 rounded-full border border-[#B3392F] text-[#B3392F] text-sm font-semibold cursor-pointer"
              >
                Sair
              </button>
            </div>
          </div>
        ) : mfaStep ? (
          <form onSubmit={handleMfaVerify} className="space-y-4">
            <div className="bg-[#FBF1D9] border border-[#EBD392] rounded-xl p-4 text-xs text-[#6B4A00] flex items-start gap-2.5">
              <KeyRound className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <b className="text-sm block mb-1">{t.auth.mfaTitle}</b>
                {t.auth.mfaDesc}
                {session.authMode === "sandbox" && (
                  <p className="mt-1 font-semibold">
                    (Modo Sandbox: use qualquer código de 6 dígitos, ex. <code>482910</code>)
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1D3557] mb-1">
                {t.auth.mfaCodeLabel}
              </label>
              <input
                type="text"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="w-full border border-[#E3DED3] rounded-lg px-4 py-3 text-center text-2xl font-mono tracking-[0.4em]"
                required
              />
            </div>

            {error && <p className="text-xs text-[#B3392F] font-semibold">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#1F7A6B] hover:bg-[#14564B] text-white font-semibold text-sm transition cursor-pointer"
            >
              {t.auth.mfaVerifyBtn}
            </button>
          </form>
        ) : (
          <>
            <div className="flex rounded-full bg-[#FAF7F2] p-1 border border-[#E3DED3]">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-2 text-xs font-bold rounded-full cursor-pointer ${
                  mode === "login" ? "bg-[#0B1F3A] text-white" : "text-[#6B7690]"
                }`}
              >
                {t.auth.loginBtn}
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 text-xs font-bold rounded-full cursor-pointer ${
                  mode === "signup" ? "bg-[#0B1F3A] text-white" : "text-[#6B7690]"
                }`}
              >
                {t.auth.signupBtn}
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-[#1D3557] mb-1">
                    {t.auth.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex.: Marcelo Silva"
                    className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1D3557] mb-1">
                  {t.auth.emailLabel}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1D3557] mb-1">
                  {t.auth.passwordLabel}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>

              {mode === "signup" && (
                <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#E3DED3] space-y-2 text-xs">
                  <div className="font-bold text-[#0B1F3A] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#1F7A6B]" /> {t.auth.consentTitle}
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 accent-[#1F7A6B]"
                    />
                    <span>Aceito os Termos de Uso e Política de Privacidade (armazenamento criptografado na UE).</span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiAccepted}
                      onChange={(e) => setAiAccepted(e.target.checked)}
                      className="mt-0.5 accent-[#1F7A6B]"
                    />
                    <span>Autorizo apoio pelos Agentes IA (meus dados nunca treinam modelos públicos).</span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingAccepted}
                      onChange={(e) => setMarketingAccepted(e.target.checked)}
                      className="mt-0.5 accent-[#1F7A6B]"
                    />
                    <span>Opcional: receber alertas de oportunidades e mudanças fiscais.</span>
                  </label>
                </div>
              )}

              {error && <p className="text-xs text-[#B3392F] font-semibold">{error}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#B8793A] hover:bg-[#9E652D] text-white font-semibold text-sm transition cursor-pointer"
              >
                {mode === "login" ? t.auth.loginBtn : t.auth.signupBtn}
              </button>
            </form>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-[#E3DED3]" />
              <span className="shrink mx-3 text-xs text-[#6B7690]">ou</span>
              <div className="flex-grow border-t border-[#E3DED3]" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              className="w-full py-2.5 rounded-full border border-[#0B1F3A] text-[#0B1F3A] text-sm font-semibold hover:bg-[#FAF7F2] transition cursor-pointer"
            >
              {t.auth.googleBtn}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
