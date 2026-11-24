import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runMultiAgentReply } from "@/lib/ai/agents";
import { checkRateLimit } from "@/lib/ai/guardrails";

const chatRequestSchema = z.object({
  message: z.string().min(2).max(2000),
  agentType: z
    .enum([
      "orchestrator",
      "real_estate",
      "financial",
      "legal",
      "tax",
      "relocation",
      "concierge",
      "compliance",
      "due_diligence",
    ])
    .default("orchestrator"),
  locale: z.enum(["pt", "en", "es"]).default("pt"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "agent"]),
        text: z.string(),
      })
    )
    .max(10)
    .default([]),
  buyerContextSummary: z.string().max(600).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "local";

    const rl = checkRateLimit(ip, 25);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a minute before sending more messages." },
        { status: 429 }
      );
    }

    const json = await request.json();
    const parsed = chatRequestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await runMultiAgentReply({
      message: parsed.data.message,
      requestedAgent: parsed.data.agentType,
      locale: parsed.data.locale,
      history: parsed.data.history,
      buyerContextSummary: parsed.data.buyerContextSummary,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("AI chat endpoint error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
