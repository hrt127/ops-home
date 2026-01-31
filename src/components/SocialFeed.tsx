"use client";

import React, { useState, useEffect } from "react";

interface FeedItem {
    id: string;
    source: "farcaster" | "twitter" | "rss";
    author: string;
    content: string;
    timestamp: Date;
    engagement?: {
        likes: number;
        replies: number;
        recasts?: number;
    };
    tags?: string[];
}

export function SocialFeed() {
    const [items, setItems] = useState<FeedItem[]>([
        {
            id: "1",
            source: "farcaster",
            author: "vitalik.eth",
            content: "New research on ZK-SNARKs efficiency improvements. Seeing 40% reduction in proof generation time with our latest optimizations.",
            timestamp: new Date(Date.now() - 3600000),
            engagement: { likes: 234, replies: 45, recasts: 67 },
            tags: ["zk", "research"]
        },
        {
            id: "2",
            source: "twitter",
            author: "@cobie",
            content: "Market structure is changing. Watch the funding rates and open interest. Something's brewing.",
            timestamp: new Date(Date.now() - 7200000),
            engagement: { likes: 1203, replies: 156 },
            tags: ["trading", "market"]
        },
        {
            id: "3",
            source: "farcaster",
            author: "jessepollak",
            content: "Base just crossed 10M daily transactions. Onchain summer never ended 🔵",
            timestamp: new Date(Date.now() - 10800000),
            engagement: { likes: 892, replies: 123, recasts: 234 },
            tags: ["base", "onchain"]
        }
    ]);

    const [filter, setFilter] = useState<"all" | "farcaster" | "twitter" | "rss">("all");

    const getSourceIcon = (source: FeedItem["source"]) => {
        switch (source) {
            case "farcaster":
                return "🟣";
            case "twitter":
                return "🐦";
            case "rss":
                return "📡";
        }
    };

    const getSourceColor = (source: FeedItem["source"]) => {
        switch (source) {
            case "farcaster":
                return "text-purple-400";
            case "twitter":
                return "text-cyan-400";
            case "rss":
                return "text-amber-400";
        }
    };

    const formatTimestamp = (date: Date) => {
        const diff = Date.now() - date.getTime();
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) return `${Math.floor(diff / 60000)}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    const filteredItems = filter === "all"
        ? items
        : items.filter(item => item.source === filter);

    return (
        <div className="glass panel-shadow overflow-hidden panel-mount">
            {/* Header */}
            <div className="panel-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <span className="upper">Social Feed</span>
                </div>
                <div className="flex items-center gap-2">
                    {(["all", "farcaster", "twitter", "rss"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`text-[10px] mono uppercase tracking-widest px-2 py-1 rounded transition-colors hover-press ${filter === f
                                ? "bg-cyan-500/20 text-cyan-400"
                                : "text-gray-500 hover:text-gray-300"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feed Items */}
            <div className={`p-4 space-y-4 max-h-96 overflow-y-auto custom-scrollbar`}>
                <div key={filter} className="space-y-4 scale-in">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 rounded-lg bg-slate-800/30 border border-gray-700/50 hover:border-cyan-500/30 transition-all group hover-lift"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full border border-gray-700/50 bg-slate-900 flex items-center justify-center text-xs overflow-hidden`}>
                                        {getSourceIcon(item.source)}
                                    </div>
                                    <div>
                                        <div className={`text-sm font-bold group-hover:text-white transition-colors ${getSourceColor(item.source)}`}>
                                            {item.author}
                                        </div>
                                        <div className="text-[10px] mono text-gray-500 uppercase tracking-widest">
                                            {item.source} • {formatTimestamp(item.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <p className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-100 transition-colors mb-4">{item.content}</p>

                            {/* Tags */}
                            {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {item.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] mono px-2 py-0.5 rounded-sm bg-slate-900/50 text-gray-500 border border-gray-800/50 uppercase tracking-widest group-hover:border-cyan-500/30 transition-colors"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Engagement */}
                            {item.engagement && (
                                <div className="flex items-center gap-5 text-[10px] mono text-gray-500 uppercase tracking-[0.1em]">
                                    <span className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer transition-colors hover-press">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        {item.engagement.likes}
                                    </span>
                                    <span className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer transition-colors hover-press">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        {item.engagement.replies}
                                    </span>
                                    {item.engagement.recasts && (
                                        <span className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer transition-colors hover-press">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                            {item.engagement.recasts}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-gray-800/50 px-4 py-2 flex items-center justify-between text-[10px] mono text-gray-500 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-cyan-400 pulse" />
                    <span className="font-bold opacity-50">{filteredItems.length} signal streams active</span>
                </div>
                <button className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors hover-press">Refetch</button>
            </div>
        </div>
    );
}
