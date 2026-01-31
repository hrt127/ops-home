"use client";

import React, { useState, useEffect } from "react";
import { getEvents, dismissAlert } from "../lib/api-client";
import { clsx } from "clsx";
import type { UIEvent } from "../lib/agent-types";

interface EventsPanelProps {
  events: UIEvent[];
  setEvents?: (events: UIEvent[]) => void;
}

export default function EventsPanel({ events, setEvents }: EventsPanelProps) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getEvents()
      .then((data: any) => {
        if (setEvents) setEvents(data.upcoming || []);
        setAlerts(data.alerts || []);
      })
      .finally(() => setLoading(false));
  }, [setEvents]);

  const handleDismiss = async (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    try {
      await dismissAlert(id);
    } catch (e) {
      console.error(e);
    }
  };

  const upcoming = events || [];

  return (
    <React.Fragment>
      <div className="glass panel-shadow h-full flex flex-col panel-mount overflow-hidden">
        {/* Header */}
        <div className="panel-header flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse" />
            <span className="text-[11px] mono font-black uppercase tracking-[0.25em]">Sentinel_Queue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`text-[8px] mono font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-rose-500/20 text-rose-500/60 bg-rose-500/5 ${alerts.length > 0 ? "opacity-100" : "opacity-30"}`}>
              Hazards: {alerts.length}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 bg-slate-950/20">
          {/* Alerts Section */}
          {alerts.length > 0 && (
            <div className="space-y-3 scale-in">
              <div className="text-[9px] mono text-rose-500 font-black uppercase tracking-[0.25em] flex items-center gap-2 mb-1">
                <span className="w-1 h-1 rounded-full bg-rose-500 pulse" />
                PROTOCOL_VIOLATIONS
              </div>
              <div className="space-y-2">
                {alerts.map(a => (
                  <div key={a.id} className="bg-rose-500/5 border border-rose-500/20 rounded-sm p-4 flex justify-between items-start gap-4 transition-all hover:bg-rose-500/10 hover:border-rose-500/40 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-[1px] bg-rose-500/20" />
                    <div className="flex-1">
                      <div className="text-[12px] text-rose-100/90 font-bold leading-relaxed uppercase tracking-tight">{a.message}</div>
                      <div className="text-[8px] mono text-rose-400/50 mt-2.5 uppercase tracking-widest font-black italic">
                        {a.source} // {new Date(a.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDismiss(a.id)}
                      className="text-[9px] mono text-rose-500/60 hover:text-rose-400 font-black px-2 py-1.5 rounded-sm border border-rose-500/20 bg-black/40 transition-all uppercase hover-press italic"
                    >
                      ACK
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Section */}
          <div className="space-y-4">
            <div className="text-[9px] mono text-gray-500 font-black uppercase tracking-[0.25em] flex items-center justify-between">
              <span>Temporal_Sequence</span>
              {!loading && upcoming.length > 0 && (
                <span className="text-[8px] opacity-40">{upcoming.length} NODES_PENDING</span>
              )}
            </div>

            {loading && (
              <div className="flex items-center gap-3 py-6 shimmer bg-slate-900/20 rounded-sm border border-white/5 px-4">
                <div className="w-3 h-3 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                <span className="text-[9px] mono text-gray-600 uppercase tracking-widest font-black">Syncing_Timeline...</span>
              </div>
            )}

            {!loading && upcoming.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-800 opacity-40 scale-in bg-black/20 rounded-sm border border-white/[0.02]">
                <div className="text-3xl font-light mb-3 italic">∅</div>
                <p className="mono text-[9px] uppercase tracking-[0.3em] font-black italic">Sequence_Clear</p>
              </div>
            )}

            <div className="space-y-2.5 pb-2">
              {upcoming.map((e: UIEvent, idx: number) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-4 rounded-sm bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 transition-all group hover-lift cursor-default relative overflow-hidden backdrop-blur-sm scale-in"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="absolute top-0 right-0 w-12 h-[1px] bg-gradient-to-l from-white/10 to-transparent" />
                  <div className="space-y-2 flex-1 min-w-0 pr-4">
                    <div className="text-[13px] font-black text-gray-200 group-hover:text-cyan-400 transition-colors uppercase tracking-tight italic truncate leading-none">
                      {e.label}
                    </div>
                    <div className="text-[8px] mono text-gray-600 uppercase tracking-widest flex items-center gap-2 font-bold">
                      <span className="text-cyan-500/60 font-black">
                        {e.when || 'TBD'}
                      </span>
                      <span className="opacity-20">•</span>
                      <span className="truncate">{e.type.replace('-', '_')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className={`text-[8px] mono font-black px-2 py-0.5 rounded-sm border uppercase tracking-widest leading-none ${e.importance === 'high' || e.importance === 'critical' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-slate-950 text-gray-700 border-white/5'
                      }`}>
                      {e.importance.slice(0, 3)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="glass-heavy border-t border-white/5 px-6 py-3 flex items-center justify-between shrink-0 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[2px] animate-pulse" />
            </div>
            <span className="text-[9px] mono text-gray-600 font-black uppercase tracking-[0.25em]">GATEWAY_SYNC_OK</span>
          </div>
          <button className="text-[9px] mono text-cyan-400 hover:text-cyan-300 transition-all font-black uppercase tracking-[0.3em] hover-press italic">+ MANIFEST_EVENT</button>
        </div>
      </div>
    </React.Fragment>
  );
}
