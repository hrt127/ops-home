# Ops-Home (Layer 2)

**The Cockpit for the Dojo.**

A local-first dashboard for high-intensity crypto operations, finance, and knowledge management.

*   **Location**: `~/dojo/projects/ops-home`
*   **Tech Stack**: Next.js 15+, SQLite, Tailwind v4.
*   **Role**: Primary UI for the Operator (Heart).

## Quick Start
```bash
cd ~/dojo/projects/ops-home
npm install
npm run dev
# Visit http://localhost:3000
```

## Contracts & Data
See `OPS-HOME_CONTRACT.md`. This app reads from Layr 1 (`~/dojo`) but owns its local state (`data/ops-home.db`).
