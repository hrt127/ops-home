# INTENT (REVISED)
This project is now scoped as a single-user, local development dashboard. No teams, roles, or sharing. Authentication is for local dev only (no real auth, no passwords). Persistence is via SQLite (Prisma), not Postgres. Security, compliance, and production hardening are out of scope. The goal is to finalize UX and workflows, not infrastructure.
# SYSTEM_STATE.md

## 1. ORIGINAL INTENT
- Build a production-ready, secure, auditable crypto operations dashboard.
- Core problem: Enable persistent, compliant, multi-user management of wallets, events, notes, and ideas for crypto ops.
- Success: All main flows (login, CRUD, audit, backup, team support) work reliably, securely, and are test-covered.

## 2. CURRENT STATE (FACTUAL ONLY)
- Implemented:
  - Next.js frontend with modular components for wallets, events, notes, ideas, snippets, projects.
  - API routes for agent and events (rate limiting stubbed).
  - Local dev-only authentication (stubbed, no passwords, no real auth).
  - Protected layout for local dev auth.
  - Prisma schema for Wallet, Event, Note, Idea, User (stub).
  - Local storage helpers for client state.
  - Playwright UI tests (main flows).
  - .env file stub for SQLite connection.
- Assumptions:
  - SQLite is the database (not Postgres).
  - Prisma ORM is used for DB access.
  - Authentication is for local dev only; no passwords, no production auth.
  - Single-user only; no teams, roles, or sharing.
- Not implemented:
  - Real authentication, password management, or user registration.
  - Team features, roles, sharing, notifications, LLM backend, real-time sync, mobile UX, analytics dashboard.
  - Security, compliance, production hardening, or infrastructure.

## 3. DECISIONS MADE
- Next.js 16, React 19, Tailwind CSS 4, TypeScript 5 chosen for frontend.
- Prisma ORM and SQLite chosen for backend persistence.
- Authentication is stubbed for local dev only; no passwords, no production auth.
- Single-user only; team support and sharing removed from scope.
- All missing dependencies or features are stubbed, not blocked.

## 4. OPEN QUESTIONS / AMBIGUITIES
- SQLite connection and migration details for local dev only.
- User registration, password security, and onboarding flows are out of scope.
- Team roles, permissions, and sharing logic are out of scope.
- Notification delivery, LLM backend integration, real-time sync, analytics, and mobile UX are not specified.

## 5. RISKS & FAILURE MODES
- Authentication is stubbed and insecure; not suitable for production.
- Stubs may mask missing functionality, leading to false sense of completeness.
- Scope creep possible if new features are added without review.
- Tech debt risk from deferred features, but security and production hardening are explicitly out of scope.

## 6. NEXT LOGICAL STEP (REMOVED)
No next steps proposed. Awaiting human review before further implementation.
