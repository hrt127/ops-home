// LLM provider interface and implementations
// Supports OpenAI, Anthropic, and extensible for others

export type LLMProvider = "openai" | "anthropic";

export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  model?: string;
}

export interface LLMRequest {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

/**
 * Unified LLM interface — abstracts away provider differences
 */
export async function callLLM(
  config: LLMConfig,
  request: LLMRequest
): Promise<LLMResponse> {
  switch (config.provider) {
    case "openai":
      return callOpenAI(config, request);
    case "anthropic":
      return callAnthropic(config, request);
    default:
      throw new Error(`Unknown LLM provider: ${config.provider}`);
  }
}

/**
 * OpenAI API call (gpt-4-turbo or gpt-3.5-turbo)
 */
async function callOpenAI(
  config: LLMConfig,
  request: LLMRequest
): Promise<LLMResponse> {
  const model = config.model || "gpt-3.5-turbo";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: request.systemPrompt },
        { role: "user", content: request.userPrompt },
      ],
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `OpenAI API error: ${response.status} — ${error.error?.message || "Unknown error"}`
    );
  }

  const data = await response.json();
  return {
    content: data.choices[0]?.message?.content || "",
    usage: {
      inputTokens: data.usage?.prompt_tokens || 0,
      outputTokens: data.usage?.completion_tokens || 0,
    },
  };
}

/**
 * Anthropic Claude API call
 */
async function callAnthropic(
  config: LLMConfig,
  request: LLMRequest
): Promise<LLMResponse> {
  const model = config.model || "claude-3-5-sonnet-20241022";
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: request.maxTokens ?? 1000,
      system: request.systemPrompt,
      messages: [
        {
          role: "user",
          content: request.userPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Anthropic API error: ${response.status} — ${error.error?.message || "Unknown error"}`
    );
  }

  const data = await response.json();
  return {
    content: data.content[0]?.text || "",
    usage: {
      inputTokens: data.usage?.input_tokens || 0,
      outputTokens: data.usage?.output_tokens || 0,
    },
  };
}
