"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import "./globals.css";
import { MarketStripEnhanced } from "../components/MarketStripEnhanced";
import WalletLanes from "../components/WalletLanes";
import WalletBriefing from "../components/WalletBriefing";
import EventsPanel from "../components/EventsPanel";
import NotesPanel from "../components/NotesPanel";
import IdeasPanel from "../components/IdeasPanel";
import SnippetsPanel from "../components/SnippetsPanel";
import DailyFocusPanel from "../components/DailyFocusPanel";
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

import { getEvents, getIdeas, getWallets, Idea } from "../lib/api-client";

export type IdeaItem = Idea;

export type NoteItem = {
  id: string;
  text: string;
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
    text: "Anchor: Ops Home + Dojo CLI are the base. No new surfaces until this is stable and trusted.",
  },
];

const DEFAULT_IDEAS: IdeaItem[] = [
  {
    id: "idea-1",
    text: "Farcaster mini-app for alerts + publishing.",
    status: "promoted",
  },
  {
    id: "idea-2",
    text: "Agent that summarises my last 24h from notes/logs.",
    status: "open",
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

// Assumption: Single-user, local-only dashboard. No authentication, no teams, no sharing.
// Home screen shows today's events, recent notes, and recent ideas. All CRUD handled in panels.

function PageContent() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [snippets] = useState<SnippetItem[]>(DEFAULT_SNIPPETS);
  const [projects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  // Show today's events (assume dayOffset === 0 means today)
  const todaysEvents = events.filter((ev) => ev.dayOffset === 0);
  // Show 3 most recent notes
  const recentNotes = notes.slice(0, 3);
  // Show 3 most recent ideas
  const recentIdeas = ideas.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <h2 className="text-sm font-semibold text-gray-200">Active Lanes</h2>
            <Link href="/wallets" className="text-xs text-sky-400 hover:text-sky-300 transition-colors">
              Full Registry →
            </Link>
          </div>
          <MarketStripEnhanced />
          <WalletLanes wallets={wallets} onChange={setWallets} selected={selectedWallet} onSelect={setSelectedWallet} />
        </div>
        <div>
          <DailyFocusPanel />
          <div className="h-4" />
          <EventsPanel events={events} setEvents={setEvents} />
        </div>
        <div>
          <NotesPanel notes={notes} setNotes={setNotes} />
          <IdeasPanel ideas={ideas} setIdeas={setIdeas} />
          <SnippetsPanel snippets={snippets} />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4">
        <section className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4">
          <h2 className="text-sm font-semibold text-gray-200 mb-2">Today's Events</h2>
          {todaysEvents.length === 0 ? (
            <div className="text-xs text-zinc-400">No events scheduled for today.</div>
          ) : (
            <ul className="space-y-1 text-xs">
              {todaysEvents.map((ev) => (
                <li key={ev.id} className="rounded bg-zinc-900/80 px-2 py-1 flex items-center justify-between">
                  <span className="text-zinc-100">{ev.label}</span>
                  <span className="text-[10px] text-sky-400">{ev.when}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4">
          <h2 className="text-sm font-semibold text-gray-200 mb-2">Recent Notes</h2>
          {recentNotes.length === 0 ? (
            <div className="text-xs text-zinc-400">No notes yet.</div>
          ) : (
            <ul className="space-y-1 text-xs">
              {recentNotes.map((n, i) => (
                <li key={n.id || i} className="rounded bg-zinc-900/80 px-2 py-1 flex items-center justify-between">
                  <span className="text-zinc-100">{n.text}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4">
          <h2 className="text-sm font-semibold text-gray-200 mb-2">Recent Ideas</h2>
          {recentIdeas.length === 0 ? (
            <div className="text-xs text-zinc-400">No ideas yet.</div>
          ) : (
            <ul className="space-y-1 text-xs">
              {recentIdeas.map((i) => (
                <li key={i.id} className="rounded bg-zinc-900/80 px-2 py-1 flex items-center justify-between">
                  <span className="text-zinc-100">{i.text}</span>
                  <span className="text-[10px] text-zinc-400">{i.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <div className="mt-8">
        <DojoMap projects={projects} />
      </div>
      <div className="mt-8">
        <AgentConsole mode={"daily-plan"} setMode={() => { }} today={{ focus: "", riskLevel: 5, nonNegotiables: [] }} setToday={() => { }} wallets={wallets} events={events} />
      </div>
    </div>
  );
}

export default function Page() {
  return <PageContent />;
}
