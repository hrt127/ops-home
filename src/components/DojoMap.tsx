import React from "react";

export default function DojoMap({ projects }: any) {
  return (
    <div className="glass panel-shadow overflow-hidden panel-mount">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="upper tracking-[0.2em] text-emerald-500/80">Topology_Visualizer</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/50 pulse" />
      </div>

      {/* Project List */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto custom-scrollbar">
        {projects.map((p: any) => (
          <div
            key={p.id}
            className="p-3 rounded-lg bg-slate-800/20 border border-gray-700/50 hover:border-emerald-500/30 transition-all group relative overflow-hidden hover-lift"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{p.label}</span>
              <span className={`text-[9px] mono font-black uppercase px-1.5 py-0.5 rounded-sm border transition-all ${p.status === 'live' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                p.status === 'idea' ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                  'text-gray-500 bg-slate-900 border-gray-800'
                }`}>
                {p.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-3 bg-emerald-500/40 rounded-full" />
              <div className="text-[10px] mono text-gray-400 group-hover:text-gray-200 transition-colors truncate font-black">
                {p.path}
              </div>
            </div>
            {/* Subtle background decorative element */}
            <div className="absolute -bottom-2 -right-2 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-0">
              <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
