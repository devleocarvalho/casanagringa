import { CountryCode } from "@/types/domain";

export type SimulationRegion =
  | "PT-CONT-SEC"
  | "PT-CONT-HPP"
  | "ES-MD"
  | "ES-AN"
  | "ES-VC"
  | "ES-CT";

export interface SimulationInput {
  country: CountryCode;
  region: SimulationRegion;
  priceEur: number;
  condition: "used" | "new_build";
  ltvPct: number;
  termYears: number;
  annualRatePct: number;
  brlPerEur: number;
}

export interface SimulationResult {
  priceEur: number;
  transferTaxLabel: string;
  transferTaxEur: number;
  stampOrAjdLabel: string;
  stampOrAjdEur: number;
  notaryRegistryEur: number;
  legalAndDdEur: number;
  bankSetupAndMortgageStampEur: number;
  totalAcquisitionCostEur: number;
  extraCostsEur: number;
  extraCostsPct: number;
  loanAmountEur: number;
  downPaymentEur: number;
  totalCashNeededEur: number;
  monthlyMortgageEur: number;
  minSuggestedMonthlyIncomeEur: number;
  totalCashNeededBrl: number;
  totalAcquisitionCostBrl: number;
}

/** Tabela progressiva indicativa IMT Portugal Continente - Habitação Secundária/Arrendamento (referência base 2025/2026 - confirmar anualmente) */
function calcPortugalImt(price: number, isPrimary: boolean): number {
  if (isPrimary) {
    // Escala própria permanente (referência simplificada sujeita a confirmação OE)
    if (price <= 104261) return 0;
    if (price <= 142618) return Math.max(0, price * 0.02 - 2085.22);
    if (price <= 194458) return Math.max(0, price * 0.05 - 6363.76);
    if (price <= 324058) return Math.max(0, price * 0.07 - 10252.92);
    if (price <= 648022) return Math.max(0, price * 0.08 - 13493.50);
    if (price <= 1128287) return price * 0.06;
    return price * 0.075;
  }

  // Habitação secundária / investimento (escalões verificados na pesquisa)
  if (price <= 106346) return price * 0.01;
  if (price <= 145470) return Math.max(0, price * 0.02 - 1063.46);
  if (price <= 198347) return Math.max(0, price * 0.05 - 5427.56);
  if (price <= 330539) return Math.max(0, price * 0.07 - 9394.50);
  if (price <= 633931) return Math.max(0, price * 0.08 - 12700.00);
  if (price <= 1150853) return price * 0.06;
  return price * 0.075;
}

/** Tabela ITP Catalunha (progressiva por escalões) */
function calcCataloniaItp(price: number): number {
  let tax = 0;
  const tier1 = Math.min(price, 600_000);
  tax += tier1 * 0.10;
  if (price > 600_000) {
    const tier2 = Math.min(price - 600_000, 300_000);
    tax += tier2 * 0.11;
  }
  if (price > 900_000) {
    const tier3 = Math.min(price - 900_000, 600_000);
    tax += tier3 * 0.12;
  }
  if (price > 1_500_000) {
    tax += (price - 1_500_000) * 0.13;
  }
  return tax;
}

export function simulateAcquisitionCosts(input: SimulationInput): SimulationResult {
  const price = Math.max(50_000, input.priceEur);
  const ltv = Math.min(80, Math.max(0, input.ltvPct)) / 100;
  const loanAmountEur = Math.round(price * ltv);
  const downPaymentEur = price - loanAmountEur;

  let transferTaxLabel = "IMT";
  let transferTaxEur = 0;
  let stampOrAjdLabel = "Imposto do Selo (0,8%)";
  let stampOrAjdEur = 0;
  let notaryRegistryEur = 1250;
  let legalAndDdEur = 3800;
  let bankSetupAndMortgageStampEur = 0;

  if (input.country === "PT") {
    const isPrimary = input.region === "PT-CONT-HPP";
    transferTaxLabel = isPrimary ? "IMT (Hab. Própria Permanente est.)" : "IMT (Hab. Secundária / Invest. est.)";
    transferTaxEur = Math.round(calcPortugalImt(price, isPrimary));
    stampOrAjdLabel = "Imposto do Selo (0,8%)";
    stampOrAjdEur = Math.round(price * 0.008);
    notaryRegistryEur = price > 500_000 ? 1500 : 1200;
    legalAndDdEur = 3800;
    // Em PT há Imposto do Selo sobre o crédito (0,6% acima de 5 anos) + avaliação/abertura
    bankSetupAndMortgageStampEur = loanAmountEur > 0 ? Math.round(loanAmountEur * 0.006 + 1400) : 0;
  } else {
    // Espanha
    if (input.condition === "new_build") {
      transferTaxLabel = "IVA Obra Nova (10%)";
      transferTaxEur = Math.round(price * 0.10);
      const ajdRates: Record<string, number> = {
        "ES-MD": 0.0075,
        "ES-AN": 0.012,
        "ES-VC": 0.015,
        "ES-CT": 0.015,
      };
      const ajdRate = ajdRates[input.region] ?? 0.012;
      stampOrAjdLabel = `AJD Regional (${(ajdRate * 100).toFixed(2)}%)`;
      stampOrAjdEur = Math.round(price * ajdRate);
    } else {
      stampOrAjdLabel = "AJD Compra (isento em usada)";
      stampOrAjdEur = 0;
      if (input.region === "ES-MD") {
        transferTaxLabel = "ITP Madrid (6%)";
        transferTaxEur = Math.round(price * 0.06);
      } else if (input.region === "ES-AN") {
        transferTaxLabel = "ITP Andaluzia (7%)";
        transferTaxEur = Math.round(price * 0.07);
      } else if (input.region === "ES-VC") {
        const rate = price > 1_000_000 ? 0.11 : 0.09;
        transferTaxLabel = `ITP Com. Valenciana (${Math.round(rate * 100)}%)`;
        transferTaxEur = Math.round(price * rate);
      } else {
        transferTaxLabel = "ITP Catalunha (10%–13% prog.)";
        transferTaxEur = Math.round(calcCataloniaItp(price));
      }
    }
    notaryRegistryEur = Math.round(1600 + price * 0.0025);
    legalAndDdEur = 4200; // Inclui gestoría / NIE / advogado / tradução estimada
    bankSetupAndMortgageStampEur = loanAmountEur > 0 ? Math.round(loanAmountEur * 0.005 + 1100) : 0;
  }

  const extraCostsEur =
    transferTaxEur +
    stampOrAjdEur +
    notaryRegistryEur +
    legalAndDdEur +
    bankSetupAndMortgageStampEur;

  const totalAcquisitionCostEur = price + extraCostsEur;
  const totalCashNeededEur = downPaymentEur + extraCostsEur;

  // Prestação mensal (Sistema Price)
  let monthlyMortgageEur = 0;
  if (loanAmountEur > 0 && input.termYears > 0) {
    const monthlyRate = input.annualRatePct / 100 / 12;
    const months = input.termYears * 12;
    if (monthlyRate === 0) {
      monthlyMortgageEur = Math.round(loanAmountEur / months);
    } else {
      const factor = Math.pow(1 + monthlyRate, months);
      monthlyMortgageEur = Math.round((loanAmountEur * (monthlyRate * factor)) / (factor - 1));
    }
  }

  return {
    priceEur: price,
    transferTaxLabel,
    transferTaxEur,
    stampOrAjdLabel,
    stampOrAjdEur,
    notaryRegistryEur,
    legalAndDdEur,
    bankSetupAndMortgageStampEur,
    totalAcquisitionCostEur,
    extraCostsEur,
    extraCostsPct: Number(((extraCostsEur / price) * 100).toFixed(2)),
    loanAmountEur,
    downPaymentEur,
    totalCashNeededEur,
    monthlyMortgageEur,
    minSuggestedMonthlyIncomeEur: Math.round(monthlyMortgageEur / 0.35),
    totalCashNeededBrl: Math.round(totalCashNeededEur * input.brlPerEur),
    totalAcquisitionCostBrl: Math.round(totalAcquisitionCostEur * input.brlPerEur),
  };
}
