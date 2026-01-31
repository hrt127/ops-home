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
            message: "SYSTEM: Kernel_Connection_Established >> Latency: 12ms."
        },
        {
            timestamp: new Date(Date.now() - 1000).toISOString(),
            level: "info",
            message: "AUTH: Hardware_Session_Init >> User: MachiSamurai"
        },
        {
            timestamp: new Date(Date.now() - 2000).toISOString(),
            level: "success",
            message: "NETWORK: Multi_Chain_Sync >> Base | Sol | Eth :: OK"
        },
        {
            timestamp: new Date(Date.now() - 3000).toISOString(),
            level: "warning",
            message: "SECURITY: Gas_Spike_Detected >> Contract: 0x...A"
        },
        {
            timestamp: new Date(Date.now() - 4000).toISOString(),
            level: "info",
            message: "DATA: Registry_Query >> Mapping tactical deployment assets"
        },
        {
            timestamp: new Date(Date.now() - 5000).toISOString(),
            level: "success",
            message: "SYSTEM: Watcher_Active >> All feeds nominal"
        },
    ]);

    const [autoScroll, setAutoScroll] = useState(true);
    const logContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (autoScroll && logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs, autoScroll]);

    const getLevelStyles = (level: LogEntry["level"]) => {
        switch (level) {
            case "success": return "text-emerald-400";
            case "info": return "text-cyan-400";
            case "warning": return "text-amber-400";
            case "error": return "text-rose-400";
            default: return "text-gray-400";
        }
    };

    const getLevelIcon = (level: LogEntry["level"]) => {
        switch (level) {
            case "success": return "●";
            case "info": return "○";
            case "warning": return "▲";
            case "error": return "×";
            default: return "·";
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
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse" />
                    <span className="text-[11px] mono font-black uppercase tracking-[0.25em]">Kernel_Event_Stream</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] mono text-gray-700 font-black uppercase tracking-widest">AUTOSCROLL:</span>
                        <button
                            onClick={() => setAutoScroll(!autoScroll)}
                            className={`w-3 h-3 rounded-full border transition-all ${autoScroll ? "bg-emerald-500/40 border-emerald-500/60 pulse" : "bg-slate-800 border-gray-700"}`}
                        />
                    </div>
                    <button
                        onClick={() => setLogs([])}
                        className="text-[9px] mono uppercase tracking-widest text-gray-600 hover:text-rose-400 transition-all font-black hover-press"
                    >
                        FLUSH
                    </button>
                </div>
            </div>

            {/* Log Content */}
            <div
                ref={logContainerRef}
                className="h-64 overflow-y-auto bg-black/60 custom-scrollbar relative"
            >
                {/* Simulated Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/[0.01] to-transparent bg-[length:100%_4px] opacity-20" />

                {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-800 scale-in opacity-40">
                        <div className="w-12 h-[1px] bg-gray-800 mb-4" />
                        <p className="mono text-[9px] uppercase tracking-[0.4em] font-black italic">Buffer_Purged</p>
                    </div>
                ) : (
                    <div className="p-3 space-y-0.5">
                        {logs.map((log, idx) => (
                            <div key={idx} className="flex items-start gap-3 hover:bg-white/[0.03] px-2 py-0.5 rounded-sm transition-all group scale-in cursor-default border border-transparent hover:border-white/[0.05]">
                                <span className="text-gray-700 mono text-[9px] mt-0.5 font-bold min-w-[60px] tracking-tighter">
                                    [{formatTimestamp(log.timestamp)}]
                                </span>
                                <span className={`mono text-[8px] mt-1 flex-shrink-0 ${getLevelStyles(log.level)}`}>
                                    {getLevelIcon(log.level)}
                                </span>
                                <span className={`flex-1 mono text-[10px] leading-tight transition-colors font-medium ${getLevelStyles(log.level)} group-hover:text-white/90`}>
                                    {log.message}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-gray-800/50 px-6 py-3 flex items-center justify-between text-[9px] mono text-gray-500 uppercase tracking-[0.2em] font-black">
                <div className="flex items-center gap-3">
                    <span className="text-emerald-500/40">{logs.length} PKTS_SYNCED</span>
                    <div className="w-1 h-3 bg-gray-800 rotate-12" />
                    <span className="text-gray-700">NODE_ALPHA_v1</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse" />
                    <span className="text-cyan-500/60 animate-pulse">STREAMING_REALTIME</span>
                </div>
            </div>
        </div>
    );
}

