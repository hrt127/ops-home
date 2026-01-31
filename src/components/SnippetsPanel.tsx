import React, { useState } from "react";

export default function SnippetsPanel({ snippets }: any) {
  const [search, setSearch] = useState("");

  const filtered = snippets.filter(
    (s: any) =>
      s.label.toLowerCase().includes(search.toLowerCase()) ||
      s.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass panel-shadow overflow-hidden panel-mount">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="upper tracking-[0.2em] text-amber-500/80">Command_Vault_v2</span>
        </div>
        <div className="relative w-36">
          <input
            className="w-full bg-slate-900/60 border border-gray-800/50 rounded-sm pl-2 pr-6 py-0.5 text-[9px] mono uppercase tracking-widest text-gray-300 placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-all font-black"
            placeholder="SCAN_QUERY..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
            <svg className="w-2.5 h-2.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-600 opacity-50 scale-in">
            <div className="text-2xl mb-2">⊘</div>
            <p className="mono text-[10px] uppercase tracking-[0.2em] font-black">Matrix_Node_Neutral</p>
          </div>
        )}

        {filtered.map((s: any) => (
          <div
            key={s.id}
            className="p-3 rounded-lg bg-slate-800/10 border border-gray-700/50 hover:border-amber-500/30 transition-all group hover-lift"
          >
            <div className="text-[10px] mono font-black text-gray-500 group-hover:text-amber-400 transition-colors uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-amber-500/40 pulse" />
              {s.label}
            </div>
            <div className="relative scale-in">
              <pre className="rounded bg-black/40 border border-gray-800/50 p-2 text-[9px] mono text-amber-200/90 whitespace-pre-wrap leading-relaxed font-bold">
                {s.content}
              </pre>
              <button
                className="absolute top-2 right-2 text-[8px] mono font-black uppercase text-gray-500 hover:text-amber-400 transition-all bg-slate-900 border border-gray-800 px-1.5 py-0.5 rounded-sm hover-press"
                onClick={() => navigator.clipboard.writeText(s.content)}
                title="Copy to terminal"
              >
                EXEC_COPY
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
