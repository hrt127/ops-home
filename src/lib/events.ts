export type EventType = "prediction" | "sports" | "options" | "macro" | "life";

export type CockpitEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: EventType;
  source: string;
  url?: string | null;
  importance: "low" | "medium" | "high";
};

export const events: CockpitEvent[] = [
  {
    id: "btc-expiry",
    title: "BTC options expiry (Kyan)",
    date: "2025-01-31",
    type: "options",
    source: "Kyan",
    url: "https://www.kyan.exchange",
    importance: "high"
  },
  {
    id: "poly-1",
    title: "Polymarket – key market resolves",
    date: "2025-02-10",
    type: "prediction",
    source: "Polymarket",
    url: "https://polymarket.com",
    importance: "high"
  },
  {
    id: "betmoar-1",
    title: "EPL match (Betmoar)",
    date: "2025-01-14",
    type: "sports",
    source: "Betmoar",
    url: "https://www.betmoar.fun/markets?view=calendar",
    importance: "medium"
  },
  {
    id: "fomc-1",
    title: "FOMC meeting",
    date: "2025-02-15",
    type: "macro",
    source: "macro",
    importance: "high"
  },
  {
    id: "no-screens",
    title: "No screens day",
    date: "2025-01-05",
    type: "life",
    source: "personal",
    importance: "high"
  }
];
