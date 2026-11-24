"""Gerador do plano financeiro mensal de 24 meses da CASA NA GRINGA (jan/2027 - dez/2028).

Gera docs/anexos/plano-financeiro-24m.csv e imprime resumo trimestral/anual
para consistencia absoluta com 15-plano-financeiro-24-meses.md.
Todos os numeros sao estimativas [E] para validacao.
"""

import csv
from pathlib import Path

MONTHS = [
    f"M{i:02d}-{'2027' if i <= 12 else '2028'}-{(i-1)%12 + 1:02d}"
    for i in range(1, 25)
]

# Fechamentos mensais (Base: A1=20, A2=90; ciclo de venda 4-6m gera rampa a partir de M5)
CLOSINGS_BASE = [
    0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 4,       # M01-M12 = 20
    4, 5, 6, 6, 7, 8, 8, 8, 9, 9, 10, 10      # M13-M24 = 90
]

TICKET_AVG_EUR = 400_000
BRL_PER_EUR = 6.30

# Novos leads qualificados (MQLs) mensais
MQLS_BASE = [
    30, 45, 65, 90, 115, 140, 170, 200, 230, 260, 290, 320,
    360, 400, 450, 500, 540, 580, 620, 660, 710, 760, 810, 860
]

# Assinantes pagos ativos (Essencial €79, Plus €249, Private €790 -> ARPU ponderado ~€175/mes)
PAID_SUBS_BASE = [
    0, 0, 2, 4, 7, 10, 14, 18, 22, 26, 30, 35,
    42, 50, 58, 66, 74, 82, 90, 98, 106, 115, 125, 136
]
SUB_ARPU_EUR = 170

# Imoveis sob administracao/aluguel acumulados (comeca M10)
MANAGED_PROPS = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3,
    4, 5, 7, 9, 11, 13, 16, 19, 22, 25, 29, 34
]
MGMT_ARPU_EUR = 240  # mix taxa fixa + % aluguel

# Headcount FTE mensal (enxuto no inicio, escalando com receita/seed)
FTE_BASE = [
    2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 7, 8,
    9, 10, 11, 12, 13, 14, 15, 16, 16, 17, 18, 18
]
AVG_COST_PER_FTE_EUR = 4_800  # custo empresa ponderado BR + PT

# Marketing mensal (EUR)
MKT_SPEND = [
    1_500, 2_000, 3_000, 4_000, 5_000, 6_000, 7_500, 9_000, 10_500, 12_000, 13_500, 15_000,
    18_000, 20_000, 22_000, 24_000, 26_000, 28_000, 30_000, 32_000, 34_000, 36_000, 38_000, 40_000
]


def build_model():
    rows = []
    cash = 100_000  # Caixa inicial fundador/anjo M00
    pre_seed_month = 1   # M01 entrada Pre-Seed €500k
    seed_month = 13      # M13 entrada Seed €2.2M (cobre expansion + AMI + equipe)

    for idx in range(24):
        m = idx + 1
        closings = CLOSINGS_BASE[idx]
        gmv = closings * TICKET_AVG_EUR

        # Taxa liquida de comissao sobre GMV: A1 = 2.2% (co-corretagem), A2 = 3.0% (mix AMI propria)
        comm_rate = 0.022 if m <= 12 else 0.030
        rev_commission = round(gmv * comm_rate)

        # Due diligence + Assessoria (inicia M02 com diagnosticos e DDs antes do fechamento)
        dd_cases = max(closings + (1 if m >= 3 else 0), round(MQLS_BASE[idx] * 0.025))
        rev_dd_advisory = dd_cases * 1_650 if m >= 2 else 780

        # Assinaturas
        rev_subs = PAID_SUBS_BASE[idx] * SUB_ARPU_EUR

        # Financiamento + Cambio + Referral
        rev_fin_fx_ref = round(closings * (1_800 if m <= 12 else 2_800))

        # Pos-venda (Administracao + Aluguel)
        rev_post_sale = MANAGED_PROPS[idx] * MGMT_ARPU_EUR

        # Concierge VIP + B2B piloto (M15+)
        rev_concierge_b2b = 0 if m < 15 else round(closings * 360 + (m - 14) * 900)

        total_rev = (
            rev_commission
            + rev_dd_advisory
            + rev_subs
            + rev_fin_fx_ref
            + rev_post_sale
            + rev_concierge_b2b
        )

        # COGS (custos diretos: split advogado DD, variavel consultor, KYC/DocAI, Stripe, tokens IA)
        cogs = round(
            rev_commission * 0.34
            + rev_dd_advisory * 0.50
            + rev_subs * 0.16
            + rev_fin_fx_ref * 0.14
            + rev_post_sale * 0.56
            + rev_concierge_b2b * 0.45
        )
        gross_profit = total_rev - cogs

        # OPEX
        people_cost = FTE_BASE[idx] * AVG_COST_PER_FTE_EUR
        mkt_cost = MKT_SPEND[idx]
        tech_cloud_ai = 650 + PAID_SUBS_BASE[idx] * 12 + MQLS_BASE[idx] * 2
        legal_comp_ins = 3_200 if m <= 12 else 5_500  # advogado, DPO, seguro RC, contabil
        ga_other = 1_800 if m <= 12 else 4_200        # viagens, escritorio flex, ferramentas
        total_opex = people_cost + mkt_cost + tech_cloud_ai + legal_comp_ins + ga_other

        ebitda = gross_profit - total_opex

        # Capital / Financiamento
        funding_inflow = 0
        if m == pre_seed_month:
            funding_inflow = 500_000
        elif m == seed_month:
            funding_inflow = 2_200_000

        net_cash_flow = ebitda + funding_inflow
        cash += net_cash_flow

        rows.append({
            "month": MONTHS[idx],
            "mqls": MQLS_BASE[idx],
            "paid_subs": PAID_SUBS_BASE[idx],
            "closings": closings,
            "gmv_eur": gmv,
            "rev_commission_eur": rev_commission,
            "rev_dd_advisory_eur": rev_dd_advisory,
            "rev_subs_eur": rev_subs,
            "rev_fin_fx_ref_eur": rev_fin_fx_ref,
            "rev_post_sale_eur": rev_post_sale,
            "rev_concierge_b2b_eur": rev_concierge_b2b,
            "total_revenue_eur": total_rev,
            "cogs_eur": cogs,
            "gross_profit_eur": gross_profit,
            "gross_margin_pct": round((gross_profit / total_rev) * 100, 1) if total_rev else 0.0,
            "fte": FTE_BASE[idx],
            "opex_people_eur": people_cost,
            "opex_marketing_eur": mkt_cost,
            "opex_tech_eur": tech_cloud_ai,
            "opex_legal_compliance_eur": legal_comp_ins,
            "opex_ga_eur": ga_other,
            "total_opex_eur": total_opex,
            "ebitda_eur": ebitda,
            "funding_inflow_eur": funding_inflow,
            "net_cash_flow_eur": net_cash_flow,
            "ending_cash_eur": cash,
            "total_revenue_brl_est": round(total_rev * BRL_PER_EUR),
        })
    return rows


def main():
    rows = build_model()
    out_path = Path(__file__).parent / "plano-financeiro-24m.csv"
    with out_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    for label, sl in [("Ano 1 (M01-M12)", rows[:12]), ("Ano 2 (M13-M24)", rows[12:])]:
        rev = sum(r["total_revenue_eur"] for r in sl)
        cogs = sum(r["cogs_eur"] for r in sl)
        gp = sum(r["gross_profit_eur"] for r in sl)
        opex = sum(r["total_opex_eur"] for r in sl)
        ebitda = sum(r["ebitda_eur"] for r in sl)
        closings = sum(r["closings"] for r in sl)
        gmv = sum(r["gmv_eur"] for r in sl)
        min_cash = min(r["ending_cash_eur"] for r in sl)
        end_cash = sl[-1]["ending_cash_eur"]
        print(f"{label}: closings={closings}, GMV=€{gmv:,}, Rev=€{rev:,}, COGS=€{cogs:,}, GP=€{gp:,} ({gp/rev*100:.1f}%), OPEX=€{opex:,}, EBITDA=€{ebitda:,}, MinCash=€{min_cash:,}, EndCash=€{end_cash:,}")

    # Resumo trimestral
    for q in range(8):
        qrows = rows[q*3:(q+1)*3]
        print(
            f"Q{q+1}: closings={sum(r['closings'] for r in qrows)}, "
            f"rev=€{sum(r['total_revenue_eur'] for r in qrows):,}, "
            f"gp=€{sum(r['gross_profit_eur'] for r in qrows):,}, "
            f"opex=€{sum(r['total_opex_eur'] for r in qrows):,}, "
            f"ebitda=€{sum(r['ebitda_eur'] for r in qrows):,}, "
            f"end_cash=€{qrows[-1]['ending_cash_eur']:,}"
        )


if __name__ == "__main__":
    main()
