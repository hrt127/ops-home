import React, { useState } from "react";

export default function SnippetsPanel({ snippets }: any) {
  const [search, setSearch] = useState("");

  const filtered = snippets.filter(
    (s: any) =>
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
        {filtered.map((s: any) => (
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
