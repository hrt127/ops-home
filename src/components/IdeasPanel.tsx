import React, { useEffect, useState } from "react";
import { getIdeas, updateIdea } from "../lib/api-client";

export default function IdeasPanel({ ideas: initialIdeas, setIdeas }: any) {
  const [localIdeas, setLocalIdeas] = useState<any[]>([]);
  const [newIdea, setNewIdea] = useState("");
  const [filter, setFilter] = useState<"all" | string>("all");
  const [loading, setLoading] = useState(false);

  // Sync props if provided, else fetch
  useEffect(() => {
    if (initialIdeas) {
      setLocalIdeas(initialIdeas);
    } else {
      load();
    }
  }, [initialIdeas]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getIdeas();
      // API returns { items: [...] } but fetchAPI wrapper returns items array effectively in my implementation?
      // Wait, api-client getIdeas returns `data.items || []`.
      setLocalIdeas(data);
      if (setIdeas) setIdeas(data);
    } finally {
      setLoading(false);
    }
  };

  const visible = filter === "all" ? localIdeas : localIdeas.filter((i: any) => i.status === filter);

  const cycleStatus = async (id: string) => {
    const current = localIdeas.find(i => i.id === id);
    if (!current) return;

    // Status cycle: open -> promoted -> done? Or idea -> shaping -> live?
    // User spec for Inbox: status = "open" | "promoted".
    // Existing UI used idea/shaping/live.
    // Let's map "open"->idea, "promoted"->live? 
    // Or just adopt the new "open/promoted" schema?
    // User said: { "items": [ { "id": string, "text": string, "tags": string[], "status": "open" | "promoted" } ] }
    // I should stick to user spec.
    // But UI might want more states. 
    // Let's implement cycle: open -> promoted -> open.

    const next = current.status === "open" ? "promoted" : "open";

    const updated = localIdeas.map(i => i.id === id ? { ...i, status: next } : i);
    setLocalIdeas(updated);
    if (setIdeas) setIdeas(updated);

    try {
      await updateIdea(id, { status: next });
    } catch {
      load();
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim()) return;

    // Optimistic
    const temp = { id: crypto.randomUUID(), text: newIdea, status: 'open', tags: [] };
    const updated = [...localIdeas, temp];
    setLocalIdeas(updated);
    if (setIdeas) setIdeas(updated);
    setNewIdea("");

    try {
      const { createIdea } = await import("../lib/api-client");
      await createIdea({ text: newIdea });
      load(); // Reload to get real persistent state
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3 h-full flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Ideas / Inbox</h2>
        <select
          className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-[11px] text-zinc-100"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="promoted">Promoted</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1 mb-2">
        {visible.length === 0 ? <div className="text-xs text-zinc-600 italic">No ideas found.</div> : null}
        {visible.map((i: any) => (
          <li
            key={i.id}
            className="rounded bg-zinc-900/80 px-2 py-1 flex items-center justify-between gap-2 group list-none cursor-pointer hover:bg-zinc-800"
            onClick={() => cycleStatus(i.id)}
          >
            <span className="text-zinc-100 text-xs">{i.text || i.label}</span>
            <span className={clsx(
              "text-[10px] uppercase px-1 rounded",
              i.status === 'promoted' ? "text-emerald-400 bg-emerald-400/10" : "text-zinc-500"
            )}>
              {i.status}
            </span>
          </li>
        ))}
      </div>

      <form onSubmit={handleAdd} className="pt-2 border-t border-zinc-800">
        <input
          className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none"
          placeholder="+ Add idea..."
          value={newIdea}
          onChange={e => setNewIdea(e.target.value)}
        />
      </form>
    </div>
  );
}
