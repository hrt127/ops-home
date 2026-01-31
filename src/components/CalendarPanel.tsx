"use client";

import React, { useState } from "react";

interface Event {
    id: string;
    title: string;
    time: string;
    importance: "low" | "normal" | "high" | "critical";
    type: "ongoing" | "time-bound";
}

export function CalendarPanel() {
    const [events] = useState<Event[]>([
        {
            id: "1",
            title: "Check wallets: balances + recent moves",
            time: "16:00",
            importance: "high",
            type: "ongoing"
        },
        {
            id: "2",
            title: "Ops Home review",
            time: "21:00",
            importance: "normal",
            type: "ongoing"
        },
        {
            id: "3",
            title: "Farcaster mini-app shaping",
            time: "Tomorrow 14:00",
            importance: "normal",
            type: "time-bound"
        }
    ]);

    const getImportanceColor = (importance: Event["importance"]) => {
        switch (importance) {
            case "critical":
                return "border-rose-500 bg-rose-500/10 text-rose-400";
            case "high":
                return "border-amber-500 bg-amber-500/10 text-amber-400";
            case "normal":
                return "border-cyan-500 bg-cyan-500/10 text-cyan-400";
            case "low":
                return "border-gray-500 bg-gray-500/10 text-gray-400";
        }
    };

    return (
        <div className="glass panel-shadow overflow-hidden panel-mount">
            {/* Header */}
            <div className="panel-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="upper">Calendar</span>
                </div>
                <button className="text-[10px] mono text-cyan-400 hover:text-cyan-300 uppercase tracking-widest font-black hover-press">
                    + Schedule
                </button>
            </div>

            {/* Events List */}
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                <div className="space-y-3 scale-in">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="p-3 rounded-lg bg-slate-800/30 border border-gray-700/50 hover:border-cyan-500/30 transition-all group hover-lift cursor-default"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${event.importance === 'critical' ? 'bg-rose-500 pulse' :
                                            event.importance === 'high' ? 'bg-amber-500 pulse' :
                                                event.importance === 'normal' ? 'bg-cyan-500' : 'bg-gray-500'
                                            }`} />
                                        <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors leading-relaxed">
                                            {event.title}
                                        </div>
                                    </div>
                                    <div className="text-[10px] mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <span className="text-cyan-500/60 font-bold">{event.time}</span>
                                        <span className="opacity-30">•</span>
                                        <span>{event.type}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-gray-800/50 px-4 py-2 text-[10px] mono text-gray-500 uppercase tracking-widest flex justify-between items-center">
                <span className="opacity-50 font-bold">{events.length} upcoming events</span>
                <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-cyan-500 pulse" />
                    <span className="text-cyan-400 font-black">Sync_Live</span>
                </div>
            </div>
        </div>
    );
}
