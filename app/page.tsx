"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import "./globals.css";
import MarketStrip from "../components/MarketStrip";
import WalletLanes from "../components/WalletLanes";
import WalletBriefing from "../components/WalletBriefing";
import EventsPanel from "../components/EventsPanel";
import NotesPanel from "../components/NotesPanel";
import IdeasPanel from "../components/IdeasPanel";
import SnippetsPanel from "../components/SnippetsPanel";
import DojoMap from "../components/DojoMap";
import AgentConsole from "../components/AgentConsole";
import { arenas } from "@/lib/arenas";
import type {
  AgentMode,
  AgentTodayContext,
  UIWallet,
  UIEvent,
  AgentRequestPayload,
  AgentResponse,
} from "../lib/agent-types";
import { clsx } from "clsx";

const ReactCalendar = dynamic(() => import("react-calendar"), { ssr: false });

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type RiskBand = "safe" | "operational" | "speculative";
type EventType = UIEvent["type"];

// Re-export UIWallet as Wallet for page.tsx convenience
type Wallet = UIWallet;

// Re-export UIEvent as EventItem for page.tsx convenience

type EventItem = UIEvent;
type EventImportance = UIEvent["importance"];


type NoteItem = {
  id: string;
  label: string;
  detail?: string;
};

type IdeaItem = {
  id: string;
  label: string;
  status: "idea" | "shaping" | "live";
};

type SnippetItem = {
  id: string;
  label: string;
  content: string;
};

type ProjectItem = {
  id: string;
  label: string;
  status: "live" | "paused" | "idea";
  path: string;
};

// ----------------------------
// Local storage helpers
// ----------------------------
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// ----------------------------
// Static defaults
// ----------------------------
const DEFAULT_WALLETS: Wallet[] = [
  {
    id: "safe-cold",
    label: "Cold storage",
    purpose: "Long-term safety. Never touched for ops.",
    riskBand: "safe",
    address: "0x....cold",
    browserProfile: "N/A – offline",
    provider: "Hardware",
    persona: "Long-term safety",
    forbiddenWith: ["Trading", "Experiments"],
    allowedWith: ["Strategic holds"],
    notes: "Only moved with extreme justification.",
  },
  {
    id: "ops-core",
    label: "Ops core",
    purpose: "Day-to-day operational spend.",
    riskBand: "operational",
    address: "0x....ops",
    browserProfile: "Brave – Ops profile",
    provider: "Rabby",
    persona: "Snowziesk Ops",
    forbiddenWith: ["Speculative trades", "New contracts"],
    allowedWith: ["Kyan", "Farcaster clients"],
  },
  {
    id: "spec-play",
    label: "Speculative",
    purpose: "High-risk experiments. Never from cold.",
    riskBand: "speculative",
    address: "0x....spec",
    browserProfile: "Brave – Degen profile",
    provider: "Metamask",
    persona: "Experiment sandbox",
    forbiddenWith: ["Cold storage", "Real ops"],
    allowedWith: ["High-risk tests"],
    notes: "Assume this can go to zero.",
  },
];

const DEFAULT_EVENTS: EventItem[] = [
  {
    id: "event-1",
    label: "Check wallets: balances + recent moves",
    when: "Today 16:00",
    dayOffset: 0,
    importance: "high",
    type: "ongoing",
  },
  {
    id: "event-2",
    label: "Ops Home review",
    when: "Today 21:00",
    dayOffset: 0,
    importance: "normal",
    type: "ongoing",
  },
  {
    id: "event-3",
    label: "Farcaster mini-app shaping",
    when: "Tomorrow 14:00",
    dayOffset: 1,
    importance: "normal",
    type: "time-bound",
  },
];

const DEFAULT_NOTES: NoteItem[] = [
  {
    id: "note-1",
    label: "Anchor: Ops Home + Dojo CLI are the base.",
    detail: "No new surfaces until this is stable and trusted.",
  },
];

const DEFAULT_IDEAS: IdeaItem[] = [
  {
    id: "idea-1",
    label: "Farcaster mini-app for alerts + publishing.",
    status: "shaping",
  },
  {
    id: "idea-2",
    label: "Agent that summarises my last 24h from notes/logs.",
    status: "idea",
  },
];

const DEFAULT_SNIPPETS: SnippetItem[] = [
  {
    id: "snip-1",
    label: "WSL path to dojo",
    content: "cd ~/dojo",
  },
  {
    id: "snip-2",
    label: "Serve ops-home",
    content: "dojo serve ops-home",
  },
];

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "proj-ops-home",
    label: "Ops Home",
    status: "live",
    path: "~/dojo/apps/ops-home",
  },
  {
    id: "proj-farcaster-mini",
    label: "Farcaster mini-app",
    status: "idea",
    path: "~/dojo/apps/farcaster-mini",
  },
];

// ----------------------------
// Small helpers
// ----------------------------
function riskBandLabel(band: RiskBand) {
  switch (band) {
    case "safe":
      return "SAFE";
    case "operational":
      return "OPS";
    case "speculative":
      return "SPEC";
    default:
      return band;
  }
}

function importanceLabel(imp: EventImportance) {
  switch (imp) {
    case "low":
      return "LOW";
    case "normal":
      return "NORMAL";
    case "high":
      return "HIGH";
    case "critical":
      return "CRITICAL";
    default:
      return imp;
  }
}

function importanceColor(imp: EventImportance) {
  switch (imp) {
    case "low":
      return "bg-zinc-800 text-zinc-200";
    case "normal":
      return "bg-sky-900 text-sky-200";
    case "high":
      return "bg-amber-900 text-amber-200";
    case "critical":
      return "bg-rose-900 text-rose-200";
    default:
      return "bg-zinc-800 text-zinc-200";
  }
}

function Card(props: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section
      className={clsx(
        "flex flex-col rounded-xl border border-zinc-700 bg-zinc-900/50",
        "shadow-sm shadow-black/40 backdrop-blur-sm",
        props.className
      )}
    >
      <header className="flex items-center justify-between px-4 py-2 border-b border-zinc-700/70">
        <h2 className="text-sm font-semibold tracking-wide text-gray-200 uppercase">
          {props.title}
        </h2>
      </header>
      <div className="flex-1 px-4 py-3 overflow-hidden">{props.children}</div>
    </section>
  );
}

// ----------------------------
// UI sections
// (moved to `components/` directory)
// ----------------------------

// ----------------------------
// Main page
// ----------------------------
export default function Page() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [snippets] = useState<SnippetItem[]>(DEFAULT_SNIPPETS);
  const [projects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  const [riskLevel, setRiskLevel] = useState(3);
  const [nonNegotiables, setNonNegotiables] = useState<string[]>(["", "", ""]);
  const [calendarValue, setCalendarValue] = useState<Value>(new Date());
  const [eventTypeFilters, setEventTypeFilters] = useState<Record<EventType, boolean>>({
    ongoing: true,
    "time-bound": true,
  });
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const [agentMode, setAgentMode] = useState<AgentMode>("daily-plan");
  const [todayCtx, setTodayCtx] = useState<AgentTodayContext>({
    focus: "Stabilise Ops Home + Dojo CLI.",
    riskLevel: 5,
    nonNegotiables: ["No cold wallet risk", "No new surfaces"],
  });

  // Only persist riskLevel, nonNegotiables, todayCtx, agentMode
  useEffect(() => {
    saveToStorage("ops-home:risk-level", riskLevel);
  }, [riskLevel]);
  useEffect(() => {
    saveToStorage("ops-home:non-negotiables", nonNegotiables);
  }, [nonNegotiables]);
  useEffect(() => {
    saveToStorage("ops-home:todayctx", todayCtx);
  }, [todayCtx]);
  useEffect(() => {
    saveToStorage("ops-home:agent-mode", agentMode);
  }, [agentMode]);

  // Event filtering and grouping
  const filteredEvents = useMemo(
    () => events.filter((ev) => eventTypeFilters[ev.type]),
    [events, eventTypeFilters]
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    for (const ev of filteredEvents) {
      const dateStr = ev.when || "unknown";
      if (!map.has(dateStr)) map.set(dateStr, []);
      map.get(dateStr)!.push(ev);
    }
    return map;
  }, [filteredEvents]);

  const onToggleType = (type: EventType) => {
    setEventTypeFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const onCalendarClickDay = (value: Date) => {
    const dateStr = value.toISOString().slice(0, 10);
    const evs = eventsByDate.get(dateStr);
    if (!evs || evs.length === 0) return;
    setSelectedEvent(evs[0]);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-4 space-y-4">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Ops Home</h1>
            <p className="text-xs text-zinc-400">
              Your daily cockpit. Focus · wallets · events · agent · ideas.
            </p>
          </div>
          <div className="text-right text-[11px] text-zinc-400">
            <div>Dojo: ~/dojo</div>
            <div>App: ~/dojo/apps/ops-home</div>
          </div>
        </header>

        <MarketStrip />

        {/* Top row: Today focus, Risk level, Non-negotiables */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card title="Today's Focus">
            <input
              type="text"
              placeholder="What matters most today?"
              value={todayCtx.focus}
              onChange={(e) => setTodayCtx({ ...todayCtx, focus: e.target.value })}
              className="w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </Card>

          <Card title="Risk Level">
            <div className="flex flex-col gap-3">
              <input
                type="range"
                min={1}
                max={5}
                value={riskLevel}
                onChange={(e) => setRiskLevel(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>1 (cold)</span>
                <span className="text-sm font-semibold text-sky-400">
                  {riskLevel}
                </span>
                <span>5 (hot)</span>
              </div>
            </div>
          </Card>

          <Card title="Non‑negotiables">
            <div className="flex flex-col gap-2">
              {nonNegotiables.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 w-4">{idx + 1}.</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const copy = [...nonNegotiables];
                      copy[idx] = e.target.value;
                      setNonNegotiables(copy);
                    }}
                    className="flex-1 rounded-md bg-zinc-950 border border-zinc-800 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="Non‑negotiable for today"
                  />
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Main three-column layout */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Column 1: Wallets + Calendar */}
          <div className="space-y-4">
            <WalletLanes wallets={wallets} onChange={setWallets} selected={selectedWallet} onSelect={setSelectedWallet} />
            
            <Card title="Calendar & Events" className="min-h-[320px]">
              <div className="flex flex-col h-full gap-2">
                <div className="flex flex-wrap gap-2 text-[11px] mb-2">
                  {(["ongoing", "time-bound"] as EventType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => onToggleType(t)}
                      className={clsx(
                        "inline-flex items-center gap-1 rounded-full px-2 py-1 border text-xs",
                        eventTypeFilters[t]
                          ? "border-sky-500 bg-sky-500/10 text-sky-300"
                          : "border-zinc-700 bg-zinc-900/40 text-zinc-400"
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span>{t}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-3 min-h-0">
                  <div className="rounded-lg border border-zinc-700 bg-zinc-900/40 p-2 text-[11px]">
                    <ReactCalendar
                      onChange={setCalendarValue}
                      value={calendarValue}
                      onClickDay={onCalendarClickDay}
                      className="w-full bg-transparent text-xs text-zinc-100 [&_.react-calendar__navigation]:mb-1 [&_.react-calendar__tile]:text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-2 text-xs overflow-auto max-h-[150px]">
                    <h3 className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
                      Upcoming
                    </h3>
                    {filteredEvents
                      .slice()
                      .sort((a, b) => (a.when || "").localeCompare(b.when || ""))
                      .map((ev) => (
                        <button
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className="w-full text-left rounded-md border border-zinc-700 bg-zinc-900/40 px-2 py-2 hover:border-sky-500/60 hover:bg-sky-500/10"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] text-zinc-400">
                              {ev.when} · {ev.label?.substring(0, 20)}...
                            </span>
                          </div>
                        </button>
                      ))}
                    {filteredEvents.length === 0 && (
                      <p className="text-xs text-zinc-500">No events with current filters.</p>
                    )}
                  </div>
                </div>

                {selectedEvent && (
                  <div className="mt-2 rounded-md border border-zinc-700 bg-zinc-900/60 p-2 text-[11px]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-zinc-200 font-semibold">
                          {selectedEvent.label}
                        </div>
                        <div className="text-zinc-400 text-[11px]">
                          {selectedEvent.when}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedEvent(null)}
                        className="text-zinc-500 hover:text-zinc-300 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Column 2: Arenas + Events + Agent */}
          <div className="space-y-4">
            <Card title="Arenas" className="min-h-[200px]">
              <div className="overflow-auto max-h-[280px] text-xs">
                <table className="w-full border-collapse">
                  <thead className="bg-zinc-800/30 sticky top-0 z-10">
                    <tr>
                      <th className="px-2 py-2 text-left font-medium text-zinc-300">Name</th>
                      <th className="px-2 py-2 text-left font-medium text-zinc-300">Type</th>
                      <th className="px-2 py-2 text-left font-medium text-zinc-300">Status</th>
                      <th className="px-2 py-2 text-right font-medium text-zinc-300">Open</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arenas.map((a) => (
                      <tr
                        key={a.name}
                        className="border-b border-zinc-800/40 hover:bg-zinc-800/20"
                      >
                        <td className="px-2 py-2 font-semibold text-zinc-100">{a.name}</td>
                        <td className="px-2 py-2 text-zinc-300">{a.type}</td>
                        <td className="px-2 py-2">
                          <span
                            className={clsx(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                              a.status === "live" || a.status === "active"
                                ? "bg-emerald-500/15 text-emerald-300"
                                : a.status === "scouting"
                                ? "bg-yellow-500/10 text-yellow-300"
                                : "bg-sky-500/10 text-sky-300"
                            )}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-right">
                          <button
                            onClick={() =>
                              window.open(a.url, "_blank", "noopener,noreferrer")
                            }
                            className="inline-flex items-center rounded-md border border-sky-500/40 bg-sky-500/10 px-2 py-1 text-[11px] font-semibold text-sky-400 hover:bg-sky-500/20"
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <EventsPanel events={events} setEvents={setEvents} />

            <AgentConsole
              mode={agentMode}
              setMode={setAgentMode}
              today={todayCtx}
              setToday={setTodayCtx}
              wallets={wallets}
              events={events}
            />
          </div>

          {/* Column 3: Notes, Ideas, Snippets, Projects, Links */}
          <div className="space-y-4">
            <NotesPanel notes={notes} setNotes={setNotes} />
            <IdeasPanel ideas={ideas} setIdeas={setIdeas} />
            <SnippetsPanel snippets={snippets} />
            <DojoMap projects={projects} />

            <Card title="Quick Links" className="min-h-[160px]">
              <div className="flex flex-col h-full gap-2 text-xs overflow-auto">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Bybit", url: "https://www.bybit.com" },
                    { label: "Polymarket", url: "https://polymarket.com" },
                    { label: "Betmoar", url: "https://www.betmoar.fun/markets?view=calendar" },
                    { label: "Bullpen", url: "https://app.bullpen.fi" },
                    { label: "42", url: "https://beta.42.space" },
                    { label: "Zapper", url: "https://build.zapper.xyz" },
                    { label: "ENS", url: "https://app.ens.domains" },
                    { label: "GitHub", url: "https://github.com" },
                    { label: "Farcaster", url: "https://warpcast.com" },
                    { label: "Email", url: "https://mail.google.com" },
                    { label: "Discord", url: "https://discord.com/app" },
                    { label: "Telegram", url: "https://web.telegram.org" }
                  ].map((l) => (
                    <button
                      key={l.label}
                      onClick={() =>
                        window.open(l.url, "_blank", "noopener,noreferrer")
                      }
                      className="flex items-center justify-between gap-2 rounded-md border border-zinc-700 bg-zinc-900/40 px-2 py-2 text-left hover:border-sky-500/40 hover:bg-sky-500/5"
                    >
                      <span className="text-[11px] text-zinc-100">
                        {l.label}
                      </span>
                      <span className="text-[9px] text-zinc-500">↗</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Footer: Wallet briefing */}
        {selectedWallet && (
          <footer className="border-t border-zinc-800 bg-zinc-900/90 px-4 py-3 rounded-md">
            <WalletBriefing wallet={selectedWallet} />
          </footer>
        )}
      </div>
    </main>
  );
}
