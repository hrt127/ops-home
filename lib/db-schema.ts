// Database schema and initialization for ops-home
// Uses SQLite for local persistence with multi-device sync capability

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

/**
 * Initialize database schema
 * Creates tables for wallets, events, notes, ideas, etc.
 */
export function initializeDatabase(dbPath: string): any {
  // Ensure data directory exists
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Open or create database
  const db = new (require("better-sqlite3"))(dbPath);

  // Enable foreign keys
  db.pragma("foreign_keys = ON");

  // Create tables if they don't exist
  db.exec(`
    -- Wallets table (extended for Ops Home)
    CREATE TABLE IF NOT EXISTS wallets (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      layer TEXT CHECK(layer IN ('identity', 'vault', 'ops', 'project')),
      role TEXT,
      address_evm TEXT,
      address_solana TEXT,
      chains TEXT, -- JSON array
      purpose TEXT,
      security_level TEXT CHECK(security_level IN ('high', 'medium', 'low')),
      notes TEXT,
      project_slug TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Events table
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      when_ts TEXT,
      day_offset INTEGER DEFAULT 0,
      importance TEXT CHECK(importance IN ('low', 'normal', 'high', 'critical')),
      type TEXT CHECK(type IN ('time-bound', 'ongoing')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Notes table
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      detail TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Ideas table
    CREATE TABLE IF NOT EXISTS ideas (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      status TEXT CHECK(status IN ('idea', 'shaping', 'live')) DEFAULT 'idea',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Daily context table
    CREATE TABLE IF NOT EXISTS daily_context (
      id TEXT PRIMARY KEY DEFAULT 'current',
      focus TEXT,
      risk_level INTEGER DEFAULT 5,
      non_negotiables TEXT, -- JSON array as string
      agent_mode TEXT DEFAULT 'daily-plan',
      last_agent_response TEXT, -- JSON as string
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Sync metadata table (for multi-device sync)
    CREATE TABLE IF NOT EXISTS sync_metadata (
      id TEXT PRIMARY KEY,
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      operation TEXT CHECK(operation IN ('insert', 'update', 'delete')),
      synced BOOLEAN DEFAULT FALSE,
      synced_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(table_name, record_id, operation)
    );

    -- Create indices for better query performance
    CREATE INDEX IF NOT EXISTS idx_events_day ON events(day_offset);
    CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
    CREATE INDEX IF NOT EXISTS idx_wallets_risk ON wallets(risk_band);
    CREATE INDEX IF NOT EXISTS idx_sync_unsynced ON sync_metadata(synced) WHERE synced = FALSE;
  `);

  return db;
}

/**
 * Database helper functions
 */
export const dbHelpers = {
  /**
   * Add a record and track it for sync
   */
  insertWithSync(
    db: any,
    table: string,
    data: Record<string, any>
  ): void {
    const columns = Object.keys(data);
    const placeholders = columns.map(() => "?").join(",");
    const values = columns.map((col) => {
      const val = data[col];
      // Convert arrays to JSON strings for storage
      if (Array.isArray(val)) {
        return JSON.stringify(val);
      }
      return val;
    });

    const stmt = db.prepare(
      `INSERT INTO ${table} (${columns.join(",")}) VALUES (${placeholders})`
    );
    stmt.run(...values);

    // Track for sync
    if (data.id) {
      const syncStmt = db.prepare(
        `INSERT OR IGNORE INTO sync_metadata (id, table_name, record_id, operation) 
         VALUES (?, ?, ?, 'insert')`
      );
      syncStmt.run(`${table}-${data.id}-${Date.now()}`, table, data.id);
    }
  },

  /**
   * Update a record and track it for sync
   */
  updateWithSync(
    db: any,
    table: string,
    id: string,
    data: Record<string, any>
  ): void {
    const updates = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(",");
    const values = Object.values(data).map((val) => {
      if (Array.isArray(val)) {
        return JSON.stringify(val);
      }
      return val;
    });

    const stmt = db.prepare(
      `UPDATE ${table} SET ${updates}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    );
    stmt.run(...values, id);

    // Track for sync
    const syncStmt = db.prepare(
      `INSERT OR IGNORE INTO sync_metadata (id, table_name, record_id, operation) 
       VALUES (?, ?, ?, 'update')`
    );
    syncStmt.run(`${table}-${id}-${Date.now()}`, table, id);
  },

  /**
   * Delete a record and track it for sync
   */
  deleteWithSync(db: any, table: string, id: string): void {
    const stmt = db.prepare(`DELETE FROM ${table} WHERE id = ?`);
    stmt.run(id);

    // Track for sync
    const syncStmt = db.prepare(
      `INSERT INTO sync_metadata (id, table_name, record_id, operation) 
       VALUES (?, ?, ?, 'delete')`
    );
    syncStmt.run(`${table}-${id}-${Date.now()}`, table, id);
  },

  /**
   * Get unsynced changes
   */
  getUnsynced(db: any): Array<any> {
    const stmt = db.prepare(
      `SELECT * FROM sync_metadata WHERE synced = FALSE ORDER BY created_at ASC LIMIT 100`
    );
    return stmt.all();
  },

  /**
   * Mark changes as synced
   */
  markSynced(db: any, ids: string[]): void {
    const placeholders = ids.map(() => "?").join(",");
    const stmt = db.prepare(
      `UPDATE sync_metadata SET synced = TRUE, synced_at = CURRENT_TIMESTAMP 
       WHERE id IN (${placeholders})`
    );
    stmt.run(...ids);
  },
};

// Individual exports for convenience
export const insertWithSync = dbHelpers.insertWithSync;
export const updateWithSync = dbHelpers.updateWithSync;
export const deleteWithSync = dbHelpers.deleteWithSync;
export const getUnsynced = dbHelpers.getUnsynced;
export const markSynced = dbHelpers.markSynced;

