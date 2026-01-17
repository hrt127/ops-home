
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const LOG_FILE = path.join(os.homedir(), 'dojo/knowledge/threads/activity_log.ndjson');

export async function appendActivityLog(action: string, details: any) {
    const line = JSON.stringify({
        timestamp: new Date().toISOString(),
        action,
        details
    }) + '\n';

    try {
        await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
        await fs.appendFile(LOG_FILE, line, 'utf8');
    } catch (error) {
        console.error('Failed to append to activity log:', error);
    }
}
