// Parse and validate agent responses from LLM

import type { AgentResponsePayload } from "./agent-types";

/**
 * Parse LLM response into structured AgentResponsePayload
 * Handles JSON parsing, fallback formatting, and validation
 */
export function parseAgentResponse(
  llmContent: string
): AgentResponsePayload {
  // Attempt to parse JSON
  let parsed: any;
  try {
    parsed = JSON.parse(llmContent);
  } catch {
    // If JSON parsing fails, try to extract JSON from markdown code blocks
    const jsonMatch = llmContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[1]);
      } catch {
        // Fallback: treat entire response as summary
        return fallbackResponse(llmContent);
      }
    } else {
      return fallbackResponse(llmContent);
    }
  }

  // Validate and extract fields
  const summary = extractString(parsed.summary, "Unable to parse response");
  const bullets = extractArray(parsed.bullets, []);
  const warnings = extractArray(parsed.warnings, []);
  const details = extractString(parsed.details, "");

  return {
    summary,
    bullets: bullets.length > 0 ? bullets : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
    details: details ? details : undefined,
  };
}

/**
 * Fallback response when JSON parsing fails
 */
function fallbackResponse(text: string): AgentResponsePayload {
  // Try to extract first sentence as summary
  const summaryMatch = text.match(/^([^.!?]*[.!?])/);
  const summary = summaryMatch ? summaryMatch[1].trim() : text.substring(0, 100);

  // Try to find bullet points
  const bulletMatches = text.match(/^[\s\-\*]\s+(.+)$/gm);
  const bullets = bulletMatches
    ? bulletMatches.map((b) => b.replace(/^[\s\-\*]\s+/, "").trim())
    : [];

  return {
    summary,
    bullets: bullets.length > 0 ? bullets : undefined,
    details: text,
  };
}

/**
 * Safe string extraction with fallback
 */
function extractString(value: any, fallback: string): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value).substring(0, 500);
  }
  return fallback;
}

/**
 * Safe array extraction with filtering
 */
function extractArray(value: any, fallback: string[]): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : String(item)))
      .filter((item) => item.length > 0)
      .slice(0, 10); // Limit to 10 items
  }
  return fallback;
}
