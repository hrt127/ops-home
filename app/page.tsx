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
// Moved to (protected) route group for auth
import ProtectedLayout from "./(protected)/layout";

import { useSession, signIn, signOut } from "next-auth/react";

function PageContent() {
  const { data: session, status } = useSession();
  // ...existing state and logic...
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
    <ProtectedLayout>
      <div className="flex items-center justify-end gap-4 p-4">
        {status === "loading" ? (
          <span>Loading...</span>
        ) : session ? (
          <>
            <span className="text-sm text-gray-300">Signed in as {session.user?.email || session.user?.name}</span>
            <button className="bg-zinc-800 px-3 py-1 rounded text-gray-200" onClick={() => signOut()}>Logout</button>
          </>
        ) : (
          <button className="bg-sky-700 px-3 py-1 rounded text-white" onClick={() => signIn()}>Login</button>
        )}
      </div>
      {/* ...existing code... */}
    </ProtectedLayout>
  );
}

export default function Page() {
  return <PageContent />;
}
