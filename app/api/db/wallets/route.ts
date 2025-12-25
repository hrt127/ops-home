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
      const wallet = await prisma.wallet.findUnique({ where: { id } });
      if (!wallet) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      if (history) {
        const changes = await prisma.changeLog.findMany({
          where: { entity: 'wallet', entityId: id },
          orderBy: { createdAt: 'asc' },
        });
        return NextResponse.json({ wallet, changes });
      }
      return NextResponse.json(wallet);
    }

    const wallets = await prisma.wallet.findMany({ where: { deletedAt: null } });
    return NextResponse.json(wallets);
  } catch (err) {
    console.error('GET /api/db/wallets:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, address, metadata } = body;

    const id = uuid();
    const wallet = await prisma.wallet.create({
      data: {
        id,
        name: name || 'wallet',
        address: address || null,
        metadata: metadata || null,
        version: 1,
      },
    });

    await prisma.changeLog.create({
      data: {
        id: uuid(),
        op: 'CREATE',
        entity: 'wallet',
        entityId: id,
        payload: wallet,
        version: 1,
        actorId: null,
      },
    });

    return NextResponse.json(wallet, { status: 201 });
  } catch (err) {
    console.error('POST /api/db/wallets:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, address, metadata } = body;

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const existing = await prisma.wallet.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const newVersion = existing.version + 1;
    const updated = await prisma.wallet.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        address: address ?? existing.address,
        metadata: metadata ?? existing.metadata,
        version: newVersion,
      },
    });

    await prisma.changeLog.create({
      data: {
        id: uuid(),
        op: 'UPDATE',
        entity: 'wallet',
        entityId: id,
        payload: updated,
        version: newVersion,
        actorId: null,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('PUT /api/db/wallets:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const existing = await prisma.wallet.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const newVersion = existing.version + 1;
    const deleted = await prisma.wallet.update({
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
        entity: 'wallet',
        entityId: id,
        payload: deleted,
        version: newVersion,
        actorId: null,
      },
    });

    return NextResponse.json(deleted);
  } catch (err) {
    console.error('DELETE /api/db/wallets:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
