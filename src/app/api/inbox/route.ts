
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { appendActivityLog } from '@/lib/activityLog';

const INBOX_FILE = path.join(os.homedir(), 'dojo/knowledge/inbox/ideas.json');

async function ensureFile() {
    await fs.mkdir(path.dirname(INBOX_FILE), { recursive: true });
    try {
        await fs.access(INBOX_FILE);
    } catch {
        await fs.writeFile(INBOX_FILE, JSON.stringify({ items: [] }, null, 2), 'utf-8');
    }
}

export async function GET() {
    await ensureFile();
    try {
        const content = await fs.readFile(INBOX_FILE, 'utf-8');
        return NextResponse.json(JSON.parse(content));
    } catch (error) {
        return NextResponse.json({ items: [] });
    }
}

export async function POST(request: Request) {
    await ensureFile();

    try {
        const body = await request.json();
        const { action, text, id, status } = body;

        const content = await fs.readFile(INBOX_FILE, 'utf-8');
        const data = JSON.parse(content);

        if (action === 'add') {
            const newItem = {
                id: crypto.randomUUID(),
                text,
                tags: [],
                status: 'open'
            };
            data.items.push(newItem);
            await appendActivityLog('inbox:add', { item: newItem });
        } else if (action === 'update') {
            data.items = data.items.map((item: any) => {
                if (item.id === id) {
                    return { ...item, status: status || item.status };
                }
                return item;
            });
            await appendActivityLog('inbox:update', { id, status });
        }

        await fs.writeFile(INBOX_FILE, JSON.stringify(data, null, 2), 'utf-8');
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json({ error: 'Failed to update inbox' }, { status: 500 });
    }
}
