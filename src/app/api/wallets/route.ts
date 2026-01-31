
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { appendActivityLog } from '@/lib/activityLog';

// Helper to parse JSON fields from DB
const parseWallet = (w: any) => ({
    ...w,
    chains: JSON.parse(w.chains || '[]'),
    allowed_actions: JSON.parse(w.allowed_actions || '[]'),
    forbidden_actions: JSON.parse(w.forbidden_actions || '[]'),
    allowed_dapps: JSON.parse(w.allowed_dapps || '[]'),
    forbidden_dapps: JSON.parse(w.forbidden_dapps || '[]'),
    linked_projects: JSON.parse(w.linked_projects || '[]')
});

export async function GET() {
    try {
        const stmt = db.prepare('SELECT * FROM wallets');
        const rows = stmt.all();
        const wallets = rows.map(parseWallet);
        return NextResponse.json({ wallets }); // Maintain structure { wallets: [...] }
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, wallet } = body;

        if (action === 'add') {
            const stmt = db.prepare(`
                INSERT INTO wallets (
                    id, address, type, lane, chains, 
                    ens_name, farcaster_handle, browser_profile, preferred_wallet_extension,
                    risk_band, purpose, allowed_actions, forbidden_actions,
                    allowed_dapps, forbidden_dapps, linked_projects, status
                ) VALUES (
                    @id, @address, @type, @lane, @chains,
                    @ens_name, @farcaster_handle, @browser_profile, @preferred_wallet_extension,
                    @risk_band, @purpose, @allowed_actions, @forbidden_actions,
                    @allowed_dapps, @forbidden_dapps, @linked_projects, @status
                )
            `);

            stmt.run({
                ...wallet,
                chains: JSON.stringify(wallet.chains || []),
                allowed_actions: JSON.stringify(wallet.allowed_actions || []),
                forbidden_actions: JSON.stringify(wallet.forbidden_actions || []),
                allowed_dapps: JSON.stringify(wallet.allowed_dapps || []),
                forbidden_dapps: JSON.stringify(wallet.forbidden_dapps || []),
                linked_projects: JSON.stringify(wallet.linked_projects || [])
            });

            await appendActivityLog('wallets:add', { id: wallet.id });

        } else if (action === 'update') {
            const stmt = db.prepare(`
                UPDATE wallets SET
                    address = @address, type = @type, lane = @lane, chains = @chains,
                    ens_name = @ens_name, farcaster_handle = @farcaster_handle,
                    browser_profile = @browser_profile, preferred_wallet_extension = @preferred_wallet_extension,
                    risk_band = @risk_band, purpose = @purpose,
                    allowed_actions = @allowed_actions, forbidden_actions = @forbidden_actions,
                    allowed_dapps = @allowed_dapps, forbidden_dapps = @forbidden_dapps,
                    linked_projects = @linked_projects, status = @status,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = @id
            `);

            stmt.run({
                ...wallet,
                chains: JSON.stringify(wallet.chains || []),
                allowed_actions: JSON.stringify(wallet.allowed_actions || []),
                forbidden_actions: JSON.stringify(wallet.forbidden_actions || []),
                allowed_dapps: JSON.stringify(wallet.allowed_dapps || []),
                forbidden_dapps: JSON.stringify(wallet.forbidden_dapps || []),
                linked_projects: JSON.stringify(wallet.linked_projects || [])
            });

            await appendActivityLog('wallets:update', { id: wallet.id });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
