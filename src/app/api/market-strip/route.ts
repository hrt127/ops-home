
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { appendActivityLog } from '@/lib/activityLog';

const PAIRS_FILE = path.join(os.homedir(), 'dojo/system/market_pairs.json');

export async function GET() {
    try {
        const content = await fs.readFile(PAIRS_FILE, 'utf-8');
        const { pairs } = JSON.parse(content);

        // Stub data generation
        const data = pairs.map((pair: string) => {
            // Randomish data based on string hash or day mostly
            const hash = pair.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
            const basePrice = hash * 100 % 50000 + 1000;
            const change = (Math.random() * 10) - 5;

            return {
                pair,
                price: basePrice.toFixed(2),
                change24h: change.toFixed(2),
                fundingRate: (Math.random() * 0.02).toFixed(4)
            };
        });

        return NextResponse.json(data);
    } catch {
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        const { pairs } = await request.json();
        // Validate pairs is array of strings
        if (!Array.isArray(pairs)) throw new Error('Invalid format');

        await fs.writeFile(PAIRS_FILE, JSON.stringify({ pairs }, null, 2), 'utf-8');
        await appendActivityLog('market_pairs:update', { pairs });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
