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
      const idea = await prisma.idea.findUnique({ where: { id } });
      if (!idea) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      if (history) {
        const changes = await prisma.changeLog.findMany({
          where: { entity: 'idea', entityId: id },
          orderBy: { createdAt: 'asc' },
        });
        return NextResponse.json({ idea, changes });
      }
      return NextResponse.json(idea);
    }

    const ideas = await prisma.idea.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(ideas);
  } catch (err) {
    console.error('GET /api/db/ideas:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, body: ideaBody, status, metadata } = body;

    const id = uuid();
    const idea = await prisma.idea.create({
      data: {
        id,
        title: title || 'idea',
        body: ideaBody || '',
        status: status || 'idea',
        metadata: metadata || null,
        version: 1,
      },
    });

    await prisma.changeLog.create({
      data: {
        id: uuid(),
        op: 'CREATE',
        entity: 'idea',
        entityId: id,
        payload: idea,
        version: 1,
        actorId: null,
      },
    });

    return NextResponse.json(idea, { status: 201 });
  } catch (err) {
    console.error('POST /api/db/ideas:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, body: ideaBody, status, metadata } = body;

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const existing = await prisma.idea.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const newVersion = existing.version + 1;
    const updated = await prisma.idea.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        body: ideaBody ?? existing.body,
        status: status ?? existing.status,
        metadata: metadata ?? existing.metadata,
        version: newVersion,
      },
    });

    await prisma.changeLog.create({
      data: {
        id: uuid(),
        op: 'UPDATE',
        entity: 'idea',
        entityId: id,
        payload: updated,
        version: newVersion,
        actorId: null,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('PUT /api/db/ideas:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const existing = await prisma.idea.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const newVersion = existing.version + 1;
    const deleted = await prisma.idea.update({
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
        entity: 'idea',
        entityId: id,
        payload: deleted,
        version: newVersion,
        actorId: null,
      },
    });

    return NextResponse.json(deleted);
  } catch (err) {
    console.error('DELETE /api/db/ideas:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
