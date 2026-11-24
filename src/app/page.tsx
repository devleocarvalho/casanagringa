"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Globe2, Landmark, FileCheck2, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { CURATED_PROPERTIES } from "@/data/properties";
import { ParallaxSection } from "@/components/ParallaxSection";

export default function HomePage() {
  const { locale } = useApp();
  const t = DICTIONARIES[locale];

  // 3 residências icônicas para a galeria editorial da capa
  const showcaseIds = ["prop-pt-cas-0071", "prop-es-mad-0108", "prop-pt-lis-0042"];
  const featured = showcaseIds
    .map((id) => CURATED_PROPERTIES.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const brlRate = 6.3;

  const pillars =
    locale === "pt"
      ? [
          {
            num: "01",
            title: "Auditoria jurídica antes do primeiro euro",
            desc: "Advogados independentes verificam matrícula, dívidas ocultas, licenças e condomínio antes de você assinar qualquer contrato de reserva.",
          },
          {
            num: "02",
            title: "Câmbio e Banco Central sem travamentos",
            desc: "Estruturamos sua origem de fundos, IOF e remessa oficial Brasil → Europa para que bancos portugueses e espanhóis aprovem sua operação.",
          },
          {
            num: "03",
            title: "Compre à distância ou com visitas privadas",
            desc: "Emitimos seu NIF ou NIE, coordenamos conta bancária e procuração apostilada — ou preparamos roteiro VIP em Lisboa, Cascais e Madrid.",
          },
          {
            num: "04",
            title: "Alinhamento total de comissão",
            desc: "Você conhece toda a remuneração antes da proposta. Se contratar nossa assessoria dedicada, o valor é abatido no fechamento.",
          },
        ]
      : locale === "es"
        ? [
            {
              num: "01",
              title: "Auditoría legal antes de entregar señal",
              desc: "Abogados locales independientes revisan Nota Simple, cargas y licencias antes de firmar cualquier compromiso.",
            },
            {
              num: "02",
              title: "Divisas y origen de fondos sin bloqueos",
              desc: "Estructuramos tu documentación bancaria y transferencia regulada para cumplir la normativa europea desde el primer día.",
            },
            {
              num: "03",
              title: "Compra remota o visitas privadas",
              desc: "Tramitamos NIE/NIF, cuenta bancaria y poderes apostillados, o coordinamos agenda presencial en Madrid y Lisboa.",
            },
            {
              num: "04",
              title: "Transparencia de honorarios",
              desc: "Declaración previa de comisiones antes de ofertar y compensación de cuotas elegibles en el cierre.",
            },
          ]
        : [
            {
              num: "01",
              title: "Legal audit before your first euro",
              desc: "Independent local lawyers clear land registry, liens, and permits prior to any binding reservation contract.",
            },
            {
              num: "02",
              title: "Compliant cross-border FX & banking",
              desc: "We structure source-of-funds files and regulated currency transfers so European banks clear your closing smoothly.",
            },
            {
              num: "03",
              title: "Remote closing or private tours",
              desc: "From NIF/NIE tax IDs and apostilled PoA to curated private viewings in Cascais, Lisbon, and Madrid.",
            },
            {
              num: "04",
              title: "Aligned compensation",
              desc: "Written fee disclosure upfront before any offer, with eligible advisory credits applied at closing.",
            },
          ];

  const steps =
    locale === "pt"
      ? [
          {
            n: "01",
            title: "Estratégia & Impostos Reais",
            desc: "Simule exatamente quanto custa comprar e manter o imóvel em Euro e em Real — sem surpresas na escritura.",
          },
          {
            n: "02",
            title: "Documentação & Conta na Europa",
            desc: "Preparamos seu NIF/NIE, abertura bancária e comprovação de origem de recursos em um cofre privado.",
          },
          {
            n: "03",
            title: "Seleção & Auditoria Jurídica",
            desc: "Visitamos com você (ou por vídeo técnico) e emitimos parecer jurídico independente antes do sinal.",
          },
          {
            n: "04",
            title: "Escritura & Renda em Euro",
            desc: "Receba as chaves com dossiê pronto para IRPF/CBE e conte com nossa gestão se desejar rentabilizar.",
          },
        ]
      : locale === "es"
        ? [
            {
              n: "01",
              title: "Estrategia e Impuestos Reales",
              desc: "Simula el coste total exacto con ITP, IMT o IVA antes de visitar propiedades.",
            },
            {
              n: "02",
              title: "Documentación y Cuenta Bancaria",
              desc: "Preparamos NIE/NIF, cuenta en Europa y dossier de origen de fondos.",
            },
            {
              n: "03",
              title: "Selección y Due Diligence",
              desc: "Visitas privadas o videotour técnico y verificación registral previa a arras.",
            },
            {
              n: "04",
              title: "Escritura y Gestión Patrimonial",
              desc: "Entrega de llaves y administración de alquiler si buscas rentabilidad en euros.",
            },
          ]
        : [
            {
              n: "01",
              title: "Strategy & True Tax Modeling",
              desc: "Know the exact all-in euro and home-currency cost before making an offer.",
            },
            {
              n: "02",
              title: "Tax ID & European Banking",
              desc: "Seamless NIF/NIE issuance, bank onboarding, and AML files inside a private vault.",
            },
            {
              n: "03",
              title: "Curation & Legal Due Diligence",
              desc: "Private tours or live technical video walkthroughs backed by lawyer sign-off.",
            },
            {
              n: "04",
              title: "Deed & Euro Asset Management",
              desc: "Smooth closing and optional long-term rental and tax dossier management.",
            },
          ];

  return (
    <div className="bg-[#FAF7F2]">
      {/* BAND 1 — HERO PARALLAX FULL-BLEED DE LUXO */}
      <ParallaxSection
        imageSrc="/images/hero-cascais-villa.jpg"
        imageAlt="Villa de luxo em Cascais ao pôr do sol com vista para o Atlântico"
        heightClass="min-h-[86vh]"
        speed={0.26}
        overlayClassName="bg-gradient-to-r from-[#071426]/92 via-[#0B1F3A]/68 to-[#0B1F3A]/25"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-2xl space-y-6 text-white">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#D9A15E]">
              <span className="w-6 h-px bg-[#D9A15E]" />
              {t.brand.tagline}
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight"
              style={{ color: "#FFFFFF" }}
            >
              {t.brand.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-[#E5E9F2] leading-relaxed font-light max-w-xl">
              {t.brand.heroSubtitle}
            </p>

            {/* Apenas 2 CTAs claros e elegantes para não assustar o investidor */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/imoveis"
                className="px-7 py-3.5 rounded-full bg-[#B8793A] hover:bg-[#9E652D] text-white text-sm font-semibold inline-flex items-center gap-2.5 shadow-lg transition"
              >
                {t.brand.ctaExplore} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/simuladores"
                className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-semibold transition"
              >
                {t.brand.ctaSimulate}
              </Link>
            </div>

            <div className="pt-6 border-t border-white/15 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#D3DBE8]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D9A15E]" />
                {locale === "pt"
                  ? "Advogado independente pré-sinal"
                  : locale === "es"
                    ? "Abogado independiente previo"
                    : "Independent pre-deposit counsel"}
              </span>
              <span className="flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-[#D9A15E]" />
                {locale === "pt"
                  ? "Remessa legalizada BR → UE"
                  : locale === "es"
                    ? "Divisas y origen verificados"
                    : "Compliant cross-border FX"}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-[#D9A15E]" />
                {locale === "pt"
                  ? "Atendimento privado em Português"
                  : locale === "es"
                    ? "Atención privada multilingüe"
                    : "Bespoke multilingual advisory"}
              </span>
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* BAND 2 — AS RESPOSTAS QUE O INVESTIDOR BRASILEIRO PROCURA */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8793A]">
            {locale === "pt"
              ? "Patrimônio Internacional sem Incerteza"
              : locale === "es"
                ? "Patrimonio Internacional Seguro"
                : "Borderless Wealth Protection"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 leading-tight">
            {locale === "pt"
              ? "Comprar fora do país não precisa ser um salto no escuro."
              : locale === "es"
                ? "Comprar en el extranjero no tiene por qué ser incierto."
                : "Acquiring European real estate shouldn't feel like a leap of faith."}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item) => (
            <div
              key={item.num}
              className="bg-white rounded-2xl border border-[#E3DED3] p-7 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="font-serif-brand text-3xl font-bold text-[#B8793A] mb-4">
                  {item.num}
                </div>
                <h3 className="text-xl font-bold mb-3 leading-snug">{item.title}</h3>
                <p className="text-sm text-[#4A556E] leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-6 h-0.5 w-10 bg-[#E3DED3]" />
            </div>
          ))}
        </div>
      </section>

      {/* BAND 3 — SEGUNDA FAIXA PARALLAX CINEMATOGRÁFICA (LISBOA / LIFESTYLE & EURO) */}
      <ParallaxSection
        imageSrc="/images/parallax-lisboa-terrace.jpg"
        imageAlt="Terraço panorâmico de cobertura de luxo em Lisboa ao entardecer"
        heightClass="min-h-[68vh]"
        speed={0.28}
        overlayClassName="bg-[#081529]/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex justify-end">
          <div className="max-w-xl bg-[#0B1F3A]/78 backdrop-blur-md border border-white/15 rounded-3xl p-8 sm:p-10 text-white shadow-2xl space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D9A15E] block">
              {locale === "pt"
                ? "Dólar, Euro & Legado Familiar"
                : locale === "es"
                  ? "Rentabilidad y Legado en Euro"
                  : "Euro Yield & Family Legacy"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold leading-tight" style={{ color: "#FFFFFF" }}>
              {locale === "pt"
                ? "Mais do que comprar um imóvel na Europa. Blindar o futuro da sua família em moeda forte."
                : locale === "es"
                  ? "Más que comprar ladrillo en Europa. Proteger tu patrimonio familiar en euros."
                  : "More than square meters. A resilient family reserve denominated in Euro."}
            </h2>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/15">
              <div>
                <div className="font-serif-brand text-xl sm:text-2xl font-bold text-[#D9A15E]">
                  4,5–5,8%
                </div>
                <div className="text-[11px] text-[#D3DBE8] mt-0.5">
                  {locale === "pt" ? "Yield bruto est. em Euro" : "Est. EUR gross yield"}
                </div>
              </div>
              <div>
                <div className="font-serif-brand text-xl sm:text-2xl font-bold text-[#D9A15E]">
                  6%–11%
                </div>
                <div className="text-[11px] text-[#D3DBE8] mt-0.5">
                  {locale === "pt" ? "Impostos simulados antes" : "All-in tax clarity"}
                </div>
              </div>
              <div>
                <div className="font-serif-brand text-xl sm:text-2xl font-bold text-[#D9A15E]">
                  100%
                </div>
                <div className="text-[11px] text-[#D3DBE8] mt-0.5">
                  {locale === "pt" ? "Auditado antes do sinal" : "Pre-deposit audited"}
                </div>
              </div>
            </div>

            <Link
              href="/assistentes"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B8793A] hover:bg-[#9E652D] text-white text-sm font-semibold transition"
            >
              <Sparkles className="w-4 h-4" />
              {t.brand.ctaConsult}
            </Link>
          </div>
        </div>
      </ParallaxSection>

      {/* BAND 4 — COLEÇÃO PRIVADA DE RESIDÊNCIAS (FOTOS REAIS) */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8793A]">
              {locale === "pt"
                ? "Curadoria Privada · Portugal & Espanha"
                : locale === "es"
                  ? "Selección Privada · PT & ES"
                  : "Private Collection · PT & ES"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">
              {locale === "pt"
                ? "Residências com verificação prévia"
                : locale === "es"
                  ? "Residencias con verificación previa"
                  : "Pre-audited residences"}
            </h2>
          </div>
          <Link
            href="/imoveis"
            className="text-sm font-semibold text-[#0B1F3A] border-b border-[#B8793A] pb-0.5 hover:text-[#B8793A] transition"
          >
            {locale === "pt"
              ? "Ver coleção completa →"
              : locale === "es"
                ? "Ver colección completa →"
                : "View full collection →"}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((prop) => {
            const tr = prop.translations[locale];
            const approxBrl = Math.round(prop.priceEur * brlRate);
            return (
              <Link
                key={prop.id}
                href={`/imoveis/${prop.id}`}
                className="group bg-white rounded-2xl border border-[#E3DED3] overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col"
              >
                <div className="relative h-64 overflow-hidden bg-[#0B1F3A]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prop.imageSrc || "/images/hero-cascais-villa.jpg"}
                    alt={tr.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/70 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 text-[#14564B] text-[11px] font-bold flex items-center gap-1 shadow-sm">
                    <FileCheck2 className="w-3.5 h-3.5" /> Auditado {prop.ddScore}/100
                  </span>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white font-medium">
                    <span>
                      {prop.neighborhood} · {prop.city}
                    </span>
                    <span className="opacity-80">{prop.country}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-serif-brand text-2xl font-bold text-[#0B1F3A] tabular-nums">
                        € {prop.priceEur.toLocaleString("pt-BR")}
                      </span>
                      <span className="text-xs text-[#6B7690] tabular-nums">
                        ≈ R$ {(approxBrl / 1_000_000).toFixed(2)}M
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mt-2 group-hover:text-[#B8793A] transition">
                      {tr.title}
                    </h3>
                    <p className="text-xs text-[#6B7690] mt-1">{tr.subtitle}</p>
                  </div>

                  <div className="pt-3 border-t border-[#EFEBE2] flex items-center justify-between text-xs text-[#4A556E]">
                    <span>
                      {prop.areaSqm} m² · {prop.bedrooms} qts
                    </span>
                    <span className="font-semibold text-[#0B1F3A] group-hover:translate-x-1 transition">
                      Analisar residência →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* BAND 5 — COMO FUNCIONA EM 4 PASSOS CLAROS (SEM RUÍDO) */}
      <section id="como-funciona" className="py-20 bg-[#F1ECE2] border-y border-[#E3DED3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8793A]">
              {locale === "pt" ? "Método Casa na Gringa" : "How It Works"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">
              {locale === "pt"
                ? "Da primeira simulação às chaves na mão, em 4 etapas claras"
                : locale === "es"
                  ? "De la simulación a las llaves en 4 pasos claros"
                  : "From tax clarity to keys in hand in 4 calm steps"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div
                key={s.n}
                className="bg-white rounded-2xl border border-[#E3DED3] p-6 space-y-3 shadow-sm"
              >
                <span className="inline-block text-xs font-bold tracking-widest text-[#B8793A]">
                  ETAPA {s.n}
                </span>
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="text-sm text-[#4A556E] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BAND 6 — CONVITE PRIVADO FINAL */}
      <section className="py-20 bg-[#0B1F3A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#D9A15E] block">
            {locale === "pt" ? "Atendimento Privado e Confidencial" : "Private Client Desk"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: "#FFFFFF" }}>
            {locale === "pt"
              ? "Pronto para planejar seu imóvel na Europa com previsibilidade total?"
              : locale === "es"
                ? "¿Listo para planificar tu inversión europea con total claridad?"
                : "Ready to plan your European property acquisition with full clarity?"}
          </h2>
          <p className="text-sm sm:text-base text-[#C6D1E6] max-w-2xl mx-auto leading-relaxed">
            {locale === "pt"
              ? "Simule seus custos em minutos ou entre na sua Área do Cliente para organizar documentos, conversar com especialistas e acompanhar prazos."
              : locale === "es"
                ? "Simula tus impuestos en minutos o accede a tu Área Privada para organizar documentos y plazos."
                : "Model your all-in acquisition costs in minutes or open your private portal to organize documentation and timelines."}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/simuladores"
              className="px-7 py-3.5 rounded-full bg-[#B8793A] hover:bg-[#9E652D] text-white text-sm font-semibold transition"
            >
              {t.brand.ctaSimulate}
            </Link>
            <Link
              href="/auth"
              className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-sm font-semibold transition"
            >
              {locale === "pt" ? "Acessar Área do Cliente" : "Open Client Portal"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
