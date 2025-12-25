# Ops-Home

A modern, modular Next.js app for managing wallets, events, and agent-based operations guidance. Built for daily use with real-time AI assistance, persistent state, and extensible APIs.

## Features

- 🎯 **Daily Planning** — Focus tracking, risk levels, non-negotiables
- 💼 **Wallet Management** — Multiple wallets with risk bands, personas, rules
- 📅 **3-Day Calendar** — Events with importance levels and quick add/remove
- 🤖 **AI Agent** — Real-time guidance via OpenAI or Anthropic
- 📝 **Notes & Ideas** — Quick capture with status tracking (idea → shaping → live)
- 🗺️ **Dojo Map** — Project list and quick links
- 📈 **Market Strip** — Live prices and time display (ready for CoinGecko/Alchemy)
- 💾 **Persistent State** — localStorage auto-save for all data

## Quick Start

### 1. Install & Run
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — app starts in **stub mode** (demo responses).

### 2. Activate Real Agent (Optional, 2 min setup)
```bash
cp .env.example .env.local
# Edit .env.local and add your LLM API key
LLM_PROVIDER=openai
LLM_API_KEY=sk-...
```

Restart the dev server. The agent now calls real LLMs!

See [AGENT_SETUP.md](AGENT_SETUP.md) for detailed instructions.

## Project Structure

```
app/
├── page.tsx              # Main cockpit UI
├── api/
│   ├── agent/route.ts    # Agent endpoint (OpenAI/Anthropic)
│   └── events/route.ts   # Events endpoint (stub)
└── layout.tsx            # Root layout

components/              # Modular UI components
├── AgentConsole.tsx     # Agent interface
├── WalletLanes.tsx      # Wallet editor
├── EventsPanel.tsx      # 3-day calendar
├── NotesPanel.tsx       # Notes capture
├── IdeasPanel.tsx       # Idea lifecycle
├── MarketStrip.tsx      # Market/time display
├── WalletBriefing.tsx   # Wallet metadata
├── DojoMap.tsx          # Project list
└── SnippetsPanel.tsx    # Code snippets

lib/
├── agent-types.ts       # Shared types
├── llm.ts               # LLM provider abstraction
├── prompt-builder.ts    # Context → prompt formatting
├── response-parser.ts   # LLM → structured response
├── wallets.ts           # Wallet definitions
├── events.ts            # Event definitions
└── arenas.ts            # Arena/project data

public/                  # Static assets
```

## Documentation

- **[CHANGELOG.md](CHANGELOG.md)** — Build history and current status
- **[AGENT_SETUP.md](AGENT_SETUP.md)** — How to configure OpenAI/Anthropic
- **[PHASE_3_APIS.md](PHASE_3_APIS.md)** — Integrating live market/wallet data
- **[.env.example](.env.example)** — Configuration template

## Agent Modes

The AI agent adapts based on your selected mode:

| Mode | Focus | Best For |
|------|-------|----------|
| **Daily Plan** | Wallets, events, spend | Planning your day |
| **Risk Audit** | Portfolio risks, violations | Security review |
| **Market Scan** | Events, rebalancing, macro | Market opportunity |

## Architecture

### Type-Safe Request/Response
```typescript
// Client sends
POST /api/agent {
  mode: "daily-plan",
  prompt: "Should I rebalance?",
  today: { focus, riskLevel, nonNegotiables },
  wallets: [...],
  events: [...]
}

// Server returns
{
  summary: "...",
  bullets: ["...", "..."],
  warnings: ["..."],
  details: "..."
}
```

### State Management
- React `useState` for UI state
- `localStorage` for persistence (ops-home:* keys)
- `/api/*` routes for external API calls (proxy pattern)

### Performance
- Turbopack (near-instant hot reload)
- 7–9s initial build, ~100ms rebuild
- Zero runtime errors (TypeScript strict mode)

## Phases

| Phase | Status | Features |
|-------|--------|----------|
| **Phase 1** | ✓ Done | UI, components, agent stub |
| **Phase 2** | ✓ Done | LLM integration (OpenAI/Anthropic) |
| **Phase 3** | 📋 Planned | Live market data, wallet balances, events |
| **Phase 4** | 📋 Planned | Database persistence, multi-device sync |

See [PHASE_3_APIS.md](PHASE_3_APIS.md) for Phase 3 implementation roadmap.

## Environment Setup

### Required for Real Agent
```env
LLM_PROVIDER=openai        # or "anthropic"
LLM_API_KEY=sk-...         # Your API key
LLM_MODEL=gpt-3.5-turbo    # Optional, override default
```

### Optional for Phase 3
```env
COINGECKO_API_KEY=...      # Market data
ETHERSCAN_API_KEY=...      # Wallet balances
NEWSAPI_KEY=...            # Headlines
```

See [.env.example](.env.example) and [AGENT_SETUP.md](AGENT_SETUP.md) for details.

## Development

### Commands
```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Build for production
npm run lint      # TypeScript + ESLint check
```

### Testing Agent
1. Open http://localhost:3000
2. Fill in daily context (focus, risk level, wallets, events)
3. Type optional prompt
4. Click "Run agent"
5. Check response in UI and console

## Known Limitations

- **Stub mode default** — Activate with `.env.local` to use real LLM
- **Market data hardcoded** — Phase 3 will add CoinGecko, Alchemy, etc.
- **localStorage only** — No multi-device sync (Phase 4)
- **No DB** — Data stored locally; persists across sessions

## Roadmap

- [ ] Phase 3: Live market feeds (CoinGecko, Alchemy, Etherscan)
- [ ] Phase 3: Event aggregation (NewsAPI, Polymarket, macro calendar)
- [ ] Phase 4: SQLite or Supabase for persistence
- [ ] Phase 4: Farcaster social signals
- [ ] Component tests (Jest)
- [ ] Dark mode toggle (currently hardcoded dark)
- [ ] Mobile responsive design

## Troubleshooting

**Agent returns stub response?**
- You haven't configured `.env.local` yet. See [AGENT_SETUP.md](AGENT_SETUP.md).

**TypeError: Cannot read property 'focus' of undefined?**
- Check console logs. Ensure today context is initialized.

**Build takes >10s?**
- First build is slower. Hot rebuild should be <200ms. If not, check system resources.

**Market data shows "—"?**
- Market Strip displays placeholder until Phase 3 integration. This is expected.

## Security Notes

- **Never commit `.env.local`** — it contains API keys
- **Rotate keys regularly** — if accidentally shared, regenerate immediately
- **Use API key restrictions** — OpenAI/Anthropic allow IP/domain limits
- **Monitor costs** — Set spending alerts in provider dashboard
- **All external calls use `/api/*` routes** — keeps API keys server-side

## Contributing

This is a personal daily tool. For improvements:
1. Test locally with `npm run dev`
2. Check TypeScript: `npx tsc --noEmit`
3. Verify build: `npm run build`
4. Document changes in [CHANGELOG.md](CHANGELOG.md)

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Runtime**: React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript (strict mode)
- **Bundler**: Turbopack (fast refresh)
- **LLM**: OpenAI or Anthropic (via env config)

## License

MIT (Personal use encouraged)

---

**Status**: Production-ready for local daily use ✓  
**Last Updated**: 2025-12-25  
**Next**: Phase 3 — External data integration
