#!/bin/bash
cd ~/dojo/projects/ops-home

cat > README.md <<'END_README'
# Ops-Home

Personal command center for crypto operations. Local-first, single-user.

**Version**: v0.3-alpha  
**Status**: Phase 3→4 in progress | **Blocked by Node v20 upgrade**

---

## What It Does

Solves fragmentation, prevents wallet errors, builds systematic habits.

- **Knowledge**: Unified search (~/dojo/knowledge)
- **Wallets**: Risk lanes + permission gating
- **Awareness**: Market strip, smart money, narratives (no tabs)
- **Execution**: Calendar tasks, bot monitoring, positions
- **Learning**: Spaced repetition, poker lab, meta-skills

**Not**: Generic productivity, social scheduler, trading platform.  
**Is**: YOUR command center for crypto ops.

---

## Quick Start

### Prerequisites
- Node.js v20.9.0+ (**currently blocked on v18**)
- npm 9+
- SQLite3

### Install

    git clone https://github.com/hrt127/ops-home.git
    cd ops-home
    npm install
    cp .env.example .env
    npx prisma generate
    npm run dev

Open http://localhost:3000/dashboard

---

## Documentation

**Start here**:
1. [INTENT.md](INTENT.md) - Why this exists
2. [CAPTURE.md](CAPTURE.md) - Daily workflow
3. [CHANGELOG.md](CHANGELOG.md) - Changes

**For setup**: See .env.example for API keys.

**For collaborators**: Read INTENT.md first. Next.js 16 + React 19 + SQLite + Prisma. Integrates with ~/dojo.

---

## Current State (Feb 2026)

**What works**: SQLite schema, Wallet API, Market strip, 12-panel UI grid.

**Blocked**: Node v20 upgrade (npm install fails on v18)

**Next**: Fix Node, seed DB, wire Cmd+K search, connect knowledge panel, add DeFi panel.

**MVP**: Wallet safety + notes search + market awareness.

---

## Tech Stack

Next.js 16 + React 19 + Tailwind CSS 4 + SQLite (Prisma) + Zod

**Integrations**: Alchemy, CoinGecko, Neynar, Freqtrade (planned), OpenAI (planned)

---

## Related Projects

- [smart-money-dashboard](https://github.com/hrt127/smart-money-dashboard) - Data source
- [dojo](https://github.com/hrt127/dojo) - Parent filesystem

---

## License

MIT

**Last updated**: 2026-02-05
END_README

mkdir -p docs/archive

echo "Moving old docs to docs/archive/..."
mv DOCUMENTATION_INDEX.md IMPLEMENTATION_GUIDE.md COMPLETE_IMPLEMENTATION_STATUS.md BUILD_PROTOCOL.md AGENT_SETUP.md SYSTEM_ANALYSIS.md PROJECT_CONTEXT.md SYSTEM_STATE.md DELIVERABLES.md IMPLEMENTATION_SUMMARY.md DOCUMENTATION.md ASCII_MOCKUP.md VISUAL_MOCKUP_FINAL.md DASHBOARD_WALKTHROUGH.md SECURITY_AUDIT_REPORT.md BACKUP_RESTORE_GUIDE.md LOCAL_SETUP.md DOJO_INTEGRATION.md docs/archive/ 2>/dev/null

mv docs/architecture docs/archive/ 2>/dev/null
mv docs/guides docs/archive/ 2>/dev/null
mv docs/phases docs/archive/ 2>/dev/null

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📁 Root now has:"
ls -1 *.md 2>/dev/null
echo ""
echo "📦 Archived in docs/archive/"
echo ""
echo "🔍 Review: git status"
echo "📝 Commit: git add . && git commit -m 'docs: cleanup - rewrite README, archive old docs' && git push"
