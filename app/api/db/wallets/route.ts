import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { insertWithSync, updateWithSync, deleteWithSync } from '@/lib/db-schema';

// Initialize database
function getDatabase() {
  const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'ops-home.db');
  return new Database(dbPath);
}

// GET /api/db/wallets
export async function GET(req: NextRequest) {
  try {
    const db = getDatabase();
    const wallets = db.prepare('SELECT * FROM wallets ORDER BY created_at DESC').all();
    db.close();

    return NextResponse.json({ wallets, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('GET /api/db/wallets error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallets', details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/db/wallets (create new wallet)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDatabase();

    const id = `wallet-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const wallet = {
      id,
      label: body.label || 'Untitled Wallet',
      purpose: body.purpose || 'trading',
      risk_band: body.risk_band || 'medium',
      address: body.address || '',
      browser_profile: body.browser_profile || null,
      provider: body.provider || 'metamask',
      persona: body.persona || null,
      forbidden_with: body.forbidden_with || [],
      allowed_with: body.allowed_with || [],
    };

    insertWithSync(db, 'wallets', wallet);
    db.close();

    return NextResponse.json({ ...wallet, timestamp: new Date().toISOString() }, { status: 201 });
  } catch (error) {
    console.error('POST /api/db/wallets error:', error);
    return NextResponse.json(
      { error: 'Failed to create wallet', details: String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/db/wallets (update wallet)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Wallet ID required' }, { status: 400 });
    }

    // Convert JSON fields if provided
    if (updates.forbidden_with && typeof updates.forbidden_with === 'object') {
      updates.forbidden_with = JSON.stringify(updates.forbidden_with);
    }
    if (updates.allowed_with && typeof updates.allowed_with === 'object') {
      updates.allowed_with = JSON.stringify(updates.allowed_with);
    }

    const db = getDatabase();
    updateWithSync(db, 'wallets', id, updates);
    db.close();

    return NextResponse.json({ id, ...updates, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('PUT /api/db/wallets error:', error);
    return NextResponse.json(
      { error: 'Failed to update wallet', details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/db/wallets?id=1
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Wallet ID required' }, { status: 400 });
    }

    const db = getDatabase();
    deleteWithSync(db, 'wallets', id);
    db.close();

    return NextResponse.json({ deleted: true, id, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('DELETE /api/db/wallets error:', error);
    return NextResponse.json(
      { error: 'Failed to delete wallet', details: String(error) },
      { status: 500 }
    );
  }
}
