# ops-home

## Short Description
Ops-Home is a single-user, local-first digital cockpit for crypto operations and daily life.  
It consolidates wallets, schedules, ideas, notes, market awareness, and an AI co-pilot into a dense, 12-panel dashboard designed for high-intensity execution.

This is the primary interface for operating the Dojo.

---

## Goal (Now)
**Phase 3 → Phase 4: Eyes & Memory**

- **Phase 3 (In Progress):** Integrate external APIs  
  - ✅ SQLite database layer
  - ✅ Wallet registry with risk bands & permissions
  - ✅ Live balance API endpoint (Etherscan)
  - ⏳ Market data (CoinGecko)  
  - ⏳ Social feeds (Farcaster/Twitter)  
  - ⏳ Market events  

- **Phase 4 (Partially Started):** Long-term memory  
  - ✅ SQLite + better-sqlite3
  - ✅ Database schema (wallets, projects, contracts, liquidity)
  - ⏳ Multi-device sync  
  - ⏳ Persistent task + idea + project state  

**Current Status**: Database-first architecture implemented. UI components ready. Blocked by Node.js version (need v20+).

---

## Vision (Finished State)
A 12-panel command center that feels like a trading terminal for your entire life:

- **Top:** Market Strip (ambient awareness)  
- **Left:** Wallets + Trading  
- **Center:** Time + Tasks  
- **Right:** Notes + Ideas + Social Signal  
- **Bottom:** AI Co-Pilot with full system context  

Everything comes to you.  
No tab-switching.  
No fragmentation.

---

## Architecture

### Current (Phase 3→4)
- **Framework**: Next.js 16 (App Router)  
- **UI**: React 19 + Tailwind CSS 4  
- **Language**: TypeScript (strict)  
- **Database**: SQLite (`data/ops-home.db`) via better-sqlite3
- **Schema Validation**: Zod
- **Data Flow**:
  ```
  JSON Registries (wallets.json, projects.json)
      ↓
  SQLite Database (data/ops-home.db)
      ↓
  API Routes (/api/wallets/*, /api/projects/*)
      ↓
  React Components
      ↓
  User Interface
  ```

### Data Layer
- **Primary Storage**: SQLite database
- **Schemas**: Defined in `src/lib/db-schema.ts`
- **Tables**: wallets, projects, contracts, liquidity, events, notes, ideas, daily_context, sync_metadata
- **Type Safety**: Zod schemas in `src/lib/wallets.ts` and `src/lib/projects.ts`

### External Integrations
- **Etherscan API**: Live wallet balances
- **CoinGecko API**: Market data (planned)
- **Farcaster/Twitter**: Social feeds (planned)

---

## Panel Breakdown (12 Panels)

### **Panel 1: Market Strip (Top Bar)** ✅ IMPLEMENTED
Ambient situational awareness: BTC/ETH/SOL prices, branding, live clock.  
**Component**: `MarketStripEnhanced.tsx`  
**Status**: Complete with live ticker and time display.

### **Panel 2: Wallet Manager (Left Column)** ✅ IMPLEMENTED
Risk-banded wallets grouped by lane (Identity, Trading, Treasury, LP).  
**Component**: `WalletManager.tsx`  
**Status**: Complete with collapsible lanes, selection state, risk badges.

### **Panel 2b: Active Session (Right Column)** ✅ IMPLEMENTED
Detailed view of selected wallet with live balance and permission gating.  
**Component**: `ActiveSession.tsx`  
**Status**: Complete with allowed/forbidden actions and dapps display.

### **Panel 3: Events & Calendar (Center Column)** ✅ SCAFFOLDED
3-day tactical view: Today / Tomorrow / +2.  
**Component**: `CalendarPanel.tsx`  
**Status**: Basic implementation. Needs market events integration.

### **Panel 4: Notes (Center Column)** ✅ SCAFFOLDED
Frictionless capture + search.  
**Component**: `NotesPanelEnhanced.tsx`  
**Status**: Quick capture implemented. Needs database persistence.

### **Panel 5: Ideas (Right Column)** ✅ SCAFFOLDED
Idea → Shaping → Live pipeline.  
**Component**: `IdeasPanelEnhanced.tsx`  
**Status**: Status badges implemented. Needs database persistence.

### **Panel 6: System Log (Center Column)** ✅ IMPLEMENTED
Terminal-style activity log with color-coded levels.  
**Component**: `SystemLog.tsx`  
**Status**: Complete with auto-scroll and log filtering.

### **Panel 7: Trading Dashboard** ⏳ NOT STARTED
Execution layer: DCA/Grid bots, manual trades.  
**Status**: Future phase.

### **Panel 8: Task Manager** ⏳ NOT STARTED
GTD-style tasks, subtasks, timers.  
**Status**: Future phase.

### **Panel 9: Social Feed Aggregator** ⏳ NOT STARTED
Curated signal: Farcaster, Twitter lists, RSS.  
**Status**: Future phase.

### **Panel 10: Poker Lab** ⏳ NOT STARTED
Deliberate practice: hand replayer, ranges, tracking.  
**Status**: Future phase.

### **Panel 11: Learning Lab** ⏳ NOT STARTED
Spaced repetition for skills (Solidity, trading).  
**Status**: Future phase.

### **Panel 12: Project Manager (Right Column)** ✅ SCAFFOLDED
Strategic view of all active projects.  
**Component**: `ProjectManager.tsx`  
**Status**: Grid layout implemented. Needs database integration.

---

### **Dojo Integration Boundary**

- **Global knowledge canonical**: `~/dojo/knowledge`.
- **Ops-home local docs**: `~/dojo/projects/ops-home/knowledge`.
- **App data**: `~/dojo/projects/ops-home/data/ops-home.db` and JSON registries in this project.
- **Rules**: 
  - Ops-home must not create durable state outside these locations and the Dojo paths defined in `SYSTEM.md`.
  - **Ideas**: `~/dojo/knowledge/inbox/ideas.json` is canonical; the `ideas` table in SQLite is a cached view.
  - **Daily focus**: `~/dojo/system/calendar/day_plan-YYYY-MM-DD.json` is canonical; the `daily_context` table is a cached view.

---

## API Endpoints

### Implemented
- `GET /api/wallets` - Fetch all wallets from SQLite
- `POST /api/wallets` - Add or update wallet
- `GET /api/wallets/[id]/balance` - Fetch live ETH balance via Etherscan

### Planned
- `GET /api/projects` - Fetch all projects
- `GET /api/market` - Market data (CoinGecko)
- `GET /api/events` - Calendar events
- `POST /api/notes` - Create/update notes
- `POST /api/ideas` - Create/update ideas

---

## Tech / Environment
- **Languages**: TypeScript, Node.js  
- **Tools**: Next.js App Router, TailwindCSS, better-sqlite3, Zod  
- **Node Version**: Requires v20.9.0+ (currently v18.19.1 - **BLOCKER**)
- **Canonical Path**:  
  ```
  ~/dojo/projects/ops-home
  ```

---

## Constraints
- Use WSL paths only  
- No silos  
- All state must live under `~/dojo` or in documented databases  
- All changes must be logged (activity_log)  
- Agents must follow Dojo protocols  

---

## Implementation Status

### ✅ Complete
1. Database schema and singleton
2. Wallet API routes (SQLite-backed)
3. Live balance endpoint
4. Enhanced UI components (Market Strip, Wallet Manager, Active Session, System Log)
5. Zod type schemas
6. JSON registries

### ⏳ In Progress
1. Node.js upgrade (v18 → v20+)
2. Database seeding script
3. Panel scaffolding (Calendar, Notes, Ideas, Projects)

### 🔜 Next Steps
1. Fix Node.js version
2. Complete `npm install`
3. Seed database with registries
4. Configure Etherscan API key
5. Test dashboard page
6. Implement remaining API endpoints

---

## Open Questions
None currently.
