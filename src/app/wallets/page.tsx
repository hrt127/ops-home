import React from 'react';
import { loadWallets } from '@/lib/data-loader';
import { WalletList } from '@/components/WalletList';
import Link from 'next/link';

export default async function WalletsPage() {
    const wallets = await loadWallets();

    return (
        <main className="min-h-screen p-8 bg-slate-950 text-gray-100">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Wallet Registry</h1>
                        <p className="text-gray-400">
                            Manage identity, operational, and vault wallets across all lanes.
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>
                </header>

                <WalletList wallets={wallets} />
            </div>
        </main>
    );
}
