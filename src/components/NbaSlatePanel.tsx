"use client";

import useSWR from "swr";
import { clsx } from "clsx";

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

type SlateFile = {
  meta?: {
    date?: string;
  };
  games?: Game[];
};

type ApiResponse = {
  slates?: SlateFile[];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function parseDate(d?: string): Date | null {
  if (!d) return null;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export function NbaSlatePanel() {
  const { data, error, isLoading } = useSWR<ApiResponse>(
    "/api/sports/nba-slate",
    fetcher,
    { refreshInterval: 5 * 60 * 1000 }
  );

  if (error) return (
    <div className="glass panel-shadow p-6 text-rose-400 mono text-xs">
      NBA Slate: error loading. Check directory: data/sports/nba/slates/
    </div>
  );

  if (isLoading || !data) return (
    <div className="glass panel-shadow p-6 text-zinc-500 mono text-xs animate-pulse">
      NBA Slate: loading…
    </div>
  );

  const slates = data.slates ?? [];

  // Group games by date string
  const grouped: Record<string, Game[]> = {};
  for (const slate of slates) {
    const date = slate.meta?.date;
    if (!date) continue;
    if (!grouped[date]) grouped[date] = [];
    for (const g of slate.games ?? []) {
      grouped[date].push(g);
    }
  }

  // Build a sorted list of upcoming dates (today + next few)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = Object.keys(grouped).sort((a, b) => {
    const da = parseDate(a)?.getTime() ?? 0;
    const db = parseDate(b)?.getTime() ?? 0;
    return da - db;
  });

  const upcomingDates = dates.filter((d) => {
    const dt = parseDate(d);
    if (!dt) return false;
    dt.setHours(0, 0, 0, 0);
    return dt.getTime() >= today.getTime();
  });

  const shownDates = upcomingDates.slice(0, 3); // “next few days”

  return (
    <div className="glass panel-shadow flex flex-col panel-mount overflow-hidden">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="upper text-orange-400 tracking-[0.2em]">NBA SLATE — Today & Next Few Days</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 pulse" />
          <div className="text-[10px] mono text-zinc-500 font-bold uppercase tracking-widest bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800/50">
            {shownDates.length} SLATES
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-6">
        {shownDates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-600 opacity-50 scale-in">
            <div className="text-3xl mb-3">○</div>
            <p className="mono text-[10px] uppercase tracking-[0.2em]">No upcoming slates found.</p>
          </div>
        )}

        {shownDates.map((date) => (
          <div key={date} className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h3 className="text-[10px] mono font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 pl-1 border-l-2 border-orange-500/50">
              {date === new Date().toISOString().split('T')[0] ? 'TODAY' : date}
            </h3>
            <ul className="space-y-2">
              {(grouped[date] || []).map((g) => (
                <li
                  key={g.id}
                  className="group flex flex-col gap-1 p-3 rounded-lg border border-zinc-800/50 bg-zinc-900/30 hover:border-orange-500/20 hover:bg-zinc-800/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-200">
                      <span className="group-hover:text-orange-400 transition-colors uppercase">{g.away}</span>
                      <span className="mx-2 text-zinc-600">at</span>
                      <span className="group-hover:text-orange-400 transition-colors uppercase">{g.home}</span>
                    </span>
                    {g.priority && (
                      <span className="text-[9px] mono px-1.5 py-0.5 rounded bg-orange-950/30 text-orange-400 border border-orange-900/40 font-bold uppercase tracking-tighter">
                        {g.priority}
                      </span>
                    )}
                  </div>

                  {(g.market?.spread || typeof g.market?.total === "number") && (
                    <div className="flex gap-3 text-[10px] mono text-zinc-500 mt-1">
                      {g.market?.spread && (
                        <div className="flex items-center gap-1">
                          <span className="text-zinc-600 font-bold uppercase">Spread</span>
                          <span className="text-zinc-300">{g.market.spread}</span>
                        </div>
                      )}
                      {typeof g.market?.total === "number" && (
                        <div className="flex items-center gap-1 border-l border-zinc-800/80 pl-3">
                          <span className="text-zinc-600 font-bold uppercase">Total</span>
                          <span className="text-zinc-300">{g.market.total}</span>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
