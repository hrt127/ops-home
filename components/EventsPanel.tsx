import React, { useState, useEffect } from "react";
import { getEvents, createEvent, deleteEvent } from "../lib/api-client";

export default function EventsPanel({ events, setEvents }: any) {
  const [newLabel, setNewLabel] = useState("");
  const [newWhen, setNewWhen] = useState("");
  const [newDayOffset, setNewDayOffset] = useState(0);
  const [newImportance, setNewImportance] = useState("normal");
  const [loading, setLoading] = useState(false);

  // Background sync on mount
  useEffect(() => {
    setLoading(true);
    getEvents()
      .then((data) => setEvents(data))
      .finally(() => setLoading(false));
  }, [setEvents]);

  const addEvent = async () => {
    if (!newLabel.trim()) return;
    const evt: any = {
      label: newLabel.trim(),
      when: newWhen || "unscheduled",
      dayOffset: newDayOffset,
      importance: newImportance,
      type: "time-bound",
    };
    // Optimistic update
    setEvents((prev: any) => [...prev, { ...evt, id: `tmp-${Date.now()}` }]);
    try {
      const created = await createEvent(evt);
      setEvents((prev: any) => prev.map((e: any) => e.id.startsWith("tmp-") ? created : e));
    } catch {
      // On error, remove optimistic
      setEvents((prev: any) => prev.filter((e: any) => !e.id.startsWith("tmp-")));
    }
    setNewLabel("");
    setNewWhen("");
    setNewDayOffset(0);
    setNewImportance("normal");
  };

  const removeEvent = async (id: string) => {
    // Optimistic remove
    const prev = events;
    setEvents(events.filter((e: any) => e.id !== id));
    try {
      await deleteEvent(id);
    } catch {
      setEvents(prev); // revert
    }
  };

  const days = [0, 1, 2];

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Events / Calendar (3-day)</h2>
      </div>
      {loading ? <div className="text-xs text-zinc-400">Loading...</div> : null}
      <div className="grid grid-cols-3 gap-2 text-xs">
        {days.map((d) => (
          <div key={d} className="space-y-1">
            <div className="text-[11px] font-semibold text-zinc-300">
              {d === 0 ? "Today" : d === 1 ? "Tomorrow" : "+2"}
            </div>
            {events
              .filter((e: any) => e.dayOffset === d)
              .map((evt: any) => (
                <div
                  key={evt.id}
                  className="rounded bg-zinc-900/80 px-2 py-1 space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-100">{evt.label}</span>
                    <span className={"ml-2 rounded px-1.5 py-0.5 text-[9px] bg-sky-900 text-sky-200"}>
                      {evt.importance?.toUpperCase?.() || evt.importance}
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
              onChange={(e) => setNewImportance(e.target.value)}
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
