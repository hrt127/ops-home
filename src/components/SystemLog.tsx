"use client";

import React, { useEffect, useState } from "react";

interface LogEntry {
    timestamp: string;
    level: "info" | "success" | "warning" | "error";
    message: string;
}

export function SystemLog() {
    const [logs, setLogs] = useState<LogEntry[]>([
        {
            timestamp: new Date().toISOString(),
            level: "success",
            message: "SYSTEM: Connection established to Node-01. Latency: 12ms."
        },
        {
            timestamp: new Date(Date.now() - 1000).toISOString(),
            level: "info",
            message: "AUTH: User 'MachiSamurai' authenticated via hardware key."
        },
        {
            timestamp: new Date(Date.now() - 2000).toISOString(),
            level: "success",
            message: "NETWORK: Monitoring deployment for try.base.eth, SOL, BNB. OK refreshed."
        },
        {
            timestamp: new Date(Date.now() - 3000).toISOString(),
            level: "warning",
            message: "SECURITY: Alert! High gas fee detected on contract '0x...A' contract."
        },
        {
            timestamp: new Date(Date.now() - 4000).toISOString(),
            level: "info",
            message: "RECEIVED: Querying deployment for try.base.eth, SOL, BNB. OK refreshed."
        },
        {
            timestamp: new Date(Date.now() - 5000).toISOString(),
            level: "success",
            message: "SYSTEM: Data feed updated successfully for all tracked pairs."
        },
    ]);

    const [autoScroll, setAutoScroll] = useState(true);
    const logContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (autoScroll && logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs, autoScroll]);

    const getLevelColor = (level: LogEntry["level"]) => {
        switch (level) {
            case "success":
                return "text-emerald-400";
            case "info":
                return "text-cyan-400";
            case "warning":
                return "text-amber-400";
            case "error":
                return "text-rose-400";
            default:
                return "text-gray-400";
        }
    };

    const getLevelIcon = (level: LogEntry["level"]) => {
        switch (level) {
            case "success":
                return "✓";
            case "info":
                return "→";
            case "warning":
                return "⚠";
            case "error":
                return "✕";
            default:
                return "•";
        }
    };

    const formatTimestamp = (iso: string) => {
        const date = new Date(iso);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    return (
        <div className="glass panel-shadow overflow-hidden panel-mount">
            {/* Header */}
            <div className="panel-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse" />
                    <span className="upper tracking-[0.2em] text-emerald-500/80">Kernel_Event_Stream</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setAutoScroll(!autoScroll)}
                        className={`text-[9px] mono uppercase tracking-widest px-2.5 py-0.5 rounded-sm transition-all hover-press font-black ${autoScroll ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800/50 text-gray-500 border border-gray-700/30"
                            }`}
                    >
                        AUTOSCROLL_{autoScroll ? "ACTIVE" : "STALLED"}
                    </button>
                    <button
                        onClick={() => setLogs([])}
                        className="text-[9px] mono uppercase tracking-widest text-gray-500 hover:text-rose-400 transition-all font-black hover-press"
                    >
                        FLUSH_STACK
                    </button>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full border border-gray-700/50 bg-slate-800 hover:bg-slate-700 transition-colors hover-press" />
                        <div className="w-2.5 h-2.5 rounded-full border border-gray-700/50 bg-slate-800 hover:bg-slate-700 transition-colors hover-press" />
                        <div className="w-2.5 h-2.5 rounded-full border border-gray-800/50 bg-slate-900 hover:bg-rose-500/40 transition-colors hover-press" />
                    </div>
                </div>
            </div>

            {/* Log Content */}
            <div
                ref={logContainerRef}
                className="h-64 overflow-y-auto bg-black/40 custom-scrollbar"
            >
                {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-700 opacity-40 scale-in">
                        <div className="text-3xl mb-3">⊘</div>
                        <p className="mono text-[10px] uppercase tracking-[0.2em] font-black">Memory_Grid_Clear</p>
                    </div>
                ) : (
                    <div className="p-3 space-y-1">
                        {logs.map((log, idx) => (
                            <div key={idx} className="flex items-start gap-3 hover:bg-white/[0.02] px-2 py-1.5 rounded-sm transition-all group scale-in cursor-default border border-transparent hover:border-gray-800/30">
                                <span className="text-gray-600 mono text-[9px] mt-1 font-black min-w-[65px] tracking-tighter">
                                    {formatTimestamp(log.timestamp)}
                                </span>
                                <span className={`mono font-black text-[10px] mt-0.5 ${getLevelColor(log.level)}`}>
                                    {getLevelIcon(log.level)}
                                </span>
                                <span className={`flex-1 mono text-[10px] leading-relaxed transition-colors font-medium ${getLevelColor(log.level)} group-hover:text-gray-200`}>
                                    <span className="opacity-40 uppercase text-[8px] mr-2 font-black tracking-widest">
                                        [{log.level}]
                                    </span>
                                    {log.message}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-gray-800/50 px-4 py-2 flex items-center justify-between text-[9px] mono text-gray-500 uppercase tracking-widest font-black">
                <span className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-cyan-500 pulse" />
                    {logs.length} RAW_PACKETS_TRACKED
                </span>
                <span className="text-gray-700 opacity-50">NODE_VERSION: OPSHOME-ALPHA</span>
            </div>
        </div>
    );
}
