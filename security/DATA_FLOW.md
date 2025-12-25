# Data Flow – Ops-Home

This document describes how data moves through the app and where security controls apply.

## 1. Browser (Client) → Next.js API Routes

### Inputs from the browser

- Today context: focus, risk level, non-negotiables.
- Wallet selections.
- Event CRUD (add/edit/delete).
- Notes, ideas, snippets, docs metadata.
- Agent mode + prompt.
- UI state (filters, selected tabs, etc.).

### Destinations

- React state (in-memory).
- localStorage (LOW-RISK ONLY):
  - UI preferences (selected tab, filters).
  - Optional drafts / scratch notes.
  - NOT secrets or long-term canonical data.

### Security Controls

- Never store secrets in localStorage.
- Validate all outbound payloads before sending (simple client-side checks).
- Assume anything in localStorage can be read by any script on the origin.

---

## 2. Next.js API Routes → Database

### Database (Phase 4)

Primary storage: Postgres/Supabase.

Tables (examples):

- `wallets`
  - Metadata only: lane, risk band, persona, provider, browser profile, forbidden arenas.
  - No private keys or seed phrases.

- `events`
  - `id`, `title`, `date`, `type`, `importance`, `source`, `url`, `user_id`, timestamps.

- `tasks`
  - `id`, `description`, `due_at`, `status`, `event_id?`, `user_id`.

- `notes`, `ideas`, `snippets`
  - `id`, `title`, `body/content`, `tags`, `status`, `user_id`, timestamps.

- `projects`, `docs`
  - Metadata about Dojo map and doc registry.

### Flow

- Browser → `/api/*` → DB (read/write).
- No direct browser → DB connection.

### Security Controls

- Validate and sanitize all incoming payloads (e.g. zod) before writing.
- Enforce user scoping (per-user rows by `user_id` once auth exists).
- Use parameterized queries to prevent injection.
- Consider encrypting highly sensitive fields at rest.

---

## 3. Next.js API Routes → External Services

### External APIs

- Market data: CoinGecko or similar (prices, market info).
- Wallet data: Etherscan/Alchemy/RPC (balances, possibly positions).
- News/events: NewsAPI, macro calendars, prediction market APIs.
- LLMs: OpenAI/Anthropic (agent responses).

### Flow

- `/api/markets` → calls CoinGecko.
- `/api/wallets/balances` → calls Etherscan/Alchemy.
- `/api/events/ingest` (optional) → calls external event sources.
- `/api/agent` → calls chosen LLM provider via `llm.ts`.

### Security Controls

- All external calls use server-side env vars (`process.env.*`).
- Keys never exposed to the client.
- Rate limiting and caching on API routes where appropriate.
- Use HTTPS for all external communications.

---

## 4. LLM Data Flow

### Client → `/api/agent`

Payload:

- `mode`
- `prompt`
- `today` context
- IDs or summary of wallets/events/tasks/docs

### `/api/agent` internal steps

1. Load relevant context from DB.
2. Build safe prompt (`prompt-builder.ts`).
3. Call provider via `llm.ts` (server-side only).
4. Parse result into structured response (`response-parser.ts`).
5. Optionally log non-sensitive interaction metadata to DB.

### Security Controls

- No secrets in prompts (no API keys, no seeds).
- Only minimum necessary context sent.
- Treat external text as untrusted (defend against prompt injection).
- Optionally mask/abstract addresses/IDs before sending.
