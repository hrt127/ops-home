import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { initializeDatabase } from '@/lib/db-schema';

export async function POST(req: NextRequest) {
  try {
    const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'ops-home.db');
    const db = initializeDatabase(dbPath);
    db.close();

    return NextResponse.json({ created: true, path: dbPath, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('POST /api/db/init error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, msg: 'POST to create DB' });
}
