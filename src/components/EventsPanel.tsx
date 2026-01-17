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
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3 flex flex-col h-full">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Events & Alerts</h2>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="mb-4 space-y-1">
          <h3 className="text-[10px] uppercase text-rose-400 font-bold tracking-wider">System Alerts</h3>
          {alerts.map(a => (
            <div key={a.id} className="bg-rose-950/30 border border-rose-900/50 rounded p-2 flex justify-between items-start gap-2">
              <div className="flex-1">
                <div className="text-xs text-rose-200 font-medium">{a.message}</div>
                <div className="text-[10px] text-rose-400 mt-0.5">{a.source} • {new Date(a.timestamp).toLocaleTimeString()}</div>
              </div>
              <button onClick={() => handleDismiss(a.id)} className="text-[10px] text-rose-500 hover:text-rose-300">
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Events Section */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider mb-2">Upcoming 24h</h3>
        {loading && <div className="text-xs text-zinc-600">Loading...</div>}

        {!loading && upcoming.length === 0 && <div className="text-xs text-zinc-600 italic">No upcoming events.</div>}

        <div className="space-y-1">
          {upcoming.map((e: any) => (
            <div key={e.id} className="flex items-center justify-between p-1.5 rounded bg-zinc-900/50 border border-zinc-800/50">
              <div>
                <div className="text-xs text-zinc-200">{e.label}</div>
                <div className="text-[10px] text-zinc-500">{e.ts ? new Date(e.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'} <span className="text-zinc-600">|</span> {e.source}</div>
              </div>
              <div className="flex gap-1">
                {e.tags?.map((t: string) => (
                  <span key={t} className="text-[9px] px-1 py-0.5 rounded bg-zinc-800 text-zinc-400">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
