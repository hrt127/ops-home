import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db-sync';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const wallets = await prisma.wallet.findMany({ where: { deletedAt: null } });
    const events = await prisma.event.findMany({ where: { deletedAt: null } });
    const notes = await prisma.note.findMany({ where: { deletedAt: null } });
    const ideas = await prisma.idea.findMany({ where: { deletedAt: null } });
    const changes = await prisma.changeLog.findMany({ orderBy: { createdAt: 'asc' } });

    const exportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      exportedBy: 'ops-home',
      records: {
        wallets: wallets.length,
        events: events.length,
        notes: notes.length,
        ideas: ideas.length,
        changes: changes.length,
      },
      data: {
        wallets,
        events,
        notes,
        ideas,
        changeLog: changes,
      },
    };

    // Stream as downloadable JSON
    const filename = `ops-home-export-${new Date().toISOString().split('T')[0]}.json`;
    return new Response(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('GET /api/db/export:', err);
    return NextResponse.json({ error: 'Export failed', details: String(err) }, { status: 500 });
  }
}
