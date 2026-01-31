"use client";

import React, { useState } from "react";

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
    const [items] = useState<LearningItem[]>([
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

    const getCategoryColor = (category: LearningItem["category"]) => {
        switch (category) {
            case "solidity":
                return "bg-purple-500/20 text-purple-400 border-purple-500/30";
            case "trading":
                return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            case "defi":
                return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
            case "system":
                return "bg-amber-500/20 text-amber-400 border-amber-500/30";
        }
    };

    const getDifficultyColor = (difficulty: LearningItem["difficulty"]) => {
        switch (difficulty) {
            case "beginner":
                return "text-emerald-400";
            case "intermediate":
                return "text-amber-400";
            case "advanced":
                return "text-rose-400";
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
        <div className="glass panel-shadow overflow-hidden panel-mount">
            {/* Header */}
            <div className="panel-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="upper">Learning Lab</span>
                </div>
                <button className="text-[10px] mono text-cyan-400 hover:text-cyan-300 uppercase tracking-widest font-bold hover-press">
                    + New Subject
                </button>
            </div>

            {/* Learning Items */}
            <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                <div className="space-y-4 scale-in">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className={`p-4 rounded-lg bg-slate-800/30 border transition-all group hover-lift cursor-default ${isReviewDue(item) ? "border-amber-500/30 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.05)]" : "border-gray-700/50 hover:border-cyan-500/30"
                                }`}
                        >
                            {/* Topic Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-sm font-black text-white mb-2 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{item.topic}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[9px] mono font-bold px-1.5 py-0.5 rounded-sm bg-slate-900 border uppercase tracking-widest ${getCategoryColor(item.category)} group-hover:border-current transition-colors`}>
                                            {item.category}
                                        </span>
                                        <span className={`text-[10px] mono font-bold uppercase tracking-widest ${getDifficultyColor(item.difficulty)}`}>
                                            {item.difficulty}
                                        </span>
                                    </div>
                                </div>
                                {isReviewDue(item) && (
                                    <div className="flex items-center gap-1.5 text-[10px] mono font-black text-amber-400 uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse" />
                                        Review Due
                                    </div>
                                )}
                            </div>

                            {/* Mastery Progress */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-[10px] mono uppercase tracking-widest">
                                    <span className="text-gray-500">Cognitive_Mastery</span>
                                    <span className="text-gray-300 font-bold">{item.mastery}%</span>
                                </div>
                                <div className="w-full bg-slate-950/50 rounded-full h-1 border border-gray-800/50 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${getMasteryColor(item.mastery)} shadow-[0_0_8px_currentColor]`}
                                        style={{ width: `${item.mastery}%` }}
                                    />
                                </div>
                            </div>

                            {/* Review Info */}
                            {item.lastReviewed && (
                                <div className="mt-3 text-[9px] mono text-gray-600 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                                    Index Updated: {item.lastReviewed.toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-gray-800/50 px-4 py-2 flex items-center justify-between text-[10px] mono text-gray-500 uppercase tracking-widest">
                <span className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-cyan-500 pulse" />
                    {items.length} subjects active
                </span>
                <span className="font-bold opacity-30">OPS-HOME</span>
            </div>
        </div>
    );
}
