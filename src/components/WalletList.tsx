import { Wallet } from '@/lib/wallets';
import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';

interface WalletListProps {
    wallets: Wallet[];
}

export function WalletList({ wallets }: WalletListProps) {
    // Group by Lane
    const groupedWallets = wallets.reduce((acc, wallet) => {
        const lane = wallet.lane;
        if (!acc[lane]) acc[lane] = [];
        acc[lane].push(wallet);
        return acc;
    }, {} as Record<string, Wallet[]>);

    const lanes = Object.keys(groupedWallets).sort();

    return (
        <div className="space-y-8">
            {lanes.map((lane) => (
                <section key={lane} className="space-y-4">
                    <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 border-b border-gray-700 pb-2">
                        {lane} Lane
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupedWallets[lane].map((wallet) => (
                            <WalletCard key={wallet.id} wallet={wallet} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}

function WalletCard({ wallet }: { wallet: Wallet }) {
    const riskColor = {
        high_sensitivity: 'border-red-500/50 bg-red-900/10 text-red-100',
        medium: 'border-yellow-500/50 bg-yellow-900/10 text-yellow-100',
        low: 'border-green-500/50 bg-green-900/10 text-green-100',
        test: 'border-gray-500/50 bg-gray-900/10 text-gray-100',
    }[wallet.risk_band] || 'border-gray-700 bg-gray-800';

    return (
        <Link
            href={`/wallets/${wallet.id}`}
            className={clsx(
                "block p-4 border rounded-lg transition-all hover:scale-[1.02] hover:shadow-lg",
                riskColor
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-sm opacity-60">{wallet.risk_band}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${wallet.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                    {wallet.status}
                </span>
            </div>
            <h4 className="font-bold text-lg mb-1 truncate">{wallet.id}</h4>
            <p className="text-sm font-mono text-gray-400 truncate mb-3">{wallet.address}</p>

            <div className="flex flex-wrap gap-2 text-xs">
                {wallet.chains.map(c => (
                    <span key={c} className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">
                        {c}
                    </span>
                ))}
            </div>
        </Link>
    );
}
