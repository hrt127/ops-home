
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { appendActivityLog } from '@/lib/activityLog';

const FT_ROOT = path.join(os.homedir(), 'dojo/bots/freqtrade');
const STRATEGIES_DIR = path.join(FT_ROOT, 'strategies');
const NARRATIVES_DIR = path.join(FT_ROOT, 'narratives');
const RUNS_DIR = path.join(FT_ROOT, 'runs');

async function ensureDirs() {
    await fs.mkdir(STRATEGIES_DIR, { recursive: true });
    await fs.mkdir(NARRATIVES_DIR, { recursive: true });
    await fs.mkdir(RUNS_DIR, { recursive: true });
}

// Helper to ensure narrative file exists
async function ensureNarrative(name: string) {
    const filePath = path.join(NARRATIVES_DIR, `${name}.md`);
    try {
        await fs.access(filePath);
    } catch {
        const content = `# ${name}\n\n## Purpose\nStub purpose for ${name}.\n\n## Regime\nPlaceholder regime.\n\n## Performance\nPlaceholder performance.\n\n## Changes\n- Initial creation\n`;
        await fs.writeFile(filePath, content, 'utf-8');
    }
    return filePath;
}

export async function GET(request: Request) {
    await ensureDirs();
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (name) {
        // Detail view
        try {
            const strategyPath = path.join(STRATEGIES_DIR, `${name}.py`);
            const narrativePath = await ensureNarrative(name);

            const [strategyContent, narrativeContent] = await Promise.all([
                fs.readFile(strategyPath, 'utf-8').catch(() => null),
                fs.readFile(narrativePath, 'utf-8')
            ]);

            if (!strategyContent) return NextResponse.json({ error: 'Strategy not found' }, { status: 404 });

            // Stub runs summary
            const runs = [
                { id: 'run-latest', date: new Date().toISOString(), profit: '0.00%' }
            ];

            return NextResponse.json({
                name,
                strategyContent,
                narrativeContent,
                runs
            });

        } catch (e) {
            return NextResponse.json({ error: 'Failed' }, { status: 500 });
        }
    } else {
        // List view
        try {
            const files = await fs.readdir(STRATEGIES_DIR);
            const strategies = [];
            for (const file of files) {
                if (file.endsWith('.py') && !file.startsWith('__')) {
                    const name = file.replace('.py', '');
                    await ensureNarrative(name);
                    strategies.push({
                        name,
                        strategyPath: path.join(STRATEGIES_DIR, file),
                        narrativePath: path.join(NARRATIVES_DIR, `${name}.md`),
                        hasRuns: false // stub
                    });
                }
            }
            return NextResponse.json(strategies);
        } catch (e) {
            return NextResponse.json([]);
        }
    }
}

export async function POST(request: Request) {
    try {
        const { name, narrativeUpdate } = await request.json();
        if (!name || !narrativeUpdate) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

        const narrativePath = path.join(NARRATIVES_DIR, `${name}.md`);
        await ensureNarrative(name);

        let content = await fs.readFile(narrativePath, 'utf-8');

        // Find ## Changes section or append it
        if (!content.includes('## Changes')) {
            content += '\n## Changes\n';
        }

        // Append bullet
        const newBullet = `\n- [${new Date().toISOString().split('T')[0]}] ${narrativeUpdate}`;

        // Regex to insert after ## Changes header? Or simple replacement.
        // Simple append for now if "## Changes" is at end, but better to insert specifically.
        // Let's just strip ## Changes and re-add or simple string manipulation.
        // Robust way: split by ## Changes, append to second part.

        const parts = content.split('## Changes');
        if (parts.length > 1) {
            // Append to the section
            parts[1] = parts[1] + newBullet;
            content = parts.join('## Changes');
        } else {
            // Should not happen due to check above
            content += newBullet;
        }

        await fs.writeFile(narrativePath, content, 'utf-8');
        await appendActivityLog('freqtrade:narrative_update', { name, update: narrativeUpdate });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
