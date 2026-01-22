
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { appendActivityLog } from '@/lib/activityLog';

// Helper to get today's filename: day_plan-YYYY-MM-DD.json
function getTodayFilename() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `day_plan-${yyyy}-${mm}-${dd}.json`;
}

const CALENDAR_DIR = path.join(os.homedir(), 'dojo/system/calendar');

// Ensure directory exists
async function ensureDir() {
    await fs.mkdir(CALENDAR_DIR, { recursive: true });
}

export async function GET() {
    await ensureDir();
    const filename = getTodayFilename();
    const filePath = path.join(CALENDAR_DIR, filename);

    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return NextResponse.json(JSON.parse(content));
    } catch (error) {
        // If file missing, return default structure
        const defaultData = {
            date: new Date().toISOString().split('T')[0],
            tasks: []
        };
        return NextResponse.json(defaultData);
    }
}

export async function POST(request: Request) {
    await ensureDir();
    const filename = getTodayFilename();
    const filePath = path.join(CALENDAR_DIR, filename);

    try {
        const { task, action, id } = await request.json();

        // Read current
        let currentData;
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            currentData = JSON.parse(content);
        } catch {
            currentData = {
                date: new Date().toISOString().split('T')[0],
                tasks: []
            };
        }

        // Modify
        if (action === 'add') {
            const newTask = {
                id: crypto.randomUUID(),
                text: task,
                done: false
            };
            currentData.tasks.push(newTask);
            await appendActivityLog('daily-focus:add', { task: newTask });
        } else if (action === 'toggle') {
            currentData.tasks = currentData.tasks.map((t: any) =>
                t.id === id ? { ...t, done: !t.done } : t
            );
            await appendActivityLog('daily-focus:toggle', { id });
        }

        // Save
        await fs.writeFile(filePath, JSON.stringify(currentData, null, 2), 'utf-8');
        return NextResponse.json(currentData);

    } catch (error) {
        return NextResponse.json({ error: 'Failed to update daily focus' }, { status: 500 });
    }
}
