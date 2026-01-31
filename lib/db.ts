import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "ops-home.db");

export const db = new Database(dbPath);

// Run migrations on startup
db.exec(`
CREATE TABLE IF NOT EXISTS wallets (
  id TEXT PRIMARY KEY,
  address TEXT,
  type TEXT,
  lane TEXT,
  chains TEXT,
  ens_name TEXT,
  farcaster_handle TEXT,
  browser_profile TEXT,
  preferred_wallet_extension TEXT,
  risk_band TEXT,
  purpose TEXT,
  allowed_actions TEXT,
  forbidden_actions TEXT,
  allowed_dapps TEXT,
  forbidden_dapps TEXT,
  linked_projects TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT,
  chain TEXT,
  farcaster_identity_wallet_id TEXT,
  treasury_wallet_id TEXT
);

CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  type TEXT,
  address TEXT,
  deployer_wallet_id TEXT,
  admin_wallet_id TEXT
);

CREATE TABLE IF NOT EXISTS liquidity (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  venue TEXT,
  pair TEXT,
  lp_wallet_id TEXT
);

CREATE TABLE IF NOT EXISTS action_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wallet_id TEXT,
  action TEXT,
  timestamp INTEGER,
  metadata TEXT
);
`);
