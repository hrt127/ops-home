"use client";

import React from "react";
import type { Wallet } from "@/lib/wallets";

interface ActiveSessionProps {
    wallet: Wallet | null;
}

export function ActiveSession({ wallet }: ActiveSessionProps) {
    if (!wallet) {
        return (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
                <div className="text-center text-gray-500 py-12">
                    <div className="text-4xl mb-2">🔒</div>
                    <p className="text-sm">No active session</p>
                    <p className="text-xs text-gray-600 mt-1">Select a wallet to begin</p>
                </div>
            </div>
        );
    }

    const allowedActions = wallet.allowed_actions || [];
    const forbiddenActions = wallet.forbidden_actions || [];
    const allowedDapps = wallet.allowed_dapps || [];
    const forbiddenDapps = wallet.forbidden_dapps || [];

    const getRiskBadgeColor = (risk: string) => {
        switch (risk) {
            case "safe":
                return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            case "medium":
                return "bg-amber-500/20 text-amber-400 border-amber-500/30";
            case "high":
                return "bg-rose-500/20 text-rose-400 border-rose-500/30";
            default:
                return "bg-gray-500/20 text-gray-400 border-gray-500/30";
        }
    };

    return (
        <div className="glass panel-shadow overflow-hidden panel-mount">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 border-b border-gray-700/50 px-6 py-4">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse" />
                            <h2 className="text-sm font-black text-white tracking-widest uppercase">ACTIVE SESSION</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] mono text-gray-500 uppercase tracking-widest font-bold">ID:</span>
                            <span className="text-[10px] mono text-cyan-400 font-black">{wallet.id.toUpperCase()}</span>
                        </div>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[9px] mono font-black uppercase tracking-widest border transition-colors ${getRiskBadgeColor(wallet.risk_band)}`}>
                        {wallet.risk_band} RISK
                    </div>
                </div>
            </div>

            {/* Balance Display */}
            <div className="px-6 py-8 bg-black/20 border-b border-gray-800/50 scale-in">
                <div className="text-center">
                    <div className="text-[10px] mono text-gray-500 uppercase tracking-[0.2em] font-black mb-3">Balance Registry</div>
                    <div className="text-4xl mono font-black text-white tracking-tighter mb-1">
                        4.2045 <span className="text-xl text-gray-500">ETH</span>
                    </div>
                    <div className="text-[10px] mono text-emerald-400 font-black tracking-widest">
                        ≈ $16,380.42 USD
                    </div>
                </div>
            </div>

            {/* Permissions */}
            <div className="px-6 py-6 space-y-6 scale-in" style={{ animationDelay: '0.1s' }}>
                {/* Allowed Actions */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-4 h-4 rounded bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-[10px] mono font-black text-gray-400 uppercase tracking-widest">Authorized_Ops</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {allowedActions.length > 0 ? (
                            allowedActions.map((action) => (
                                <div
                                    key={action}
                                    className="px-2.5 py-1 rounded-sm bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[9px] mono font-black tracking-widest hover-lift cursor-default"
                                >
                                    {action.replace(/_/g, " ").toUpperCase()}
                                </div>
                            ))
                        ) : (
                            <span className="text-[9px] mono text-gray-600 font-bold uppercase">No_Permissions_Found</span>
                        )}
                    </div>
                </div>

                {/* Forbidden Actions */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-4 h-4 rounded bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                            <svg className="w-2.5 h-2.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h3 className="text-[10px] mono font-black text-gray-400 uppercase tracking-widest">Restricted_Zone</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {forbiddenActions.length > 0 ? (
                            forbiddenActions.map((action) => (
                                <div
                                    key={action}
                                    className="px-2.5 py-1 rounded-sm bg-rose-500/5 border border-rose-500/20 text-rose-400 text-[9px] mono font-black tracking-widest line-through opacity-60 hover-lift cursor-default"
                                >
                                    {action.replace(/_/g, " ").toUpperCase()}
                                </div>
                            ))
                        ) : (
                            <span className="text-[9px] mono text-gray-600 font-bold uppercase">No_Restrictions_Active</span>
                        )}
                    </div>
                </div>

                {/* Allowed Dapps */}
                {allowedDapps.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-4 h-4 rounded bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <svg className="w-2.5 h-2.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-[10px] mono font-black text-gray-400 uppercase tracking-widest">Whitelisted_Dapps</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {allowedDapps.map((dapp) => (
                                <div
                                    key={dapp}
                                    className="px-2.5 py-1 rounded-sm bg-blue-500/5 border border-blue-500/20 text-blue-400 text-[9px] mono font-black tracking-widest hover-lift cursor-default"
                                >
                                    {dapp.toUpperCase()}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
