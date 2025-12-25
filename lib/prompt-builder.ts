// Prompt builder for agent requests
// Formats wallet, event, and context data into structured prompts for the LLM

import type { AgentMode, AgentRequestPayload } from "./agent-types";

/**
 * Build a structured prompt for the agent based on mode and context
 */
export function buildAgentPrompt(
  payload: AgentRequestPayload
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = buildSystemPrompt(payload.mode);
  const userPrompt = buildUserPrompt(payload);

  return { systemPrompt, userPrompt };
}

/**
 * System prompt defines agent role and instructions based on mode
 */
function buildSystemPrompt(mode: AgentMode): string {
  const basePrompt = `You are a concise, expert financial advisor helping manage cryptocurrency portfolios and operations.
Respond in JSON format with the following structure:
{
  "summary": "A 1-2 sentence overview of your recommendation",
  "bullets": ["Action item 1", "Action item 2", ...],
  "warnings": ["Risk or concern 1", "Risk or concern 2", ...],
  "details": "Optional deeper context or reasoning"
}
Keep responses focused, actionable, and brief.`;

  switch (mode) {
    case "daily-plan":
      return (
        basePrompt +
        `\n\nFor daily planning, prioritize:
1. Wallet operations and spending goals
2. Upcoming events and deadlines
3. Risk management within today's risk appetite
4. Quick wins and scheduled tasks`
      );

    case "risk-audit":
      return (
        basePrompt +
        `\n\nFor risk audits, focus on:
1. Wallet exposure and concentration risks
2. Forbidden pairs and rule violations
3. Market volatility and drawdown scenarios
4. Counterparty and smart contract risks`
      );

    case "market-scan":
      return (
        basePrompt +
        `\n\nFor market scans, analyze:
1. Upcoming events that could impact positions
2. Market opportunities aligned with risk tolerance
3. Portfolio rebalancing opportunities
4. Macro conditions and tail risks`
      );

    default:
      return basePrompt;
  }
}

/**
 * User prompt includes all context: today's focus, wallets, events, and optional question
 */
function buildUserPrompt(payload: AgentRequestPayload): string {
  const lines: string[] = [];

  // Today context
  lines.push("## Today's Context");
  lines.push(`Focus: ${payload.today.focus || "(not set)"}`);
  lines.push(
    `Risk level: ${payload.today.riskLevel}/10 (${getRiskLabel(payload.today.riskLevel)})`
  );
  if (payload.today.nonNegotiables.length > 0) {
    lines.push(`Non-negotiables: ${payload.today.nonNegotiables.join(", ")}`);
  }
  lines.push("");

  // Wallets
  lines.push("## Wallets");
  if (payload.wallets.length === 0) {
    lines.push("(none configured)");
  } else {
    payload.wallets.forEach((w) => {
      const purpose = w.purpose ? ` — ${w.purpose}` : "";
      const risk = `[${w.riskBand.toUpperCase()}]`;
      lines.push(`- ${w.label} ${risk}${purpose}`);
      if (w.notes) {
        lines.push(`  Rules: ${w.notes}`);
      }
    });
  }
  lines.push("");

  // Events
  lines.push("## Upcoming Events");
  if (payload.events.length === 0) {
    lines.push("(none)");
  } else {
    const grouped = groupEventsByDay(payload.events);
    ["Today", "Tomorrow", "+2"].forEach((label, idx) => {
      const dayOffset = idx;
      const dayEvents = grouped[dayOffset] || [];
      if (dayEvents.length > 0) {
        lines.push(`${label}:`);
        dayEvents.forEach((e) => {
          const importance = `[${e.importance.toUpperCase()}]`;
          lines.push(`  - ${e.label} ${importance}`);
        });
      }
    });
  }
  lines.push("");

  // User prompt (optional extra context)
  if (payload.prompt && payload.prompt !== "(no extra prompt)") {
    lines.push("## Additional Context");
    lines.push(payload.prompt);
    lines.push("");
  }

  lines.push("Please provide concise, actionable guidance for this situation.");

  return lines.join("\n");
}

/**
 * Group events by day offset
 */
function groupEventsByDay(
  events: AgentRequestPayload["events"]
): Record<number, typeof events> {
  const grouped: Record<number, typeof events> = {};
  events.forEach((e) => {
    if (!grouped[e.dayOffset]) grouped[e.dayOffset] = [];
    grouped[e.dayOffset].push(e);
  });
  return grouped;
}

/**
 * Convert numeric risk level to label
 */
function getRiskLabel(riskLevel: number): string {
  if (riskLevel <= 3) return "calm";
  if (riskLevel <= 6) return "elevated";
  return "hot";
}
