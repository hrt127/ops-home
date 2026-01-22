import React from "react";
import { Wallet, WalletLane, RiskBandEnum } from "../lib/wallets";

type Props = {
    wallets: Wallet[];
    selectedWalletId: string | null;
    onSelect: (id: string) => void;
    todayMissionWalletIds?: string[];
};

const laneOrder: (keyof typeof WalletLaneEnum.enum)[] = [
    "identity",
    "treasury",
    "deployer",
    "lp",
    "trading",
    "mint",
    "test",
    "other",
];

const riskOrder: (keyof typeof RiskBandEnum.enum)[] = [
    "high_sensitivity",
    "medium",
    "low",
    "experimental",
];

export default function WalletList({
    wallets,
    selectedWalletId,
    onSelect,
    todayMissionWalletIds = [],
}: Props) {
    const grouped: Record<string, Wallet[]> = {};

    wallets.forEach((w) => {
        if (!grouped[w.lane]) grouped[w.lane] = [];
        grouped[w.lane].push(w);
    });

    laneOrder.forEach((lane) => {
        if (grouped[lane]) {
            grouped[lane].sort(
                (a, b) => riskOrder.indexOf(a.risk_band) - riskOrder.indexOf(b.risk_band)
            );
        }
    });

    const isMission = (id: string) => todayMissionWalletIds.includes(id);

    return (
        <div className="flex flex-col gap-4">
            {laneOrder.map((lane) => {
                const list = grouped[lane];
                if (!list) return null;

                return (
                    <div key={lane}>
                        <div className="text-xs uppercase text-zinc-500 mb-1">{lane}</div>
                        <div className="flex flex-col gap-1">
                            {list.map((w) => {
                                const selected = w.id === selectedWalletId;
                                const mission = isMission(w.id);

                                return (
                                    <button
                                        key={w.id}
                                        onClick={() => onSelect(w.id)}
                                        className={[
                                            "px-3 py-2 rounded border text-left transition w-full",
                                            selected
                                                ? "border-cyan-400 bg-zinc-900"
                                                : "border-zinc-800 bg-zinc-950 hover:border-zinc-600",
                                            mission ? "shadow-[0_0_0_1px_rgba(34,211,238,0.6)]" : "",
                                            w.status !== "active" ? "opacity-60 line-through" : "",
                                        ].join(" ")}
                                    >
                                        <div className="flex justify-between">
                                            <div>
                                                <div className="text-sm font-medium">
                                                    {w.ens_name || w.id}
                                                </div>
                                                <div className="text-[10px] text-zinc-500">
                                                    {w.address.slice(0, 6)}…{w.address.slice(-4)} •{" "}
                                                    {w.chains.join(", ")}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] uppercase text-zinc-400">
                                                    {w.risk_band}
                                                </span>
                                                {mission && (
                                                    <span className="text-[10px] text-cyan-400">
                                                        today’s mission
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
