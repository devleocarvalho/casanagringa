"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, Lock } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function Footer() {
  const { locale } = useApp();

  return (
    <footer className="bg-[#0B1F3A] text-[#A9B6D0] mt-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div className="space-y-3">
          <div className="font-serif-brand text-xl font-bold text-white">
            Casa na <span className="text-[#D9A15E]">Gringa</span>
          </div>
          <p className="text-xs leading-relaxed">
            casanagringa.com · Lisboa · Madrid · São Paulo.
            {locale === "pt" &&
              " Plataforma de confiança para compra, investimento e gestão patrimonial no exterior."}
            {locale === "en" &&
              " Cross-border real estate trust platform for international property acquisition and asset management."}
            {locale === "es" &&
              " Plataforma de confianza inmobiliaria para compra e inversión internacional en Portugal y España."}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-white font-semibold">Plataforma</h4>
          <ul className="space-y-1.5 text-xs">
            <li><Link href="/imoveis" className="hover:text-white">Portal de Imóveis Curados</Link></li>
            <li><Link href="/simuladores" className="hover:text-white">Simuladores PT & ES</Link></li>
            <li><Link href="/portal" className="hover:text-white">Timeline 7 Fases</Link></li>
            <li><Link href="/cofre" className="hover:text-white">Cofre Documental</Link></li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="text-white font-semibold">Assessoria & Ferramentas</h4>
          <ul className="space-y-1.5 text-xs">
            <li><Link href="/assistentes" className="hover:text-white">Concierge Especialista</Link></li>
            <li><Link href="/portal" className="hover:text-white">Área do Cliente</Link></li>
            <li><Link href="/crm" className="hover:text-white">Mesa de Operações (Interno)</Link></li>
            <li><Link href="/seguranca" className="hover:text-white">Governança & Auditoria</Link></li>
          </ul>
        </div>

        <div className="space-y-2.5 text-xs">
          <h4 className="text-white font-semibold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#1F7A6B]" /> Zero Trust & Compliance
          </h4>
          <p className="leading-relaxed">
            LGPD · GDPR · AML/KYC. A plataforma não custodia fundos de imóveis em Fase 1; valores de sinais e escrituras fluem via contas escrow ou notários verificados.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex items-start gap-2 text-[#F5E6CD]">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#D9A15E]" />
            <span>
              Anti-BEC: Nunca alteramos IBAN por e-mail ou WhatsApp.
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-[#7F8FB0] px-4">
        © 2027 Casa na Gringa (casanagringa.com) · Todos os simuladores e agentes de IA têm caráter informativo e exigem confirmação com advogado/contador local.
      </div>
    </footer>
  );
}
