# Ops-Home: Intent & Architecture

## What This Is

Ops-Home is a **personal command center for crypto operations**. It solves the problem of fragmentation: scattered notes, wallet mistakes, tab chaos, and lack of systematic habits.

**Not**: A generic productivity app, social media scheduler, or trading platform.  
**Is**: Your single source of truth for knowledge, positions, awareness, and execution.

---

## The Problems It Solves

### 1. Knowledge Fragmentation
**Pain**: Notes scattered across Notion, Twitter bookmarks, Farcaster saves, GitHub issues, Perplexity threads.  
**Example**: "I analyzed Clearpool in December—where did I save that?"

**Solution**:
- Single knowledge store:
-   - `~/dojo/knowledge` for notes, threads, prompts
  - Cmd+K search across everything
  - Fast capture > rigid organization

### 2. Wallet Mistakes
**Pain**: Wrong wallet, wrong network, unclear permissions.
**Example**: "Almost sent to Ethereum instead of Base."

**Solution**:
- Risk lanes (Safe / Medium / High)
- Permission gating (allowed/forbidden actions)
- Active session panel shows current wallet + permissions

### 3. Tab Chaos
**Pain**: 20 open tabs, lost context, switching overhead.
**Example**: "Where was that trade I was tracking?"

**Solution**:
- 12-panel dashboard = everything in one view
- Market strip, wallets, calendar, notes, tasks, trading, social, learning, poker, projects
- No tab-switching

### 4. Lack of Systematic Habits
**Pain**: Inconsistent execution, no tracking, lessons lost.
**Example**: "What did I learn from last month's trades?"

**Solution**:
- Daily workflow: morning routine, capture, evening review
- Learning Lab with spaced repetition
- Activity log tracks every action
- Calendar keeps you on track

---

## Architecture

### Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS 4
- **Database**: SQLite (Prisma)
- **Type Safety**: TypeScript + Zod

### Data Layer
```
Genesis (wallets.json, projects.json)
  ↓
SQLite (data/ops-home.db)
  ↓
API Routes (/api/*)
  ↓
React Components (12 panels)
  ↓
Dashboard UI
```

### Integration with Dojo
Ops-home sits on top of `~/dojo`:
- Reads: `~/dojo/knowledge`, `~/dojo/system/*.json`, `~/.config/dojo/sync/latest.json`
- Writes: `~/dojo/knowledge/threads/activity_log.ndjson`, `~/dojo/system/calendar/*.json`
- Owns: `data/ops-home.db` (wallets, projects, notes, ideas, daily context)

**No silos**: Everything either lives in Dojo or in documented SQLite schema.

---

## The 12 Panels

1. **Market Strip** - Live prices, clock, branding
2. **Wallet Manager** - Risk-banded lanes
3. **Active Session** - Current wallet + permissions
4. **Calendar** - 3-day tactical view
5. **Notes** - Fast capture
6. **System Log** - Activity monitor
7. **Trading** - Bot management, P&L
8. **Tasks** - GTD workflow
9. **Social** - Farcaster, Twitter feeds
10. **Poker Lab** - Hand tracking
11. **Learning Lab** - Spaced repetition
12. **Projects** - Strategic oversight

---

## Current State

**Phase**: 3→4 (Eyes & Memory)
- ✅ 12-panel UI implemented
- ✅ SQLite database layer
- ✅ Wallet API with live balances
- ⏳ Market data integration
- ⏳ Social feeds

**Next**: Wire remaining APIs, add keyboard shortcuts, multi-device sync.

---

**Version**: v0.3-alpha  
**Last Updated**: 2026-02-05
