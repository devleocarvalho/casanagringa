"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, MapPin, ShieldCheck, Sparkles, SlidersHorizontal } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { CURATED_PROPERTIES, computePropertyMatch } from "@/data/properties";
import { simulateAcquisitionCosts, SimulationRegion } from "@/lib/taxCalculator";

export default function PropertiesPage() {
  const { locale, session } = useApp();
  const t = DICTIONARIES[locale];

  const [country, setCountry] = useState<"ALL" | "PT" | "ES">("ALL");
  const [maxBudget, setMaxBudget] = useState<number>(1000000);
  const [minDd, setMinDd] = useState<number>(80);
  const [sortBy, setSortBy] = useState<"match" | "dd" | "price">("match");
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  const items = useMemo(() => {
    const filtered = CURATED_PROPERTIES.filter((p) => {
      if (country !== "ALL" && p.country !== country) return false;
      if (p.priceEur > maxBudget) return false;
      if (p.ddScore < minDd) return false;
      return true;
    }).map((p) => {
      const match = computePropertyMatch(p, session.buyerProfile);
      const regionMap: Record<string, SimulationRegion> = {
        "PT-CONT": "PT-CONT-SEC",
        "ES-MD": "ES-MD",
        "ES-AN": "ES-AN",
        "ES-VC": "ES-VC",
        "ES-CT": "ES-CT",
      };
      const sim = simulateAcquisitionCosts({
        country: p.country,
        region: regionMap[p.regionCode] || "PT-CONT-SEC",
        priceEur: p.priceEur,
        condition: p.condition,
        ltvPct: 0,
        termYears: 25,
        annualRatePct: 3.6,
        brlPerEur: 6.3,
      });
      return { property: p, match, sim };
    });

    filtered.sort((a, b) => {
      if (sortBy === "match") return b.match.score - a.match.score;
      if (sortBy === "dd") return b.property.ddScore - a.property.ddScore;
      return a.property.priceEur - b.property.priceEur;
    });
    return filtered;
  }, [country, maxBudget, minDd, sortBy, session.buyerProfile]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#B8793A]">
            Fase 4 · Busca & Match Curado
          </span>
          <h1 className="text-3xl font-bold mt-1">{t.properties.title}</h1>
          <p className="text-sm text-[#4A556E] mt-1 max-w-2xl">{t.properties.subtitle}</p>
        </div>
        <Link
          href="/portal"
          className="px-4 py-2 rounded-full bg-[#0B1F3A] text-white text-xs font-semibold hover:bg-[#1D3557]"
        >
          Calibrar Perfil (Orçamento: € {session.buyerProfile.budgetMaxEur.toLocaleString("pt-BR")})
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-[#E3DED3] p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#1D3557] mb-1">
            {t.simulators.countryLabel}
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as "ALL" | "PT" | "ES")}
            className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="ALL">{t.properties.countryAll} (PT + ES)</option>
            <option value="PT">Portugal</option>
            <option value="ES">Espanha</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1D3557] mb-1">
            {t.properties.maxBudget}: € {maxBudget.toLocaleString("pt-BR")}
          </label>
          <input
            type="range"
            min={250000}
            max={1000000}
            step={25000}
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="w-full accent-[#B8793A]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1D3557] mb-1">
            {t.properties.minDd}
          </label>
          <select
            value={minDd}
            onChange={(e) => setMinDd(Number(e.target.value))}
            className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value={90}>90+ (Excelente)</option>
            <option value={80}>80+ (Pré-auditado)</option>
            <option value={0}>Todos</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1D3557] mb-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Ordenar por
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "match" | "dd" | "price")}
            className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="match">Maior Match % com Perfil</option>
            <option value="dd">Maior Score Due Diligence</option>
            <option value="price">Menor Preço (EUR)</option>
          </select>
        </div>
      </div>

      {/* Lista + Mapa */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map(({ property: p, match, sim }) => {
            const tr = p.translations[locale];
            const highlighted = selectedPinId === p.id;
            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition flex flex-col ${
                  highlighted ? "border-[#B8793A] ring-2 ring-[#B8793A]/30" : "border-[#E3DED3]"
                }`}
              >
                <div className="relative h-44 bg-[#0B1F3A] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imageSrc || "/images/hero-cascais-villa.jpg"}
                    alt={tr.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/80 via-[#0B1F3A]/20 to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold shadow ${
                        p.ddScore >= 90 ? "bg-[#1F7A6B]" : "bg-[#C98A12]"
                      }`}
                    >
                      {t.properties.ddLabel} {p.ddScore}/100
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#B8793A] text-xs font-bold flex items-center gap-1 shadow">
                      <Sparkles className="w-3 h-3" /> {match.score}% Match
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#D9A15E]" /> {p.neighborhood}, {p.city} ({p.country})
                    </span>
                    <span className="font-mono text-[11px] opacity-85">{p.canonicalRef}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="font-serif-brand text-2xl font-bold text-[#0B1F3A] tabular-nums">
                      € {p.priceEur.toLocaleString("pt-BR")}
                    </div>
                    <h3 className="text-base font-bold mt-0.5">{tr.title}</h3>
                    <p className="text-xs text-[#6B7690] mt-1">
                      {p.areaSqm} m² · {p.bedrooms} qts · {p.bathrooms} wc · Yield est. {p.estYieldPct}%
                    </p>
                    <p className="text-xs text-[#14564B] bg-[#E4F2EE] rounded-lg px-2.5 py-1.5 mt-2 font-medium">
                      {t.properties.totalCostEst}:{" "}
                      <b>€ {sim.totalAcquisitionCostEur.toLocaleString("pt-BR")}</b> (+{sim.extraCostsPct}%)
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#EFEBE2] flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#6B7690] flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> {p.partnerLicense}
                    </span>
                    <Link
                      href={`/imoveis/${p.id}`}
                      className="px-3.5 py-1.5 rounded-full bg-[#0B1F3A] text-white text-xs font-semibold hover:bg-[#1D3557]"
                    >
                      Analisar →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mapa Ibérico Interativo */}
        <aside className="lg:col-span-4 bg-white rounded-2xl border border-[#E3DED3] p-4 shadow-sm sticky top-28 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Mapa Ibérico Curado (PT + ES)</h3>
            <span className="text-xs text-[#6B7690]">{items.length} ativos</span>
          </div>

          <div className="relative h-80 rounded-xl bg-gradient-to-br from-[#DCE8E4] via-[#EAEFE7] to-[#E8E2D4] border border-[#D4CFC2] overflow-hidden">
            {/* Contorno estilizado da Península Ibérica */}
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-35">
              <path
                d="M15,18 L72,16 L88,28 L80,55 L64,78 L34,84 L16,74 L14,42 Z"
                fill="#0B1F3A"
              />
              <line x1="28" y1="18" x2="28" y2="78" stroke="#FAF7F2" strokeDasharray="2 2" strokeWidth="0.8" />
            </svg>

            <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-[#0B1F3A]/60">
              Portugal | Espanha
            </span>

            {items.map(({ property: p }) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPinId(p.id === selectedPinId ? null : p.id)}
                style={{ left: `${p.mapPos.x}%`, top: `${p.mapPos.y}%` }}
                className={`-translate-x-1/2 -translate-y-1/2 absolute px-2 py-0.5 rounded-full text-[11px] font-bold shadow cursor-pointer transition ${
                  selectedPinId === p.id
                    ? "bg-[#B8793A] text-white scale-110 z-10"
                    : "bg-[#0B1F3A] text-white hover:bg-[#1F7A6B]"
                }`}
              >
                € {Math.round(p.priceEur / 1000)}k
              </button>
            ))}
          </div>

          <div className="bg-[#E4F2EE] border border-[#BFE0D8] rounded-xl p-3 text-xs text-[#14564B] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Zero duplicidade MDM: listagens unificadas pelo código predial/catastral com parceiros licenciados (AMI/AICAT/RAIN).
            </span>
          </div>

          {selectedPinId && (() => {
            const sel = items.find((i) => i.property.id === selectedPinId);
            if (!sel) return null;
            return (
              <div className="bg-[#FAF7F2] border border-[#B8793A] rounded-xl p-3 text-xs space-y-1.5">
                <div className="font-bold text-[#0B1F3A]">{sel.property.translations[locale].title}</div>
                <div className="text-[#4A556E]">
                  € {sel.property.priceEur.toLocaleString("pt-BR")} · {sel.property.city} · DD {sel.property.ddScore}/100
                </div>
                <Link
                  href={`/imoveis/${sel.property.id}`}
                  className="inline-block font-bold text-[#B8793A] hover:underline"
                >
                  Abrir análise completa →
                </Link>
              </div>
            );
          })()}
        </aside>
      </div>
    </div>
  );
}
