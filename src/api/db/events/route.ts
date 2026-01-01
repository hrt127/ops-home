import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { insertWithSync, updateWithSync, deleteWithSync } from '@/lib/db-schema';

// Initialize database
function getDatabase() {
  const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'ops-home.db');
  return new Database(dbPath);
}

// GET /api/db/events
export async function GET(req: NextRequest) {
  try {
    const db = getDatabase();
    const events = db.prepare('SELECT * FROM events ORDER BY when_ts ASC').all();
    db.close();

    return NextResponse.json({ events, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('GET /api/db/events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events', details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/db/events (create new event)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDatabase();
    const id = `event-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const event = {
      id,
      label: body.label || 'Untitled Event',
      when_ts: body.when_ts || body.when || new Date().toISOString(),
      day_offset: body.day_offset || 0,
      importance: body.importance || 'medium',
      type: body.type || 'reminder',
    };

    const result = insertWithSync(db, 'events', event);
    db.close();

    return NextResponse.json({ id: result, ...event, timestamp: new Date().toISOString() }, { status: 201 });
  } catch (error) {
    console.error('POST /api/db/events error:', error);
    return NextResponse.json(
      { error: 'Failed to create event', details: String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/db/events (update event)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }

    const db = getDatabase();
    updateWithSync(db, 'events', id, updates);
    db.close();

    return NextResponse.json({ id, ...updates, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('PUT /api/db/events error:', error);
    return NextResponse.json(
      { error: 'Failed to update event', details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/db/events?id=1
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }

    const db = getDatabase();
    deleteWithSync(db, 'events', id);
    db.close();

    return NextResponse.json({ deleted: true, id, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('DELETE /api/db/events error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event', details: String(error) },
      { status: 500 }
    );
  }
}
