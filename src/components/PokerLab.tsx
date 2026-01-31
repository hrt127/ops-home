"use client";

import React, { useState } from "react";

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
    const [hands] = useState<Hand[]>([
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

    const [view, setView] = useState<"hands" | "stats" | "ranges">("hands");

    const getResultColor = (result: Hand["result"]) => {
        switch (result) {
            case "win":
                return "text-emerald-400";
            case "loss":
                return "text-rose-400";
            case "break-even":
                return "text-gray-400";
        }
    };

    const totalProfit = hands.reduce((sum, hand) => sum + hand.amount, 0);
    const winRate = (hands.filter(h => h.result === "win").length / hands.length) * 100;

    return (
        <div className="glass panel-shadow overflow-hidden panel-mount">
            {/* Header */}
            <div className="panel-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="upper">Poker Lab</span>
                </div>
                <div className="flex items-center gap-2">
                    {(["hands", "stats", "ranges"] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`text-[10px] mono uppercase tracking-widest px-2 py-1 rounded transition-colors hover-press ${view === v
                                ? "bg-cyan-500/20 text-cyan-400"
                                : "text-gray-500 hover:text-gray-300"
                                }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Summary */}
            <div className="p-4 border-b border-gray-800/50 grid grid-cols-3 gap-4 bg-slate-950/20">
                <div className="space-y-1">
                    <div className="text-[10px] mono text-gray-500 uppercase tracking-widest">SESSION_PNL</div>
                    <div className={`text-sm mono font-black flex items-center gap-2 ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full pulse ${totalProfit >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {totalProfit >= 0 ? '+' : ''}${totalProfit}
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="text-[10px] mono text-gray-500 uppercase tracking-widest">WIN_PROB</div>
                    <div className="text-sm mono font-black text-cyan-400">
                        {winRate.toFixed(1)}%
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="text-[10px] mono text-gray-500 uppercase tracking-widest">HAND_LOGS</div>
                    <div className="text-sm mono font-black text-white">
                        {hands.length}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {view === "hands" && (
                    <div className="p-4 space-y-4 scale-in">
                        {hands.map((hand) => (
                            <div
                                key={hand.id}
                                className="p-4 rounded-lg bg-slate-800/30 border border-gray-700/50 hover:border-cyan-500/30 transition-all group hover-lift cursor-default"
                            >
                                {/* Hand Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <span className="text-sm font-black text-white uppercase tracking-tight">{hand.stakes}</span>
                                            <span className="text-[9px] mono font-bold px-1.5 py-0.5 rounded-sm bg-slate-900 text-gray-400 border border-gray-800/50 uppercase tracking-widest group-hover:border-cyan-500/30 transition-colors">
                                                {hand.position}
                                            </span>
                                        </div>
                                        <div className="text-[10px] mono text-gray-500 uppercase tracking-widest">
                                            {hand.date.toLocaleDateString()} • {hand.result}
                                        </div>
                                    </div>
                                    <div className={`text-base mono font-black leading-none ${getResultColor(hand.result)}`}>
                                        {hand.amount >= 0 ? '+' : ''}${hand.amount}
                                    </div>
                                </div>

                                {/* Notes */}
                                {hand.notes && (
                                    <p className="text-sm text-gray-300 leading-relaxed mb-4 group-hover:text-gray-100 transition-colors">{hand.notes}</p>
                                )}

                                {/* Tags */}
                                {hand.tags && hand.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {hand.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] mono px-2 py-0.5 rounded-sm bg-slate-950/50 text-gray-500 border border-gray-800/50 uppercase tracking-widest group-hover:border-cyan-500/20 transition-colors"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {view === "stats" && (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-600 opacity-50 scale-in">
                        <div className="text-4xl mb-3">📊</div>
                        <p className="mono text-[10px] uppercase tracking-[0.2em]">Analytic Core Offline</p>
                    </div>
                )}

                {view === "ranges" && (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-600 opacity-50 scale-in">
                        <div className="text-4xl mb-3">🎯</div>
                        <p className="mono text-[10px] uppercase tracking-[0.2em]">Strategic Ranges Pending</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-gray-800/50 px-4 py-2 flex items-center justify-between text-[10px] mono text-gray-500 uppercase tracking-widest">
                <span className="font-bold opacity-50">{hands.length} events recorded</span>
                <button className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors hover-press">+ Capture Hand</button>
            </div>
        </div>
    );
}
