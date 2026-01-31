"use client";

import React from "react";

interface Hand {
    id: string;
    date: Date;
    stakes: string;
    position: string;
    result: "win" | "loss" | "break-even";
    amount: number;
    notes?: string;
    tags?: string[];
}

export function PokerLab() {
    const [hands] = React.useState<Hand[]>([
        {
            id: "1",
            date: new Date(Date.now() - 86400000),
            stakes: "1/2 NLH",
            position: "BTN",
            result: "win",
            amount: 245,
            notes: "3-bet with AKs, villain called. Hit top pair on flop, value bet all streets.",
            tags: ["3bet", "value-bet"]
        },
        {
            id: "2",
            date: new Date(Date.now() - 172800000),
            stakes: "1/2 NLH",
            position: "CO",
            result: "loss",
            amount: -180,
            notes: "Overvalued top pair vs aggressive opponent. Should have folded turn.",
            tags: ["bluff-catch", "mistake"]
        }
    ]);

    const [view, setView] = React.useState<"hands" | "stats" | "ranges">("hands");

    const getResultStyles = (result: Hand["result"]) => {
        switch (result) {
            case "win": return { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
            case "loss": return { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" };
            default: return { color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20" };
        }
    };

    const totalProfit = hands.reduce((sum: number, hand: Hand) => sum + hand.amount, 0);
    const winRate = hands.length > 0 ? (hands.filter((h: Hand) => h.result === "win").length / hands.length) * 100 : 0;

    return (
        <React.Fragment>
            <div className="glass panel-shadow overflow-hidden panel-mount flex flex-col h-full">
                {/* Header */}
                <div className="panel-header flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse" />
                        <span className="text-[11px] mono font-black uppercase tracking-[0.25em]">Session_Control_Lab</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {(["hands", "stats", "ranges"] as const).map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={`text-[8px] mono uppercase tracking-widest px-3 py-1 rounded-sm border transition-all hover-press font-black ${view === v
                                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                                    : "text-gray-600 border-gray-800/40 hover:text-gray-400"
                                    }`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tactical Dashboard Stats */}
                <div className="p-4 border-b border-gray-800/40 grid grid-cols-3 gap-6 bg-slate-900/20 shrink-0">
                    <div className="space-y-1 scale-in" style={{ animationDelay: '0s' }}>
                        <div className="text-[8px] mono text-gray-500 uppercase tracking-[0.2em] font-black">Net_Differential</div>
                        <div className={`text-sm mono font-black flex items-center gap-1.5 ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {totalProfit >= 0 ? '▲' : '▼'} {totalProfit >= 0 ? '+' : ''}${Math.abs(totalProfit)}
                        </div>
                    </div>
                    <div className="space-y-1 scale-in" style={{ animationDelay: '0.1s' }}>
                        <div className="text-[8px] mono text-gray-500 uppercase tracking-[0.2em] font-black">Efficiency_Ratio</div>
                        <div className="text-sm mono font-black text-white">
                            {winRate.toFixed(1)}<span className="text-gray-600 text-[10px] ml-0.5">%</span>
                        </div>
                    </div>
                    <div className="space-y-1 scale-in" style={{ animationDelay: '0.2s' }}>
                        <div className="text-[8px] mono text-gray-500 uppercase tracking-[0.2em] font-black">Packet_Density</div>
                        <div className="text-sm mono font-black text-cyan-500/60">
                            00{hands.length}
                        </div>
                    </div>
                </div>

                {/* Session Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-950/20">
                    {view === "hands" && (
                        <div className="p-4 space-y-3">
                            {hands.map((hand: Hand, idx: number) => {
                                const styles = getResultStyles(hand.result);
                                return (
                                    <div
                                        key={hand.id}
                                        className="p-3 rounded border border-gray-800/60 bg-slate-900/30 hover:bg-slate-900/50 hover:border-cyan-500/30 transition-all group scale-in hover-lift relative overflow-hidden"
                                        style={{ animationDelay: `${idx * 0.05}s` }}
                                    >
                                        <div className="absolute top-0 right-0 w-12 h-[1px] bg-gradient-to-l from-cyan-500/20 to-transparent" />

                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex gap-4">
                                                <div className="flex flex-col items-center justify-center w-8 h-8 rounded-sm bg-slate-950/80 border border-white/5 font-black text-[10px] mono text-gray-400 group-hover:text-cyan-400 transition-colors">
                                                    {hand.position}
                                                </div>
                                                <div>
                                                    <div className="text-[12px] font-bold text-gray-200 uppercase tracking-tight group-hover:text-white transition-colors">
                                                        {hand.stakes}
                                                    </div>
                                                    <div className="text-[9px] mono text-gray-600 font-bold uppercase tracking-widest mt-0.5">
                                                        {hand.date.toLocaleDateString()} // SYNC_0{idx + 1}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`text-base mono font-black tracking-tighter ${styles.color}`}>
                                                {hand.amount >= 0 ? '+' : ''}${hand.amount}
                                            </div>
                                        </div>

                                        {hand.notes && (
                                            <div className="relative mb-3 pl-3 border-l-2 border-slate-800 group-hover:border-cyan-500/30 transition-colors">
                                                <p className="text-[11px] text-gray-400 leading-relaxed italic line-clamp-2 group-hover:text-gray-200">
                                                    {hand.notes}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-1.5">
                                            {hand.tags?.map((tag: string) => (
                                                <span
                                                    key={tag}
                                                    className="text-[8px] mono px-1.5 py-0.5 rounded-sm bg-slate-950/80 text-gray-600 border border-white/5 uppercase font-black tracking-widest group-hover:text-cyan-500/40 transition-colors"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {view === "stats" && (
                        <div className="p-16 flex flex-col items-center justify-center text-gray-700 opacity-40 scale-in">
                            <div className="w-12 h-[1px] bg-gray-800 mb-6" />
                            <p className="mono text-[9px] uppercase tracking-[0.4em] font-black italic">Analytics_Matrix_Loading</p>
                        </div>
                    )}

                    {view === "ranges" && (
                        <div className="p-16 flex flex-col items-center justify-center text-gray-700 opacity-40 scale-in">
                            <div className="w-12 h-[1px] bg-gray-800 mb-6" />
                            <p className="mono text-[9px] uppercase tracking-[0.4em] font-black italic">Strategic_Sync_Pending</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="glass-heavy border-t border-gray-800/50 px-6 py-3 flex items-center justify-between shrink-0 text-[10px] mono text-gray-500 uppercase tracking-widest font-black">
                    <div className="flex items-center gap-3">
                        <span className="opacity-40">EVENTS: 0{hands.length}</span>
                        <div className="w-1 h-3 bg-gray-800 rotate-12" />
                        <span className={`font-black ${totalProfit >= 0 ? 'text-emerald-500/60' : 'text-rose-500/60'}`}>
                            EST_EV: ${Math.floor(totalProfit * 0.9)}
                        </span>
                    </div>
                    <button className="px-3 py-1 rounded-sm bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all hover-press shadow-lg shadow-cyan-500/5 uppercase mono font-black tracking-widest text-[9px]">
                        + CAPTURE_NODE
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
}

