"use client";

import React, { useEffect, useState, useCallback } from "react";
import type { FocusData } from "../app/api/focus/route";

// Re-export type for consumers
export type { FocusData };

const MODE_CONFIG: Record<
    string,
    { label: string; color: string; glow: string; icon: string }
> = {
    DOING: {
        label: "DOING",
        color: "text-emerald-400",
        glow: "shadow-[0_0_12px_rgba(52,211,153,0.25)]",
        icon: "⚡",
    },
    LEARNING: {
        label: "LEARNING",
        color: "text-sky-400",
        glow: "shadow-[0_0_12px_rgba(56,189,248,0.25)]",
        icon: "◈",
    },
    REVIEWING: {
        label: "REVIEWING",
        color: "text-amber-400",
        glow: "shadow-[0_0_12px_rgba(251,191,36,0.25)]",
        icon: "◎",
    },
    IDLE: {
        label: "IDLE",
        color: "text-zinc-500",
        glow: "",
        icon: "○",
    },
};

function formatUpdatedAt(ts: string | null): string {
    if (!ts) return "never";
    try {
        const d = new Date(ts);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return "just now";
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHrs = Math.floor(diffMin / 60);
        if (diffHrs < 24) return `${diffHrs}h ago`;
        return d.toLocaleDateString();
    } catch {
        return ts;
    }
}

interface GravityFocusCardProps {
    /** Poll interval in ms. Default: 60000 (1 min). */
    pollInterval?: number;
    /** Called whenever focus data changes. */
    onFocusChange?: (focus: FocusData) => void;
}

export default function GravityFocusCard({
    pollInterval = 60_000,
    onFocusChange,
}: GravityFocusCardProps) {
    const [focus, setFocus] = useState<FocusData | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastPoll, setLastPoll] = useState<Date | null>(null);

    const fetchFocus = useCallback(async () => {
        try {
            const res = await fetch("/api/focus", { cache: "no-store" });
            if (!res.ok) return;
            const data: FocusData = await res.json();
            setFocus(data);
            setLastPoll(new Date());
        } catch {
            // silently fail — ops-home must always render
        } finally {
            setLoading(false);
        }
    }, []);

    // Notify parent of focus changes
    useEffect(() => {
        if (focus && onFocusChange) {
            onFocusChange(focus);
        }
    }, [focus?.mode, focus?.project, focus?.topic, onFocusChange]);

    // Initial fetch + polling
    useEffect(() => {
        fetchFocus();
        const id = setInterval(fetchFocus, pollInterval);
        return () => clearInterval(id);
    }, [fetchFocus, pollInterval]);

    const mode = focus?.mode ?? "IDLE";
    const cfg = MODE_CONFIG[mode] ?? MODE_CONFIG.IDLE;
    const project = focus?.project;
    const topic = focus?.topic;
    const isActive = mode !== "IDLE";

    return (
        <div
            className={`glass panel-shadow panel-mount flex flex-col overflow-hidden ${isActive ? cfg.glow : ""
                }`}
        >
            {/* Header */}
            <div className="panel-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className={`text-base leading-none ${cfg.color}`}>
                        {cfg.icon}
                    </span>
                    <span className="upper tracking-[0.2em] text-gray-300">
                        Gravity Focus
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse" />
                    )}
                    <button
                        onClick={fetchFocus}
                        className="text-[10px] mono text-gray-600 hover:text-gray-400 transition-colors"
                        title="Refresh focus"
                    >
                        ↺
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 px-4 py-4">
                {loading ? (
                    <div className="flex items-center justify-center h-16 text-zinc-600 text-xs mono">
                        loading focus…
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Mode pill */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-[10px] mono uppercase tracking-widest text-zinc-600 w-16 shrink-0">
                                mode
                            </span>
                            <span
                                className={`text-sm font-bold mono tracking-widest ${cfg.color}`}
                            >
                                {cfg.label}
                            </span>
                        </div>

                        {/* Project */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-[10px] mono uppercase tracking-widest text-zinc-600 w-16 shrink-0">
                                project
                            </span>
                            {project ? (
                                <span className="text-sm text-gray-200 font-medium">
                                    {project}
                                </span>
                            ) : (
                                <span className="text-sm text-zinc-600 italic">—</span>
                            )}
                        </div>

                        {/* Topic */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-[10px] mono uppercase tracking-widest text-zinc-600 w-16 shrink-0">
                                topic
                            </span>
                            {topic ? (
                                <span className="text-sm text-gray-300">{topic}</span>
                            ) : (
                                <span className="text-sm text-zinc-600 italic">—</span>
                            )}
                        </div>

                        {/* Updated at */}
                        {focus?.updated_at && (
                            <div className="pt-1 mt-1 border-t border-zinc-800/60">
                                <span className="text-[10px] mono text-zinc-600">
                                    set {formatUpdatedAt(focus.updated_at)}
                                    {lastPoll && (
                                        <span className="ml-2 text-zinc-700">
                                            · polled {formatUpdatedAt(lastPoll.toISOString())}
                                        </span>
                                    )}
                                </span>
                            </div>
                        )}

                        {/* IDLE hint */}
                        {!isActive && (
                            <div className="pt-2 text-[10px] mono text-zinc-700 italic">
                                run{" "}
                                <code className="bg-zinc-900 px-1 py-0.5 rounded text-zinc-500">
                                    dojo gravity
                                </code>{" "}
                                to set focus
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
