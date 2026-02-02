# Ops-Home System Blueprint

**Your Local-First Command OS - Complete System Architecture**

Date: 2026-02-02  
Status: Core Foundation Built | Integration Phase

---

## System Overview

Ops-Home unifies **5 operational domains** into one integrated cockpit:

1. **Capital & Bots** - Wallet management, Freqtrade trading, risk exposure
2. **Markets & Intelligence** - Smart money, ELFA narratives, social signals  
3. **Time & Strategy** - Calendar-driven scenarios, options, event management
4. **Knowledge & Learning** - Notes, study queues, poker RL lab
5. **Agents & Automation** - LLM agents, research copilots, experiment tracking

**Core Principle**: Everything is **rules-driven**, **scenario-based**, and **time-anchored**—not vibes.

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE LAYER                     │
│  Next.js 16 Dashboard | 12 Panels | Real-time Updates     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LOGIC LAYER                   │
│  React 19 | TypeScript 5 | Zod Validation | State Mgmt   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      API & DATA LAYER                        │
│  Next.js API Routes | Prisma ORM | Data Fetching          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                           │
│  SQLite (Local) / PostgreSQL (Deployed) | Prisma Schema    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 INTEGRATION & DATA SOURCES                   │
│  Dojo (WSL) | Freqtrade | Smart-Money | ELFA | APIs       │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Dashboard (12-Panel Cockpit)

**Layout**: 12 panels in responsive grid

```
┌──────────┬──────────┬──────────┬──────────┐
│  WALLET  │ FREQTRAD │  RISK    │  SOCIAL  │
│  LANES   │  BOTS    │  METER   │  FEED    │
├──────────┼──────────┼──────────┼──────────┤
│  SMART   │  ELFA    │ CALENDAR │ OPTIONS  │
│  MONEY   │ NARRATIV │ SCENARIOS│  PANEL   │
├──────────┼──────────┼──────────┼──────────┤
│  TASKS   │  AGENTS  │  POKER   │  NOTES   │
│  QUEUE   │  CONTROL │  LAB     │  QUEUE   │
└──────────┴──────────┴──────────┴──────────┘
```

**Each Panel**:
- Real-time data updates
- State-driven UI (loading, error, success)
- Action buttons for quick operations
- Links to detailed views

### 2. Data Models (Prisma Schema)

**Core Entities**:
```typescript
- Wallet (address, name, risk_band, holdings)
- Project (protocol, narrative, state, score)
- Event (type, date, scenario, signals)
- Agent (type, purpose, status, permissions)
- Task (title, priority, due_date, scenario_linked)
- Note (content, tags, knowledge_type)
- Calendar (events, scenarios, checkpoints)
- Trade (freqtrade integration, bot_id, pnl)
```

**Relationships**:
- Wallets → Holdings (one-to-many)
- Projects → Narratives (many-to-one)
- Events → Scenarios (many-to-many)
- Tasks → Events (many-to-many)
- Agents → Experiments (one-to-many)

### 3. API Routes

**RESTful Endpoints**:
```
GET  /api/wallets          - List wallets with holdings
POST /api/wallets          - Create new wallet
GET  /api/wallets/[id]     - Get wallet details

GET  /api/freqtrade/bots   - Freqtrade bot status
GET  /api/freqtrade/trades - Recent trades

GET  /api/events           - Calendar events
POST /api/events           - Create event
GET  /api/events/scenarios - Scenario-linked events

GET  /api/agents           - Agent list and status
POST /api/agents/execute   - Execute agent action

GET  /api/notes            - Knowledge base notes
POST /api/notes            - Create note
```

### 4. External Integrations

**Dojo (WSL Filesystem)**:
- Location: `~/dojo/` (not in GitHub)
- Purpose: System docs, prompts, workflows
- Access: Via WSL CLI from ops-home

**Freqtrade**:
- Bot monitoring
- Trade execution status
- P&L tracking
- Regime detection

**Smart Money Dashboard**:
- On-chain flows
- Wallet tracking
- Transaction analysis

**ELFA Narratives**:
- Narrative state tracking
- Score calculation
- Sentiment analysis

**APIs**:
- Neynar (Farcaster social data)
- Zapper (DeFi wallet data)
- OpenAI (LLM agents)
- CoinGecko/Dune (market data)

---

## Data Flow

### Example: Smart Money Signal → Action

```
1. Smart Money Dashboard detects large wallet movement
   ↓
2. ops-home /api/smart-money webhook receives data
   ↓
3. Narrative engine checks: which narrative?
   ↓
4. Scenario engine: is there an active scenario?
   ↓
5. Rule engine: ADD | HOLD | EXIT | PREP_TASK?
   ↓
6. Task created in dashboard with:
   - Context: "Smart money buying XYZ narrative"
   - Action: "Review for 0.5% position"
   - Due: Today
   ↓
7. User sees task in Task Queue panel
   ↓
8. User clicks → sees narrative score, flows, social signals
   ↓
9. User decides → logs decision in journal
```

### Example: Calendar Event → Bot Action

```
1. Calendar: "Fed Meeting" event tomorrow
   ↓
2. Scenario engine: Match "Macro Vol Event" scenario
   ↓
3. Rule: Reduce bot risk 24h before
   ↓
4. Signal sent to Freqtrade API
   ↓
5. Bot switches to conservative strategy
   ↓
6. ops-home Risk Meter updates: "Defensive mode"
   ↓
7. Task created: "Review bot performance post-event"
```

---

## State Management

**Global State** (React Context + Local Storage):
- User preferences (theme, panel layout)
- Active filters and views
- Cached API responses
- Notification settings

**Panel State** (Component-level):
- Loading states
- Error handling
- Pagination
- Sort/filter settings

**Database State** (Prisma + DB):
- Persistent user data
- Historical records
- Relationships
- Audit logs

---

## Security & Permissions

**Wallet Permissions**:
- Cold wallets: View only
- Core wallets: Limited actions
- Tactical wallets: Full trading
- Degen wallets: Experimental

**Agent Boundaries**:
- Explicit allowed outputs
- Forbidden actions list
- Sandbox mode for new agents
- Eval loops track PnL impact

**API Security**:
- Environment variables for keys
- Rate limiting on POST routes
- Input validation (Zod)
- CORS configuration

---

## Deployment Architecture

**Local (Development)**:
```
Windows 11
├── ops-home/ (Next.js app)
│   ├── SQLite database
│   └── npm run dev (port 3000)
│
└── WSL2
    └── ~/dojo/ (filesystem integration)
        ├── CLI tools
        ├── Documentation
        └── Database
```

**Production (Vercel)**:
```
Vercel Edge
├── Next.js 16 SSR
├── PostgreSQL (Vercel Postgres)
├── Environment variables
└── Auto-scaling
```

---

## Tech Stack Summary

**Frontend**:
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4

**Backend**:
- Next.js API Routes
- Prisma 5.8 (ORM)
- Zod (Validation)

**Database**:
- SQLite (local)
- PostgreSQL (production)

**Integration**:
- Freqtrade REST API
- Neynar API (Farcaster)
- Zapper API (DeFi)
- OpenAI API (LLM)

**Deployment**:
- Vercel (production)
- Local-first (primary use)

---

## Extensibility Points

**New Panels**: Add to dashboard grid via component
**New Data Sources**: Add API route + Prisma model
**New Agents**: Register in agent_types.json
**New Scenarios**: Define in Calendar panel
**New Rules**: Add to rule engine logic

---

## Performance Considerations

**Optimization Strategies**:
- Server-side rendering for initial load
- API route caching (5-15 min TTL)
- Lazy loading for panels
- Debounced search/filter inputs
- Pagination for large lists
- WebSocket for real-time updates (future)

---

## Related Documentation

- [COMPLETE_IMPLEMENTATION_STATUS.md](./COMPLETE_IMPLEMENTATION_STATUS.md) - Current build status
- [SYSTEM_ANALYSIS.md](./SYSTEM_ANALYSIS.md) - Detailed technical analysis
- [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) - Goals and constraints
- [DOJO_INTEGRATION.md](./DOJO_INTEGRATION.md) - Dojo filesystem details
- [LOCAL_SETUP.md](./LOCAL_SETUP.md) - Setup guide

---

**Maintained by**: hrt127  
**Last Updated**: 2026-02-02  
**Next Review**: When major architecture changes occur
