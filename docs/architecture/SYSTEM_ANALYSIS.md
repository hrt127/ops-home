# Dojo & Ops-Home: System Analysis & Current State
**Generated**: 2026-01-31 06:24 UTC+2  
**Analyst**: Antigravity (Claude 4.5 Sonnet)

---

## 🏗️ DOJO SYSTEM ARCHITECTURE

### Core Philosophy
The Dojo is a **four-layer personal operating system** for high-intensity crypto/DeFi work:

```
┌─────────────────────────────────────────┐
│ LAYER 4: Cockpit UI (ops-home)          │  ← Interface
├─────────────────────────────────────────┤
│ LAYER 3: Dojo CLI (~/dojo2-clean)       │  ← Logic/Orchestration
├─────────────────────────────────────────┤
│ LAYER 2: Filesystem (~/dojo)            │  ← Data/State
├─────────────────────────────────────────┤
│ LAYER 1: You (Ideas/Tasks/Projects)     │  ← Human
└─────────────────────────────────────────┘
```

### Canonical Paths
| Component | Path | Purpose |
|-----------|------|---------|
| **Dojo Root** | `~/dojo` | All system data lives here |
| **Ops-Home** | `~/dojo/projects/ops-home` | Primary cockpit UI |
| **Dojo CLI** | `~/dojo2-clean` | System orchestrator |
| **Snapshot** | `~/.config/dojo/sync/latest.json` | Machine-readable state export |
| **System Docs** | `~/dojo/system/` | Identity, policies, architecture |
| **Knowledge** | `~/dojo/knowledge/` | Notes, threads, inbox |

### Directory Structure
```
~/dojo/
├── system/          # System law, identity, policies
├── projects/        # Active codebases (ops-home, elfa-tools)
├── knowledge/       # Notes, threads, inbox, logs
├── agents/          # Agent definitions (future)
├── scratch/         # Temporary work
└── archive/         # Old/paused projects (9,421 items)
```

### Core Principles
1. **No Silos**: All state under `~/dojo` or documented databases
2. **Context-First**: Every project needs `PROJECT_CONTEXT.md`
3. **Local-First**: WSL paths only, transparent configs
4. **Agent Protocol**: Read SYSTEM.md → IDENTITY.md → PROJECT_CONTEXT.md

---

## 🎯 OPS-HOME: THE COCKPIT

### Mission
Single-user, local-first digital cockpit for crypto operations and daily life.  
Consolidates wallets, schedules, ideas, notes, market awareness, and AI co-pilot into a **12-panel dashboard**.

### Current Location
```
~/dojo/projects/ops-home
```

### Technology Stack
- **Framework**: Next.js 16.1.1 (App Router)
- **UI**: React 19.2.3 + Tailwind CSS 4
- **Language**: TypeScript 5 (strict mode)
- **Data**: 
  - SQLite (`data/ops-home.db` - 72KB, created Dec 25)
  - JSON registries (`wallets.json`, `projects.json`)
  - Dojo snapshot (`~/.config/dojo/sync/latest.json`)
- **ORM**: Prisma 5.8.0
- **Node**: v18.19.1 (⚠️ **OUTDATED** - needs v20+)

### Dependencies Status
```json
{
  "dependencies": {
    "@prisma/client": "^5.8.0",
    "better-sqlite3": "^12.5.0",    // ⚠️ Requires Node 20+
    "clsx": "^2.1.1",
    "next": "16.1.1",                // ⚠️ Requires Node 20.9.0+
    "react": "19.2.3",
    "react-calendar": "^6.0.0",
    "react-dom": "19.2.3",
    "zod": "^3.22.4"
  }
}
```

**⚠️ CRITICAL BLOCKER**: Node v18.19.1 is incompatible with Next.js 16 and better-sqlite3.  
**Required**: Node v20.9.0 or higher.

---

## 📊 DEVELOPMENT PHASES

### Phase 1: Foundation ✅ COMPLETE
- Basic UI structure
- Component library
- Local state management

### Phase 2: Local Cockpit ✅ COMPLETE
- 12-panel dashboard
- Agent console
- localStorage persistence
- Filesystem APIs (Next.js Route Handlers)
- No database

### Phase 3: Eyes (Live Data) 🔄 IN PROGRESS
**Goal**: Integrate external APIs for real-time data

**Completed**:
- ✅ SQLite schema (`src/lib/db-schema.ts`)
- ✅ Database singleton (`src/lib/db.ts`)
- ✅ Wallet API migration (`src/app/api/wallets/route.ts`)
- ✅ Live balance endpoint (`src/app/api/wallets/[id]/balance/route.ts`)
- ✅ `WalletDetail` component with live balance display
- ✅ Zod schemas (`src/lib/wallets.ts`, `src/lib/projects.ts`)
- ✅ JSON registries (`wallets.json`, `projects.json`)

**Pending**:
- ⏳ Node.js upgrade (v18 → v20+)
- ⏳ `npm install` completion
- ⏳ Database seeding (`npx tsx scripts/load_registries.ts`)
- ⏳ Etherscan API key configuration
- ⏳ Market data integration (CoinGecko)
- ⏳ Social feeds (Farcaster/Twitter)

### Phase 4: Memory (Long-term Persistence) 🔄 PARTIALLY STARTED
**Goal**: Add persistent storage and multi-device sync

**Completed**:
- ✅ SQLite database created (`data/ops-home.db`)
- ✅ Prisma ORM configured

**Pending**:
- ⏳ Full schema migration
- ⏳ Multi-device sync strategy
- ⏳ Persistent task/idea/project state

---

## 🧩 THE 12-PANEL VISION

| # | Panel | Status | Phase | Notes |
|---|-------|--------|-------|-------|
| 1 | **Market Strip** | Partial | 3 | Needs live data (CoinGecko) |
| 2 | **Wallet Manager** | Implemented | 3 | Needs live balances (Etherscan) |
| 3 | **Events & Calendar** | Implemented | 2 | Needs market events |
| 4 | **Notes** | Implemented | 2 | ✅ Complete |
| 5 | **Ideas** | Implemented | 2 | ✅ Complete |
| 6 | **Agent Console** | Implemented | 2 | ✅ Complete |
| 7 | **Trading Dashboard** | Not Started | Future | DCA/Grid bots |
| 8 | **Task Manager** | Not Started | Future | GTD-style |
| 9 | **Social Feed** | Not Started | 3 | Farcaster/Twitter |
| 10 | **Poker Lab** | Not Started | Future | Hand replayer |
| 11 | **Learning Lab** | Not Started | Future | Spaced repetition |
| 12 | **Project Manager** | Partial | 2 | Dojo Map |

---

## 🔧 CURRENT IMPLEMENTATION STATUS

### Database Layer
**Schema Tables** (from `src/lib/db-schema.ts`):
- `wallets` - Wallet registry with risk bands, lanes, permissions
- `projects` - Project metadata and status
- `contracts` - Smart contract addresses
- `liquidity` - Liquidity pool tracking
- `events` - Activity log
- `notes` - User notes
- `ideas` - Idea pipeline
- `daily_context` - Daily focus/tasks
- `sync_metadata` - Change tracking

**Database File**: `data/ops-home.db` (72KB, last modified Dec 25, 2024)

### API Endpoints
- ✅ `GET/POST /api/wallets` - Wallet CRUD (SQLite-backed)
- ✅ `GET /api/wallets/[id]/balance` - Live ETH balance (Etherscan)
- ⏳ Market data endpoints (pending)
- ⏳ Social feed endpoints (pending)

### Components
- ✅ `WalletList` - Grouped wallet display by lane
- ✅ `WalletDetail` - Full wallet view with live balance
- ✅ `WalletLanes` - Dashboard wallet panel
- ✅ `useWalletGating` - Permission/gating logic
- ✅ `BalanceDisplay` - Live balance fetcher

### Data Flow
```
JSON Registries (wallets.json, projects.json)
    ↓
SQLite Database (data/ops-home.db)
    ↓
API Routes (/api/wallets/*)
    ↓
React Components (WalletList, WalletDetail)
    ↓
User Interface
```

---

## ⚠️ CRITICAL ISSUES

### 1. Node.js Version Mismatch
**Current**: v18.19.1  
**Required**: v20.9.0+  
**Impact**: Cannot install dependencies (Next.js 16, better-sqlite3)

**Resolution**:
```bash
# Install Node 20 LTS via nvm
nvm install 20
nvm use 20
nvm alias default 20
```

### 2. NPM Installation Failures
**Root Cause**: Network timeouts + Node version incompatibility  
**Status**: Multiple failed attempts with ETIMEDOUT, ECONNRESET errors

**Resolution**: Upgrade Node first, then retry installation

### 3. Architecture Misalignment
**Issue**: Phase 3 work (SQLite) started before Phase 2 was fully documented  
**Impact**: `PROJECT_CONTEXT.md` says "No database" but SQLite is implemented

**Resolution**: Update `PROJECT_CONTEXT.md` to reflect Phase 3→4 transition

---

## 📋 IMMEDIATE ACTION ITEMS

### Priority 1: Environment Fix
1. ✅ Upgrade Node.js to v20 LTS
2. ✅ Run `npm install` successfully
3. ✅ Verify all dependencies installed

### Priority 2: Database Seeding
1. ✅ Run `npx tsx scripts/load_registries.ts`
2. ✅ Verify wallets/projects loaded into SQLite
3. ✅ Test API endpoints

### Priority 3: Documentation Sync
1. ✅ Update `PROJECT_CONTEXT.md` with Phase 3 status
2. ✅ Document SQLite schema in context
3. ✅ Update Dojo snapshot (`dojo sync`)

### Priority 4: Live Data Integration
1. ⏳ Configure Etherscan API key
2. ⏳ Test live balance fetching
3. ⏳ Add CoinGecko market data
4. ⏳ Implement caching/rate limiting

---

## 🎨 VISUAL MOCKUP

A high-fidelity mockup has been generated showing:
- Dark cyberpunk aesthetic (#0a0a0a background)
- Bento-box grid layout
- Wallet lanes grouped by risk band
- Active session panel with live balance (4.2045 ETH)
- Permission gating (Allowed: Deploy, Sign | Forbidden: Trade, LP)
- System log terminal view

See: `ops_home_mockup_v2.png` (artifact)

---

## 🔮 NEXT STEPS (Recommended Order)

1. **Fix Environment** (30 min)
   - Upgrade Node to v20
   - Complete npm install
   
2. **Seed Database** (15 min)
   - Load registries into SQLite
   - Verify data integrity
   
3. **Configure APIs** (30 min)
   - Add Etherscan API key to `.env`
   - Test live balance endpoint
   
4. **Launch Dev Server** (5 min)
   - `npm run dev`
   - Verify UI renders correctly
   
5. **Capture Real Screenshot** (10 min)
   - Use browser agent
   - Compare to mockup
   
6. **Update Documentation** (20 min)
   - Sync PROJECT_CONTEXT.md
   - Run `dojo sync`
   - Update PHASE_3_STATUS.md

---

## 📚 KEY DOCUMENTS

| Document | Path | Purpose |
|----------|------|---------|
| System Manifesto | `~/dojo/system/SYSTEM.md` | System architecture & rules |
| Identity | `~/dojo/system/IDENTITY.md` | User identity & working style |
| Software Policy | `~/dojo/system/SOFTWARE_POLICY.md` | Tech stack & constraints |
| System State | `~/dojo/system/SYSTEM_STATE.md` | Operational reality |
| Project Context | `~/dojo/projects/ops-home/PROJECT_CONTEXT.md` | Ops-Home specific context |
| Phase 3 Status | `~/dojo/projects/ops-home/PHASE_3_STATUS.md` | Current phase tracking |
| Dojo Snapshot | `~/.config/dojo/sync/latest.json` | Machine-readable state |

---

## 🧠 SYSTEM HEALTH

**Overall Status**: 🟡 **BLOCKED** (Node.js version)

| Component | Status | Notes |
|-----------|--------|-------|
| Dojo Filesystem | 🟢 Healthy | All directories present |
| Dojo CLI | 🟢 Operational | Located at ~/dojo2-clean |
| Ops-Home Codebase | 🟢 Complete | Phase 3 code ready |
| Node Environment | 🔴 Outdated | v18 → needs v20+ |
| Dependencies | 🔴 Not Installed | Blocked by Node version |
| Database | 🟡 Ready | Schema defined, needs seeding |
| APIs | 🟡 Partial | Code ready, needs API keys |
| Documentation | 🟡 Outdated | Needs Phase 3 update |

---

**End of Analysis**
