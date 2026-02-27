"use client";

import useSWR from "swr";

type Game = {
  id: string;
  home: string;
  away: string;
  priority?: string;
  market?: {
    spread?: string;
    total?: number;
  };
};

type Slate = {
  meta?: {
    date?: string;
  };
  games?: Game[];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function NbaSlatePanel() {
  const { data, error, isLoading } = useSWR<Slate>(
    "/api/sports/nba-slate",
    fetcher,
    { refreshInterval: 5 * 60 * 1000 }
  );

  if (error) return <div className="card">NBA Slate: error loading</div>;
  if (isLoading || !data) return <div className="card">NBA Slate: loading…</div>;

  const date = data.meta?.date ?? "Unknown date";
  const games = data.games ?? [];

  return (
    <div className="card">
      <h2>NBA Slate — {date}</h2>
      {games.length === 0 && <p>No games found.</p>}
      <ul>
        {games.map((g) => (
          <li key={g.id}>
            <strong>{g.away}</strong> at <strong>{g.home}</strong>{" "}
            {g.priority && <span>[{g.priority}] </span>}
            {g.market?.spread && <span>Spread: {g.market.spread} </span>}
            {typeof g.market?.total === "number" && (
              <span>Total: {g.market.total}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
