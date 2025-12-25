import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { insertWithSync, updateWithSync, deleteWithSync } from '@/lib/db-schema';

// Initialize database
function getDatabase() {
  const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'ops-home.db');
  return new Database(dbPath);
}

// GET /api/db/ideas
export async function GET(req: NextRequest) {
  try {
    const db = getDatabase();
    const ideas = db.prepare('SELECT * FROM ideas ORDER BY created_at DESC').all();
    db.close();

    return NextResponse.json({ ideas, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('GET /api/db/ideas error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ideas', details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/db/ideas (create new idea)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDatabase();
    const id = `idea-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const idea = {
      id,
      label: body.label || 'Untitled Idea',
      status: body.status || 'idea',
    };
    
    insertWithSync(db, 'ideas', idea);
    db.close();
    
    return NextResponse.json({ ...idea, timestamp: new Date().toISOString() }, { status: 201 });
  } catch (error) {
    console.error('POST /api/db/ideas error:', error);
    return NextResponse.json(
      { error: 'Failed to create idea', details: String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/db/ideas (update idea)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Idea ID required' }, { status: 400 });
    }

    const db = getDatabase();
    updateWithSync(db, 'ideas', id, updates);
    db.close();

    return NextResponse.json({ id, ...updates, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('PUT /api/db/ideas error:', error);
    return NextResponse.json(
      { error: 'Failed to update idea', details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/db/ideas?id=1
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Idea ID required' }, { status: 400 });
    }

    const db = getDatabase();
    deleteWithSync(db, 'ideas', id);
    db.close();

    return NextResponse.json({ deleted: true, id, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('DELETE /api/db/ideas error:', error);
    return NextResponse.json(
      { error: 'Failed to delete idea', details: String(error) },
      { status: 500 }
    );
  }
}
