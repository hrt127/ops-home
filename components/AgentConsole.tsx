import React, { useState } from "react";

export default function AgentConsole({ mode, setMode, today, setToday, wallets, events }: any) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const payload = {
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

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(typeof err?.message === "string" ? err.message : "Agent request failed.");
    } finally {
      setLoading(false);
    }
  };

  const nonNegString = today.nonNegotiables?.join(", ") ?? "";

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Agent</h2>
        <select
          className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[11px] text-zinc-100"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
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
            onChange={(e) => setToday({ ...today, riskLevel: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-[10px] text-zinc-400">{today.riskLevel <= 3 ? "calm" : today.riskLevel <= 6 ? "elevated" : "hot"}</div>
        </div>
        <div className="space-y-1">
          <div className="text-zinc-400">Non‑negotiables</div>
          <input
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-sky-500"
            value={nonNegString}
            onChange={(e) => setToday({ ...today, nonNegotiables: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })}
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
        {error && <div className="text-[11px] text-rose-400 truncate max-w-xs">{error}</div>}
      </div>

      {response && (
        <div className="mt-3 rounded border border-zinc-800 bg-black/40 p-2 text-[11px] space-y-1">
          <div className="font-semibold text-zinc-100">Summary</div>
          <div className="text-zinc-200 whitespace-pre-wrap">{response.summary}</div>
          {response.bullets && response.bullets.length > 0 && (
            <ul className="mt-1 list-disc pl-4 text-zinc-200">{response.bullets.map((b: any, i: number) => (<li key={i}>{b}</li>))}</ul>
          )}
          {response.warnings && response.warnings.length > 0 && (
            <div className="mt-1 text-rose-300"><div className="font-semibold text-[11px]">Warnings</div><ul className="list-disc pl-4">{response.warnings.map((w: any, i: number) => (<li key={i}>{w}</li>))}</ul></div>
          )}
        </div>
      )}
    </div>
  );
}
