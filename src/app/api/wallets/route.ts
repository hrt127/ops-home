
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { appendActivityLog } from '@/lib/activityLog';

const WALLETS_FILE = path.join(os.homedir(), 'dojo/system/wallets.json');

async function getWalletsData() {
    try {
        const content = await fs.readFile(WALLETS_FILE, 'utf-8');
        return JSON.parse(content);
    } catch {
        return { wallets: [] };
    }
}

export async function GET() {
    const data = await getWalletsData();
    // Decorate with stubbed balances
    const enriched = data.wallets.map((w: any) => ({
        ...w,
        balanceUsd: (Math.random() * 5000).toFixed(2),
        balanceEth: (Math.random() * 2).toFixed(4)
    }));
    return NextResponse.json(enriched);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = await getWalletsData();

        if (body.action === 'add') {
            const newWallet = { ...body.wallet, id: crypto.randomUUID() };
            data.wallets.push(newWallet);
            await appendActivityLog('wallets:add', { id: newWallet.id, label: newWallet.label });
        } else if (body.action === 'update') {
            data.wallets = data.wallets.map((w: any) => w.id === body.wallet.id ? body.wallet : w);
            await appendActivityLog('wallets:update', { id: body.wallet.id });
        }

        await fs.writeFile(WALLETS_FILE, JSON.stringify(data, null, 2), 'utf-8');
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
