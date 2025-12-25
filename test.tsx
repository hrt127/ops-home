"use client";

import React, { useEffect, useState } from "react";

// ----------------------------
// Types
// ----------------------------
type RiskBand = "safe" | "operational" | "speculative";

type Wallet = {
  id: string;
  label: string;
  purpose: string;
  riskBand: RiskBand;
  notes?: string;
};

type EventImportance = "low" | "normal" | "high" | "critical";

type EventItem = {
  id: string;
  label: string;
  when: string; // ISO or human
  dayOffset: number; // 0 = today, 1 = tomorrow, 2 = day after
  importance: EventImportance;
  type: "time-bound" | "ongoing";
};

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

type AgentMode = "daily-plan" | "risk-audit" | "market-scan";

type AgentTodayContext = {
  focus: string;
  riskLevel: number; // 1–10
  nonNegotiables: string[];
};

type AgentRequestPayload = {
  mode: AgentMode;
  prompt: string;
  today: AgentTodayContext;
  wallets: Wallet[];
  events: EventItem[];
};

type AgentResponse = {
  summary: string;
  bullets?: string[];
  warnings?: string[];
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
    id: "cold-main",
    label: "Cold storage",
    purpose: "Long-term safety. Never touched for ops.",
    riskBand: "safe",
    notes: "Only moved with extreme justification.",
  },
  {
    id: "ops-core",
    label: "Ops core",
    purpose: "Day-to-day operational spend.",
    riskBand: "operational",
  },
  {
    id: "spec-play",
    label: "Speculative",
    purpose: "High-risk experiments. Never from cold.",
    riskBand: "speculative",
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

// ----------------------------
// UI sections
// ----------------------------
function MarketStrip() {
  // Stubbed, but visible
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-[11px] flex justify-between">
      <div className="flex gap-4">
        <span className="text-zinc-400">Market:</span>
        <span className="text-emerald-300">BTC ~ &mdash;</span>
        <span className="text-sky-300">ETH ~ &mdash;</span>
      </div>
      <div className="flex gap-4 text-zinc-400">
        <span>Local time: {/* placeholder */}now</span>
        <span>UTC: {/* placeholder */}now</span>
      </div>
    </div>
  );
}

function WalletLanes({
  wallets,
  onChange,
}: {
  wallets: Wallet[];
  onChange: (wallets: Wallet[]) => void;
}) {
  const updateWallet = (id: string, patch: Partial<Wallet>) => {
    const updated = wallets.map((w) => (w.id === id ? { ...w, ...patch } : w));
    onChange(updated);
  };

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Wallet lanes</h2>
      </div>
      <div className="space-y-2">
        {wallets.map((w) => (
          <div
            key={w.id}
            className="rounded bg-zinc-900/80 px-2 py-2 text-xs space-y-1"
          >
            <div className="flex items-center justify-between gap-2">
              <input
                className="w-full bg-transparent text-zinc-100 text-xs border-b border-zinc-700 focus:outline-none focus:border-sky-500"
                value={w.label}
                onChange={(e) =>
                  updateWallet(w.id, { label: e.target.value || w.id })
                }
              />
              <select
                className="rounded px-1.5 py-0.5 text-[10px] bg-zinc-950 border border-zinc-700"
                value={w.riskBand}
                onChange={(e) =>
                  updateWallet(w.id, { riskBand: e.target.value as RiskBand })
                }
              >
                <option value="safe">SAFE</option>
                <option value="operational">OPS</option>
                <option value="speculative">SPEC</option>
              </select>
            </div>
            <input
              className="w-full bg-transparent text-[11px] text-zinc-300 border-b border-zinc-800 focus:outline-none focus:border-sky-500"
              value={w.purpose}
              onChange={(e) => updateWallet(w.id, { purpose: e.target.value })}
            />
            <textarea
              className="mt-1 w-full bg-zinc-950 text-[10px] text-zinc-400 rounded border border-zinc-800 px-1 py-1 resize-none focus:outline-none focus:border-sky-500"
              rows={2}
              placeholder="Notes / rules"
              value={w.notes || ""}
              onChange={(e) => updateWallet(w.id, { notes: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsPanel({
  events,
  setEvents,
}: {
  events: EventItem[];
  setEvents: (events: EventItem[]) => void;
}) {
  const [newLabel, setNewLabel] = useState("");
  const [newWhen, setNewWhen] = useState("");
  const [newDayOffset, setNewDayOffset] = useState(0);
  const [newImportance, setNewImportance] = useState<EventImportance>("normal");

  const addEvent = () => {
    if (!newLabel.trim()) return;
    const evt: EventItem = {
      id: `evt-${Date.now()}`,
      label: newLabel.trim(),
      when: newWhen || "unscheduled",
      dayOffset: newDayOffset,
      importance: newImportance,
      type: "time-bound",
    };
    const updated = [...events, evt];
    setEvents(updated);
    setNewLabel("");
    setNewWhen("");
    setNewDayOffset(0);
    setNewImportance("normal");
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const days = [0, 1, 2];

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Events / Calendar (3-day)</h2>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        {days.map((d) => (
          <div key={d} className="space-y-1">
            <div className="text-[11px] font-semibold text-zinc-300">
              {d === 0 ? "Today" : d === 1 ? "Tomorrow" : "+2"}
            </div>
            {events
              .filter((e) => e.dayOffset === d)
              .map((evt) => (
                <div
                  key={evt.id}
                  className="rounded bg-zinc-900/80 px-2 py-1 space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-100">{evt.label}</span>
                    <span
                      className={
                        "ml-2 rounded px-1.5 py-0.5 text-[9px] " +
                        importanceColor(evt.importance)
                      }
                    >
                      {importanceLabel(evt.importance)}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400">{evt.when}</div>
                  <button
                    className="mt-1 text-[10px] text-rose-400 hover:text-rose-300"
                    onClick={() => removeEvent(evt.id)}
                  >
                    remove
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="mt-3 border-t border-zinc-800 pt-2">
        <div className="text-[11px] text-zinc-400 mb-1">Add event</div>
        <div className="flex flex-col gap-1 text-[11px]">
          <input
            className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-sky-500"
            placeholder="Label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <input
            className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-sky-500"
            placeholder="When (e.g. Today 18:00)"
            value={newWhen}
            onChange={(e) => setNewWhen(e.target.value)}
          />
          <div className="flex gap-2">
            <select
              className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none"
              value={newDayOffset}
              onChange={(e) => setNewDayOffset(Number(e.target.value))}
            >
              <option value={0}>Today</option>
              <option value={1}>Tomorrow</option>
              <option value={2}>+2</option>
            </select>
            <select
              className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none"
              value={newImportance}
              onChange={(e) =>
                setNewImportance(e.target.value as EventImportance)
              }
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <button
              className="ml-auto rounded bg-sky-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-sky-500"
              onClick={addEvent}
            >
              add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotesPanel({
  notes,
  setNotes,
}: {
  notes: NoteItem[];
  setNotes: (notes: NoteItem[]) => void;
}) {
  const [text, setText] = useState("");

  const addNote = () => {
    if (!text.trim()) return;
    const n: NoteItem = {
      id: `note-${Date.now()}`,
      label: text.trim(),
    };
    setNotes([...notes, n]);
    setText("");
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Notes</h2>
      </div>
      <ul className="space-y-1 text-xs">
        {notes.map((n) => (
          <li
            key={n.id}
            className="rounded bg-zinc-900/80 px-2 py-1 flex items-center justify-between gap-2"
          >
            <span className="text-zinc-100">{n.label}</span>
            <button
              className="text-[10px] text-rose-400 hover:text-rose-300"
              onClick={() => removeNote(n.id)}
            >
              x
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-2 border-t border-zinc-800 pt-2">
        <textarea
          className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 resize-none focus:outline-none focus:border-sky-500"
          rows={2}
          placeholder="New note"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="mt-1 rounded bg-sky-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-sky-500"
          onClick={addNote}
        >
          add
        </button>
      </div>
    </div>
  );
}

function IdeasPanel({
  ideas,
  setIdeas,
}: {
  ideas: IdeaItem[];
  setIdeas: (ideas: IdeaItem[]) => void;
}) {
  const [filter, setFilter] = useState<"all" | IdeaItem["status"]>("all");

  const visible =
    filter === "all" ? ideas : ideas.filter((i) => i.status === filter);

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Ideas</h2>
        <select
          className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-[11px] text-zinc-100"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">All</option>
          <option value="idea">Ideas</option>
          <option value="shaping">Shaping</option>
          <option value="live">Live</option>
        </select>
      </div>
      <ul className="space-y-1 text-xs">
        {visible.map((i) => (
          <li
            key={i.id}
            className="rounded bg-zinc-900/80 px-2 py-1 flex items-center justify-between"
          >
            <span className="text-zinc-100">{i.label}</span>
            <span className="text-[10px] uppercase text-zinc-400">
              {i.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SnippetsPanel({
  snippets,
  setSnippets,
}: {
  snippets: SnippetItem[];
  setSnippets: (snippets: SnippetItem[]) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = snippets.filter(
    (s) =>
      s.label.toLowerCase().includes(search.toLowerCase()) ||
      s.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Snippets</h2>
        <input
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[11px] text-zinc-100 focus:outline-none focus:border-sky-500"
          placeholder="Search snippets"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul className="space-y-1 text-xs max-h-40 overflow-auto pr-1">
        {filtered.map((s) => (
          <li
            key={s.id}
            className="rounded bg-zinc-900/80 px-2 py-1 space-y-0.5"
          >
            <div className="font-medium text-zinc-100">{s.label}</div>
            <pre className="rounded bg-black/40 px-1 py-0.5 text-[10px] text-zinc-300 whitespace-pre-wrap">
              {s.content}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DojoMap({ projects }: { projects: ProjectItem[] }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Dojo map</h2>
      </div>
      <ul className="space-y-1 text-xs">
        {projects.map((p) => (
          <li
            key={p.id}
            className="rounded bg-zinc-900/80 px-2 py-1 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-100">{p.label}</span>
              <span className="text-[10px] uppercase text-zinc-400">
                {p.status}
              </span>
            </div>
            <div className="text-[10px] text-zinc-500">{p.path}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AgentConsole({
  mode,
  setMode,
  today,
  setToday,
  wallets,
  events,
}: {
  mode: AgentMode;
  setMode: (m: AgentMode) => void;
  today: AgentTodayContext;
  setToday: (t: AgentTodayContext) => void;
  wallets: Wallet[];
  events: EventItem[];
}) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const payload: AgentRequestPayload = {
      mode,
      prompt: input || "(no extra prompt)",
      today,
      wallets,
      events,
    };

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Agent error: ${res.status}`);
      }

      const data = (await res.json()) as AgentResponse;
      setResponse(data);
    } catch (err: any) {
      setError(
        typeof err?.message === "string"
          ? err.message
          : "Agent request failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const nonNegString = today.nonNegotiables.join(", ");

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Agent</h2>
        <select
          className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[11px] text-zinc-100"
          value={mode}
          onChange={(e) => setMode(e.target.value as AgentMode)}
        >
          <option value="daily-plan">Daily plan</option>
          <option value="risk-audit">Risk audit</option>
          <option value="market-scan">Market scan</option>
        </select>
      </div>

      <div className="mb-2 grid grid-cols-3 gap-2 text-[11px]">
        <div className="space-y-1">
          <div className="text-zinc-400">Focus</div>
          <input
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-sky-500"
            value={today.focus}
            onChange={(e) => setToday({ ...today, focus: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <div className="text-zinc-400">Risk level (1–10)</div>
          <input
            type="range"
            min={1}
            max={10}
            value={today.riskLevel}
            onChange={(e) =>
              setToday({ ...today, riskLevel: Number(e.target.value) })
            }
            className="w-full"
          />
          <div className="text-[10px] text-zinc-400">
            {today.riskLevel <= 3
              ? "calm"
              : today.riskLevel <= 6
              ? "elevated"
              : "hot"}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-zinc-400">Non‑negotiables</div>
          <input
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-sky-500"
            value={nonNegString}
            onChange={(e) =>
              setToday({
                ...today,
                nonNegotiables: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </div>
      </div>

      <textarea
        className="mt-2 w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 resize-none focus:outline-none focus:border-sky-500"
        rows={3}
        placeholder="Optional extra context / question"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="mt-2 flex items-center justify-between">
        <button
          className="rounded bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500 disabled:bg-zinc-700"
          onClick={send}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Run agent"}
        </button>
        {error && (
          <div className="text-[11px] text-rose-400 truncate max-w-xs">
            {error}
          </div>
        )}
      </div>

      {response && (
        <div className="mt-3 rounded border border-zinc-800 bg-black/40 p-2 text-[11px] space-y-1">
          <div className="font-semibold text-zinc-100">Summary</div>
          <div className="text-zinc-200 whitespace-pre-wrap">
            {response.summary}
          </div>
          {response.bullets && response.bullets.length > 0 && (
            <ul className="mt-1 list-disc pl-4 text-zinc-200">
              {response.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
          {response.warnings && response.warnings.length > 0 && (
            <div className="mt-1 text-rose-300">
              <div className="font-semibold text-[11px]">Warnings</div>
              <ul className="list-disc pl-4">
                {response.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------
// Main page
// ----------------------------
export default function Page() {
  const [wallets, setWallets] = useState<Wallet[]>(DEFAULT_WALLETS);
  const [events, setEvents] = useState<EventItem[]>(DEFAULT_EVENTS);
  const [notes, setNotes] = useState<NoteItem[]>(DEFAULT_NOTES);
  const [ideas, setIdeas] = useState<IdeaItem[]>(DEFAULT_IDEAS);
  const [snippets, setSnippets] = useState<SnippetItem[]>(DEFAULT_SNIPPETS);
  const [projects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);

  const [agentMode, setAgentMode] = useState<AgentMode>("daily-plan");
  const [todayCtx, setTodayCtx] = useState<AgentTodayContext>({
    focus: "Stabilise Ops Home + Dojo CLI.",
    riskLevel: 6,
    nonNegotiables: ["No cold wallet risk", "No new surfaces"],
  });

  // Load from storage on mount
  useEffect(() => {
    setWallets(loadFromStorage<Wallet[]>("ops-home:wallets", DEFAULT_WALLETS));
    setEvents(loadFromStorage<EventItem[]>("ops-home:events", DEFAULT_EVENTS));
    setNotes(loadFromStorage<NoteItem[]>("ops-home:notes", DEFAULT_NOTES));
    setIdeas(loadFromStorage<IdeaItem[]>("ops-home:ideas", DEFAULT_IDEAS));
    setSnippets(
      loadFromStorage<SnippetItem[]>("ops-home:snippets", DEFAULT_SNIPPETS)
    );
    setTodayCtx(
      loadFromStorage<AgentTodayContext>(
        "ops-home:todayctx",
        {
          focus: "Stabilise Ops Home + Dojo CLI.",
          riskLevel: 6,
          nonNegotiables: ["No cold wallet risk", "No new surfaces"],
        }
      )
    );
    setAgentMode(
      loadFromStorage<AgentMode>("ops-home:agent-mode", "daily-plan")
    );
  }, []);

  // Persist on change
  useEffect(() => {
    saveToStorage("ops-home:wallets", wallets);
  }, [wallets]);

  useEffect(() => {
    saveToStorage("ops-home:events", events);
  }, [events]);

  useEffect(() => {
    saveToStorage("ops-home:notes", notes);
  }, [notes]);

  useEffect(() => {
    saveToStorage("ops-home:ideas", ideas);
  }, [ideas]);

  useEffect(() => {
    saveToStorage("ops-home:snippets", snippets);
  }, [snippets]);

  useEffect(() => {
    saveToStorage("ops-home:todayctx", todayCtx);
  }, [todayCtx]);

  useEffect(() => {
    saveToStorage("ops-home:agent-mode", agentMode);
  }, [agentMode]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-4 space-y-4">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Ops Home</h1>
            <p className="text-xs text-zinc-400">
              Single surface to run today, wallets, and ops.
            </p>
          </div>
          <div className="text-right text-[11px] text-zinc-400">
            <div>Dojo: ~/dojo</div>
            <div>App: ~/dojo/apps/ops-home</div>
          </div>
        </header>

        <MarketStrip />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Column 1: Today + Events */}
          <section className="space-y-4 lg:col-span-1">
            <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Today</h2>
              </div>
              <ul className="space-y-1 text-xs">
                <li className="rounded bg-zinc-900/80 px-2 py-1 text-zinc-200">
                  Anchor: Ops Home + Dojo CLI stable. No new surfaces.
                </li>
              </ul>
            </div>

            <EventsPanel events={events} setEvents={setEvents} />
          </section>

          {/* Column 2: Wallets + Agent */}
          <section className="space-y-4 lg:col-span-1">
            <WalletLanes wallets={wallets} onChange={setWallets} />
            <AgentConsole
              mode={agentMode}
              setMode={setAgentMode}
              today={todayCtx}
              setToday={setTodayCtx}
              wallets={wallets}
              events={events}
            />
          </section>

          {/* Column 3: Notes / Ideas / Snippets / Map */}
          <section className="space-y-4 lg:col-span-1">
            <NotesPanel notes={notes} setNotes={setNotes} />
            <IdeasPanel ideas={ideas} setIdeas={setIdeas} />
            <SnippetsPanel snippets={snippets} setSnippets={setSnippets} />
            <DojoMap projects={projects} />
          </section>
        </div>
      </div>
    </main>
  );
}
