
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { appendActivityLog } from '@/lib/activityLog';

const EVENTS_DIR = path.join(os.homedir(), 'dojo/system/market_events');
const SCHEDULE_FILE = path.join(os.homedir(), 'dojo/system/bot_schedule.json');
const LOG_FILE = path.join(os.homedir(), 'dojo/knowledge/threads/activity_log.ndjson');

async function getAlertsFromLog() {
    try {
        const content = await fs.readFile(LOG_FILE, 'utf-8');
        const lines = content.split('\n').filter(Boolean);
        // Take last 100 lines to scan for errors
        const recent = lines.slice(-100);
        const alerts = [];

        for (const line of recent) {
            try {
                const json = JSON.parse(line);
                if (json.level === 'error' || json.type === 'bot_error') {
                    alerts.push({
                        id: `alert-${new Date(json.timestamp).getTime()}`,
                        timestamp: json.timestamp,
                        message: json.message || json.details?.message || 'Unknown error',
                        source: json.source || 'system',
                        severity: 'error'
                    });
                }
            } catch { }
        }
        return alerts.reverse().slice(0, 5); // Newest first
    } catch {
        return [];
    }
}

export async function GET() {
    const events = [];

    // Read market events
    try {
        const files = await fs.readdir(EVENTS_DIR);
        for (const file of files) {
            if (file.endsWith('.json')) {
                const content = await fs.readFile(path.join(EVENTS_DIR, file), 'utf-8');
                const data = JSON.parse(content);
                if (Array.isArray(data)) events.push(...data);
                else events.push(data);
            }
        }
    } catch {
        // ignore if dir missing
    }

    // Read schedule
    try {
        const scheduleContent = await fs.readFile(SCHEDULE_FILE, 'utf-8');
        const schedule = JSON.parse(scheduleContent);
        // Convert windows to events for today
        if (schedule.windows) {
            const today = new Date().toISOString().split('T')[0];
            schedule.windows.forEach((w: any) => {
                events.push({
                    id: w.id,
                    ts: `${today}T${w.start}:00`, // Naive, assuming user local time is handled by frontend or system matches
                    label: `${w.label} Window`,
                    source: 'schedule',
                    tags: ['bot', 'window']
                });
            });
        }
    } catch { }

    const alerts = await getAlertsFromLog();

    return NextResponse.json({ upcoming: events, alerts });
}

export async function POST(request: Request) {
    try {
        const { action, id } = await request.json();
        if (action === 'dismiss') {
            // In a real system, we'd mark this in a 'dismissed_alerts.json' or similar.
            // For now, just log it.
            await appendActivityLog('events:dismiss', { id });
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
