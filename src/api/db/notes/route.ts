import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db-sync';
import { v4 as uuid } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const history = searchParams.get('history') === 'true';

    if (id) {
      const note = await prisma.note.findUnique({ where: { id } });
      if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      if (history) {
        const changes = await prisma.changeLog.findMany({
          where: { entity: 'note', entityId: id },
          orderBy: { createdAt: 'asc' },
        });
        return NextResponse.json({ note, changes });
      }
      return NextResponse.json(note);
    }

    const notes = await prisma.note.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(notes);
  } catch (err) {
    console.error('GET /api/db/notes:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, body: noteBody, metadata } = body;

    const id = uuid();
    const note = await prisma.note.create({
      data: {
        id,
        title: title || 'note',
        body: noteBody || '',
        metadata: metadata || null,
        version: 1,
      },
    });

    await prisma.changeLog.create({
      data: {
        id: uuid(),
        op: 'CREATE',
        entity: 'note',
        entityId: id,
        payload: note,
        version: 1,
        actorId: null,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (err) {
    console.error('POST /api/db/notes:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, body: noteBody, metadata } = body;

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const newVersion = existing.version + 1;
    const updated = await prisma.note.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        body: noteBody ?? existing.body,
        metadata: metadata ?? existing.metadata,
        version: newVersion,
      },
    });

    await prisma.changeLog.create({
      data: {
        id: uuid(),
        op: 'UPDATE',
        entity: 'note',
        entityId: id,
        payload: updated,
        version: newVersion,
        actorId: null,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('PUT /api/db/notes:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const newVersion = existing.version + 1;
    const deleted = await prisma.note.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        version: newVersion,
      },
    });

    await prisma.changeLog.create({
      data: {
        id: uuid(),
        op: 'DELETE',
        entity: 'note',
        entityId: id,
        payload: deleted,
        version: newVersion,
        actorId: null,
      },
    });

    return NextResponse.json(deleted);
  } catch (err) {
    console.error('DELETE /api/db/notes:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
