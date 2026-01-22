import React from "react";
import { Wallet } from "../lib/wallets";
import { Project } from "../lib/projects";

type Props = {
    wallet: Wallet | null;
    linkedProjects: Project[];
};

export default function WalletDetail({ wallet, linkedProjects }: Props) {
    if (!wallet) {
        return (
            <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                Select a wallet.
            </div>
        );
    }

    const pill = (label: string, variant: "allowed" | "forbidden") =>
        [
            "px-2 py-0.5 rounded-full text-[10px] uppercase border",
            variant === "allowed"
                ? "border-emerald-500/60 text-emerald-300 bg-emerald-900/20"
                : "border-rose-500/60 text-rose-300 bg-rose-900/20",
        ].join(" ");

    const list = (items: string[], variant: "allowed" | "forbidden") =>
        items.length === 0 ? (
            <span className="text-[11px] text-zinc-500">none</span>
        ) : (
            <div className="flex flex-wrap gap-1">
                {items.map((i) => (
                    <span key={i} className={pill(i, variant)}>
                        {i}
                    </span>
                ))}
            </div>
        );

    return (
        <div className="flex flex-col gap-4 text-sm">
            <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-950">
                <div className="flex justify-between">
                    <div>
                        <div className="text-xs uppercase text-zinc-500">
                            {wallet.lane} • {wallet.type}
                        </div>
                        <div className="text-base font-semibold">
                            {wallet.ens_name || wallet.id}
                        </div>
                        {wallet.farcaster_handle && (
                            <div className="text-[11px] text-zinc-400">
                                fc: @{wallet.farcaster_handle}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase text-zinc-400">
                            {wallet.risk_band}
                        </span>
                        <span className="text-[10px] text-zinc-500">{wallet.status}</span>
                    </div>
                </div>
                <div className="mt-2 text-[11px] text-zinc-400">{wallet.purpose}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-950">
                    <div className="text-[11px] uppercase text-zinc-500 mb-1">
                        Identity & environment
                    </div>
                    <div className="text-[11px] text-zinc-400 space-y-1">
                        <div>
                            <span className="text-zinc-500">Address: </span>
                            <span>
                                {wallet.address.slice(0, 8)}…{wallet.address.slice(-6)}
                            </span>
                        </div>
                        <div>
                            <span className="text-zinc-500">Chains: </span>
                            <span>{wallet.chains.join(", ")}</span>
                        </div>
                        <div>
                            <span className="text-zinc-500">Browser profile: </span>
                            <span>{wallet.browser_profile || "n/a"}</span>
                        </div>
                        <div>
                            <span className="text-zinc-500">Extension: </span>
                            <span>{wallet.preferred_wallet_extension || "n/a"}</span>
                        </div>
                    </div>
                </div>

                <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-950">
                    <div className="text-[11px] uppercase text-zinc-500 mb-1">
                        Linked projects
                    </div>
                    {linkedProjects.length === 0 ? (
                        <div className="text-[11px] text-zinc-500">No linked projects.</div>
                    ) : (
                        <ul className="text-[11px] text-zinc-300 space-y-1">
                            {linkedProjects.map((p) => (
                                <li key={p.id}>
                                    <span className="font-medium">{p.name}</span>{" "}
                                    <span className="text-zinc-500">({p.chain})</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-950">
                    <div className="text-[11px] uppercase text-emerald-400 mb-1">
                        Allowed actions
                    </div>
                    {list(wallet.allowed_actions, "allowed")}
                    <div className="mt-2 text-[11px] uppercase text-emerald-400 mb-1">
                        Allowed dapps
                    </div>
                    {list(wallet.allowed_dapps, "allowed")}
                </div>

                <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-950">
                    <div className="text-[11px] uppercase text-rose-400 mb-1">
                        Forbidden actions
                    </div>
                    {list(wallet.forbidden_actions, "forbidden")}
                    <div className="mt-2 text-[11px] uppercase text-rose-400 mb-1">
                        Forbidden dapps
                    </div>
                    {list(wallet.forbidden_dapps, "forbidden")}
                </div>
            </div>
        </div>
    );
}
