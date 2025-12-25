export type ArenaStatus = "live" | "active" | "scouting" | "research" | "tracking";

export type ArenaType =
  | "btc_options_perps"
  | "prediction"
  | "sports_markets"
  | "research"
  | "portfolio"
  | "identity";

export type Arena = {
  name: string;
  type: ArenaType;
  status: ArenaStatus;
  url: string;
  comment: string;
};

export const arenas: Arena[] = [
  {
    name: "Kyan",
    type: "btc_options_perps",
    status: "live",
    url: "https://www.kyan.exchange",
    comment: "Main BTC book"
  },
  {
    name: "Polymarket",
    type: "prediction",
    status: "scouting",
    url: "https://polymarket.com",
    comment: "Prediction markets"
  },
  {
    name: "Betmoar",
    type: "sports_markets",
    status: "active",
    url: "https://www.betmoar.fun/markets?view=calendar",
    comment: "Sports markets + calendar"
  },
  {
    name: "Bullpen",
    type: "sports_markets",
    status: "active",
    url: "https://app.bullpen.fi",
    comment: "Sports structured bets"
  },
  {
    name: "42",
    type: "research",
    status: "research",
    url: "https://beta.42.space",
    comment: "Research / intel"
  },
  {
    name: "Zapper",
    type: "portfolio",
    status: "tracking",
    url: "https://build.zapper.xyz",
    comment: "Onchain portfolio overview"
  },
  {
    name: "ENS",
    type: "identity",
    status: "active",
    url: "https://app.ens.domains",
    comment: "Names / identity"
  }
];
