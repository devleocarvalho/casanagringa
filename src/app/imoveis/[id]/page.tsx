"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  CalendarCheck,
  Calculator,
  Bot,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { CURATED_PROPERTIES, computePropertyMatch } from "@/data/properties";
import { simulateAcquisitionCosts, SimulationRegion } from "@/lib/taxCalculator";

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { locale, session, addLead } = useApp();
  const t = DICTIONARIES[locale];
  const [visitRequested, setVisitRequested] = useState(false);

  const prop = CURATED_PROPERTIES.find((p) => p.id === id) || CURATED_PROPERTIES[0];
  const tr = prop.translations[locale];
  const match = computePropertyMatch(prop, session.buyerProfile);

  const regionMap: Record<string, SimulationRegion> = {
    "PT-CONT": "PT-CONT-SEC",
    "ES-MD": "ES-MD",
    "ES-AN": "ES-AN",
    "ES-VC": "ES-VC",
    "ES-CT": "ES-CT",
  };

  const sim = simulateAcquisitionCosts({
    country: prop.country,
    region: regionMap[prop.regionCode] || "PT-CONT-SEC",
    priceEur: prop.priceEur,
    condition: prop.condition,
    ltvPct: 70,
    termYears: 25,
    annualRatePct: 3.6,
    brlPerEur: 6.3,
  });

  const handleRequestVisit = async () => {
    await addLead({
      name: session.displayName,
      email: session.email,
      origin: `Interesse Imóvel ${prop.canonicalRef}`,
      countryTarget: prop.country,
      cityTarget: prop.city,
      budgetEur: prop.priceEur,
      segment: session.buyerProfile.taxResidence === "BR" ? "S1/S3 (Brasil)" : "S2 (PT)",
      stage: "property_selection",
      score: 85,
      assignedAdvisor: "Ana Beatriz Silva",
    });
    setVisitRequested(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Link href="/imoveis" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1F3A] hover:underline">
        <ArrowLeft className="w-4 h-4" /> Voltar para imóveis curados
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna principal */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header visual */}
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#0B1F3A] p-6 flex flex-col justify-between text-white shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={prop.imageSrc || "/images/hero-cascais-villa.jpg"}
              alt={tr.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/90 via-[#0B1F3A]/45 to-[#0B1F3A]/20" />
            <div className="relative z-10 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-[#1F7A6B] text-xs font-bold shadow">
                ✓ {prop.canonicalRef} · Score DD {prop.ddScore}/100
              </span>
              <span className="px-3 py-1 rounded-full bg-[#B8793A] text-xs font-bold flex items-center gap-1 shadow">
                <Sparkles className="w-3.5 h-3.5" /> {match.score}% Match ({match.reasons.join(", ") || "Base"})
              </span>
            </div>
            <div className="relative z-10">
              <span className="text-xs uppercase tracking-widest text-[#D9A15E] font-bold">
                {prop.neighborhood} · {prop.city}, {prop.country}
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold mt-1" style={{ color: "#FFFFFF" }}>
                {tr.title}
              </h1>
              <p className="text-sm text-white/85 mt-1">{tr.subtitle}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E3DED3] p-6 space-y-3">
            <h2 className="text-xl font-bold">Descrição e Contexto</h2>
            <p className="text-sm text-[#26324A] leading-relaxed">{tr.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-center">
              <div className="bg-[#FAF7F2] rounded-xl p-3">
                <div className="text-xs text-[#6B7690]">Área Útil</div>
                <div className="font-bold text-lg text-[#0B1F3A]">{prop.areaSqm} m²</div>
              </div>
              <div className="bg-[#FAF7F2] rounded-xl p-3">
                <div className="text-xs text-[#6B7690]">Quartos / WC</div>
                <div className="font-bold text-lg text-[#0B1F3A]">{prop.bedrooms} / {prop.bathrooms}</div>
              </div>
              <div className="bg-[#FAF7F2] rounded-xl p-3">
                <div className="text-xs text-[#6B7690]">Cert. Energético</div>
                <div className="font-bold text-lg text-[#0B1F3A]">Classe {prop.energyRating}</div>
              </div>
              <div className="bg-[#FAF7F2] rounded-xl p-3">
                <div className="text-xs text-[#6B7690]">Yield Bruto Est.</div>
                <div className="font-bold text-lg text-[#1F7A6B]">{prop.estYieldPct}% a.a.</div>
              </div>
            </div>
          </div>

          {/* Due Diligence Breakdown */}
          <div className="bg-white rounded-2xl border border-[#E3DED3] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t.properties.ddBreakdownTitle}</h2>
              <span className="px-3 py-1 rounded-full bg-[#E4F2EE] text-[#14564B] text-xs font-bold">
                Score {prop.ddScore}/100
              </span>
            </div>
            <p className="text-sm text-[#4A556E]">{tr.ddSummary}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prop.checks.map((chk, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-sm ${
                    chk.status === "pass"
                      ? "bg-[#E4F2EE]/60 border-[#BFE0D8] text-[#14564B]"
                      : "bg-[#FBF1D9] border-[#EBD392] text-[#6B4A00]"
                  }`}
                >
                  {chk.status === "pass" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  <span className="font-medium">{chk.label[locale]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown de Impostos & Custos */}
          <div className="bg-white rounded-2xl border border-[#E3DED3] p-6 space-y-4">
            <h2 className="text-xl font-bold">Transparência de Custos Estimados na Compra</h2>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[#EFEBE2]">
                <tr>
                  <td className="py-2.5">Preço do imóvel</td>
                  <td className="py-2.5 text-right font-semibold tabular-nums">€ {sim.priceEur.toLocaleString("pt-BR")}</td>
                </tr>
                <tr>
                  <td className="py-2.5">{sim.transferTaxLabel}</td>
                  <td className="py-2.5 text-right tabular-nums">€ {sim.transferTaxEur.toLocaleString("pt-BR")}</td>
                </tr>
                <tr>
                  <td className="py-2.5">{sim.stampOrAjdLabel}</td>
                  <td className="py-2.5 text-right tabular-nums">€ {sim.stampOrAjdEur.toLocaleString("pt-BR")}</td>
                </tr>
                <tr>
                  <td className="py-2.5">Notário, Registo & Advogado/DD (est.)</td>
                  <td className="py-2.5 text-right tabular-nums">
                    € {(sim.notaryRegistryEur + sim.legalAndDdEur).toLocaleString("pt-BR")}
                  </td>
                </tr>
                <tr className="font-bold text-[#0B1F3A] bg-[#FAF7F2]">
                  <td className="py-3 px-2">Total Estimado à Vista (sem crédito)</td>
                  <td className="py-3 px-2 text-right tabular-nums">
                    € {(sim.totalAcquisitionCostEur - sim.bankSetupAndMortgageStampEur).toLocaleString("pt-BR")}
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-[#6B7690]">{t.simulators.disclaimer}</p>
          </div>
        </div>

        {/* Sidebar CTA & Transparência */}
        <aside className="lg:col-span-4 space-y-5 sticky top-28">
          <div className="bg-white rounded-2xl border border-[#E3DED3] p-6 shadow-sm space-y-4">
            <div className="font-serif-brand text-3xl font-bold text-[#0B1F3A] tabular-nums">
              € {prop.priceEur.toLocaleString("pt-BR")}
            </div>

            <div className="bg-[#FAF7F2] border border-[#E3DED3] rounded-xl p-3.5 text-xs space-y-1">
              <div className="font-bold text-[#0B1F3A] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1F7A6B]" /> {t.properties.transparencyTitle}
              </div>
              <p className="text-[#4A556E] leading-relaxed">{prop.commissionDisclosure[locale]}</p>
              <p className="text-[#6B7690] pt-1">
                Parceiro: <b>{prop.partnerBroker}</b> ({prop.partnerLicense})
              </p>
            </div>

            {visitRequested ? (
              <div className="bg-[#E4F2EE] border border-[#BFE0D8] rounded-xl p-4 text-xs text-[#14564B] font-semibold">
                ✓ Solicitação registrada no CRM! Nosso consultor agendará o vídeo-tour técnico em até 2h úteis.
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRequestVisit}
                className="w-full py-3 rounded-full bg-[#B8793A] hover:bg-[#9E652D] text-white font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" /> {t.properties.scheduleVisit}
              </button>
            )}

            <Link
              href={`/simuladores?country=${prop.country}&price=${prop.priceEur}`}
              className="w-full py-2.5 rounded-full border border-[#0B1F3A] text-[#0B1F3A] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#FAF7F2]"
            >
              <Calculator className="w-4 h-4" /> {t.properties.simulateThis}
            </Link>

            <Link
              href="/assistentes"
              className="w-full py-2.5 rounded-full bg-[#F1ECE2] text-[#0B1F3A] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#E3DED3]"
            >
              <Bot className="w-4 h-4 text-[#1F7A6B]" /> {t.properties.askAi}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
