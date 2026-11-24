"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, Calculator } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { simulateAcquisitionCosts, SimulationRegion } from "@/lib/taxCalculator";
import { CITY_BENCHMARKS } from "@/data/properties";
import { CountryCode } from "@/types/domain";

function SimulatorsInner() {
  const searchParams = useSearchParams();
  const initialCountry = searchParams.get("country") === "ES" ? "ES" : "PT";
  const paramPrice = Number(searchParams.get("price"));
  const initialPrice = !Number.isNaN(paramPrice) && paramPrice >= 50000 ? paramPrice : 420000;

  const { locale, session, addLead } = useApp();
  const t = DICTIONARIES[locale];

  const [country, setCountry] = useState<CountryCode>(initialCountry);
  const [region, setRegion] = useState<SimulationRegion>(
    initialCountry === "ES" ? "ES-MD" : "PT-CONT-SEC"
  );
  const [priceEur, setPriceEur] = useState<number>(initialPrice);
  const [condition, setCondition] = useState<"used" | "new_build">("used");
  const [ltvPct, setLtvPct] = useState<number>(70);
  const [termYears, setTermYears] = useState<number>(25);
  const [annualRatePct, setAnnualRatePct] = useState<number>(3.6);
  const [brlPerEur, setBrlPerEur] = useState<number>(6.3);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleCountryChange = (next: CountryCode) => {
    setCountry(next);
    setRegion(next === "PT" ? "PT-CONT-SEC" : "ES-MD");
  };

  const result = useMemo(
    () =>
      simulateAcquisitionCosts({
        country,
        region,
        priceEur,
        condition,
        ltvPct,
        termYears,
        annualRatePct,
        brlPerEur,
      }),
    [country, region, priceEur, condition, ltvPct, termYears, annualRatePct, brlPerEur]
  );

  const handleSaveSimulation = async () => {
    await addLead({
      name: session.displayName,
      email: session.email,
      origin: `Simulador ${country} (${region})`,
      countryTarget: country,
      budgetEur: priceEur,
      segment: session.buyerProfile.taxResidence === "BR" ? "S1 (Simulador)" : "S2 (Simulador)",
      stage: "qualified_mql",
      score: priceEur >= 350000 ? 68 : 48,
      assignedAdvisor: "Ana Beatriz Silva",
    });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#B8793A]">
          Fase 1–2 · Transparência de Custos
        </span>
        <h1 className="text-3xl font-bold mt-1">{t.simulators.title}</h1>
        <p className="text-sm text-[#4A556E] mt-1 max-w-2xl">{t.simulators.subtitle}</p>
      </div>

      {/* Simulador Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E3DED3] p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#B8793A]" /> Parâmetros da Compra
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1D3557] mb-1">
                {t.simulators.countryLabel}
              </label>
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value as CountryCode)}
                className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="PT">Portugal</option>
                <option value="ES">Espanha</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1D3557] mb-1">
                {t.simulators.regionLabel}
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as SimulationRegion)}
                className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm bg-white"
              >
                {country === "PT" ? (
                  <>
                    <option value="PT-CONT-SEC">{t.simulators.secondaryHome}</option>
                    <option value="PT-CONT-HPP">{t.simulators.primaryHome}</option>
                  </>
                ) : (
                  <>
                    <option value="ES-MD">Madrid (ITP 6%)</option>
                    <option value="ES-AN">Andaluzia / Málaga (ITP 7%)</option>
                    <option value="ES-VC">Valência (ITP 9% / 11%)</option>
                    <option value="ES-CT">Catalunha / BCN (ITP 10–13%)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1D3557] mb-1">
                {t.simulators.priceLabel}
              </label>
              <input
                type="number"
                min={100000}
                step={10000}
                value={priceEur}
                onChange={(e) => setPriceEur(Number(e.target.value) || 0)}
                className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1D3557] mb-1">
                {t.simulators.conditionLabel}
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as "used" | "new_build")}
                className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="used">{t.simulators.used}</option>
                <option value="new_build">{t.simulators.newBuild}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1D3557] mb-1">
                {t.simulators.ltvLabel}
              </label>
              <input
                type="number"
                min={0}
                max={80}
                step={5}
                value={ltvPct}
                onChange={(e) => setLtvPct(Number(e.target.value) || 0)}
                className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1D3557] mb-1">
                {t.simulators.yearsLabel}
              </label>
              <input
                type="number"
                min={5}
                max={35}
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value) || 25)}
                className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1D3557] mb-1">
                {t.simulators.rateLabel}
              </label>
              <input
                type="number"
                step={0.1}
                min={0}
                max={12}
                value={annualRatePct}
                onChange={(e) => setAnnualRatePct(Number(e.target.value) || 0)}
                className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1D3557] mb-1">
                {t.simulators.fxLabel}
              </label>
              <input
                type="number"
                step={0.05}
                min={1}
                value={brlPerEur}
                onChange={(e) => setBrlPerEur(Number(e.target.value) || 6.3)}
                className="w-full border border-[#E3DED3] rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveSimulation}
            className="w-full py-3 rounded-full bg-[#B8793A] hover:bg-[#9E652D] text-white font-semibold text-sm transition cursor-pointer"
          >
            {t.simulators.saveToCrm}
          </button>

          {savedBanner && (
            <div className="bg-[#E4F2EE] border border-[#BFE0D8] rounded-xl p-3 text-xs text-[#14564B] flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {t.simulators.savedSuccess}
            </div>
          )}
        </div>

        {/* Resultado Detalhado */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E3DED3] p-6 shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#E3DED3]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7690]">
                Capital Próprio Inicial
              </div>
              <div className="font-serif-brand text-2xl font-bold text-[#0B1F3A] mt-1 tabular-nums">
                € {result.totalCashNeededEur.toLocaleString("pt-BR")}
              </div>
              <div className="text-xs text-[#6B7690]">
                ≈ R$ {result.totalCashNeededBrl.toLocaleString("pt-BR")}
              </div>
            </div>

            <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#E3DED3]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7690]">
                Custos + Impostos ({result.extraCostsPct}%)
              </div>
              <div className="font-serif-brand text-2xl font-bold text-[#B8793A] mt-1 tabular-nums">
                € {result.extraCostsEur.toLocaleString("pt-BR")}
              </div>
              <div className="text-xs text-[#6B7690]">
                Total operação: € {result.totalAcquisitionCostEur.toLocaleString("pt-BR")}
              </div>
            </div>

            <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#E3DED3]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7690]">
                Prestação Est. ({ltvPct}% LTV)
              </div>
              <div className="font-serif-brand text-2xl font-bold text-[#1F7A6B] mt-1 tabular-nums">
                € {result.monthlyMortgageEur.toLocaleString("pt-BR")}/mês
              </div>
              <div className="text-xs text-[#6B7690]">
                Renda sug. ≥ € {result.minSuggestedMonthlyIncomeEur.toLocaleString("pt-BR")}/mês
              </div>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E3DED3] text-xs uppercase text-[#6B7690]">
                <th className="py-2 text-left">Rubrica</th>
                <th className="py-2 text-right">EUR</th>
                <th className="py-2 text-right">BRL (Ref. {brlPerEur.toFixed(2)})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEBE2] tabular-nums">
              <tr>
                <td className="py-2.5">Valor do imóvel</td>
                <td className="py-2.5 text-right">€ {result.priceEur.toLocaleString("pt-BR")}</td>
                <td className="py-2.5 text-right">R$ {Math.round(result.priceEur * brlPerEur).toLocaleString("pt-BR")}</td>
              </tr>
              <tr>
                <td className="py-2.5">{result.transferTaxLabel}</td>
                <td className="py-2.5 text-right">€ {result.transferTaxEur.toLocaleString("pt-BR")}</td>
                <td className="py-2.5 text-right">R$ {Math.round(result.transferTaxEur * brlPerEur).toLocaleString("pt-BR")}</td>
              </tr>
              <tr>
                <td className="py-2.5">{result.stampOrAjdLabel}</td>
                <td className="py-2.5 text-right">€ {result.stampOrAjdEur.toLocaleString("pt-BR")}</td>
                <td className="py-2.5 text-right">R$ {Math.round(result.stampOrAjdEur * brlPerEur).toLocaleString("pt-BR")}</td>
              </tr>
              <tr>
                <td className="py-2.5">Notário, Registo Predial & Gestoría (est.)</td>
                <td className="py-2.5 text-right">€ {result.notaryRegistryEur.toLocaleString("pt-BR")}</td>
                <td className="py-2.5 text-right">R$ {Math.round(result.notaryRegistryEur * brlPerEur).toLocaleString("pt-BR")}</td>
              </tr>
              <tr>
                <td className="py-2.5">Advocacia Independente + Due Diligence (est.)</td>
                <td className="py-2.5 text-right">€ {result.legalAndDdEur.toLocaleString("pt-BR")}</td>
                <td className="py-2.5 text-right">R$ {Math.round(result.legalAndDdEur * brlPerEur).toLocaleString("pt-BR")}</td>
              </tr>
              {result.bankSetupAndMortgageStampEur > 0 && (
                <tr>
                  <td className="py-2.5">Imposto/Comissão abertura crédito & avaliação</td>
                  <td className="py-2.5 text-right">€ {result.bankSetupAndMortgageStampEur.toLocaleString("pt-BR")}</td>
                  <td className="py-2.5 text-right">
                    R$ {Math.round(result.bankSetupAndMortgageStampEur * brlPerEur).toLocaleString("pt-BR")}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[#0B1F3A] font-bold text-[#0B1F3A] tabular-nums">
                <td className="py-3">Custo Total Estimado da Operação</td>
                <td className="py-3 text-right">€ {result.totalAcquisitionCostEur.toLocaleString("pt-BR")}</td>
                <td className="py-3 text-right">R$ {result.totalAcquisitionCostBrl.toLocaleString("pt-BR")}</td>
              </tr>
            </tfoot>
          </table>

          <div className="bg-[#FBF1D9] border border-[#EBD392] rounded-xl p-3.5 text-xs text-[#6B4A00] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{t.simulators.disclaimer}</span>
          </div>
        </div>
      </div>

      {/* Comparador de Cidades */}
      <section className="bg-white rounded-2xl border border-[#E3DED3] p-6 shadow-sm space-y-4">
        <h2 className="text-2xl font-bold">{t.simulators.citiesTitle}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E3DED3] text-xs uppercase text-[#6B7690]">
                <th className="py-3 text-left">Cidade</th>
                <th className="py-3 text-right">Preço Médio/m² (Prime)</th>
                <th className="py-3 text-left">Yield Bruto Est.</th>
                <th className="py-3 text-left">Regime Fiscal</th>
                <th className="py-3 text-left">ID Prévia</th>
                <th className="py-3 text-left">Prazo Escritura</th>
                <th className="py-3 text-left">Perfil Indicado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEBE2]">
              {CITY_BENCHMARKS.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF7F2]">
                  <td className="py-3 font-bold text-[#0B1F3A]">
                    {c.city} <span className="text-xs text-[#6B7690]">({c.country})</span>
                  </td>
                  <td className="py-3 text-right tabular-nums font-semibold">
                    € {c.avgPriceSqmEur.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-3 text-[#1F7A6B] font-semibold">{c.estGrossYield}</td>
                  <td className="py-3">{c.taxLabel}</td>
                  <td className="py-3">{c.docIdRequired}</td>
                  <td className="py-3">{c.avgDaysToClose}</td>
                  <td className="py-3 text-xs text-[#4A556E]">{c.idealFor[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default function SimulatorsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-sm text-[#6B7690]">Carregando simuladores...</div>}>
      <SimulatorsInner />
    </Suspense>
  );
}
