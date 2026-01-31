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

    const getTypeColor = (type: Position["type"]) => {
        switch (type) {
            case "dca":
                return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
            case "grid":
                return "bg-purple-500/20 text-purple-400 border-purple-500/30";
            case "manual":
                return "bg-amber-500/20 text-amber-400 border-amber-500/30";
        }
    };

    const getStatusColor = (status: Position["status"]) => {
        switch (status) {
            case "active":
                return "bg-emerald-500/20 text-emerald-400";
            case "paused":
                return "bg-amber-500/20 text-amber-400";
            case "completed":
                return "bg-gray-500/20 text-gray-400";
        }
    };

    const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
    const totalValue = positions.reduce((sum, pos) => sum + (pos.currentPrice * pos.size), 0);

    return (
        <div className="glass panel-shadow overflow-hidden panel-mount">
            {/* Header */}
            <div className="panel-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="upper">Trading Cockpit</span>
                </div>
                <div className="flex items-center gap-1.5">
                    {(["positions", "orders", "history"] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`text-[9px] mono uppercase tracking-widest px-2 py-0.5 rounded-sm transition-all hover-press font-black ${view === v
                                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                : "text-gray-500 hover:text-gray-300 border border-transparent"
                                }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="p-4 border-b border-gray-800/50 grid grid-cols-3 gap-4 bg-slate-950/20">
                <div className="space-y-1">
                    <div className="text-[9px] mono text-gray-500 uppercase tracking-widest font-black">NAV_VALUATION</div>
                    <div className="text-sm mono font-black text-white">
                        ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="text-[9px] mono text-gray-500 uppercase tracking-widest font-black">TOTAL_PNL</div>
                    <div className={`text-sm mono font-black ${totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="text-[9px] mono text-gray-500 uppercase tracking-widest font-black">CONTROL_NODES</div>
                    <div className="text-sm mono font-black text-cyan-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse" />
                        {positions.filter(p => p.status === "active").length} ACTIVE
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {view === "positions" && (
                    <div className="p-4 space-y-4 scale-in">
                        {positions.map((position) => (
                            <div
                                key={position.id}
                                className="p-4 rounded-lg bg-slate-800/20 border border-gray-700/30 hover:border-cyan-500/30 transition-all group hover-lift"
                            >
                                {/* Position Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm font-black text-white uppercase tracking-tight">{position.pair}</span>
                                            <span className={`text-[9px] mono font-black px-1.5 py-0.5 rounded-sm border transition-all group-hover:scale-105 ${getTypeColor(position.type)}`}>
                                                {position.type}
                                            </span>
                                            <div className={`w-1.5 h-1.5 rounded-full ${position.status === 'active' ? 'bg-emerald-400 pulse' : 'bg-gray-600'}`} />
                                        </div>
                                        <div className="text-[10px] mono text-gray-500 uppercase tracking-widest font-bold">
                                            SIZE: {position.size} {position.pair.split('/')[0]}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-base mono font-black leading-none mb-1 ${position.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                                        </div>
                                        <div className={`text-[10px] mono font-black ${position.pnlPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>

                                {/* Price Info */}
                                <div className="grid grid-cols-2 gap-4 text-[10px] mono bg-black/20 p-2 rounded-sm border border-gray-800/50 mb-4">
                                    <div>
                                        <div className="text-gray-600 uppercase tracking-widest mb-1 font-black">ENTRY_PRICE</div>
                                        <div className="text-gray-300 font-black tracking-tight">${position.entryPrice.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-600 uppercase tracking-widest mb-1 font-black">MARK_PRICE</div>
                                        <div className="text-cyan-400/80 font-black tracking-tight">${position.currentPrice.toLocaleString()}</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button className="flex-1 py-1.5 rounded-sm bg-slate-800/50 hover:bg-slate-700/50 text-[9px] mono font-black text-gray-400 uppercase tracking-widest border border-gray-700/50 transition-all hover-press">
                                        CONFIG
                                    </button>
                                    <button className="flex-1 py-1.5 rounded-sm bg-amber-500/5 hover:bg-amber-500/10 text-[9px] mono font-black text-amber-500/80 uppercase tracking-widest border border-amber-500/20 transition-all hover-press">
                                        PAUSE
                                    </button>
                                    <button className="flex-1 py-1.5 rounded-sm bg-rose-500/5 hover:bg-rose-500/10 text-[9px] mono font-black text-rose-500/80 uppercase tracking-widest border border-rose-500/20 transition-all hover-press">
                                        LIQUIDATE
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {view === "orders" && (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-600 opacity-50 scale-in">
                        <div className="text-4xl mb-3">⊘</div>
                        <p className="mono text-[10px] uppercase tracking-[0.2em] font-black">Zero Orders Active</p>
                    </div>
                )}

                {view === "history" && (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-600 opacity-50 scale-in">
                        <div className="text-4xl mb-3">📊</div>
                        <p className="mono text-[10px] uppercase tracking-[0.2em] font-black">History Stream Empty</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-gray-800/50 px-4 py-2 flex items-center justify-between text-[10px] mono text-gray-500 uppercase tracking-widest font-black">
                <span className="opacity-50">{positions.length} strategies loaded</span>
                <button className="text-cyan-400 hover:text-cyan-300 transition-colors hover-press font-black">+ DEPLOY_BOT</button>
            </div>
        </div>
    );
}
