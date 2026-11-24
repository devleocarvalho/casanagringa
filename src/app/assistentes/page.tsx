"use client";

import React, { useState } from "react";
import { Bot, Send, ShieldAlert, UserCheck, ExternalLink, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { AI_AGENTS } from "@/lib/ai/agents";
import { AgentType, ChatMessage } from "@/types/domain";

export default function AssistantsPage() {
  const { locale, session, createHitlEscalation } = useApp();
  const t = DICTIONARIES[locale];

  const [selectedAgent, setSelectedAgent] = useState<AgentType>("orchestrator");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [escalatedMsg, setEscalatedMsg] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "agent",
      agentType: "orchestrator",
      text:
        locale === "pt"
          ? "Olá! Sou o Orquestrador Multiagente da Casa na Gringa. Posso direcionar suas dúvidas entre nossos 8 especialistas (Imobiliário, Financeiro, Jurídico, Tributário, Relocation, Concierge, Compliance e Due Diligence). Em que posso ajudar hoje?"
          : locale === "es"
            ? "¡Hola! Soy el Orquestador Multiagente de Casa na Gringa. Puedo dirigir tus consultas entre nuestros 8 especialistas en Portugal y España. ¿En qué te ayudo hoy?"
            : "Hello! I am the Casa na Gringa Multi-Agent Orchestrator. I route your questions across our 8 Portugal & Spain specialists. How can I help today?",
      disclaimer: t.ai.disclaimerBanner,
      timestamp: new Date().toISOString(),
    },
  ]);

  const activeMeta = AI_AGENTS.find((a) => a.id === selectedAgent) || AI_AGENTS[0];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: new Date().toISOString(),
    };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          agentType: selectedAgent,
          locale,
          history: nextHistory
            .filter((m) => m.sender !== "system")
            .slice(-6)
            .map((m) => ({
              role: m.sender === "user" ? "user" : "agent",
              text: m.text,
            })),
          buyerContextSummary: `Países: ${session.buyerProfile.targetCountries.join(",")}; Orçamento máx: €${session.buyerProfile.budgetMaxEur}; Residência fiscal: ${session.buyerProfile.taxResidence}`,
        }),
      });

      const data = await res.json();
      const agentReply: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: "agent",
        agentType: data.agentUsed || selectedAgent,
        text: data.text || "Não foi possível responder no momento.",
        citations: data.citations || [],
        disclaimer: data.disclaimer,
        hitlTriggered: Boolean(data.hitlTriggered),
        antiBecAlert: Boolean(data.antiBecAlert),
        mode: data.mode,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, agentReply]);

      if (data.hitlTriggered) {
        await createHitlEscalation({
          clientName: session.displayName,
          agentType: data.agentUsed || selectedAgent,
          userQuestion: trimmed,
          reason: data.hitlReason || "Decisão crítica detectada automaticamente",
          severity: data.antiBecAlert ? "critical" : "high",
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "agent",
          agentType: selectedAgent,
          text: "Erro temporário de comunicação. Use o escalonamento humano ao lado.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleManualEscalate = async () => {
    const lastUser = [...messages].reverse().find((m) => m.sender === "user");
    await createHitlEscalation({
      clientName: session.displayName,
      agentType: selectedAgent,
      userQuestion: lastUser?.text || "Solicitação de atendimento humano pelo usuário",
      reason: "Solicitação direta do comprador no chat",
      severity: "high",
    });
    setEscalatedMsg(true);
    setTimeout(() => setEscalatedMsg(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF1D9] text-[#6B4A00] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Gemini Multi-Agent + RAG Country Packs (PT/ES)
          </span>
          <h1 className="text-3xl font-bold mt-2">{t.ai.title}</h1>
          <p className="text-sm text-[#4A556E] mt-1">{t.ai.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => void handleManualEscalate()}
          className="px-5 py-2.5 rounded-full bg-[#1F7A6B] hover:bg-[#14564B] text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
        >
          <UserCheck className="w-4 h-4" /> {t.ai.escalateBtn}
        </button>
      </div>

      {/* Disclaimer Obrigatório Permanente */}
      <div className="bg-[#FBF1D9] border border-[#EBD392] rounded-xl p-3.5 text-xs text-[#6B4A00]">
        <b>{t.ai.disclaimerBanner}</b>
      </div>

      {escalatedMsg && (
        <div className="bg-[#E4F2EE] border border-[#BFE0D8] rounded-xl p-3.5 text-xs text-[#14564B] font-bold">
          ✓ {t.ai.escalatedToast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lista dos 8 Agentes + Orquestrador */}
        <aside className="lg:col-span-4 bg-white rounded-2xl border border-[#E3DED3] p-4 shadow-sm space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7690] px-2 pb-1">
            Escolha o Especialista
          </h2>
          {AI_AGENTS.map((ag) => {
            const active = ag.id === selectedAgent;
            return (
              <button
                key={ag.id}
                type="button"
                onClick={() => setSelectedAgent(ag.id)}
                className={`w-full text-left p-3 rounded-xl border transition cursor-pointer ${
                  active
                    ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                    : "bg-[#FAF7F2] text-[#0B1F3A] border-[#E3DED3] hover:bg-[#F1ECE2]"
                }`}
              >
                <div className="text-sm font-bold">{ag.label[locale]}</div>
                <div className={`text-xs mt-0.5 ${active ? "text-[#C6D1E6]" : "text-[#6B7690]"}`}>
                  {ag.roleDesc[locale]}
                </div>
              </button>
            );
          })}
        </aside>

        {/* Área de Conversa */}
        <section className="lg:col-span-8 bg-white rounded-2xl border border-[#E3DED3] shadow-sm flex flex-col min-h-[540px]">
          <div className="px-5 py-3.5 border-b border-[#E3DED3] bg-[#FAF7F2] rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0B1F3A]">
              <Bot className="w-4 h-4 text-[#B8793A]" /> {activeMeta.label[locale]}
            </div>
            <span className="text-[11px] text-[#6B7690]">{activeMeta.limits[locale]}</span>
          </div>

          <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[520px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm whitespace-pre-wrap leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#0B1F3A] text-white rounded-br-sm"
                      : m.antiBecAlert
                        ? "bg-[#F9E3E0] border border-[#EBB9B3] text-[#7D2119] rounded-bl-sm"
                        : "bg-[#FAF7F2] border border-[#E3DED3] text-[#26324A] rounded-bl-sm"
                  }`}
                >
                  {m.sender === "agent" && m.agentType && (
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#B8793A] mb-1.5 flex items-center justify-between gap-2">
                      <span>{AI_AGENTS.find((a) => a.id === m.agentType)?.label[locale]}</span>
                      {m.mode && (
                        <span className="text-[10px] text-[#6B7690]">
                          {m.mode === "gemini_live" ? "Gemini Live" : "RAG Curado"}
                        </span>
                      )}
                    </div>
                  )}

                  {m.antiBecAlert && (
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-2 text-[#B3392F]">
                      <ShieldAlert className="w-4 h-4" /> PROTOCOLO ANTI-BEC ACIONADO
                    </div>
                  )}

                  <div>{m.text}</div>

                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#E3DED3] text-xs space-y-1">
                      <div className="font-bold text-[#0B1F3A]">{t.ai.sourcesLabel}</div>
                      {m.citations.map((c) => (
                        <div key={c.sourceId} className="flex items-center gap-1.5 text-[#4A556E]">
                          <span className="px-1.5 py-0.5 rounded bg-white border border-[#E3DED3] font-mono text-[10px]">
                            {c.sourceId}
                          </span>
                          <span>
                            {c.title} (vig. {c.effectiveDate})
                          </span>
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#2F5D9E] inline-flex items-center"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}

                  {m.hitlTriggered && (
                    <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-[#0B1F3A] text-white text-[11px] font-semibold">
                      ✓ Escalonamento HITL registrado automaticamente na mesa do CRM para revisão humana.
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-xs text-[#6B7690] italic">Consultando Country Pack PT/ES...</div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-[#E3DED3] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.ai.placeholder}
              className="flex-1 border border-[#E3DED3] rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#0B1F3A]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-2.5 rounded-full bg-[#B8793A] hover:bg-[#9E652D] disabled:opacity-50 text-white text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" /> {t.ai.sendBtn}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
