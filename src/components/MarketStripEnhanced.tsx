"use client";

import React from "react";
import { getMarketStrip, updateMarketPairs } from "../lib/api-client";

interface MarketItem {
    pair: string;
    price: string;
    change24h: string;
    fundingRate?: string;
}

export function MarketStripEnhanced() {
    const [items, setItems] = React.useState<MarketItem[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [editing, setEditing] = React.useState(false);
    const [pairsInput, setPairsInput] = React.useState("");
    const [time, setTime] = React.useState(new Date());

    const loadData = React.useCallback(async () => {
        setLoading(true);
        try {
            const data = await getMarketStrip() as MarketItem[];
            setItems(data);
        } catch (e) {
            console.error("MarketStrip fetch failed:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        loadData();
        const dataTimer = setInterval(loadData, 10000);
        const clockTimer = setInterval(() => setTime(new Date()), 1000);
        return () => {
            clearInterval(dataTimer);
            clearInterval(clockTimer);
        };
    }, [loadData]);

    const startEdit = () => {
        setPairsInput(items.map((i: MarketItem) => i.pair).join(", "));
        setEditing(true);
    };

    const saveEdit = async () => {
        const newPairs = pairsInput.split(",").map((p: string) => p.trim()).filter(Boolean);
        setEditing(false);
        try {
            await updateMarketPairs(newPairs);
            setTimeout(loadData, 500);
        } catch (e) {
            console.error("Failed to update pairs:", e);
        }
    };

    const formatPrice = (price: string) => {
        const p = parseFloat(price);
        if (isNaN(p)) return price;
        if (p >= 1000) return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return p.toFixed(4);
    };

    const formatChange = (change: string) => {
        const c = parseFloat(change);
        if (isNaN(c)) return "—";
        const sign = c >= 0 ? "+" : "";
        return `${sign}${c.toFixed(2)}%`;
    };

    return (
        <React.Fragment>
            <div className="w-full glass-heavy border-b border-white/5 backdrop-blur-2xl z-50 panel-mount relative shrink-0">
                {/* Top scanning line effect */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-pulse" />

                <div className="max-w-[1920px] mx-auto px-6 py-2 flex items-center justify-between">
                    {/* Left: Branding & Status */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 group cursor-pointer hover-lift">
                            <div className="w-9 h-9 rounded bg-slate-950 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:border-cyan-500/40 transition-all">
                                <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-black text-lg tracking-[-0.05em] uppercase italic leading-none">
                                    OPS<span className="text-cyan-400">HOME</span>
                                </span>
                                <span className="text-[8px] mono text-cyan-500/50 font-black tracking-[0.4em] mt-0.5 ml-0.5 uppercase">COMMAND_OS</span>
                            </div>
                        </div>

                        <div className="h-8 w-px bg-white/5" />

                        <div className="flex items-center gap-3 cursor-pointer group" onClick={startEdit}>
                            <div className="relative">
                                <div className={`w-2 h-2 rounded-full ${loading ? "bg-amber-400 animate-pulse" : "bg-emerald-500 pulse"}`} />
                                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[4px] animate-pulse" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] mono text-gray-400 font-black uppercase tracking-widest leading-none">
                                    {editing ? "RECONFIG_ACTIVE" : "KRNL_READY"}
                                </span>
                                <span className="text-[7px] mono text-gray-700 font-bold uppercase tracking-[0.2em] mt-1 group-hover:text-cyan-500/60 transition-colors">
                                    {loading ? "SYNC_IN_PROGRESS" : "UPLINK_STABLE"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Center: Market Ticker / Editor */}
                    <div className="flex-1 px-12 overflow-hidden">
                        {editing ? (
                            <div className="flex items-center gap-3 scale-in">
                                <div className="flex-1 relative">
                                    <input
                                        className="w-full bg-slate-950/80 border border-cyan-500/30 rounded-sm px-4 py-1.5 text-[11px] mono text-cyan-400 placeholder-gray-800 focus:outline-none focus:shadow-[0_0_10px_rgba(6,182,212,0.1)] transition-all font-black uppercase tracking-widest"
                                        value={pairsInput}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPairsInput(e.target.value)}
                                        placeholder="BTC-USDT, ETH-USDT, SOL-USDT..."
                                        autoFocus
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && saveEdit()}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                                        <div className="w-1 h-3 bg-cyan-950 rotate-12" />
                                        <div className="w-1 h-3 bg-cyan-950 rotate-12" />
                                    </div>
                                </div>
                                <div className="flex gap-1.5">
                                    <button
                                        onClick={saveEdit}
                                        className="px-4 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-sm text-[9px] mono font-black uppercase tracking-widest hover:bg-cyan-500/20 hover-press transition-all"
                                    >
                                        PUSH
                                    </button>
                                    <button
                                        onClick={() => setEditing(false)}
                                        className="px-4 py-1.5 bg-slate-900/50 text-gray-600 border border-white/5 rounded-sm text-[9px] mono font-black uppercase tracking-widest hover:text-gray-400 hover-press transition-all"
                                    >
                                        ABORT
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-10 scale-in overflow-x-auto no-scrollbar py-1">
                                {items.length === 0 && !loading && (
                                    <span className="text-[9px] mono text-gray-800 font-black uppercase tracking-[0.4em] italic mx-auto">Buffer_Void_Null</span>
                                )}
                                {items.map((item: MarketItem) => (
                                    <div key={item.pair} className="flex items-center gap-4 group cursor-pointer hover-lift shrink-0">
                                        <div className="flex flex-col items-start text-left">
                                            <span className="text-[11px] mono font-black text-gray-400 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                                                {item.pair.split('-')[0]}<span className="opacity-20 ml-0.5">/USD</span>
                                            </span>
                                            {item.fundingRate && (
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <div className="w-1 h-1 rounded-full bg-cyan-500/40" />
                                                    <span className="text-[7px] mono text-gray-700 font-bold tracking-widest uppercase">
                                                        FR: {(parseFloat(item.fundingRate) * 100).toFixed(4)}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-[13px] mono font-black text-white tracking-tighter leading-none">
                                                {formatPrice(item.price)}
                                            </span>
                                            <span
                                                className={`text-[8px] mono font-black px-1 rounded-sm leading-none py-0.5 transition-all group-hover:scale-105 ${parseFloat(item.change24h) >= 0 ? "text-emerald-500/80" : "text-rose-500/80"
                                                    }`}
                                            >
                                                {formatChange(item.change24h)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Clock & User */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 px-4 py-1 rounded bg-white/[0.02] border border-white/5">
                            <div className="flex flex-col items-end">
                                <div className="text-xl mono font-black text-white tracking-[-0.08em] leading-none mb-0.5">
                                    {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                                </div>
                                <div className="flex items-center gap-1.5 opacity-40">
                                    <span className="text-[8px] mono text-gray-400 uppercase tracking-widest font-black">
                                        {time.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}
                                    </span>
                                    <div className="w-[1px] h-2 bg-gray-700" />
                                    <span className="text-[8px] mono text-gray-400 uppercase tracking-widest font-black">
                                        UTC{time.getTimezoneOffset() / -60 >= 0 ? '+' : ''}{time.getTimezoneOffset() / -60}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="relative group cursor-pointer">
                            <div className="w-10 h-10 rounded-full border border-white/10 bg-slate-900/50 flex items-center justify-center group-hover:border-cyan-500/40 transition-all p-1">
                                <div className="w-full h-full rounded-full bg-gradient-to-tr from-slate-800 to-slate-600 overflow-hidden relative border border-white/5">
                                    {/* Simulated user placeholder */}
                                    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
