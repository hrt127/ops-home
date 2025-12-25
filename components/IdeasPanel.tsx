import React from "react";

export default function IdeasPanel({ ideas, setIdeas }: any) {
  const [filter, setFilter] = React.useState<"all" | string>("all");

  const visible = filter === "all" ? ideas : ideas.filter((i: any) => i.status === filter);

  const cycleStatus = (id: string) => {
    setIdeas(
      ideas.map((i: any) => {
        if (i.id !== id) return i;
        const next = i.status === "idea" ? "shaping" : i.status === "shaping" ? "live" : "idea";
        return { ...i, status: next };
      })
    );
  };

  const removeIdea = (id: string) => {
    setIdeas(ideas.filter((i: any) => i.id !== id));
  };

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
        {visible.map((i: any) => (
          <li
            key={i.id}
            className="rounded bg-zinc-900/80 px-2 py-1 flex items-center justify-between gap-2 group"
          >
            <div className="flex-1 flex items-center justify-between cursor-pointer" onClick={() => cycleStatus(i.id)}>
              <span className="text-zinc-100">{i.label}</span>
              <span className="text-[10px] uppercase text-zinc-400 group-hover:text-sky-300">
                {i.status}
              </span>
            </div>
            <button
              className="text-[10px] text-rose-400 hover:text-rose-300 opacity-0 group-hover:opacity-100"
              onClick={() => removeIdea(i.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
