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
    const walletsByLane = wallets.reduce((acc: Record<string, Wallet[]>, wallet: Wallet) => {
        const lane = wallet.lane || "other";
        if (!acc[lane]) acc[lane] = [];
        acc[lane].push(wallet);
        return acc;
    }, {});

    const toggleLane = (lane: string) => {
        const newExpanded = new Set(expandedLanes);
        if (newExpanded.has(lane)) {
            newExpanded.delete(lane);
        } else {
            newExpanded.add(lane);
        }
        setExpandedLanes(newExpanded);
    };

    const getLaneStyles = (lane: string) => {
        switch (lane.toLowerCase()) {
            case "identity":
                return { color: "text-cyan-400", border: "border-cyan-500/20", glow: "shadow-[0_0_20px_rgba(34,211,238,0.1)]", icon: "👤", label: "NODE_IDENT" };
            case "trading":
                return { color: "text-amber-400", border: "border-amber-500/20", glow: "shadow-[0_0_20px_rgba(251,191,36,0.1)]", icon: "📈", label: "EXECUTION_LANE" };
            case "treasury":
                return { color: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-[0_0_20px_rgba(52,211,153,0.1)]", icon: "🏦", label: "VAULT_STORAGE" };
            case "lp":
                return { color: "text-purple-400", border: "border-purple-500/20", glow: "shadow-[0_0_20px_rgba(192,132,252,0.1)]", icon: "💧", label: "LIQ_PROVISION" };
            default:
                return { color: "text-gray-400", border: "border-gray-500/20", glow: "shadow-none", icon: "🔧", label: "OTHER_OPS" };
        }
    };

    const getRiskLabel = (risk: string) => {
        switch (risk) {
            case "high_sensitivity":
                return { text: "CORE_SEC", color: "text-rose-400", bg: "bg-rose-500/5", border: "border-rose-500/20" };
            case "medium":
                return { text: "OPERATIONAL", color: "text-amber-400", bg: "bg-amber-500/5", border: "border-amber-500/20" };
            case "low":
                return { text: "STANDARD", color: "text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/20" };
            default:
                return { text: "UNVERIFIED", color: "text-gray-500", bg: "bg-gray-500/5", border: "border-gray-500/20" };
        }
    };

    return (
        <div className="glass panel-shadow overflow-hidden panel-mount h-full flex flex-col">
            {/* Header */}
            <div className="panel-header flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse" />
                    <span className="text-[11px] mono font-black uppercase tracking-[0.25em]">Registry_Lanes</span>
                </div>
                <div className="flex items-center gap-4 px-2">
                    <span className="text-[9px] mono text-gray-600 font-bold uppercase tracking-widest leading-none">
                        Active: {wallets.length}
                    </span>
                    <div className="w-[1px] h-4 bg-white/5" />
                    <button className="text-[9px] mono text-cyan-400 hover:text-cyan-300 transition-colors hover-press font-black uppercase tracking-widest">+ NEW_NODE</button>
                </div>
            </div>

            {/* Tactical Lanes */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar bg-slate-950/20">
                {Object.entries(walletsByLane).map(([lane, laneWallets], laneIdx) => {
                    const isExpanded = expandedLanes.has(lane);
                    const styles = getLaneStyles(lane);

                    return (
                        <div key={lane} className="space-y-3 scale-in" style={{ animationDelay: `${laneIdx * 0.1}s` }}>
                            {/* Lane Identifier */}
                            <button
                                onClick={() => toggleLane(lane)}
                                className="w-full flex items-center justify-between group py-1"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-1 h-4 rounded-full transition-all duration-300 ${isExpanded ? styles.color.replace('text-', 'bg-') : 'bg-gray-800'}`} />
                                    <div className="flex flex-col items-start translate-y-[-1px]">
                                        <span className={`text-[10px] mono font-black uppercase tracking-[0.3em] transition-colors ${isExpanded ? styles.color : 'text-gray-600 group-hover:text-gray-400'}`}>
                                            {styles.label}
                                        </span>
                                        <div className={`text-[7px] mono font-bold uppercase opacity-40 ${styles.color}`}>
                                            STATUS: {isExpanded ? 'BUFFER_IN_USE' : 'COLLAPSED'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[8px] mono text-gray-700 font-black tracking-widest">{laneWallets.length} UNITS</span>
                                    <div className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}>
                                        <svg className="w-3 h-3 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </button>

                            {/* Wallet Cards */}
                            {isExpanded && (
                                <div className="grid grid-cols-1 gap-2 pl-4 origin-top transition-all">
                                    {laneWallets.map((wallet, walletIdx) => {
                                        const isSelected = selectedWallet?.id === wallet.id;
                                        const risk = getRiskLabel(wallet.risk_band);

                                        return (
                                            <div
                                                key={wallet.id}
                                                onClick={() => onSelectWallet(wallet)}
                                                className={`p-3 rounded border transition-all cursor-pointer relative group ${isSelected
                                                    ? `${styles.border} bg-slate-900/60 ${styles.glow} ring-1 ring-inset ring-white/5`
                                                    : "bg-slate-900/30 border-white/5 hover:bg-slate-800/40 hover:border-white/10"
                                                    }`}
                                                style={{ animationDelay: `${(laneIdx * 0.1) + (walletIdx * 0.05)}s` }}
                                            >
                                                {/* Left accent bar for selection */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-300 ${isSelected ? styles.color.replace('text-', 'bg-') : 'bg-transparent'}`} />

                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        {/* Identity & ENS */}
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`text-xs font-black tracking-tight truncate uppercase italic leading-none ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                                                {wallet.ens_name || wallet.id}
                                                            </span>
                                                            {wallet.farcaster_handle && (
                                                                <span className="text-[8px] mono text-purple-500/60 font-black uppercase tracking-widest leading-none">@{wallet.farcaster_handle}</span>
                                                            )}
                                                        </div>

                                                        {/* Purpose / Tags row */}
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="text-[8px] mono bg-black/40 px-1.5 py-0.5 rounded-sm border border-white/5 text-gray-600 font-bold tracking-widest uppercase">
                                                                {wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}
                                                            </span>
                                                            {wallet.browser_profile && (
                                                                <span className="text-[8px] mono bg-cyan-500/5 px-1.5 py-0.5 rounded-sm border border-cyan-500/10 text-cyan-500/40 font-black tracking-widest uppercase truncate max-w-[80px]">
                                                                    DEV_PROF_{wallet.browser_profile.toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Risk & Performance Dashboard */}
                                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                                        <div className={`text-[7px] mono font-black px-1.5 py-0.5 rounded-sm border uppercase tracking-[0.2em] leading-none ${risk.bg} ${risk.color} ${risk.border}`}>
                                                            {risk.text}
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <div className={`text-[13px] mono font-black tracking-tighter transition-all duration-300 ${isSelected ? 'text-white scale-105' : 'text-gray-400'}`}>
                                                                4.20<span className="text-[8px] opacity-40 ml-0.5">ETH</span>
                                                            </div>
                                                            <div className="text-[7px] mono text-emerald-500/60 font-black tracking-widest mt-0.5">
                                                                +1.2%_SYNC
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Selection corner piece */}
                                                {isSelected && (
                                                    <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${styles.border.replace('border-', 'border-t-').replace('border-', 'border-r-')} opacity-60`} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-white/5 px-6 py-3 flex items-center justify-between shrink-0 bg-slate-950/60 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[2px] animate-pulse" />
                    </div>
                    <span className="text-[9px] mono text-gray-600 font-black uppercase tracking-[0.25em]">Registry_Stream_Live</span>
                </div>
                <button className="text-[9px] mono text-gray-700 hover:text-cyan-400/80 transition-all font-black uppercase tracking-[0.3em] hover-press">SYNC_ALL_NODES</button>
            </div>
        </div>
    );
}

