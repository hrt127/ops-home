# Phase 3 Status: Eyes & Memory

## Completed
- [x] Defined TypeScript types and Zod schemas for Wallets and Projects (`lib/wallets.ts`, `lib/projects.ts`).
- [x] Created starter JSON registries (`wallets.json`, `projects.json`).
- [x] **Long-term Memory**:
  - Implemented SQLite schema in `lib/db-schema.ts` including `wallets`, `projects`, `contracts`, `liquidity`.
  - Created `lib/db.ts` for database connection.
  - Updated `api/wallets/route.ts` to read/write from SQLite.
  - Created seeding script `scripts/load_registries.ts`.
- [x] **Eyes (Live Data)**:
  - Created `api/wallets/[id]/balance/route.ts` to fetch live balances via Etherscan/RPC (stubbed/ready for API key).
  - Updated `WalletDetail` component to fetch and display live ETH balance.
- [x] **Gating**:
  - Verified `useWalletGating` hook for permission logic.

## Pending / Next Steps
1. **Finish Installation**: `npm install` is running to ensure `better-sqlite3` and `zod` are available.
2. **Seed Database**: Run `npx tsx scripts/load_registries.ts` to populate SQLite from JSON files.
3. **Verify API Keys**: Ensure `ETHERSCAN_API_KEY` is set in `.env` for live balances to work reliably.

## Architectural Notes
- The app now uses a hybrid approach:
  - **Read**: Prefers SQLite for structured data (wallets, projects).
  - **Live**: Fetches on-chain data on-demand (balances) via API routes.
- `wallets.json` acts as the "Genesis State" for the database.
