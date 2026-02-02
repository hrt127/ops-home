# Ops-Home

**Your Local-First Operating System for Bets, Work, and Intelligence**

Version: v0.2-alpha  
Status: 🚧 Active Development | Core Foundation Built | Integrations In Progress

---

## What is Ops-Home?

Ops-Home is a **local-first command OS** that unifies your entire operational stack into one rules-driven cockpit:

- **Capital & Bots**: Wallet lanes, Freqtrade bots, positions, and risk management
- **Markets & Intelligence**: Smart-money tracking, ELFA narratives, social signals, and market data
- **Time & Strategy**: Calendar-driven scenarios for options, sports, crypto cycles, and events
- **Knowledge & Learning**: Notes, study queues, and integrated poker RL lab
- **Agents & Automation**: LLM agents, research copilots, and experiment tracking

Instead of juggling 10+ tools (portfolio trackers, smart-money dashboards, calendars, journals, trading bots), you get **one cockpit** where now/when/how much/why all line up around explicit scenarios and calendars—not vibes.

---

## Core Capabilities

### 💰 Capital, Risk & Bots

- **Wallet lanes**: Group wallets by risk bands (cold/core/tactical/degen) with exposure views
- **Freqtrade integration**: Monitor bot status, PnL, drawdown, and regime; link to global risk state and calendar events
- **Positions & exposure**: Aggregate holdings across chains into narrative-level views
- **Permission gating**: Explicit allowed/forbidden actions per wallet

### 🎯 Narratives, Smart-Money & Social

- **ELFA narrative tracking**: EPL/Base/DeFi stories with state (building/mature/topping/dead) and scores
- **Smart-money module**: Integrate [smart-money-dashboard](https://github.com/hrt127/smart-money-dashboard) outputs plus on-chain + Farcaster flows
- **Social signal layer**: Quantified Farcaster/Twitter engagement per narrative—not raw doomscroll feeds

### 📅 Calendar, Options & Scenarios

- **Event & Scenario Engine**: Models events (fixtures, OpEx, unlocks, macro) and scenarios (EPL title race, BTC halving, options campaigns)
- **Signals & Rules**: ΔxPts, odds/xG, IV, bot states → ADD/HOLD/EXIT/PREP_TASK recommendations
- **Options panel**: Explicit structures (calendar spreads, condors) with expiries and review checkpoints tied to calendar

### 📝 Tasks, Knowledge, Journaling & Learning

- **Tasks/System Log**: GTD-style tasks driven by events, rules, and manual entries
- **Knowledge & Notes**: Models, playbooks, study queues linked to scenarios and stats
- **Journal & Review**: Daily/weekly review blocks that feed a change backlog for systematic iteration

### 🤖 Agents, Poker Lab & AI Control

- **Agent & LLM Control Center**: Track Freqtrade analyzers, doc agents, narrative digests, poker RL experiments
- **Poker RL Lab**: Train and evaluate poker agent via self-play for off-table study and meta-skill development (discipline, tilt, sizing)
- **AI-assisted analysis**: LLM summaries of sessions, anomalies, and study queues

---

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **UI**: Tailwind CSS 4
- **Database**: SQLite (local) / PostgreSQL (deployed) via Prisma 5.8
- **Type Safety**: TypeScript 5 + Zod
- **Deployment**: Local-first; Vercel-ready for cloud deployment

---

## Quick Start

### Prerequisites

- Node.js v20.9.0+
- npm 9+
- SQLite3 (local) or PostgreSQL connection (deployed)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/hrt127/ops-home.git
cd ops-home

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your API keys and database URL

# 4. Initialize database
npx prisma migrate dev
npx prisma generate

# 5. Seed initial data (optional)
npx tsx scripts/load_registries.ts

# 6. Start development server
npm run dev
```

### Access Dashboard

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) in your browser.

---

## Current Implementation Status

### ✅ Core Foundation (Built)

- Next.js 16 app with TypeScript + Tailwind CSS 4
- Prisma schema with core models (Wallet, Event, Note, Idea, User, Team)
- Component library: 20+ panel components (WalletLanes, CalendarPanel, EventsPanel, NotesPanel, TaskManager, PokerLab, TradingDashboard, etc.)
- API routes: /api/wallets, /api/events, /api/agent, /api/market-strip, /api/freqtrade (stub)
- Dashboard layout with 12-panel grid system

### 🚧 In Progress (Active Development)

- **Freqtrade integration**: API client + bot status panel (stub exists, needs live connection)
- **Smart-money integration**: File readers for digest + signal_events.csv (planned)
- **ELFA narratives**: Narrative scoring model + panel (schema designed, UI pending)
- **Calendar ingestion**: Scenario JSON → events automation (scripts planned)
- **Options structures**: OptionStructure model + panel (schema pending)
- **Journal & review loop**: Daily/weekly review with change backlog (UI exists, automation pending)

### 📋 Planned (Next Steps)

- Calendar-driven scenario system with signals + rules engine
- Smart-money digest panel + event table
- Freqtrade bot control + regime switching
- Narrative score computation + social sentiment layer
- Poker RL lab integration (training outputs → study queue)
- Agent orchestration + experiment tracking
- Global risk state governor (RISK_OFF / NORMAL / AGGRESSIVE)
- Weekly journal review automation

---

## A Day in the Life with Ops-Home

**Morning: Align time, risk, and bots**
- Dashboard shows market strip, wallet lanes, Freqtrade bot states, and 3-day calendar
- Calendar highlights options structures and bot adjustments around today's events
- If DD/risk thresholds hit, system nudges into RISK_OFF mode

**Midday: Narratives, execution, context**
- Review ELFA narratives, smart-money flows, social heat per narrative
- Adjust positions based on structured scenarios and rules—every trade logs setup, scenario, and rule adherence

**Afternoon: Systems, learning, poker lab**
- Calendar-scheduled study blocks for trading, options, narratives, or poker
- Agent Center shows overnight analyzer outputs and suggested tweaks
- Poker RL Lab: inspect training runs and curated hands for off-table review

**Evening: Review, decisions, planning**
- Daily review panel aggregates trades, bot actions, events; LLM drafts summary
- Weekly (on set days): journal stats → change backlog
- Strategic calendar scan: upcoming clusters (fixtures, OpEx, unlocks) → confirm active scenarios

---

## System Improvements (Roadmap)

### 1. Global Risk Layer
- Single risk state (RISK_OFF / NORMAL / AGGRESSIVE) read by bots, options, manual trades
- Automated safety rails: DD triggers, volume spikes, circuit breakers
- Risk dashboard panel: current state, realized DD, VAR, active triggers

### 2. Journal → Strategy Pipeline
- Structured journal fields: setup, scenario, rule tag, size, outcome, emotional state
- Weekly "Journal Review" ritual: aggregate stats, LLM pattern detection, change backlog
- Change log + experiments panel: track active experiments with start date and success criteria

### 3. Narrative "Model of Models"
- Composite narrative score: `f(on-chain flows, smart-money, social engagement, price trend)`
- Sentiment as bounded factor: high sentiment reduces new risk, low + improving flows flags contrarian setups
- Narrative lab panel: scores over time, tradable vs watch-only, allowed instruments

### 4. Agent Roles & Boundaries
- Explicit agent permissions: purpose, inputs, allowed outputs, forbidden actions
- Agent evaluation loops: track PnL/error impact, promote or demote agent outputs
- Sandboxing for new agents: shadow mode predictions before influencing real rules

### 5. Poker Lab ↔ Trading Meta-Skills
- Shared skill metrics: tilt incidents, adherence, hero call frequency, revenge trades
- Cross-domain review: LLM compares poker + trading journals for shared leaks
- Pre-session checklists: mood, goals, risk bounds for both trading and poker

### 6. Strategy Density Calendar
- Overlay showing how many strategies (bots, structures, narratives) are active per day
- Flags days with too much overlap → pre-emptive simplification
- Hard-coded review cadences: daily wrap, weekly strategy review, monthly system health

---

## Documentation

### Quick Reference
- [Documentation Index](./DOCUMENTATION_INDEX.md) - Complete doc map
- [How to Use Ops-Home](./knowledge/guides/how_to_use_ops_home.md) - User guide
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md) - Technical docs
- [Complete Status](./COMPLETE_IMPLEMENTATION_STATUS.md) - Current state

### For Developers
- [System Analysis](./SYSTEM_ANALYSIS.md) - Architecture overview
- [Project Context](./PROJECT_CONTEXT.md) - Goals, phases, constraints
- [Build Protocol](./BUILD_PROTOCOL.md) - Development workflow

### For Users
- [Knowledge Patterns](./knowledge/patterns/knowledge_patterns.md) - Best practices
- [Templates](./knowledge/templates) - Note, thread, prompt templates

---

## Directory Structure

```
ops-home/
├── src/
│   ├── app/
│   │   ├── dashboard/           # Main dashboard page
│   │   ├── wallets/             # Wallet management pages
│   │   └── api/                 # API routes
│   │       ├── wallets/
│   │       ├── events/
│   │       ├── agent/
│   │       ├── freqtrade/
│   │       └── market-strip/
│   ├── components/              # React components
│   │   ├── WalletLanes.tsx
│   │   ├── CalendarPanel.tsx
│   │   ├── EventsPanel.tsx
│   │   ├── NotesPanel.tsx
│   │   ├── TaskManager.tsx
│   │   ├── PokerLab.tsx
│   │   ├── TradingDashboard.tsx
│   │   ├── AgentConsole.tsx
│   │   └── ...
│   ├── lib/                     # Utilities & DB client
│   └── hooks/                   # React hooks
├── prisma/
│   └── schema.prisma            # Database schema
├── scripts/                     # Data ingestion & automation
├── knowledge/                   # Guides, patterns, templates
├── data/                        # Local data & scenarios
└── docs/                        # Additional documentation
```

---

## Database Schema (Core Models)

```prisma
model Wallet {
  id        String   @id @default(uuid())
  name      String
  address   String?  @unique
  metadata  Json?    // risk band, permissions, etc.
  version   Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?
}

model Event {
  id         String   @id @default(uuid())
  title      String
  when_ts    DateTime
  importance Int      @default(0)
  metadata   Json?    // category, subtype, scenario_id, rules, etc.
  version    Int      @default(1)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  deletedAt  DateTime?
}

model Note {
  id        String   @id @default(uuid())
  title     String
  body      String
  metadata  Json?
  version   Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?
}

model Idea {
  id        String   @id @default(uuid())
  title     String
  body      String
  metadata  Json?
  status    String   @default("idea") // idea, shaping, live, done
  version   Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?
}

// Additional planned models:
// - Scenario, Trade, BotInstance, Narrative, NarrativeSignal, AgentRun, OptionStructure
```

---

## Related Projects

- [smart-money-dashboard](https://github.com/hrt127/smart-money-dashboard) - Smart-money tracking and daily digests (integrated as data source)
- Freqtrade bots - Automated crypto trading (integrated via REST API)
- Poker RL agent - Reinforcement learning poker trainer (outputs integrated for study)

---

## Contributing

This is a personal command OS project, but contributions, ideas, and feedback are welcome. Open an issue or submit a PR.

---

## License

MIT License - See [LICENSE](./LICENSE) for details.

---

## Acknowledgments

Built with inspiration from:
- Trading journals and performance analytics tools
- Smart-money tracking platforms (Nansen, Arkham)
- Calendar-based options strategies
- Poker training tools and RL research
- GTD and knowledge management systems

---

**Ready to build your command OS?** Start with `npm run dev` and explore the dashboard at `localhost:3000/dashboard`.
