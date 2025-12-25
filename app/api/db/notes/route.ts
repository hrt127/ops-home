import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { insertWithSync, updateWithSync, deleteWithSync } from '@/lib/db-schema';

// Initialize database
function getDatabase() {
  const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'ops-home.db');
  return new Database(dbPath);
}

// GET /api/db/notes
export async function GET(req: NextRequest) {
  try {
    const db = getDatabase();
    const notes = db.prepare('SELECT * FROM notes ORDER BY created_at DESC').all();
    db.close();

    return NextResponse.json({ notes, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('GET /api/db/notes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes', details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/db/notes (create new note)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDatabase();
    const id = `note-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const note = {
      id,
      label: body.label || 'Untitled Note',
      detail: body.detail || '',
    };

    insertWithSync(db, 'notes', note);
    db.close();

    return NextResponse.json({ ...note, timestamp: new Date().toISOString() }, { status: 201 });
  } catch (error) {
    console.error('POST /api/db/notes error:', error);
    return NextResponse.json(
      { error: 'Failed to create note', details: String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/db/notes (update note)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Note ID required' }, { status: 400 });
    }

    const db = getDatabase();
    updateWithSync(db, 'notes', id, updates);
    db.close();

    return NextResponse.json({ id, ...updates, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('PUT /api/db/notes error:', error);
    return NextResponse.json(
      { error: 'Failed to update note', details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/db/notes?id=1
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Note ID required' }, { status: 400 });
    }

    const db = getDatabase();
    deleteWithSync(db, 'notes', id);
    db.close();

    return NextResponse.json({ deleted: true, id, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('DELETE /api/db/notes error:', error);
    return NextResponse.json(
      { error: 'Failed to delete note', details: String(error) },
      { status: 500 }
    );
  }
}
