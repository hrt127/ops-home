# Ops-Home

**Personal Command Center for Crypto Operations & Daily Life**

Version: Phase 3→4 (Eyes & Memory)  
Status: ✅ Implementation Complete (Awaiting Node.js v20)

---

## What is Ops-Home?

Ops-Home is a single-user, local-first digital cockpit that consolidates:
- Wallet management with risk bands & permission gating
- Live market data & price tracking
- Task management & calendar
- Note capture & idea pipeline
- Trading operations (DCA/Grid bots)
- Learning progress (spaced repetition)
- Social feed aggregation (Farcaster, Twitter)
- Poker hand tracking & analysis
- Project oversight & management
- System monitoring & logs

**Everything in one place. No tab-switching. No fragmentation.**

---

## Quick Start

### Prerequisites
- Node.js v20.9.0+ (REQUIRED)
- npm 9+
- SQLite3

### Installation

```bash
# 1. Upgrade Node.js (if needed)
nvm install 20
nvm use 20
nvm alias default 20

# 2. Install dependencies
npm install

# 3. Seed database
npx tsx scripts/load_registries.ts

# 4. Configure API keys (optional)
echo "ETHERSCAN_API_KEY=your_key_here" >> .env

# 5. Start development server
npm run dev
```

### Access Dashboard

Open `http://localhost:3000/dashboard` in your browser.

---

## The 12-Panel Cockpit

```
┌─────────────────────────────────────────────┐
│  Market Strip (Live Prices, Clock)          │
├───────────┬─────────────────┬───────────────┤
│  Wallet   │  Calendar       │  Active       │
│  Manager  │  Notes          │  Session      │
│  Trading  │  Tasks          │  Ideas        │
│  (3 cols) │  System Log     │  Social       │
│           │  (5 cols)       │  Learning     │
│           │                 │  Projects     │
│           │                 │  Poker        │
│           │                 │  (4 cols)     │
└───────────┴─────────────────┴───────────────┘
```

### Panel Overview

1. **Market Strip** - Ambient market awareness
2. **Wallet Manager** - Risk-banded wallet lanes
3. **Active Session** - Selected wallet with permissions
4. **Calendar** - 3-day tactical view
5. **Notes** - Frictionless capture
6. **System Log** - Activity monitoring
7. **Trading Dashboard** - Bot management & P&L
8. **Task Manager** - GTD-style tasks
9. **Social Feed** - Curated signal
10. **Poker Lab** - Deliberate practice
11. **Learning Lab** - Spaced repetition
12. **Project Manager** - Strategic oversight

---

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS 4
- **Database**: SQLite (better-sqlite3)
- **Type Safety**: TypeScript 5 + Zod
- **ORM**: Prisma 5.8.0

### Data Flow
```
User Input → React Components → API Routes → SQLite Database
                                          ↓
                                External APIs (Etherscan, CoinGecko)
```

### Directory Structure
```
ops-home/
├── src/
│   ├── app/
│   │   ├── dashboard/page.tsx        # Main dashboard
│   │   └── api/                      # API routes
│   ├── components/                   # 12 panel components
│   ├── lib/                          # Database, schemas, utilities
│   └── hooks/                        # React hooks
├── data/
│   └── ops-home.db                   # SQLite database
├── knowledge/                        # Templates, guides, patterns
├── scripts/                          # Database seeding, utilities
├── wallets.json                      # Wallet registry (genesis)
├── projects.json                     # Project registry (genesis)
└── package.json
```

---

## Documentation

### Quick Reference
- **[Documentation Index](DOCUMENTATION_INDEX.md)** - Complete doc map
- **[How to Use Ops-Home](knowledge/guides/how_to_use_ops_home.md)** - User guide
- **[Implementation Guide](IMPLEMENTATION_GUIDE.md)** - Technical docs
- **[Complete Status](COMPLETE_IMPLEMENTATION_STATUS.md)** - Current state

### For Developers
- [Implementation Guide](IMPLEMENTATION_GUIDE.md) - Component details, API docs
- [System Analysis](SYSTEM_ANALYSIS.md) - Architecture overview
- [Project Context](PROJECT_CONTEXT.md) - Goals, phases, constraints

### For Users
- [How to Use Ops-Home](knowledge/guides/how_to_use_ops_home.md) - Complete guide
- [Knowledge Patterns](knowledge/patterns/knowledge_patterns.md) - Best practices
- [Templates](knowledge/templates/) - Note, thread, prompt templates

---

## Features

### ✅ Implemented
- 12-panel dashboard with responsive grid
- SQLite database with 9 tables
- Wallet management with risk bands & lanes
- Permission gating (allowed/forbidden actions)
- Live balance fetching (Etherscan)
- Task management with GTD workflow
- Note capture with timestamps
- Idea pipeline (Idea → Shaping → Live)
- Learning lab with spaced repetition
- Trading dashboard with P&L tracking
- Social feed aggregation
- Poker hand tracking
- Project manager
- System log with color-coded levels
- Calendar with importance levels
- Knowledge base integration

### ⏳ Planned
- Market data integration (CoinGecko)
- Social feed live updates (Farcaster/Twitter)
- Multi-device sync
- Keyboard shortcuts
- Panel customization
- Search functionality
- Notifications
- Data export/import
- AI co-pilot integration

---

## Database Schema

### Tables
- `wallets` - Wallet registry (risk bands, lanes, permissions)
- `projects` - Project metadata
- `contracts` - Smart contract addresses
- `liquidity` - LP positions
- `events` - Activity log
- `notes` - User notes
- `ideas` - Idea pipeline
- `daily_context` - Daily focus/tasks
- `sync_metadata` - Change tracking

### Seeding
```bash
npx tsx scripts/load_registries.ts
```

This loads `wallets.json` and `projects.json` into the database.

---

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:reset     # Reset database (Prisma)
```

### Environment Variables

Create `.env` file:
```bash
ETHERSCAN_API_KEY=your_key_here
COINGECKO_API_KEY=your_key_here  # Optional
```

---

## Design System

### Colors
- **Cyan** (#22d3ee) - Primary actions
- **Emerald** (#34d399) - Success, allowed, safe
- **Amber** (#fbbf24) - Warning, medium risk
- **Rose** (#fb7185) - Error, forbidden, high risk
- **Purple** (#c084fc) - LP lane, special features

### Typography
- **Headers**: Bold, uppercase, tracking-wide
- **Data**: Monospace for addresses, balances
- **UI**: Clean sans-serif

### Panel Structure
All panels follow a consistent structure:
- Gradient header with icon & title
- Content area with padding
- Optional footer with stats/actions

---

## Workflows

### Morning Routine
1. Check Market Strip for overnight moves
2. Review Calendar for today's events
3. Check System Log for alerts
4. Review Tasks for today

### Wallet Operation
1. Select wallet from Wallet Manager
2. Review permissions in Active Session
3. Verify allowed actions
4. Proceed with operation

### Idea Capture
1. Type idea in Ideas panel
2. Set initial status (Idea)
3. Move to Shaping when ready
4. Move to Live when deployed

---

## Troubleshooting

### Panel not loading?
- Check System Log for errors
- Refresh the page
- Verify API endpoints

### Data not saving?
- Check database connection
- Review browser console
- Verify API responses

### Balance not updating?
- Check Etherscan API key in `.env`
- Verify wallet address
- Review rate limits

---

## Contributing

This is a personal project, but feedback is welcome!

1. Review [Implementation Guide](IMPLEMENTATION_GUIDE.md)
2. Check [Complete Status](COMPLETE_IMPLEMENTATION_STATUS.md)
3. Follow existing patterns
4. Update documentation

---

## License

Personal use only. Not for redistribution.

---

## Acknowledgments

- Built with Next.js, React, and Tailwind CSS
- Inspired by trading terminals and command centers
- Part of the Machi Samurai Dojo system

---

## Links

- **Dojo System**: `~/dojo`
- **Dojo CLI**: `~/dojo2-clean`
- **System Docs**: `~/dojo/system/`
- **Knowledge Base**: `~/dojo/knowledge/`

---

**Version**: Phase 3→4 (Eyes & Memory)  
**Status**: ✅ Implementation Complete  
**Next**: Node.js v20 upgrade → Launch

**Built by**: Antigravity (Claude 4.5 Sonnet)  
**Date**: 2026-01-31
