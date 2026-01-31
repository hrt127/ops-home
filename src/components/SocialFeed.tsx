"use client";

import React from "react";

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

const MOCK_ITEMS: FeedItem[] = [
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
];

export function SocialFeed() {
    const [items] = React.useState<FeedItem[]>(MOCK_ITEMS);
    const [filter, setFilter] = React.useState<"all" | "farcaster" | "twitter" | "rss">("all");
    const [now, setNow] = React.useState(Date.now());

    React.useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(timer);
    }, []);

    const getSourceStyles = (source: FeedItem["source"]) => {
        switch (source) {
            case "farcaster":
                return { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", label: "FARC_NET" };
            case "twitter":
                return { color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", label: "X_STREAM" };
            case "rss":
                return { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "RSS_FEED" };
        }
    };

    const formatTimestamp = (date: Date) => {
        const diff = now - date.getTime();
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) return `${Math.floor(diff / 60000)}M_AGO`;
        if (hours < 24) return `${hours}H_AGO`;
        return `${Math.floor(hours / 24)}D_AGO`;
    };

    const filteredItems = React.useMemo(() =>
        filter === "all" ? items : items.filter((item: FeedItem) => item.source === filter),
        [filter, items]);

    return (
        <React.Fragment>
            <div className="glass panel-shadow overflow-hidden panel-mount flex flex-col h-full">
                {/* Header */}
                <div className="panel-header flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse" />
                        <span className="text-[11px] mono font-black uppercase tracking-[0.25em]">Neural_Stream</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {(["all", "farcaster", "twitter", "rss"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`text-[8px] mono uppercase tracking-widest px-2.5 py-1 rounded-sm transition-all hover-press font-black border ${filter === f
                                    ? "bg-white/10 text-white border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                                    : "text-gray-600 hover:text-gray-400 border-transparent"
                                    }`}
                            >
                                {f.slice(0, 3)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar bg-slate-950/20">
                    <div key={filter} className="space-y-4 scale-in">
                        {filteredItems.map((item: FeedItem, idx: number) => {
                            const styles = getSourceStyles(item.source);
                            return (
                                <div
                                    key={item.id}
                                    className="p-4 rounded border border-white/5 bg-slate-900/40 hover:bg-slate-900/60 hover:border-cyan-500/40 transition-all group scale-in hover-lift relative backdrop-blur-sm"
                                    style={{ animationDelay: `${idx * 0.05}s` }}
                                >
                                    <div className="absolute top-0 right-0 w-12 h-[1px] bg-gradient-to-l from-white/10 to-transparent" />

                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`text-[13px] font-black italic tracking-tight group-hover:text-white transition-colors leading-none ${styles.color}`}>
                                                {item.author}
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                            <span className="text-[8px] mono text-gray-700 font-bold uppercase tracking-widest leading-none group-hover:text-gray-500">
                                                {formatTimestamp(item.timestamp)}
                                            </span>
                                        </div>
                                        <div className={`text-[7px] mono font-black px-1.5 py-0.5 rounded-sm border uppercase tracking-widest leading-none ${styles.bg} ${styles.color} ${styles.border}`}>
                                            {styles.label}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="text-[12px] text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed font-medium mb-4 uppercase tracking-snug">
                                        {item.content}
                                    </div>

                                    {/* Meta: Tags & Stats */}
                                    <div className="flex items-center justify-between mt-auto bg-black/20 px-2 py-1.5 rounded-sm border border-white/[0.02]">
                                        <div className="flex gap-2">
                                            {item.tags?.map((tag: string) => (
                                                <span key={tag} className="text-[7px] mono text-cyan-500/30 font-black uppercase tracking-[0.2em] italic group-hover:text-cyan-500/60 transition-colors">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 text-[8px] mono text-gray-700 group-hover:text-gray-400 transition-colors font-black uppercase tracking-widest">
                                                <span className="text-gray-800">L:</span>{item.engagement?.likes}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[8px] mono text-gray-700 group-hover:text-gray-400 transition-colors font-black uppercase tracking-widest">
                                                <span className="text-gray-800">R:</span>{item.engagement?.replies}
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
                        <span className="text-[9px] mono text-gray-600 font-black uppercase tracking-[0.3em]">RELAY_STREAM_OK</span>
                    </div>
                    <div className="text-[8px] mono text-gray-800 font-black uppercase tracking-widest italic tracking-[0.2em]">PACKETS: 1.2MB_SEC</div>
                </div>
            </div>
        </React.Fragment>
    );
}

