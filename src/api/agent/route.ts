import { NextRequest, NextResponse } from "next/server";

// Minimal rate limit stub
let lastRequest = 0;
export async function POST(req: NextRequest) {
  const now = Date.now();
  if (now - lastRequest < 1000) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  lastRequest = now;
  // ...existing code...
}
import { NextRequest, NextResponse } from "next/server";
import type { AgentRequestPayload, AgentResponsePayload } from "@/lib/agent-types";
import { callLLM, type LLMProvider } from "@/lib/llm";
import { buildAgentPrompt } from "@/lib/prompt-builder";
import { parseAgentResponse } from "@/lib/response-parser";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AgentRequestPayload;

    // Check for LLM configuration
    const provider = (process.env.LLM_PROVIDER as LLMProvider) || "openai";
    const apiKey = process.env.LLM_API_KEY;

    if (!apiKey) {
      // Fallback: return stub response if no API key configured
      return NextResponse.json(
        getStubResponse(body),
        { status: 200 }
      );
    }

    // Build structured prompt
    const { systemPrompt, userPrompt } = buildAgentPrompt(body);

    // Call LLM
    const llmResponse = await callLLM(
      {
        provider,
        apiKey,
        model: process.env.LLM_MODEL,
      },
      {
        systemPrompt,
        userPrompt,
        temperature: 0.7,
        maxTokens: 1000,
      }
    );

    // Parse and validate response
    const parsedResponse = parseAgentResponse(llmResponse.content);

    // Add usage info if available
    if (llmResponse.usage) {
      parsedResponse.details = `${parsedResponse.details || ""}\n\n[Tokens: ${llmResponse.usage.inputTokens} in, ${llmResponse.usage.outputTokens} out]`;
    }

    return NextResponse.json(parsedResponse);
  } catch (error: any) {
    console.error("Agent request error:", error);

    const response: AgentResponsePayload = {
      summary: `Error: ${error?.message || "Unknown error"}`,
      warnings: [
        "LLM request failed. Check API key and network.",
        `Details: ${error?.message || "No details available"}`,
      ],
      details: "Stub mode active. Configure LLM_API_KEY to enable real agent.",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * Fallback stub response when no API key is configured
 */
function getStubResponse(body: AgentRequestPayload): AgentResponsePayload {
  return {
    summary: `[STUB] Agent ready for ${body.mode}. Focus: ${body.today?.focus || "(not set)"}`,
    bullets: [
      "Configure LLM_API_KEY and LLM_PROVIDER in .env.local to enable real agent",
      "Supported providers: openai, anthropic",
      "Clarify top objectives for this session.",
      `Risk appetite: ${body.today?.riskLevel}/10`,
    ],
    warnings: body.wallets?.length ? ["Review wallet rules before any operations."] : undefined,
    details: "This is a stub response. Set up environment variables to activate the real agent.",
  };
}
