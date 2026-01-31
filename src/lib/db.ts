import { initializeDatabase } from './db-schema';
import path from 'path';

// Singleton database instance
// Accessing this will initialize the DB if not already initialized
// The DB file is located at <project_root>/data/ops-home.db

const DB_PATH = process.env.DATABASE_URL
    ? process.env.DATABASE_URL.replace('file:', '')
    : path.join(process.cwd(), 'data', 'ops-home.db');

export const db = initializeDatabase(DB_PATH);
