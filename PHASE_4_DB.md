Phase 4 — Database (Postgres + Prisma)

This document describes the Phase 4 DB plan and quickstart.

Overview
- Postgres (production-grade), Prisma ORM for TypeScript developer DX.
- Models: Wallet, Event, Note, Idea (id=UUID, createdAt, updatedAt, version, deletedAt, metadata JSON).
- ChangeLog: append-only snapshots for history and sync.

Local quickstart
1. Install deps:

```bash
npm install
```

2. Add `.env.local` containing `DATABASE_URL`:

```env
DATABASE_URL=postgresql://postgres:pass@localhost:5432/ops_home?schema=public
```

3. Generate client + run migration (dev):

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Files created in repo
- `prisma/schema.prisma` — schema and ChangeLog model
- `lib/db-types.ts` — TypeScript interfaces for records
- `lib/db-sync.ts` — minimal Prisma client helpers (createWallet, listWallets, createChangeLog)

Next steps (I can do these):
- Add full CRUD API routes with transactional versioning and ChangeLog writes.
- Implement `/api/db/export` to stream consistent JSON snapshots.
- Provide a migration script that reads existing localStorage/SQLite data and imports into Postgres (dry-run mode).
- Hook frontend components to the API with a storage adapter layer.

If you want, I'll now:
- run `npm install` and `npx prisma generate` here (will modify node_modules), OR
- continue by implementing the CRUD API and export endpoint.

Tell me which to do next.