import React, { useState, useEffect } from "react";
import { getEvents, dismissAlert } from "../lib/api-client";
import { clsx } from "clsx";

export default function EventsPanel({ events, setEvents }: any) {
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

  // Group events by source/tag
  const upcoming = events || [];

  return (
    <div className="glass panel-shadow h-full flex flex-col panel-mount overflow-hidden">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="upper">Events & Alerts</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 glow" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            <div className="text-[10px] mono text-rose-500 font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-rose-500 pulse" />
              Active Hazards
            </div>
            <div className="space-y-2">
              {alerts.map(a => (
                <div key={a.id} className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-3 flex justify-between items-start gap-3 transition-all hover:bg-rose-500/10 hover:border-rose-500/40 group hover-lift">
                  <div className="flex-1">
                    <div className="text-xs text-rose-100 font-bold leading-relaxed">{a.message}</div>
                    <div className="text-[9px] mono text-rose-400/60 mt-1.5 uppercase tracking-widest font-bold">
                      {a.source} • {new Date(a.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDismiss(a.id)}
                    className="text-[10px] mono text-rose-500/50 hover:text-rose-400 font-bold glass-heavy px-2 py-1 rounded border border-rose-500/20 transition-all uppercase hover-press"
                  >
                    Acknowledge
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Section */}
        <div className="space-y-3">
          <div className="text-[10px] mono text-gray-500 font-black uppercase tracking-[0.2em]">Temporal_Queue</div>

          {loading && (
            <div className="flex items-center gap-2 py-4 shimmer rounded-lg">
              <div className="w-3 h-3 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              <span className="text-[10px] mono text-gray-600 uppercase tracking-widest">Scanning...</span>
            </div>
          )}

          {!loading && upcoming.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-gray-600 opacity-50 scale-in">
              <div className="text-2xl mb-2">∅</div>
              <p className="mono text-[10px] uppercase tracking-[0.2em]">Queue Neutral</p>
            </div>
          )}

          <div className="space-y-2 pb-2">
            {upcoming.map((e: any) => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/20 border border-gray-700/50 hover:border-cyan-500/30 transition-all group hover-lift cursor-default">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors uppercase tracking-tight">{e.label}</div>
                  <div className="text-[10px] mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="text-cyan-500/70 font-bold">
                      {e.ts ? new Date(e.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ASAP'}
                    </span>
                    <span className="opacity-30">•</span>
                    <span>{e.source}</span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {e.tags?.map((t: string) => (
                    <span key={t} className="text-[9px] mono font-bold px-1.5 py-0.5 rounded-sm bg-slate-900 text-gray-500 border border-gray-800/50 uppercase tracking-widest group-hover:border-cyan-500/30 transition-colors">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
