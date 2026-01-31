"use client";

import React, { useState } from "react";
import type { Wallet } from "@/lib/wallets";

interface WalletManagerProps {
    wallets: Wallet[];
    selectedWallet: Wallet | null;
    onSelectWallet: (wallet: Wallet) => void;
}

export function WalletManager({ wallets, selectedWallet, onSelectWallet }: WalletManagerProps) {
    const [expandedLanes, setExpandedLanes] = useState<Set<string>>(new Set(["identity", "trading", "treasury"]));

    // Group wallets by lane
    const walletsByLane = wallets.reduce((acc, wallet) => {
        const lane = wallet.lane || "other";
        if (!acc[lane]) acc[lane] = [];
        acc[lane].push(wallet);
        return acc;
    }, {} as Record<string, Wallet[]>);

    const toggleLane = (lane: string) => {
        const newExpanded = new Set(expandedLanes);
        if (newExpanded.has(lane)) {
            newExpanded.delete(lane);
        } else {
            newExpanded.add(lane);
        }
        setExpandedLanes(newExpanded);
    };

    const getLaneColor = (lane: string) => {
        switch (lane.toLowerCase()) {
            case "identity":
                return "text-cyan-400 border-cyan-500/30";
            case "trading":
                return "text-amber-400 border-amber-500/30";
            case "treasury":
                return "text-emerald-400 border-emerald-500/30";
            case "lp":
                return "text-purple-400 border-purple-500/30";
            default:
                return "text-gray-400 border-gray-500/30";
        }
    };

    const getRiskBadge = (risk: string) => {
        switch (risk) {
            case "safe":
                return { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "SAFE" };
            case "medium":
                return { bg: "bg-amber-500/20", text: "text-amber-400", label: "MED" };
            case "high":
                return { bg: "bg-rose-500/20", text: "text-rose-400", label: "HIGH" };
            default:
                return { bg: "bg-gray-500/20", text: "text-gray-400", label: "UNK" };
        }
    };

    return (
        <div className="glass panel-shadow overflow-hidden panel-mount">
            {/* Header */}
            <div className="panel-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="upper">Wallet Lanes</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse" />
            </div>

            {/* Lanes */}
            <div className="divide-y divide-gray-800/50 max-h-[600px] overflow-y-auto custom-scrollbar">
                {Object.entries(walletsByLane).map(([lane, laneWallets]) => {
                    const isExpanded = expandedLanes.has(lane);
                    const laneColor = getLaneColor(lane);

                    return (
                        <div key={lane}>
                            {/* Lane Header */}
                            <button
                                onClick={() => toggleLane(lane)}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/40 transition-all hover-press border-l-2 border-transparent hover:border-cyan-500/20"
                            >
                                <div className="flex items-center gap-3">
                                    <svg
                                        className={`w-3 h-3 text-gray-600 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    <span className={`text-[10px] mono font-black uppercase tracking-[0.15em] ${laneColor}`}>
                                        {lane}
                                    </span>
                                </div>
                                <span className="text-[10px] mono text-gray-500 font-bold bg-slate-900 border border-gray-800/50 px-2 py-0.5 rounded">
                                    {laneWallets.length}
                                </span>
                            </button>

                            {/* Lane Wallets */}
                            {isExpanded && (
                                <div className="bg-slate-950/40 divide-y divide-gray-800/30 scale-in origin-top">
                                    {laneWallets.map((wallet) => {
                                        const isSelected = selectedWallet?.id === wallet.id;
                                        const riskBadge = getRiskBadge(wallet.risk_band);

                                        return (
                                            <button
                                                key={wallet.id}
                                                onClick={() => onSelectWallet(wallet)}
                                                className={`w-full px-6 py-4 text-left transition-all relative group hover-lift ${isSelected ? "bg-cyan-500/10" : "hover:bg-slate-800/30"
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
                                                )}
                                                <div className="flex items-start justify-between gap-4">
                                                    {/* Wallet Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2.5 mb-2">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-cyan-400 pulse" : "bg-gray-700"}`} />
                                                            <span className={`text-sm font-bold truncate transition-colors ${isSelected ? "text-cyan-400 uppercase tracking-tight" : "text-gray-300 group-hover:text-white"}`}>
                                                                {wallet.id}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] mono text-gray-500">
                                                            <span className="bg-slate-800/50 px-1.5 py-0.5 rounded border border-gray-700/50 group-hover:border-cyan-500/30 transition-colors">
                                                                {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                                                            </span>
                                                            <span className="opacity-30">|</span>
                                                            <span className="uppercase tracking-widest">{wallet.provider || 'EOA'}</span>
                                                        </div>
                                                    </div>

                                                    {/* Balance & Risk */}
                                                    <div className="flex flex-col items-end gap-2">
                                                        <div className="text-sm mono font-black text-emerald-400 tracking-tighter">
                                                            4.20 ETH
                                                        </div>
                                                        <div className={`px-2 py-0.5 rounded-sm text-[9px] mono font-black tracking-widest border transition-all ${riskBadge.bg} ${riskBadge.text} ${riskBadge.text.replace('text-', 'border-').replace('400', '500/30')} group-hover:scale-105`}>
                                                            {riskBadge.label}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-gray-800/50 px-4 py-2 flex items-center justify-between text-[10px] mono text-gray-500 uppercase tracking-widest font-black">
                <span className="opacity-50">{wallets.length} active nodes</span>
                <button className="text-cyan-400 hover:text-cyan-300 transition-colors hover-press">+ Provision</button>
            </div>
        </div>
    );
}
