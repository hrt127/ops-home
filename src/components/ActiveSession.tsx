"use client";

import React from "react";
import type { Wallet } from "@/lib/wallets";

interface ActiveSessionProps {
    wallet: Wallet | null;
}

export function ActiveSession({ wallet }: ActiveSessionProps) {
    if (!wallet) {
        return (
            <div className="glass panel-shadow p-8 flex flex-col items-center justify-center min-h-[400px] panel-mount border-dashed border-gray-800">
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-gray-800/50 mb-6 scale-in">
                    <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <div className="text-[11px] mono font-black text-gray-600 uppercase tracking-[0.3em] mb-2">STATUS: NO_ACTIVE_SESSION</div>
                <p className="text-[10px] mono text-gray-700 uppercase tracking-widest text-center max-w-[200px] leading-relaxed">
                    Awaiting wallet selection for tactical interface deployment.
                </p>
            </div>
        );
    }

    const allowedActions = wallet.allowed_actions || [];
    const forbiddenActions = wallet.forbidden_actions || [];
    const allowedDapps = wallet.allowed_dapps || [];

    const getRiskStyles = (risk: string) => {
        switch (risk) {
            case "safe":
                return { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
            case "medium":
                return { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
            case "high":
                return { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" };
            default:
                return { color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20" };
        }
    };

    const riskStyles = getRiskStyles(wallet.risk_band);

    return (
        <div className="glass panel-shadow overflow-hidden panel-mount">
            {/* Header */}
            <div className="panel-header flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse" />
                    <span className="text-[11px] mono font-black uppercase tracking-[0.25em]">Session_Active</span>
                </div>
                <div className={`px-2 py-0.5 rounded-sm text-[8px] mono font-black uppercase tracking-widest border ${riskStyles.bg} ${riskStyles.color} ${riskStyles.border}`}>
                    {wallet.risk_band}_RISK
                </div>
            </div>

            {/* Tactical Display */}
            <div className="p-8 bg-gradient-to-b from-slate-900/40 to-transparent border-b border-gray-800/40 relative overflow-hidden">
                <div className="absolute top-2 right-4 text-[40px] font-black text-white/5 mono select-none pointer-events-none">
                    {wallet.id.substring(0, 4).toUpperCase()}
                </div>
                <div className="relative z-10 text-center scale-in">
                    <div className="text-[9px] mono text-cyan-500/50 uppercase tracking-[0.3em] font-black mb-4">Balance_Registry</div>
                    <div className="flex items-baseline justify-center gap-3 mb-2">
                        <span className="text-4xl mono font-black text-white tracking-tighter">4.2045</span>
                        <span className="text-xl mono font-bold text-gray-600 uppercase">ETH</span>
                    </div>
                    <div className="text-[11px] mono text-emerald-400 font-bold tracking-[0.15em] opacity-80">
                        ≈ $16,380.42_USD
                    </div>
                </div>
            </div>

            {/* Permission Matrix */}
            <div className="p-6 space-y-8 scale-in">
                {/* Authorized Operations */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-emerald-500/20" />
                        <h3 className="text-[9px] mono font-black text-emerald-400/60 uppercase tracking-widest whitespace-nowrap">Authorized_Ops</h3>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-emerald-500/20" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {allowedActions.map((action) => (
                            <div
                                key={action}
                                className="px-2 py-1 rounded-sm bg-slate-900/50 border border-emerald-500/20 text-emerald-400/80 text-[8px] mono font-black tracking-widest hover-lift cursor-default group"
                            >
                                <span className="text-emerald-500/30 mr-1 opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                                {action.replace(/_/g, " ").toUpperCase()}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Restricted Zone */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-rose-500/20" />
                        <h3 className="text-[9px] mono font-black text-rose-400/60 uppercase tracking-widest whitespace-nowrap">Restricted_Zone</h3>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-rose-500/20" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {forbiddenActions.map((action) => (
                            <div
                                key={action}
                                className="px-2 py-1 rounded-sm bg-slate-900/30 border border-gray-800/40 text-gray-600 text-[8px] mono font-black tracking-widest line-through opacity-70 group cursor-not-allowed"
                            >
                                <span className="text-rose-500/20 mr-1 opacity-40 group-hover:opacity-100 transition-opacity">!</span>
                                {action.replace(/_/g, " ").toUpperCase()}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Whitelisted Dapps */}
                {allowedDapps.length > 0 && (
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-500/20" />
                            <h3 className="text-[9px] mono font-black text-cyan-400/60 uppercase tracking-widest whitespace-nowrap">Whitelisted_Dapps</h3>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-500/20" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {allowedDapps.map((dapp) => (
                                <div
                                    key={dapp}
                                    className="px-2 py-1 rounded-sm bg-cyan-500/5 border border-cyan-500/20 text-cyan-400/70 text-[8px] mono font-black tracking-widest hover-lift cursor-default"
                                >
                                    {dapp.toUpperCase()}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-gray-800/50 px-6 py-3 flex items-center justify-between text-[9px] mono text-gray-500 uppercase tracking-[0.2em] font-black">
                <div className="flex items-center gap-2">
                    <span className="text-gray-700">SESSION_ID:</span>
                    <span className="text-cyan-500/60 font-black">{wallet.id.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="w-1 h-3 bg-gray-800 -rotate-12" />
                    <span className="text-emerald-500/40 animate-pulse">ENCRYPTION_SAFE</span>
                </div>
            </div>
        </div>
    );
}

