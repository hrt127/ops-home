"use client";

import React, { useState } from "react";

interface Event {
    id: string;
    title: string;
    time: string;
    duration?: string;
    importance: "low" | "normal" | "high" | "critical";
    type: "ongoing" | "time-bound";
    status: "pending" | "active" | "completed";
}

export function CalendarPanel() {
    const [events] = useState<Event[]>([
        {
            id: "1",
            title: "Wallet_Registry_Audit: Syncing balances + risk assessment",
            time: "16:00",
            duration: "45m",
            importance: "high",
            type: "ongoing",
            status: "active"
        },
        {
            id: "2",
            title: "Ops_Home_System_Review: master-plan-v3 alignment",
            time: "21:00",
            duration: "1h 30m",
            importance: "normal",
            type: "ongoing",
            status: "pending"
        },
        {
            id: "3",
            title: "Farcaster_Canvas_Logic: Mini-app prototype shaping",
            time: "T+1 14:00",
            duration: "3h",
            importance: "normal",
            type: "time-bound",
            status: "pending"
        }
    ]);

    const getImportanceStyles = (importance: Event["importance"]) => {
        switch (importance) {
            case "critical":
                return { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" };
            case "high":
                return { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
            case "normal":
                return { color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" };
            case "low":
                return { color: "text-gray-500", bg: "bg-gray-500/10", border: "border-gray-500/20" };
        }
    };

    return (
        <div className="glass panel-shadow overflow-hidden panel-mount flex flex-col h-full">
            {/* Header */}
            <div className="panel-header flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse" />
                    <span className="text-[11px] mono font-black uppercase tracking-[0.25em]">Cronos_Timeline</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[9px] mono text-gray-600 font-bold uppercase tracking-widest leading-none">
                        UTC: {new Date().getHours()}:00
                    </span>
                    <div className="w-[1px] h-4 bg-white/5" />
                    <button className="text-[9px] mono text-cyan-400 hover:text-cyan-300 transition-colors hover-press font-black uppercase tracking-widest">+ NEW_SEQ</button>
                </div>
            </div>

            {/* Timeline Layout */}
            <div className="flex-1 p-5 relative overflow-y-auto custom-scrollbar bg-slate-950/20">
                {/* Vertical Axis */}
                <div className="absolute left-[3.25rem] top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/5 via-white/10 to-transparent" />

                <div className="space-y-6 relative z-10 scale-in">
                    {events.map((event, idx) => {
                        const styles = getImportanceStyles(event.importance);
                        const isActive = event.status === 'active';

                        return (
                            <div key={event.id} className="flex gap-4 group cursor-default scale-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                                {/* Time Marker */}
                                <div className="w-12 flex flex-col items-end pt-1 shrink-0">
                                    <span className={`text-[10px] mono font-black italic tracking-tighter leading-none ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                        {event.time}
                                    </span>
                                    {event.duration && (
                                        <span className="text-[7px] mono text-gray-800 font-black mt-1 uppercase tracking-widest leading-none">
                                            {event.duration}
                                        </span>
                                    )}
                                </div>

                                {/* Node Marker */}
                                <div className="relative pt-1.5 shrink-0">
                                    <div className={`w-2.5 h-2.5 rounded-full border bg-slate-950 z-20 relative transition-all duration-300 group-hover:scale-125 ${isActive ? 'border-cyan-400 pulse shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'border-white/10'}`} />
                                    {isActive && (
                                        <div className="absolute inset-x-0 inset-y-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400/20 blur-[2px] animate-pulse" />
                                    )}
                                </div>

                                {/* Event Content */}
                                <div className={`flex-1 p-3 rounded-sm border transition-all duration-300 group-hover:translate-x-1 ${isActive
                                    ? 'bg-slate-900/60 border-cyan-500/20 ring-1 ring-inset ring-white/5'
                                    : 'bg-slate-900/20 border-white/5 opacity-60 group-hover:opacity-100 group-hover:border-white/10'}`}>

                                    <div className="flex items-center justify-between gap-3 mb-2">
                                        <div className={`text-[7px] mono font-black px-1.5 py-0.5 rounded-sm border uppercase tracking-widest leading-none ${styles.bg} ${styles.color} ${styles.border}`}>
                                            {event.importance}
                                        </div>
                                        <div className="flex-1 h-[1px] bg-white/[0.03]" />
                                        <div className={`text-[7px] mono font-black uppercase tracking-[0.2em] leading-none ${isActive ? 'text-cyan-400' : 'text-gray-700'}`}>
                                            {event.status}
                                        </div>
                                    </div>

                                    <div className={`text-[12px] font-bold leading-snug tracking-tight mb-2 uppercase italic transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                        {event.title}
                                    </div>

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-1">
                                                {[1, 2].map(i => (
                                                    <div key={i} className="w-3.5 h-3.5 rounded-full border border-slate-950 bg-slate-800 ring-1 ring-white/5" />
                                                ))}
                                            </div>
                                            <span className="text-[8px] mono text-gray-700 font-black uppercase tracking-widest italic">
                                                {event.type.replace('-', '_')}
                                            </span>
                                        </div>
                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-white/5 px-6 py-3 flex items-center justify-between shrink-0 bg-slate-950/60">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[2px] animate-pulse" />
                    </div>
                    <span className="text-[9px] mono text-gray-600 font-black uppercase tracking-[0.25em]">CRON_SYNC_OK</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[9px] mono text-gray-800 font-black uppercase tracking-widest">{events.length} NODES</span>
                    <button className="text-[9px] mono text-gray-700 hover:text-cyan-400 transition-all font-black uppercase tracking-[0.3em] hover-press italic">VIEW_ALL</button>
                </div>
            </div>
        </div>
    );
}

