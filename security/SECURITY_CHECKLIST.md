# Security Checklist – Ops-Home

Use this checklist for every build / major change.

## A. Secrets & Configuration

- [ ] `.env.local` (or deployment env) contains all secrets; none are in source control.
- [ ] `.env.local` is in `.gitignore`.
- [ ] Client code never reads secret env vars (no `process.env.*` in client components).
- [ ] External API calls (LLM, CoinGecko, Etherscan, NewsAPI) are only made from server code (`/api/*`, server actions).
- [ ] API keys are scoped/restricted where possible (read-only, IP/app restrictions).

## B. API Route Security

- [ ] All `/api/*` routes validate inputs (schema validation: e.g. zod).
- [ ] No route trusts client-provided IDs blindly without scoping to the authenticated user.
- [ ] Mutating routes (POST/PUT/PATCH/DELETE) are protected by auth once multi-device exists.
- [ ] Internal-only routes (cron/ingest) are protected by a server-side key or other mechanism.
- [ ] API responses do not include secrets or unnecessary internal fields.

## C. Storage: localStorage vs Database

- [ ] localStorage only stores low-risk data (UI preferences, drafts).
- [ ] Important data (events, tasks, wallet metadata, notes, ideas) are persisted in DB, not only in localStorage (Phase 4).
- [ ] No secrets (keys, passwords, seeds) ever stored in localStorage, cookies, or DB.
- [ ] DB queries are parameterized to prevent injection.

## D. LLM Usage

- [ ] Agent payloads never include API keys, passwords, or seed phrases.
- [ ] Only necessary context is sent to the LLM (minimal wallet, event, note data).
- [ ] System prompts explicitly state that external text is untrusted and should not override core rules.
- [ ] If you ingest external content (web pages, feeds) for the agent, it is clearly separated as "data", not "instructions".
- [ ] LLM provider is called only from server-side code with env keys.

## E. Frontend Security

- [ ] All user-generated text (notes, ideas, snippets, event titles, etc.) is rendered as text (escaped), not raw HTML.
- [ ] If any HTML is ever rendered, it is sanitized before insertion.
- [ ] No direct eval or injection of dynamic scripts from user input.
- [ ] Components avoid leaking sensitive info in error messages.

## F. Network & App Hardening

- [ ] Production is served over HTTPS.
- [ ] Security headers are configured (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
- [ ] Rate limiting is applied to high-cost endpoints (`/api/agent`, `/api/markets`).
- [ ] Logs are monitored for unusual activity (excessive agent calls, failed writes).

## G. Data Backup & Export

- [ ] There is a way to export important data (events, notes, ideas, wallet metadata) in a portable format (e.g. JSON).
- [ ] DB backups are configured via your DB provider (e.g. Supabase, managed Postgres).
- [ ] Sensitive backups are stored securely and access is restricted.

## H. Release / Change Procedure

- [ ] Security checklist reviewed before major releases.
- [ ] Changes that affect data shape (schema) are documented.
- [ ] New external integrations (APIs, providers) are listed with their keys, permissions, and any new risks.
