import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { getUnsynced, markSynced } from '@/lib/db-schema';

// Initialize database
function getDatabase() {
  const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'ops-home.db');
  return new Database(dbPath);
}

// GET /api/db/sync
// Pulls unsynced changes (for multi-device sync)
export async function GET(req: NextRequest) {
  try {
    const db = getDatabase();
    
    // Get unsynced changes
    const unsynced = getUnsynced(db);
    
    // Extract IDs for marking as synced
    const syncIds = unsynced.map((change: any) => change.id);
    
    // Mark as synced
    if (syncIds.length > 0) {
      markSynced(db, syncIds);
    }
    
    db.close();

    return NextResponse.json({
      changes: unsynced,
      count: unsynced.length,
      synced_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('GET /api/db/sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync changes', details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/db/sync
// Force sync of specific changes (for pushing changes to other devices)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sync_ids = [] } = body;

    if (sync_ids.length === 0) {
      return NextResponse.json(
        { error: 'sync_ids array required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    markSynced(db, sync_ids);
    db.close();

    return NextResponse.json({
      marked_synced: sync_ids.length,
      synced_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('POST /api/db/sync error:', error);
    return NextResponse.json(
      { error: 'Failed to mark sync', details: String(error) },
      { status: 500 }
    );
  }
}
