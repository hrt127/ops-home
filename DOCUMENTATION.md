# Ops-Home Documentation Index

Quick reference for all project documentation.

## 📚 Core Documentation

| File | Purpose | Read Time |
|------|---------|-----------|
| [README.md](README.md) | Project overview, features, quick start | 5 min |
| [CHANGELOG.md](CHANGELOG.md) | Build history, phases, progress tracking | 10 min |
| [.env.example](.env.example) | Environment variable template | 2 min |

## 🤖 Agent Integration

| File | Purpose | Read Time |
|------|---------|-----------|
| [AGENT_SETUP.md](AGENT_SETUP.md) | How to configure OpenAI or Anthropic | 10 min |
| [lib/agent-types.ts](lib/agent-types.ts) | Type definitions for agent payloads | reference |
| [lib/llm.ts](lib/llm.ts) | LLM provider abstraction (OpenAI, Anthropic) | reference |
| [lib/prompt-builder.ts](lib/prompt-builder.ts) | Formats context into structured prompts | reference |
| [lib/response-parser.ts](lib/response-parser.ts) | Parses LLM responses into structured format | reference |

## 📈 Phase 3 Planning (External APIs)

| File | Purpose | Read Time |
|------|---------|-----------|
| [PHASE_3_APIS.md](PHASE_3_APIS.md) | Integration guide for market, wallet, event APIs | 15 min |

## 🏗️ Project Structure

```
ops-home/
├── README.md                  # Start here
├── CHANGELOG.md               # Build history
├── AGENT_SETUP.md             # LLM configuration
├── PHASE_3_APIS.md            # External API roadmap
├── .env.example               # Environment template
│
├── app/
│   ├── page.tsx               # Main cockpit UI
│   ├── layout.tsx             # Root layout
│   ├── api/
│   │   ├── agent/route.ts     # Agent endpoint (Phase 2 - DONE)
│   │   └── events/route.ts    # Events endpoint (Phase 3 TODO)
│   └── globals.css
│
├── components/                # Modular UI (9 files)
│   ├── AgentConsole.tsx
│   ├── WalletLanes.tsx
│   ├── EventsPanel.tsx
│   ├── NotesPanel.tsx
│   ├── IdeasPanel.tsx
│   ├── MarketStrip.tsx        # Ready for Phase 3 live data
│   ├── WalletBriefing.tsx     # Ready for Phase 3 balances
│   ├── DojoMap.tsx
│   └── SnippetsPanel.tsx
│
├── lib/
│   ├── agent-types.ts         # Shared type definitions
│   ├── llm.ts                 # LLM abstraction (Phase 2 - DONE)
│   ├── prompt-builder.ts      # Prompt formatting (Phase 2 - DONE)
│   ├── response-parser.ts     # Response parsing (Phase 2 - DONE)
│   ├── wallets.ts             # Wallet seed data
│   ├── events.ts              # Event seed data
│   └── arenas.ts              # Project/arena definitions
│
├── public/                    # Static assets
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── next.config.ts
├── tailwind.config.js
└── eslint.config.mjs
```

## 🚀 Quick Start

### First Time?
1. Read [README.md](README.md) (5 min)
2. Run `npm install && npm run dev`
3. Open http://localhost:3000
4. Try the app in **stub mode** (no setup required)

### Want Real Agent?
1. Read [AGENT_SETUP.md](AGENT_SETUP.md) (10 min)
2. `cp .env.example .env.local`
3. Add your OpenAI or Anthropic API key
4. Restart dev server
5. Click "Run agent" at http://localhost:3000

### Planning Phase 3?
1. Read [PHASE_3_APIS.md](PHASE_3_APIS.md) (15 min)
2. Choose your first API (CoinGecko recommended)
3. Add env var to `.env.local`
4. Create API route in `app/api/`
5. Wire component to fetch from new route

## 📋 Current Status

| Phase | Status | Key Files |
|-------|--------|-----------|
| **Phase 1** | ✅ Complete | app/page.tsx, components/*, lib/agent-types.ts |
| **Phase 2** | ✅ Complete | lib/llm.ts, lib/prompt-builder.ts, app/api/agent/route.ts |
| **Phase 3** | 📋 Planned | PHASE_3_APIS.md (guide), TODO: external API routes |
| **Phase 4** | 📋 Planned | Database, multi-device sync |

See [CHANGELOG.md](CHANGELOG.md) for detailed phase breakdown.

## 🔧 Commands

```bash
# Development
npm run dev          # Start dev server at localhost:3000
npm run build        # Build for production
npm run lint         # TypeScript + ESLint check

# Environment
cp .env.example .env.local  # Create local config
# Edit .env.local with your API keys
```

## 📞 Common Questions

**Where do I start?**
→ [README.md](README.md) — 5 minute overview

**How do I set up the agent?**
→ [AGENT_SETUP.md](AGENT_SETUP.md) — Step-by-step instructions

**What external APIs should I integrate?**
→ [PHASE_3_APIS.md](PHASE_3_APIS.md) — Complete roadmap with examples

**How are types defined?**
→ [lib/agent-types.ts](lib/agent-types.ts) — Shared payload types

**What's the agent flow?**
→ Check [lib/llm.ts](lib/llm.ts) + [lib/prompt-builder.ts](lib/prompt-builder.ts) + [app/api/agent/route.ts](app/api/agent/route.ts)

**How do I add a new API?**
→ [PHASE_3_APIS.md](PHASE_3_APIS.md) — "Implementation Pattern" section

## 📊 File Statistics

```
Source code:
  - Components: 9 files (~2KB each)
  - Pages/Routes: 2 files (page.tsx, agent/route.ts)
  - Libraries: 7 files (types, llm, prompts, parsers, seeds)

Documentation:
  - README.md: ~300 lines
  - CHANGELOG.md: ~150 lines
  - AGENT_SETUP.md: ~350 lines
  - PHASE_3_APIS.md: ~400 lines

Total codebase: ~3500 lines (including docs)
Build time: 5-7s (Turbopack)
```

---

**Last Updated**: 2025-12-25  
**Next Action**: Read README.md or AGENT_SETUP.md depending on your goal
