"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Menu, X, Lock, User, Landmark } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { Locale, UserRole } from "@/types/domain";

const INTERNAL_ROUTES = ["/portal", "/cofre", "/assistentes", "/crm", "/seguranca"];

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale, session, firebaseReady, switchSandboxRole } = useApp();
  const t = DICTIONARIES[locale];
  const [mobileOpen, setMobileOpen] = useState(false);

  const isInternalWorkspace = INTERNAL_ROUTES.some((r) => pathname?.startsWith(r));

  const publicLinks = [
    { href: "/imoveis", label: t.nav.properties },
    { href: "/simuladores", label: t.nav.simulators },
    {
      href: "/#como-funciona",
      label: locale === "pt" ? "Como Funciona" : locale === "es" ? "Cómo Funciona" : "How It Works",
    },
    { href: "/assistentes", label: "Concierge" },
  ];

  const workspaceLinks = [
    { href: "/portal", label: t.nav.portal },
    { href: "/cofre", label: t.nav.vault },
    { href: "/assistentes", label: t.nav.assistants },
    { href: "/crm", label: t.nav.crm },
    { href: "/seguranca", label: t.nav.security },
  ];

  return (
    <div className="sticky top-0 z-50">
      {/* Barra principal de luxo: enxuta, respirada e acolhedora */}
      <header className="bg-[#FAF7F2]/92 backdrop-blur-md border-b border-[#E3DED3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <span className="w-9 h-9 rounded-xl bg-[#0B1F3A] text-[#D9A15E] grid place-items-center shadow-sm group-hover:bg-[#1D3557] transition">
              <Landmark className="w-4 h-4" />
            </span>
            <div className="leading-tight">
              <span className="font-serif-brand text-xl font-bold tracking-tight text-[#0B1F3A] block">
                Casa na <span className="text-[#B8793A]">Gringa</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#6B7690] hidden sm:block">
                Private Real Estate · PT · ES
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {publicLinks.map((l) => {
              const active =
                pathname === l.href ||
                (l.href !== "/" && !l.href.includes("#") && pathname?.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm font-medium transition py-1 border-b-2 ${
                    active
                      ? "text-[#0B1F3A] border-[#B8793A] font-semibold"
                      : "text-[#26324A] border-transparent hover:text-[#0B1F3A] hover:border-[#D9A15E]"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Switcher discreto PT | EN | ES */}
            <div className="flex items-center border border-[#E3DED3] rounded-full p-0.5 bg-white/80">
              {(["pt", "en", "es"] as Locale[]).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocale(loc)}
                  className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-full transition cursor-pointer ${
                    locale === loc
                      ? "bg-[#0B1F3A] text-white"
                      : "text-[#6B7690] hover:text-[#0B1F3A]"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            <Link
              href={session.mfaVerified ? "/portal" : "/auth"}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#1D3557] shadow-sm transition"
            >
              {session.mfaVerified ? (
                <User className="w-3.5 h-3.5 text-[#D9A15E]" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-[#D9A15E]" />
              )}
              {locale === "pt"
                ? "Área do Cliente"
                : locale === "es"
                  ? "Área Privada"
                  : "Client Portal"}
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg border border-[#E3DED3] text-[#0B1F3A]"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-[#E3DED3] px-4 py-4 space-y-2">
            {publicLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-[#0B1F3A] hover:bg-[#FAF7F2]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/portal"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#B8793A]"
            >
              {locale === "pt"
                ? "Área do Cliente"
                : locale === "es"
                  ? "Área Privada"
                  : "Client Portal"}
            </Link>
          </div>
        )}
      </header>

      {/* Sub-barra técnica/operacional exibida APENAS dentro das rotas privadas */}
      {isInternalWorkspace && (
        <div className="bg-[#0B1F3A] text-[#DCE4F2] text-xs py-2 px-4 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {workspaceLinks.map((w) => {
                const active = pathname === w.href || pathname?.startsWith(w.href);
                return (
                  <Link
                    key={w.href}
                    href={w.href}
                    className={`px-3 py-1 rounded-full font-medium transition ${
                      active
                        ? "bg-[#B8793A] text-white font-semibold"
                        : "text-[#C6D1E6] hover:bg-white/10"
                    }`}
                  >
                    {w.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden xl:inline-flex items-center gap-1.5 text-[#9AA8C4]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1F7A6B]" />
                {firebaseReady ? "Firebase Online" : "Modo Sandbox Local"}
              </span>
              {!firebaseReady && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[#9AA8C4]">{t.mode.roleSwitcher}</span>
                  <select
                    aria-label="RBAC Role Switcher"
                    value={session.role}
                    onChange={(e) => switchSandboxRole(e.target.value as UserRole)}
                    className="bg-[#1D3557] text-white border border-white/20 rounded px-2 py-0.5 text-xs focus:outline-none"
                  >
                    <option value="client">client (Comprador)</option>
                    <option value="advisor">advisor (Consultor)</option>
                    <option value="legal_reviewer">legal_reviewer (Advogado)</option>
                    <option value="compliance_officer">compliance_officer (AML)</option>
                    <option value="admin">admin (Plataforma)</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
