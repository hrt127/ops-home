'use client';

import { Wallet } from '@/lib/wallets';
import { Project } from '@/lib/projects';
import React from 'react';
import { clsx } from 'clsx';
import { useWalletGating } from '@/hooks/useWalletGating';

interface WalletDetailProps {
    wallet: Wallet;
    linkedProjects?: Project[];
}

export function WalletDetail({ wallet, linkedProjects = [] }: WalletDetailProps) {
    const { canPerformAction, canInteractWithDapp } = useWalletGating(wallet);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="p-6 border border-gray-700 rounded-xl bg-gray-900/50 backdrop-blur">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{wallet.id}</h1>
                        <div className="font-mono text-gray-400 flex items-center gap-2">
                            {wallet.address}
                            <button
                                onClick={() => navigator.clipboard.writeText(wallet.address)}
                                className="text-xs hover:text-white transition-colors"
                            >
                                [COPY]
                            </button>
                        </div>

                        <div className="mt-4 flex items-center gap-4">
                            <BalanceDisplay walletId={wallet.id} />
                        </div>

                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Risk Band</div>
                        <div className={clsx("font-bold", {
                            'text-red-400': wallet.risk_band === 'high_sensitivity',
                            'text-yellow-400': wallet.risk_band === 'medium',
                            'text-green-400': wallet.risk_band === 'low'
                        })}>
                            {wallet.risk_band.toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <DetailItem label="Lane" value={wallet.lane} />
                    <DetailItem label="Type" value={wallet.type} />
                    <DetailItem label="Extension" value={wallet.preferred_wallet_extension || 'Any'} />
                    <DetailItem label="Browser Details" value={wallet.browser_profile || 'Default'} />
                </div>

                <div className="mt-6">
                    <div className="text-sm text-gray-500 uppercase mb-1">Purpose</div>
                    <p className="text-lg text-gray-200 leading-relaxed">{wallet.purpose}</p>
                </div>
            </div>

            {/* Permissions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border border-gray-700 rounded-xl bg-gray-900/30">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Allowed Actions
                    </h3>
                    <ul className="space-y-2">
                        {wallet.allowed_actions.map(action => (
                            <li key={action} className="text-green-300/80 font-mono text-sm bg-green-900/10 px-2 py-1.5 rounded border border-green-900/30">
                                ✓ {action}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-5 border border-gray-700 rounded-xl bg-gray-900/30">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span> Forbidden Actions
                    </h3>
                    <ul className="space-y-2">
                        {wallet.forbidden_actions.map(action => (
                            <li key={action} className="text-red-300/80 font-mono text-sm bg-red-900/10 px-2 py-1.5 rounded border border-red-900/30">
                                ✕ {action}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Dapps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border border-gray-700 rounded-xl bg-gray-900/30">
                    <h3 className="text-lg font-bold mb-4">Allowed Dapps</h3>
                    <div className="flex flex-wrap gap-2">
                        {wallet.allowed_dapps.map(dapp => (
                            <span key={dapp} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-700">
                                {dapp}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="p-5 border border-gray-700 rounded-xl bg-gray-900/30">
                    <h3 className="text-lg font-bold mb-4">Forbidden Dapps</h3>
                    <div className="flex flex-wrap gap-2">
                        {wallet.forbidden_dapps.map(dapp => (
                            <span key={dapp} className="bg-red-900/20 text-red-400 px-3 py-1 rounded-full text-sm border border-red-900/30">
                                {dapp}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Linked Projects */}
            {linkedProjects.length > 0 && (
                <div className="p-6 border border-gray-700 rounded-xl bg-blue-900/10">
                    <h3 className="text-xl font-bold mb-4 text-blue-200">Linked Projects</h3>
                    <div className="grid gap-4">
                        {linkedProjects.map(project => (
                            <div key={project.id} className="bg-gray-900 p-4 rounded border border-gray-700">
                                <div className="flex justify-between">
                                    <span className="font-bold text-white">{project.name}</span>
                                    <span className="text-xs text-blue-400 uppercase border border-blue-900 bg-blue-900/20 px-2 py-0.5 rounded">{project.chain}</span>
                                </div>
                                <div className="mt-2 text-sm text-gray-400">
                                    Contracts: {project.contracts.length} | Liquidity Pools: {project.liquidity.length}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailItem({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
            <div className="text-gray-200 font-medium">{value}</div>
        </div>
    );
}

function BalanceDisplay({ walletId }: { walletId: string }) {
    const [balance, setBalance] = React.useState<{ balance_eth: number } | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(true);
        fetch(`/api/wallets/${walletId}/balance`)
            .then(res => res.json())
            .then(data => {
                if (!data.error) setBalance(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [walletId]);

    if (loading) return <div className="text-sm text-gray-500 animate-pulse">Loading balance...</div>;

    if (!balance) return <div className="text-sm text-gray-600">-- ETH</div>;

    return (
        <div className="bg-black/40 px-3 py-1.5 rounded border border-gray-700/50 backdrop-blur-sm">
            <span className="text-xl font-mono text-white font-bold tracking-tight">
                {balance.balance_eth.toFixed(4)} <span className="text-gray-500 text-sm">ETH</span>
            </span>
        </div>
    );
}
