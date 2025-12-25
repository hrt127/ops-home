#!/bin/bash

# Backup Postgres database using pg_dump
# Usage: scripts/backup-db.sh [backup-dir]

set -e

BACKUP_DIR="${1:-./.backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/ops-home_$TIMESTAMP.sql.gz"

if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL environment variable not set"
  exit 1
fi

mkdir -p "$BACKUP_DIR"

echo "📦 Backing up Postgres database..."
echo "   Target: $BACKUP_FILE"

# Extract connection info from DATABASE_URL
# Format: postgresql://user:password@host:port/database?schema=public
if ! command -v pg_dump &> /dev/null; then
  echo "❌ pg_dump not found. Install PostgreSQL client tools."
  exit 1
fi

# Use pg_dump with database URL
PGPASSWORD=${DATABASE_URL##*:} && PGPASSWORD=${PGPASSWORD%%@*}
pg_dump "$DATABASE_URL" --no-owner --no-privileges | gzip > "$BACKUP_FILE"

if [ -f "$BACKUP_FILE" ]; then
  SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo "✅ Backup complete: $BACKUP_FILE ($SIZE)"
  
  # Optional: Keep only last 7 days of backups
  find "$BACKUP_DIR" -name "ops-home_*.sql.gz" -mtime +7 -delete
  echo "🧹 Cleaned old backups (> 7 days)"
else
  echo "❌ Backup failed"
  exit 1
fi
