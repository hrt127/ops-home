# ops-home
Short description: ops-home project inside dojo workspace. 12-panel dashboard for managing the Dojo.

## Goal (now)
Phase 2: Wiring Ops-Home to Dojo Automation Layer.
Specifics:
- Daily Focus Panel & API
- Inbox/Ideas Panel & API
- Shared Activity Logging

## Architecture
- **No Database**: State is stored in JSON/Markdown files in `~/dojo/system` and `~/dojo/knowledge`.
- **APIs**: Next.js Route Handlers (`src/app/api/*`) Interface with the filesystem.
- **Frontend**: React Context (`DojoContext`) + Panels.

## Data Schemas

### Daily Focus
File: `~/dojo/system/calendar/day_plan-YYYY-MM-DD.json`
Used by: `/api/daily-focus`, `DailyFocusPanel`
```json
{
  "date": "YYYY-MM-DD",
  "tasks": [
    { "id": "uuid", "text": "Task description", "done": boolean }
  ]
}
```

### Ideas / Inbox
File: `~/dojo/knowledge/inbox/ideas.json`
Used by: `/api/inbox`, `IdeasInboxPanel` (IdeasPanel)
```json
{
  "items": [
    { "id": "uuid", "text": "Idea text", "tags": [], "status": "open" | "promoted" }
  ]
}
```

### Activity Log
File: `~/dojo/knowledge/threads/activity_log.ndjson`
Append-only log of system actions.
Format: `{"timestamp": "...", "action": "focus:add", "details": {...}}`

### Events / Alerts
Files: `~/dojo/system/market_events/` (JSON files), `~/dojo/system/bot_schedule.json`
API: `/api/events`
- Returns united view of schedule windows and alerts (from log errors).
- POST { action: 'dismiss', id } to dismiss alerts (logged).

### Market Strip
File: `~/dojo/system/market_pairs.json`
API: `/api/market-strip`
- POST { pairs: string[] } to update tracked pairs.
- Returns stubbed price/funding data for now.

### Wallets
File: `~/dojo/system/wallets.json`
API: `/api/wallets`
- GET/POST to manage wallet inventory.
- Returns stubbed balance data.

## Tech / environment
- Languages: TypeScript, Node.js
- Key tools: Next.js App Router, TailwindCSS
- Location on disk: /home/heart/dojo/apps/ops-home

## Constraints
- Use WSL paths.
- No SQL database.
- Log meaningful actions to activity_log.

## Open questions
- None currently.
