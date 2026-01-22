
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const LOG_FILE = path.join(os.homedir(), 'dojo/knowledge/threads/activity_log.ndjson');
const CONFIG_FILE = path.join(os.homedir(), 'dojo/system/builder_signal.json');

export async function GET() {
    try {
        // Read config
        const configRaw = await fs.readFile(CONFIG_FILE, 'utf-8');
        const config = JSON.parse(configRaw);

        // Read recent logs
        const logContent = await fs.readFile(LOG_FILE, 'utf-8');
        const lines = logContent.split('\n').filter(Boolean).slice(-20).reverse();

        // Simple heuristics to generate prompts
        const prompts = [];

        // Look for updates to freqtrade
        const ftUpdate = lines.find(l => l.includes('freqtrade:narrative_update'));
        if (ftUpdate) {
            const detail = JSON.parse(ftUpdate);
            prompts.push(`Write a Farcaster cast about updates to strategy ${detail.details?.name || 'unknown'}.`);
        }

        // Look for completed focus tasks
        const taskUpdate = lines.find(l => l.includes('daily-focus:toggle'));
        // We track toggle but we don't know if it was checked or unchecked easily without state. 
        // Assume active work.
        if (taskUpdate) {
            prompts.push("Reflect on today's Daily Focus progress in a short note.");
        }

        // Default / Random
        if (prompts.length < 3) {
            const topic = config.topics[Math.floor(Math.random() * config.topics.length)];
            prompts.push(`Share a thought on ${topic} relative to your current work.`);
        }

        return NextResponse.json(prompts.slice(0, 3));

    } catch {
        return NextResponse.json(["Share a screenshot of your current dashboard."]);
    }
}
