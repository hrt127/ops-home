"use client";

import React, { useState } from "react";

interface Position {
    id: string;
    pair: string;
    type: "dca" | "grid" | "manual";
    status: "active" | "paused" | "completed";
    entryPrice: number;
    currentPrice: number;
    size: number;
    pnl: number;
    pnlPercent: number;
}

export function TradingDashboard() {
    const [positions] = useState<Position[]>([
        {
            id: "1",
            pair: "ETH/USDT",
            type: "dca",
            status: "active",
            entryPrice: 9500,
            currentPrice: 9895.50,
            size: 2.5,
            pnl: 988.75,
            pnlPercent: 4.16
        },
        {
            id: "2",
            pair: "BTC/USDT",
            type: "grid",
            status: "active",
            entryPrice: 87200,
            currentPrice: 88842.12,
            size: 0.15,
            pnl: 246.32,
            pnlPercent: 1.88
        }
    ]);

    const [view, setView] = useState<"positions" | "orders" | "history">("positions");

    const getTypeStyles = (type: Position["type"]) => {
        switch (type) {
            case "dca":
                return { color: "text-cyan-400", bg: "bg-cyan-500/5", border: "border-cyan-500/20", label: "DCA_STRAT" };
            case "grid":
                return { color: "text-purple-400", bg: "bg-purple-500/5", border: "border-purple-500/20", label: "GRID_OPS" };
            case "manual":
                return { color: "text-amber-400", bg: "bg-amber-500/5", border: "border-amber-500/20", label: "MANUAL_EXEC" };
        }
    };

    const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
    const totalValue = positions.reduce((sum, pos) => sum + (pos.currentPrice * pos.size), 0);

    return (
        <div className="glass panel-shadow overflow-hidden panel-mount flex flex-col h-full">
            {/* Header */}
            <div className="panel-header flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse" />
                    <span className="text-[11px] mono font-black uppercase tracking-[0.25em]">Execution_Cockpit</span>
                </div>
                <div className="flex items-center gap-1">
                    {(["positions", "orders", "history"] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`text-[8px] mono uppercase tracking-widest px-2 py-1 rounded-sm transition-all hover-press font-black ${view === v
                                ? "bg-white/10 text-white border-white/20 border"
                                : "text-gray-600 hover:text-gray-400 border border-transparent"
                                }`}
                        >
                            {v.slice(0, 4)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tactical Summary */}
            <div className="p-4 border-b border-white/5 bg-slate-900/10 grid grid-cols-3 gap-6 shrink-0">
                <div className="space-y-1">
                    <div className="text-[8px] mono text-gray-700 uppercase tracking-widest font-black leading-none">NAV_CAPITAL</div>
                    <div className="text-[14px] mono font-black text-white tracking-tighter">
                        ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}<span className="text-[9px] opacity-40 ml-0.5">.{(totalValue % 1).toFixed(2).slice(2)}</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="text-[8px] mono text-gray-700 uppercase tracking-widest font-black leading-none">REALIZED_NET</div>
                    <div className={`text-[14px] mono font-black tracking-tighter ${totalPnL >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
                <div className="space-y-1 text-right">
                    <div className="text-[8px] mono text-gray-700 uppercase tracking-widest font-black leading-none">SYS_LOAD</div>
                    <div className="text-[14px] mono font-black text-cyan-400 tracking-tighter">
                        {positions.filter(p => p.status === "active").length} // MODS
                    </div>
                </div>
            </div>

            {/* Position Stream */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar bg-slate-950/20">
                {view === "positions" && (
                    <div className="space-y-2 scale-in">
                        {positions.map((position, idx) => {
                            const styles = getTypeStyles(position.type);
                            const isPositive = position.pnl >= 0;

                            return (
                                <div
                                    key={position.id}
                                    className="p-3 rounded border border-white/5 bg-slate-900/30 hover:bg-slate-900/50 hover:border-cyan-500/30 transition-all group scale-in hover-lift relative overflow-hidden"
                                    style={{ animationDelay: `${idx * 0.05}s` }}
                                >
                                    <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-cyan-500/0 via-cyan-500/40 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[12px] font-black text-white uppercase italic tracking-tight">{position.pair}</span>
                                                <div className={`w-1 h-1 rounded-full ${position.status === 'active' ? 'bg-emerald-500 pulse' : 'bg-gray-700'}`} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[7px] mono font-black px-1.5 py-0.5 rounded-sm border uppercase tracking-widest leading-none ${styles.bg} ${styles.color} ${styles.border}`}>
                                                    {styles.label}
                                                </span>
                                                <span className="text-[8px] mono text-gray-600 font-black uppercase tracking-widest leading-none italic">
                                                    SZ: {position.size}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-[15px] mono font-black tracking-tighter italic leading-none mb-1 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {isPositive ? '+' : ''}{position.pnl.toFixed(2)}
                                            </div>
                                            <div className={`text-[8px] mono font-black uppercase tracking-widest leading-none ${isPositive ? 'text-emerald-500/60' : 'text-rose-500/60'}`}>
                                                {isPositive ? 'GAIN' : 'LOSS'} // {position.pnlPercent.toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>

                                    {/* Market Context */}
                                    <div className="grid grid-cols-2 gap-2 text-[9px] mono bg-black/40 p-2 rounded-sm border border-white/[0.02] mb-3">
                                        <div className="flex flex-col">
                                            <span className="text-gray-700 font-bold uppercase tracking-widest leading-none mb-1">ENTRY</span>
                                            <span className="text-gray-400 font-black tracking-tighter">${position.entryPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-gray-700 font-bold uppercase tracking-widest leading-none mb-1">MARK</span>
                                            <span className="text-white font-black tracking-tighter">${position.currentPrice.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Action Deck */}
                                    <div className="flex gap-1.5 opacity-40 group-hover:opacity-100 transition-all">
                                        <button className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-[8px] mono font-black text-gray-400 hover:text-white uppercase tracking-widest border border-white/5 transition-all hover-press italic">
                                            CFG
                                        </button>
                                        <button className="flex-1 py-1.5 bg-amber-500/5 hover:bg-amber-500/10 text-[8px] mono font-black text-amber-500/60 hover:text-amber-400 uppercase tracking-widest border border-amber-500/10 transition-all hover-press italic">
                                            HALT
                                        </button>
                                        <button className="flex-1 py-1.5 bg-rose-500/5 hover:bg-rose-500/10 text-[8px] mono font-black text-rose-500/60 hover:text-rose-500 uppercase tracking-widest border border-rose-500/10 transition-all hover-press italic">
                                            EXIT
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-white/5 px-6 py-3 flex items-center justify-between shrink-0 bg-slate-950/60">
                <div className="flex items-center gap-3">
                    <span className="text-[9px] mono text-gray-600 font-black uppercase tracking-widest">GATEWAY_STREAM_SYNC</span>
                    <div className="w-1 h-1 rounded-full bg-emerald-500/60 pulse" />
                </div>
                <button className="text-[9px] mono text-cyan-400 hover:text-cyan-300 transition-all font-black uppercase tracking-[0.3em] hover-press italic">+ AUTO_DEPLOY</button>
            </div>
        </div>
    );
}

