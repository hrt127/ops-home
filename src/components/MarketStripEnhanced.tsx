"use client";

import React, { useEffect, useState } from "react";

interface MarketItem {
    symbol: string;
    price: number;
    change24h: number;
}

export function MarketStripEnhanced() {
    const [items, setItems] = useState<MarketItem[]>([
        { symbol: "BTC", price: 88842.12, change24h: 2.4 },
        { symbol: "ETH", price: 9895.50, change24h: 1.9 },
        { symbol: "SOL", price: 148.21, change24h: -0.5 },
        { symbol: "BNB", price: 145.02, change24h: 0.8 },
    ]);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatPrice = (price: number) => {
        if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return price.toFixed(2);
    };

    const formatChange = (change: number) => {
        const sign = change >= 0 ? "+" : "";
        return `${sign}${change.toFixed(1)}%`;
    };

    return (
        <div className="w-full glass-heavy border-b border-cyan-500/10 backdrop-blur-xl z-50 panel-mount">
            <div className="max-w-[1920px] mx-auto px-6 py-2.5 flex items-center justify-between">
                {/* Left: Branding */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 group cursor-pointer hover-lift">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center panel-shadow group-active:scale-95 transition-all">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-white font-black text-xl tracking-tighter uppercase italic group-hover:text-cyan-400 transition-colors">
                            Ops<span className="text-cyan-400">Home</span>
                        </span>
                    </div>
                    <div className="h-6 w-px bg-gray-800" />
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse" />
                        <span className="text-[10px] mono text-gray-400 uppercase tracking-[0.2em] font-bold">SYSTEM_READY</span>
                    </div>
                </div>

                {/* Center: Market Ticker */}
                <div className="flex items-center gap-8 scale-in">
                    {items.map((item) => (
                        <div key={item.symbol} className="flex items-center gap-2.5 group cursor-pointer hover-lift">
                            <span className="text-[10px] mono font-black text-gray-500 group-hover:text-cyan-400 transition-colors uppercase tracking-widest">{item.symbol}</span>
                            <span className="text-sm mono font-bold text-white tracking-tight">${formatPrice(item.price)}</span>
                            <span
                                className={`text-[10px] mono font-bold px-1.5 py-0.5 rounded-sm transition-all group-hover:scale-105 ${item.change24h >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                                    }`}
                            >
                                {formatChange(item.change24h)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Right: Clock */}
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <div className="text-xl mono font-black text-white tracking-tighter leading-none mb-0.5">
                            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                        </div>
                        <div className="text-[10px] mono text-gray-500 uppercase tracking-[0.2em] font-bold">
                            UTC{time.getTimezoneOffset() / -60 >= 0 ? '+' : ''}{time.getTimezoneOffset() / -60} • {time.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-gray-800 bg-slate-900/50 flex items-center justify-center hover:border-cyan-500/40 transition-all cursor-pointer hover-press group">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 overflow-hidden border border-gray-600/50 group-hover:scale-110 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );
}
