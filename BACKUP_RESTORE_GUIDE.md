# Backup & Restore Guide – Ops-Home

## Quick Start

### Export Data (JSON)

**Download full backup as JSON** (useful for manual inspection or cross-DB migration):

```bash
# Via web browser:
# Navigate to http://localhost:3000/api/db/export

# Via curl:
curl http://localhost:3000/api/db/export > ops-home-backup.json
```

This exports all wallets, events, notes, ideas, and change log (read-only format).

### Backup Database (SQL)

**Backup Postgres using pg_dump**:

```bash
# Make sure DATABASE_URL is set in .env.local or shell:
export DATABASE_URL="postgresql://user:pass@localhost:5432/ops_home"

# Run backup script (creates `.backups/` folder):
bash scripts/backup-db.sh

# Backups older than 7 days auto-delete
```

Output: `.backups/ops-home_20251225_143022.sql.gz`

### Restore from Backup

#### From SQL backup:

```bash
# Restore full database from .sql.gz:
gunzip -c .backups/ops-home_20251225_143022.sql.gz | psql "$DATABASE_URL"
```

#### From JSON export:

```bash
# Dry-run first (no changes):
npx ts-node scripts/db-import.ts ops-home-backup.json

# Actually import (after confirming summary):
npx ts-node scripts/db-import.ts ops-home-backup.json --no-dry-run
```

The import script:
- Uses upsert logic (creates new records, updates existing by ID)
- Preserves original timestamps (`createdAt`, `updatedAt`, `createdAt` in ChangeLog)
- Maintains full version history from change log

---

## Recovery Scenarios

### Scenario 1: Accidental Data Loss (Single Record)

1. Check change log for history:
```bash
curl "http://localhost:3000/api/db/wallets?id=<wallet-id>&history=true" | jq '.changes'
```

2. View all versions of the record to find when it was deleted.

3. Manually restore via API:
```bash
curl -X PUT http://localhost:3000/api/db/wallets \
  -H "Content-Type: application/json" \
  -d '{"id":"<wallet-id>","name":"Restored Wallet"}'
```

### Scenario 2: Corrupted Database

1. Export current state (if still accessible):
```bash
curl http://localhost:3000/api/db/export > recovery-export.json
```

2. Restore from recent SQL backup:
```bash
gunzip -c .backups/ops-home_20251225_143022.sql.gz | psql "$DATABASE_URL"
```

3. Verify data:
```bash
curl http://localhost:3000/api/db/wallets | jq '.length'
```

### Scenario 3: Multi-Device Sync Issue

1. Export from production:
```bash
curl http://your-prod-host/api/db/export > prod-export.json
```

2. Restore locally:
```bash
npx ts-node scripts/db-import.ts prod-export.json --no-dry-run
```

---

## Automated Backups (Production)

### Using Cron (Linux/Mac)

```bash
# Edit crontab:
crontab -e

# Add daily backup at 2 AM:
0 2 * * * cd /home/heart/dojo/apps/ops-home && bash scripts/backup-db.sh >> /var/log/ops-home-backup.log 2>&1
```

### Using GitHub Actions (Recommended)

Create `.github/workflows/backup-db.yml`:

```yaml
name: Daily DB Backup

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Backup database
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: bash scripts/backup-db.sh
      - name: Upload to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws s3 cp .backups/ops-home_*.sql.gz s3://your-bucket/ops-home-backups/
```

---

## Retention Policy

- **JSON exports** (via `/api/db/export`): User-initiated, keep indefinitely in safe location.
- **SQL backups** (via `backup-db.sh`): Auto-rotate, keep last 7 days locally.
- **Production offsite backups**: Store in S3/GCS, 30-day retention.
- **Database provider** (Supabase/managed Postgres): Enable WAL archiving for PITR (point-in-time recovery).

---

## Testing Restore Procedure

Before relying on backups, test restore in a staging environment:

```bash
# 1. Create test database
createdb ops_home_test

# 2. Export from production
curl https://your-prod-host/api/db/export > test-export.json

# 3. Set test DATABASE_URL
export DATABASE_URL="postgresql://user:pass@localhost:5432/ops_home_test"

# 4. Restore
npx ts-node scripts/db-import.ts test-export.json --no-dry-run

# 5. Verify
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM wallets;"
```

---

## Disaster Recovery Plan

**If production database is lost entirely:**

1. Provision new Postgres instance.
2. Set `DATABASE_URL` to new instance.
3. Run migrations: `npm run migrate:prod`
4. Import latest backup: `npx ts-node scripts/db-import.ts <latest-export>.json --no-dry-run`
5. Verify record counts match pre-loss state.
6. Resume operations.

**Total RTO (Recovery Time Objective):** ~15 minutes (assuming backup exists).  
**RPO (Recovery Point Objective):** Last backup time (max 24 hours if daily backups).
