// Agent types (used by client and /api/agent route)
// These match the UI state in app/page.tsx to avoid type mismatches.

export type AgentMode = "daily-plan" | "risk-audit" | "market-scan";

export type AgentTodayContext = {
  focus: string;
  riskLevel: number; // 1–10
  nonNegotiables: string[];
};

// UI Wallet model (inlined here to avoid circular imports)
export type UIWallet = {
  id: string;
  label: string;
  purpose: string;
  riskBand: "safe" | "operational" | "speculative";
  notes?: string;
  // Enhanced metadata
  address?: string;
  browserProfile?: string;
  provider?: string;
  persona?: string;
  forbiddenWith?: string[];
  allowedWith?: string[];
};

// UI Event model (inlined here to avoid circular imports)
export type UIEvent = {
  id: string;
  label: string;
  when: string;
  dayOffset: number;
  importance: "low" | "normal" | "high" | "critical";
  type: "time-bound" | "ongoing";
};

export type AgentRequestPayload = {
  mode: AgentMode;
  prompt: string;
  today: AgentTodayContext;
  wallets: UIWallet[];
  events: UIEvent[];
};

export type AgentResponse = {
  summary: string;
  bullets?: string[];
  warnings?: string[];
  details?: string;
};

export type AgentResponsePayload = AgentResponse;
