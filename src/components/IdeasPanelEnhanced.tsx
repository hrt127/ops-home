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

    const getStatusColor = (status: Idea["status"]) => {
        switch (status) {
            case "live":
                return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            case "shaping":
                return "bg-amber-500/20 text-amber-400 border-amber-500/30";
            case "idea":
                return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
        }
    };

    return (
        <div className="glass panel-shadow overflow-hidden panel-mount">
            {/* Header */}
            <div className="panel-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="upper">Ideas</span>
                </div>
                <button className="text-[10px] mono text-cyan-400 hover:text-cyan-300 uppercase tracking-widest font-black hover-press">+ Create</button>
            </div>

            {/* Ideas List */}
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                <div className="space-y-3 scale-in">
                    {ideas.map((idea) => (
                        <div
                            key={idea.id}
                            className="p-3 rounded-lg bg-slate-800/20 border border-gray-700/30 hover:border-cyan-500/30 transition-all group hover-lift cursor-default"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 text-sm text-gray-200 group-hover:text-white transition-colors leading-relaxed font-medium">
                                    {idea.title}
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[9px] mono uppercase tracking-widest border transition-all group-hover:scale-105 ${getStatusColor(idea.status)}`}>
                                    {idea.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-gray-800/50 px-4 py-2 text-[10px] mono text-gray-500 uppercase tracking-widest flex justify-between items-center font-black">
                <span className="opacity-50">{ideas.length} concept{ideas.length !== 1 ? 's' : ''} in pipeline</span>
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-cyan-500 pulse" />
                    <span className="text-cyan-400">Synced</span>
                </div>
            </div>
        </div>
    );
}
