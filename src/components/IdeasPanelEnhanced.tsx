"use client";

import React, { useState } from "react";

interface Idea {
    id: string;
    title: string;
    status: "idea" | "shaping" | "live";
}

export function IdeasPanelEnhanced() {
    const [ideas] = useState<Idea[]>([
        {
            id: "1",
            title: "Farcaster mini-app for alerts + publishing",
            status: "shaping"
        },
        {
            id: "2",
            title: "Agent that summarises my last 24h from notes/logs",
            status: "idea"
        }
    ]);

    const getStatusStyles = (status: Idea["status"]) => {
        switch (status) {
            case "live":
                return { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "LIVE_PROD" };
            case "shaping":
                return { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "SHAPING" };
            case "idea":
                return { color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", label: "CONCEPT" };
        }
    };

    return (
        <div className="glass panel-shadow overflow-hidden panel-mount flex flex-col h-full">
            {/* Header */}
            <div className="panel-header flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse" />
                    <span className="text-[11px] mono font-black uppercase tracking-[0.25em]">Concept_Forge</span>
                </div>
                <button className="px-2 py-0.5 rounded-sm bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 text-[8px] mono font-black uppercase tracking-widest transition-all hover-press">
                    + FORGE_NEW
                </button>
            </div>

            {/* Ideas List */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar bg-slate-950/20">
                <div className="space-y-2 scale-in">
                    {ideas.map((idea, idx) => {
                        const styles = getStatusStyles(idea.status);
                        return (
                            <div
                                key={idea.id}
                                className="p-3 rounded border border-white/5 bg-slate-900/30 hover:bg-slate-900/50 hover:border-cyan-500/30 transition-all group scale-in hover-lift relative overflow-hidden"
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                <div className="absolute top-0 right-0 w-8 h-[1px] bg-gradient-to-l from-cyan-500/20 to-transparent" />

                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <div className="flex-1 text-[11px] text-gray-300 group-hover:text-white transition-colors leading-relaxed font-bold uppercase tracking-tight">
                                        {idea.title}
                                    </div>
                                    <span className={`px-1.5 py-0.5 rounded-sm text-[7px] mono font-black uppercase tracking-[0.2em] border leading-none shrink-0 ${styles.bg} ${styles.color} ${styles.border}`}>
                                        {styles.label}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <div className="flex gap-2">
                                        <div className="w-1.5 h-[1px] bg-gray-700" />
                                        <div className="w-4 h-[1px] bg-gray-700" />
                                        <div className="w-1.5 h-[1px] bg-gray-700" />
                                    </div>
                                    <span className="text-[7px] mono text-gray-600 font-bold uppercase tracking-widest leading-none">ID_0{idea.id} // SEC_CLEARED</span>
                                </div>
                            </div>
                        );
                    })}

                    {ideas.length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center text-gray-800 opacity-40">
                            <p className="mono text-[9px] uppercase tracking-[0.4em] font-black italic">No_Strategic_Leaks</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-white/5 px-6 py-3 flex justify-between items-center shrink-0 bg-slate-950/60">
                <div className="flex items-center gap-3">
                    <span className="text-[9px] mono text-gray-600 font-black uppercase tracking-widest">INCUBATION_STREAM</span>
                    <div className="w-1 h-1 rounded-full bg-cyan-500/40" />
                </div>
                <div className="text-[9px] mono text-gray-800 font-black uppercase tracking-widest font-black">
                    COUNT: 0{ideas.length}
                </div>
            </div>
        </div>
    );
}

