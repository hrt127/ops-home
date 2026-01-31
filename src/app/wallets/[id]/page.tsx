import React from 'react';
import { loadWalletWithProjects } from '@/lib/data-loader';
import { WalletDetail } from '@/components/WalletDetail';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function WalletDetailPage(props: PageProps) {
    const params = await props.params;
    const { wallet, projects } = await loadWalletWithProjects(params.id);

    if (!wallet) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-400">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Wallet Not Found</h1>
                    <p>ID: {params.id}</p>
                    <Link href="/wallets" className="mt-4 inline-block text-blue-400 hover:underline">Return to List</Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen p-8 bg-slate-950 text-gray-100">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/wallets"
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ← Back to Registry
                    </Link>
                </div>

                <WalletDetail wallet={wallet} linkedProjects={projects} />
            </div>
        </main>
    );
}
