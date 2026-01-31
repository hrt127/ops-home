"use client";

import React from "react";

interface LearningItem {
    id: string;
    topic: string;
    category: "solidity" | "trading" | "defi" | "system";
    difficulty: "beginner" | "intermediate" | "advanced";
    lastReviewed?: Date;
    nextReview?: Date;
    mastery: number; // 0-100
}

export function LearningLab() {
    const [items] = React.useState<LearningItem[]>([
        {
            id: "1",
            topic: "Solidity: Storage vs Memory",
            category: "solidity",
            difficulty: "intermediate",
            lastReviewed: new Date(Date.now() - 86400000 * 2),
            nextReview: new Date(Date.now() + 86400000),
            mastery: 75
        },
        {
            id: "2",
            topic: "Options Greeks: Delta, Gamma, Theta",
            category: "trading",
            difficulty: "advanced",
            lastReviewed: new Date(Date.now() - 86400000 * 5),
            nextReview: new Date(),
            mastery: 60
        },
        {
            id: "3",
            topic: "Uniswap V3: Concentrated Liquidity",
            category: "defi",
            difficulty: "advanced",
            mastery: 45
        }
    ]);

    const getCategoryStyles = (category: LearningItem["category"]) => {
        switch (category) {
            case "solidity":
                return { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" };
            case "trading":
                return { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
            case "defi":
                return { color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" };
            case "system":
                return { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
        }
    };

    const getMasteryColor = (mastery: number) => {
        if (mastery >= 80) return "bg-emerald-500";
        if (mastery >= 60) return "bg-amber-500";
        return "bg-rose-500";
    };

    const isReviewDue = (item: LearningItem) => {
        if (!item.nextReview) return false;
        return item.nextReview <= new Date();
    };

    return (
        <React.Fragment>
            <div className="glass panel-shadow overflow-hidden panel-mount flex flex-col h-full">
                {/* Header */}
                <div className="panel-header flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse" />
                        <span className="text-[11px] mono font-black uppercase tracking-[0.25em]">Cognitive_Lab</span>
                    </div>
                    <button className="text-[9px] mono text-cyan-400 hover:text-cyan-300 transition-colors hover-press font-black uppercase tracking-widest shadow-lg shadow-cyan-500/5 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                        + NEW_SUBJECT
                    </button>
                </div>

                {/* Subject Stream */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar bg-slate-950/20">
                    <div className="space-y-3 scale-in">
                        {items.map((item: LearningItem, idx: number) => {
                            const styles = getCategoryStyles(item.category);
                            const due = isReviewDue(item);

                            return (
                                <div
                                    key={item.id}
                                    className={`p-4 rounded border transition-all group scale-in hover-lift relative overflow-hidden backdrop-blur-sm ${due ? "bg-amber-500/[0.05] border-amber-500/30" : "bg-slate-900/40 border-white/5 hover:border-cyan-500/40"
                                        }`}
                                    style={{ animationDelay: `${idx * 0.05}s` }}
                                >
                                    <div className="absolute top-0 right-0 w-16 h-[1px] bg-gradient-to-l from-white/10 to-transparent" />

                                    {/* Subject Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-[7px] mono font-black px-1.5 py-0.5 rounded-sm border uppercase tracking-widest leading-none ${styles.bg} ${styles.color} ${styles.border}`}>
                                                    {item.category}
                                                </span>
                                                {due && (
                                                    <span className="text-[7px] mono font-black text-amber-500 uppercase tracking-[0.2em] animate-pulse">
                                                        [SYNC_REQUIRED]
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-[13px] font-black text-white italic uppercase tracking-tight truncate leading-tight group-hover:text-cyan-400 transition-colors">
                                                {item.topic}
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[8px] mono font-black uppercase tracking-widest leading-none px-2 py-1 rounded-sm bg-black/40 ${item.difficulty === 'advanced' ? 'text-rose-500/60' : item.difficulty === 'intermediate' ? 'text-amber-500/60' : 'text-emerald-500/60'
                                                }`}>
                                                LVL://{item.difficulty.slice(0, 3)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Mastery & Progress */}
                                    <div className="space-y-2.5 bg-black/20 p-2.5 rounded border border-white/[0.02]">
                                        <div className="flex items-center justify-between text-[8px] mono uppercase tracking-widest font-black">
                                            <span className="text-gray-600">COGNITIVE_SYNC_RATIO</span>
                                            <span className="text-white opacity-80">{item.mastery}%</span>
                                        </div>
                                        <div className="w-full bg-slate-950 rounded-full h-[4px] border border-white/[0.05] overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${getMasteryColor(item.mastery)} shadow-[0_0_10px_rgba(255,255,255,0.05)]`}
                                                style={{ width: `${item.mastery}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Subject Meta */}
                                    <div className="mt-4 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-all">
                                        <div className="text-[7px] mono text-gray-700 font-black uppercase tracking-widest flex items-center gap-2">
                                            {item.lastReviewed && (
                                                <span className="group-hover:text-gray-500">LAST_INDEX: {item.lastReviewed.toISOString().split('T')[0].replace(/-/g, '_')}</span>
                                            )}
                                        </div>
                                        <div className="flex gap-1.5">
                                            <button className="text-[7px] mono font-black px-2 py-0.5 rounded border border-white/5 hover:border-cyan-500/30 hover:text-cyan-400 transition-all uppercase tracking-widest">DETAILS</button>
                                            <button className="text-[7px] mono font-black px-2 py-0.5 rounded border border-white/5 hover:border-emerald-500/30 hover:text-emerald-400 transition-all uppercase tracking-widest">RECORD_EXP</button>
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
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/60" />
                            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-[2px] animate-pulse" />
                        </div>
                        <span className="text-[9px] mono text-gray-600 font-black uppercase tracking-[0.3em]">NEURAL_CACHE_OK</span>
                    </div>
                    <div className="text-[8px] mono text-gray-800 font-black uppercase tracking-widest italic">{items.length} NODES_ACTIVE</div>
                </div>
            </div>
        </React.Fragment>
    );
}
