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
    -- Wallets table (Ops Home Schema)
    CREATE TABLE IF NOT EXISTS wallets (
      id TEXT PRIMARY KEY,
      address TEXT NOT NULL,
      type TEXT,
      lane TEXT,
      chains TEXT, -- JSON array
      ens_name TEXT,
      farcaster_handle TEXT,
      browser_profile TEXT,
      preferred_wallet_extension TEXT,
      risk_band TEXT,
      purpose TEXT,
      allowed_actions TEXT, -- JSON array
      forbidden_actions TEXT, -- JSON array
      allowed_dapps TEXT, -- JSON array
      forbidden_dapps TEXT, -- JSON array
      linked_projects TEXT, -- JSON array
      status TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Projects table
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      chain TEXT,
      farcaster_identity_wallet_id TEXT,
      treasury_wallet_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Contracts table
    CREATE TABLE IF NOT EXISTS contracts (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      type TEXT,
      address TEXT,
      deployer_wallet_id TEXT,
      admin_wallet_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    -- Liquidity table
    CREATE TABLE IF NOT EXISTS liquidity (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      venue TEXT,
      pair TEXT,
      lp_wallet_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
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
    CREATE INDEX IF NOT EXISTS idx_contracts_project ON contracts(project_id);
    CREATE INDEX IF NOT EXISTS idx_liquidity_project ON liquidity(project_id);
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

