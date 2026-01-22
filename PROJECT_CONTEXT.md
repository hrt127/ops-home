# ops-home

## Short Description
Ops-Home is a single-user, local-first digital cockpit for crypto operations and daily life.  
It consolidates wallets, schedules, ideas, notes, market awareness, and an AI co-pilot into a dense, 12-panel dashboard designed for high-intensity execution.

This is the primary interface for operating the Dojo.

---

## Goal (Now)
**Phase 3 → Phase 4 Transition**

- **Phase 3:** Integrate external APIs  
  - Market data (CoinGecko)  
  - Wallet balances (Etherscan/Alchemy)  
  - Social feeds (Farcaster/Twitter)  
  - Market events  

- **Phase 4:** Add long-term memory  
  - SQLite + Prisma  
  - Multi-device sync  
  - Persistent task + idea + project state  

Ops-Home is already production-ready for local use (Phase 2).  
The next phases give it *eyes* (live data) and *memory* (database).

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

### Current (Phase 2)
- Next.js 16 (App Router)  
- React 19  
- Tailwind CSS 4  
- TypeScript (strict)  
- Local persistence (localStorage)  
- Next.js Route Handlers for filesystem APIs  
- No database  

### Intended (Phase 3–4)
- SQLite + Prisma  
- External API integrations  
- Unified data layer (`dojo-sync.ts`)  
- Server Actions for snapshot + system file access  
- Event-driven updates (activity log, alerts)  

---

## Panel Breakdown (12 Panels)

### **1. Market Strip (Top Bar)**
Ambient situational awareness: BTC/ETH/SOL, gas, fear/greed, funding rates.  
**Phase:** Partial → needs live data.

### **2. Wallet Manager (Left Column)**
Risk-banded wallets: SAFE / OPS / SPEC.  
**Phase:** Implemented → needs live balances.

### **3. Events & Calendar (Center Column)**
3-day tactical view: Today / Tomorrow / +2.  
**Phase:** Implemented → needs market events.

### **4. Notes (Right Column – Top)**
Frictionless capture + search.  
**Phase:** Implemented.

### **5. Ideas (Right Column – Middle)**
Idea → Shaping → Live pipeline.  
**Phase:** Implemented.

### **6. Agent Console (Bottom)**
AI co-pilot with system context.  
Modes: Daily Plan, Risk Audit, Market Scan.  
**Phase:** Implemented.

### **7. Trading Dashboard**
Execution layer: DCA/Grid bots, manual trades.  
**Phase:** Not started.

### **8. Task Manager**
GTD-style tasks, subtasks, timers.  
**Phase:** Not started.

### **9. Social Feed Aggregator**
Curated signal: Farcaster, Twitter lists, RSS.  
**Phase:** Not started.

### **10. Poker Lab**
Deliberate practice: hand replayer, ranges, tracking.  
**Phase:** Not started.

### **11. Learning Lab**
Spaced repetition for skills (Solidity, trading).  
**Phase:** Not started.

### **12. Project Manager (Dojo Map)**
Strategic view of all active projects.  
**Phase:** Partial.

---

## Data Sources

### **Primary**
- `~/.config/dojo/sync/latest.json`  
  Identity, system, projects, tasks, ideas, notes.

### **System JSON**
- `~/dojo/system/wallets.json`  
- `~/dojo/system/market_pairs.json`  
- `~/dojo/system/bot_schedule.json`  
- `~/dojo/system/market_events/*.json`  

### **Knowledge**
- `~/dojo/knowledge/inbox/ideas.json`  
- `~/dojo/knowledge/threads/activity_log.ndjson`  
- `~/dojo/knowledge/notes/*.md`  

---

## Phase 2 Data Schemas (Legacy but Active)

### Daily Focus
File: `~/dojo/system/calendar/day_plan-YYYY-MM-DD.json`
Used by: `/api/daily-focus`, `DailyFocusPanel`

```json
{
  "date": "YYYY-MM-DD",
  "tasks": [
    { "id": "uuid", "text": "Task description", "done": false }
  ]
}
```

### Ideas / Inbox
File: `~/dojo/knowledge/inbox/ideas.json`
Used by: `/api/inbox`, `IdeasInboxPanel`

```json
{
  "items": [
    { "id": "uuid", "text": "Idea text", "tags": [], "status": "open" }
  ]
}
```

### Activity Log
File: `~/dojo/knowledge/threads/activity_log.ndjson`  
Append-only log of system actions.

### Events / Alerts
Files:  
- `~/dojo/system/market_events/*.json`  
- `~/dojo/system/bot_schedule.json`  

### Market Strip
File: `~/dojo/system/market_pairs.json`

### Wallets
File: `~/dojo/system/wallets.json`

---

## Tech / Environment
- Languages: TypeScript, Node.js  
- Tools: Next.js App Router, TailwindCSS  
- Canonical Path:  
  ```
  ~/dojo/projects/ops-home
  ```

---

## Constraints
- Use WSL paths only  
- No silos  
- All state must live under `~/dojo`  
- All changes must be logged (activity_log)  
- Agents must follow Dojo protocols  

---

## Open Questions
None currently.

