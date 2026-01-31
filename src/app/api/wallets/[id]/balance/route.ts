
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { fetchWalletBalance } from '@/lib/wallet-data';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Get wallet address from DB
    const stmt = db.prepare('SELECT address FROM wallets WHERE id = ?');
    const wallet = stmt.get(id) as { address: string } | undefined;

    if (!wallet) {
        return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    try {
        // Fetch live balance
        // Note: In production this should be cached or rate-limited
        const balance = await fetchWalletBalance(wallet.address);

        if (!balance) {
            return NextResponse.json({
                address: wallet.address,
                balance_eth: 0,
                balance_usd: 0,
                status: 'error_or_empty'
            });
        }

        return NextResponse.json(balance);
    } catch (error) {
        console.error('Balance fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
    }
}
