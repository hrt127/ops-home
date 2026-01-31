import React, { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AgentTodayContext, UIWallet, UIEvent } from "../lib/agent-types";

interface AgentConsoleProps {
  mode: string;
  setMode: (mode: string) => void;
  today: AgentTodayContext;
  setToday: (today: AgentTodayContext) => void;
  wallets: UIWallet[];
  events: UIEvent[];
}

export default function AgentConsole({ mode, setMode, today, setToday, wallets, events }: AgentConsoleProps) {
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
    <div className="glass panel-shadow overflow-hidden panel-mount">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="upper tracking-[0.2em] text-cyan-500/80">Neural Processor</span>
        </div>
        <select
          className="bg-slate-900 border border-gray-800/50 rounded-sm px-2 py-0.5 text-[9px] mono uppercase tracking-widest text-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors cursor-pointer hover-lift"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="daily-plan">PLAN_MODE</option>
          <option value="risk-audit">AUDIT_MODE</option>
          <option value="market-scan">SCAN_MODE</option>
        </select>
      </div>

      <div className="p-4 space-y-4">
        {/* Simulation Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5 flex flex-col justify-between">
            <div className="text-[9px] mono text-gray-500 uppercase tracking-widest font-black">Core_Focus</div>
            <input
              className="w-full bg-slate-900 border border-gray-800/50 rounded px-2 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
              value={today.focus}
              onChange={(e) => setToday({ ...today, focus: e.target.value })}
              placeholder="Current objective..."
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <div className="text-[9px] mono text-gray-500 uppercase tracking-widest font-black">Entropy_Threshold</div>
              <span className={clsx(
                "text-[10px] mono font-black italic",
                today.riskLevel <= 3 ? "text-emerald-400" : today.riskLevel <= 6 ? "text-amber-400" : "text-rose-400"
              )}>
                {today.riskLevel}/10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={today.riskLevel}
              onChange={(e) => setToday({ ...today, riskLevel: Number(e.target.value) })}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="text-[8px] mono text-gray-600 uppercase tracking-tighter text-right font-black">
              {today.riskLevel <= 3 ? "STABLE" : today.riskLevel <= 6 ? "ELEVATED" : "CRITICAL"}
            </div>
          </div>
          <div className="space-y-1.5 flex flex-col justify-between">
            <div className="text-[9px] mono text-gray-500 uppercase tracking-widest font-black">Constraints_Buffer</div>
            <input
              className="w-full bg-slate-900 border border-gray-800/50 rounded px-2 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
              value={nonNegString}
              onChange={(e) => setToday({ ...today, nonNegotiables: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })}
              placeholder="A, B, C..."
            />
          </div>
        </div>

        {/* Extra Context */}
        <div className="space-y-1.5">
          <div className="text-[9px] mono text-gray-500 uppercase tracking-widest font-black flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-cyan-500 pulse" />
            Auxiliary_Inference_Input
          </div>
          <textarea
            className="w-full bg-slate-900/40 border border-gray-700/30 rounded px-3 py-2 text-xs text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
            rows={3}
            placeholder="Append transient variables or queries..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <button
              className="btn btn-primary px-8 py-2 font-black uppercase tracking-widest hover-press"
              onClick={send}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                  <span>CALCULATING...</span>
                </div>
              ) : "INITIATE_SYNOPSIS"}
            </button>
            {loading && (
              <span className="text-[10px] mono text-cyan-400 pulse uppercase tracking-widest font-black">Streaming_Insights...</span>
            )}
          </div>
          {error && <div className="text-[10px] mono text-rose-500 uppercase tracking-widest font-black bg-rose-500/10 px-3 py-1.5 rounded-sm border border-rose-500/30">{error}</div>}
        </div>

        {/* Response Area */}
        {response && (
          <div className="mt-4 glass-heavy rounded border border-cyan-500/20 overflow-hidden scale-in shadow-[0_0_30px_rgba(34,211,238,0.05)]">
            <div className="bg-cyan-500/10 border-b border-cyan-500/20 px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] mono font-black text-cyan-400 uppercase tracking-[0.2em]">Synthesis_Internal_Scan</span>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 glow pulse" />
            </div>
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              <div className="text-sm text-gray-200 leading-relaxed font-medium">
                {response.summary}
              </div>

              {response.bullets && response.bullets.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[9px] mono text-gray-500 font-black uppercase tracking-widest">Protocol_Nodes</div>
                  <ul className="space-y-2">
                    {response.bullets.map((b: any, i: number) => (
                      <li key={i} className="flex items-start gap-3 group hover-lift cursor-default">
                        <span className="text-cyan-500 font-black">»</span>
                        <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {response.warnings && response.warnings.length > 0 && (
                <div className="mt-4 p-3 rounded bg-rose-500/5 border border-rose-500/20 space-y-2">
                  <div className="text-[9px] mono text-rose-400 font-black uppercase tracking-widest flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    CRITICAL_THREAT_ANALYSIS
                  </div>
                  <ul className="space-y-1">
                    {response.warnings.map((w: any, i: number) => (
                      <li key={i} className="text-xs text-rose-300 font-bold italic">
                        • {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="bg-slate-900/50 border-t border-gray-800/50 px-4 py-2 flex items-center justify-between text-[8px] mono text-gray-600 uppercase tracking-widest font-black">
              <span>HASH_ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
              <span>LATENCY: 42MS</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
