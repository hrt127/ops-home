// components/WalletPanel.tsx
import React, { useMemo, useState } from "react";
import walletsJson from "../wallets.json";
import projectsJson from "../projects.json";
import { WalletRegistrySchema, Wallet } from "../lib/wallets";
import { ProjectRegistrySchema, Project } from "../lib/projects";
import WalletList from "./WalletList";
import WalletDetail from "./WalletDetail";

export default function WalletPanel() {
    const walletRegistry = useMemo(
        () => WalletRegistrySchema.parse(walletsJson),
        []
    );
    const projectRegistry = useMemo(
        () => ProjectRegistrySchema.parse(projectsJson),
        []
    );

    const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

    const selectedWallet: Wallet | null =
        walletRegistry.wallets.find((w) => w.id === selectedWalletId) || null;

    const linkedProjects: Project[] = useMemo(() => {
        if (!selectedWallet) return [];
        return projectRegistry.projects.filter((p) =>
            selectedWallet.linked_projects.includes(p.id)
        );
    }, [selectedWallet, projectRegistry.projects]);

    return (
        <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] gap-4 h-full">
            <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-950 overflow-auto">
                <WalletList
                    wallets={walletRegistry.wallets}
                    selectedWalletId={selectedWalletId}
                    onSelect={setSelectedWalletId}
                    todayMissionWalletIds={[]}
                />
            </div>
            <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-950 overflow-auto">
                <WalletDetail wallet={selectedWallet} linkedProjects={linkedProjects} />
            </div>
        </div>
    );
}
