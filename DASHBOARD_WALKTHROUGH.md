# DASHBOARD_WALKTHROUGH.md

## Repo Structure (Functional Overview)

- **app/**
  - `page.tsx`: Main dashboard UI (home screen, panels, recent activity)
  - `globals.css`: Global styles
  - `api/`: API routes for CRUD (wallets, events, notes, ideas, agent, etc.)
  - `auth/`: (Unused for single-user, local-only)
  - `(protected)/`: (Unused for single-user, local-only)
- **components/**
  - `WalletLanes.tsx`: Wallet CRUD and quick editing
  - `WalletBriefing.tsx`: Wallet details and balance
  - `EventsPanel.tsx`: Event/calendar CRUD
  - `NotesPanel.tsx`: Notes CRUD
  - `IdeasPanel.tsx`: Ideas CRUD and status cycling
  - `SnippetsPanel.tsx`: Code snippet search/view
  - `MarketStrip.tsx`: Crypto market prices
  - `DojoMap.tsx`: Project list/status
  - `AgentConsole.tsx`: Daily planning, risk audit, market scan (stubbed agent)
- **lib/**
  - Data types, API client, DB sync helpers, etc.
- **prisma/**
  - `schema.prisma`: SQLite DB schema for all core objects
- **public/**
  - Icons and static assets
- **tests/**
  - `ui.spec.ts`: Playwright workflow tests for dashboard

---

## Guided Walkthrough: Dashboard Usage

### 1. Home Screen
- On load, you see a 3-column dashboard:
  - **Left:** Market prices, wallet lanes (edit, select, view details)
  - **Center:** Events panel (view, add, edit, delete events for today/tomorrow/+2)
  - **Right:** Notes, ideas, and code snippets (full CRUD, search/filter)

### 2. Recent Activity
- Below the main panels, you see:
  - **Today's Events:** All events scheduled for today
  - **Recent Notes:** Last 3 notes added
  - **Recent Ideas:** Last 3 ideas, with status

### 3. Wallets
- Add, edit, or delete wallets in WalletLanes
- Click a wallet to see details in WalletBriefing (address, provider, persona, rules, balance)

### 4. Events
- Add new events (label, time, importance, type)
- Edit or delete events directly in EventsPanel
- Events are grouped by day (today, tomorrow, +2)

### 5. Notes
- Add, edit, or delete notes in NotesPanel
- Recent notes are shown on the home screen

### 6. Ideas
- Add, edit, or delete ideas in IdeasPanel
- Click status to cycle between “idea”, “shaping”, “live”
- Recent ideas are shown on the home screen

### 7. Snippets
- Search and view code snippets in SnippetsPanel

### 8. Projects
- View all projects and their status in DojoMap

### 9. Agent Console
- Use AgentConsole for daily planning, risk audit, or market scan (stubbed, no real LLM)

### 10. Workflow
- All panels support full CRUD (create, read, update, delete)
- No authentication, teams, or sharing—single-user only
- All changes are persisted locally via SQLite (Prisma)
- UI is clean, with no dead panels or placeholders

### 11. Testing
- Workflow tests (tests/ui.spec.ts) cover all main user flows

---

**Summary:**
Expect a clean, single-user dashboard for crypto ops, with full CRUD for all objects, recent activity highlights, and a modular UI. All data is local, and the workflow is optimized for daily use and planning.
