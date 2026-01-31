import { db } from "../src/lib/db";
import wallets from "../wallets.json";
import projects from "../projects.json";

function loadWallets() {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO wallets VALUES (
      @id, @address, @type, @lane, @chains, @ens_name,
      @farcaster_handle, @browser_profile, @preferred_wallet_extension,
      @risk_band, @purpose, @allowed_actions, @forbidden_actions,
      @allowed_dapps, @forbidden_dapps, @linked_projects, @status
    )
  `);

  wallets.wallets.forEach((w) => {
    stmt.run({
      ...w,
      chains: JSON.stringify(w.chains),
      allowed_actions: JSON.stringify(w.allowed_actions),
      forbidden_actions: JSON.stringify(w.forbidden_actions),
      allowed_dapps: JSON.stringify(w.allowed_dapps),
      forbidden_dapps: JSON.stringify(w.forbidden_dapps),
      linked_projects: JSON.stringify(w.linked_projects),
    });
  });
}

function loadProjects() {
  const stmtProject = db.prepare(`
    INSERT OR REPLACE INTO projects VALUES (
      @id, @name, @chain, @farcaster_identity_wallet_id, @treasury_wallet_id
    )
  `);

  const stmtContract = db.prepare(`
    INSERT OR REPLACE INTO contracts VALUES (
      @id, @project_id, @type, @address, @deployer_wallet_id, @admin_wallet_id
    )
  `);

  const stmtLiquidity = db.prepare(`
    INSERT OR REPLACE INTO liquidity VALUES (
      @id, @project_id, @venue, @pair, @lp_wallet_id
    )
  `);

  projects.projects.forEach((p) => {
    stmtProject.run(p);

    p.contracts.forEach((c) =>
      stmtContract.run({ ...c, project_id: p.id })
    );

    p.liquidity.forEach((l) =>
      stmtLiquidity.run({ ...l, project_id: p.id })
    );
  });
}

loadWallets();
loadProjects();

console.log("Registries loaded into SQLite.");
