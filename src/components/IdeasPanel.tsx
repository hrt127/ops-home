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
    <div className="glass panel-shadow h-full flex flex-col fade-in overflow-hidden">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="upper text-emerald-400/90 tracking-[0.2em]">Collective Inbox</span>
        </div>
        <select
          className="bg-slate-900 border border-gray-800/50 rounded-sm px-2 py-0.5 text-[9px] mono uppercase tracking-widest text-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">ALL_NODES</option>
          <option value="open">OPEN_STATE</option>
          <option value="promoted">PROMOTED_V</option>
        </select>
      </div>

      {/* Ideas List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
        {visible.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-12 text-gray-600 opacity-50">
            <div className="text-3xl mb-3">☼</div>
            <p className="mono text-[10px] uppercase tracking-[0.2em]">Neural Silence</p>
          </div>
        )}

        {visible.map((i: any) => (
          <div
            key={i.id}
            className="p-3 rounded-lg bg-slate-800/20 border border-gray-700/50 hover:border-emerald-500/30 transition-all group cursor-pointer flex items-center justify-between"
            onClick={() => cycleStatus(i.id)}
          >
            <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors flex-1">{i.text || i.label}</span>
            <div className={clsx(
              "text-[10px] mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border transition-all",
              i.status === 'promoted'
                ? "text-emerald-400 bg-emerald-400/10 border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                : "text-gray-600 bg-slate-950/50 border-gray-800 group-hover:text-gray-400"
            )}>
              {i.status}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="glass-heavy border-t border-gray-800/50 p-4">
        <form onSubmit={handleAdd} className="relative">
          <input
            className="w-full bg-slate-900/50 border border-gray-700/50 rounded-md pl-10 pr-4 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium"
            placeholder="Register new insight..."
            value={newIdea}
            onChange={e => setNewIdea(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500/50 font-bold mono">
            {"+"}
          </div>
        </form>
      </div>
    </div>
  );
}
