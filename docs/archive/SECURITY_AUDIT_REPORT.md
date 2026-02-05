# Security Audit Report – Ops-Home

**Date**: 2025-12-25  
**Phase**: Phase 1–4 (Foundational)  
**Scope**: API routes, environment config, client/server separation, LLM integration, DB schema

---

## Executive Summary

This report audits the Ops-Home codebase against the security policies defined in `security/` folder. **Phase B (Postgres + Prisma) is in progress**; this audit reflects the current state and identifies gaps before going live.

**Key Findings**:
- ✅ **Secrets isolation**: API keys correctly restricted to server-side (Phase 2).
- ✅ **DB schema**: No secrets stored in schema; versioning for audit trail.
- ✅ **Server-side calls**: External APIs (LLM, CoinGecko, Etherscan) called from `/api/*` routes only.
- ⚠️ **Input validation**: API routes lack formal schema validation (zod); manually checked.
- ⚠️ **Auth & rate limiting**: Not yet implemented; will be needed for Phase 4 multi-device.
- ⚠️ **Frontend escaping**: Components assume text-only rendering; sanitization not enforced.
- 🔴 **HTTPS & security headers**: Not configured in `next.config.ts`; must be done before production.

---

## Detailed Audit

### A. Secrets & Configuration ✅

| Item | Status | Notes |
|------|--------|-------|
| `.env.local` in `.gitignore` | ✅ | Confirmed in repo root `.gitignore`. |
| Client code reads env secrets | ✅ | No client components reference `process.env.LLM_API_KEY` or similar. |
| External API calls server-side | ✅ | All calls from `/api/agent`, `/api/markets`, `/api/wallet/*` routes. |
| `.env.example` updated | ✅ | Includes DATABASE_URL, API key placeholders. |

**Status**: PASS

---

### B. API Route Security ⚠️

#### Input Validation

| Route | Validation | Status |
|-------|-----------|--------|
| `/api/agent` | Manual (mode, prompt, today shape) | ⚠️ No zod schema. |
| `/api/db/wallets` | Manual (name, address) | ⚠️ No zod schema. |
| `/api/db/events` | Manual (title, when_ts) | ⚠️ No zod schema. |
| `/api/db/notes` | Manual (title, body) | ⚠️ No zod schema. |
| `/api/db/ideas` | Manual (title, body, status) | ⚠️ No zod schema. |
| `/api/markets` | Proxy only (query param) | ⚠️ No rate limiting. |
| `/api/wallet` | Query param (address) | ⚠️ No validation or rate limiting. |

**Recommendation**: Add zod schemas for all POST/PUT/DELETE routes:

```typescript
// Example: lib/zod-schemas.ts
import { z } from 'zod';

export const WalletCreateSchema = z.object({
  name: z.string().min(1).max(100),
  address: z.string().email().optional(),
  metadata: z.record(z.any()).optional(),
});
```

#### Auth & Rate Limiting

| Aspect | Status | Notes |
|--------|--------|-------|
| DB routes protected by user auth | 🔴 | Not implemented; all routes open. Needed for Phase 4. |
| `/api/agent` rate-limited | 🔴 | No rate limiting; can be abused for LLM cost. |
| `/api/markets` rate-limited | 🔴 | No rate limiting; external API costs. |
| Internal-only routes gated | 🔴 | No mechanism for cron/admin-only routes. |

**Recommendation**: Add per-user or per-IP rate limiting before multi-device:

```typescript
// Example: lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: process.env.REDIS_URL,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
});
```

**Status**: PARTIAL (core structure safe; auth/rate-limiting deferred to Phase 4)

---

### C. Storage: localStorage vs Database ✅

| Item | Status | Notes |
|------|--------|-------|
| localStorage used for low-risk data | ✅ | UI state, drafts; see `components/*.tsx`. |
| Secrets in localStorage | ✅ | NONE found; no keys or passwords. |
| Secrets in Prisma schema | ✅ | Schema excludes private keys, seeds, passwords. |
| Parameterized DB queries | ✅ | Prisma ORM handles all queries; no raw SQL injection. |
| Phase 4 DB ready | ✅ | Prisma schema, migration files, ChangeLog for audit trail. |

**Status**: PASS

---

### D. LLM Usage ✅

| Check | Status | Details |
|-------|--------|---------|
| Agent payloads include secrets | ✅ | No API keys, passwords, or seeds in `/api/agent` payloads. |
| Only necessary context sent | ✅ | Payload includes mode, prompt, today (focus/risk), wallet/event summaries. |
| System prompt avoids over-trusting | ✅ | `lib/prompt-builder.ts` prefixes instructions; user prompt is data. |
| External content flagged | ✅ | Not yet ingesting external feeds; when Phase 3 adds them, separate as data. |
| LLM call server-side only | ✅ | `lib/llm.ts` called from `/api/agent` only; env keys not exposed. |

**Status**: PASS

---

### E. Frontend Security ⚠️

| Item | Status | Notes |
|------|--------|-------|
| User input rendered as text | ⚠️ | Assumed in components; no explicit sanitization. |
| No raw HTML injection | ✅ | Components use JSX and dangerouslySetInnerHTML nowhere. |
| Error messages safe | ✅ | Generic messages; no stack traces to client. |
| XSS test coverage | 🔴 | No unit tests for component escaping. |

**Recommendation**: Add a util for safe text rendering + tests:

```typescript
// lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function safeText(text: string): string {
  return text.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
}
```

**Status**: PARTIAL (safe by default; explicit sanitization deferred)

---

### F. Network & App Hardening 🔴

| Item | Status | Notes |
|------|--------|-------|
| HTTPS enforced | 🔴 | Not configured in `next.config.ts`. Required for production. |
| Security headers (CSP, etc.) | 🔴 | Not set. Add via middleware. |
| Rate limiting | 🔴 | Not implemented. |
| Logs monitored | 🔴 | No centralized logging or monitoring. |

**Recommendation**: Add security headers middleware:

```typescript
// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', "default-src 'self'");
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

**Status**: NOT DONE (critical for production)

---

### G. Data Backup & Export 🔴

| Item | Status | Notes |
|------|--------|-------|
| Export endpoint exists | 🔴 | Planned in TODO 6; not yet implemented. |
| DB backup configured | 🔴 | Not yet set up. Depends on chosen provider (Supabase, managed Postgres). |
| Backup encryption | 🔴 | Not applicable until backups are configured. |

**Recommendation**: Implement `/api/db/export` endpoint:

```typescript
// app/api/db/export/route.ts
export async function GET(req: NextRequest) {
  const wallets = await prisma.wallet.findMany({ where: { deletedAt: null } });
  const events = await prisma.event.findMany({ where: { deletedAt: null } });
  const notes = await prisma.note.findMany({ where: { deletedAt: null } });
  const ideas = await prisma.idea.findMany({ where: { deletedAt: null } });
  
  const data = { wallets, events, notes, ideas, exportedAt: new Date() };
  
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Disposition': 'attachment; filename="ops-home-export.json"',
      'Content-Type': 'application/json',
    },
  });
}
```

**Status**: NOT DONE (queued for Phase 4 TODO 6)

---

### H. Release / Change Procedure ⚠️

| Item | Status | Notes |
|------|--------|-------|
| Security checklist reviewed | ⚠️ | This report serves as template; integrate into CI. |
| Schema changes documented | ✅ | Prisma migrations are git-tracked. |
| New integrations listed | ✅ | `.env.example` documents all keys. |

**Recommendation**: Add a pre-release checklist script:

```bash
# scripts/security-check.sh
#!/bin/bash
echo "Checking for hardcoded secrets..."
grep -r "sk-\|api_key\|password" src/ --include="*.ts" && exit 1
echo "Checking .env.local is in .gitignore..."
grep ".env.local" .gitignore || exit 1
echo "✓ Security checks passed."
```

**Status**: PARTIAL (manual; automate for CI)

---

## Summary Table

| Area | Score | Status | Action |
|------|-------|--------|--------|
| **A. Secrets & Config** | 5/5 | ✅ PASS | None |
| **B. API Security** | 3/5 | ⚠️ PARTIAL | Add zod, auth, rate-limiting |
| **C. Storage** | 5/5 | ✅ PASS | None |
| **D. LLM Usage** | 5/5 | ✅ PASS | None |
| **E. Frontend** | 3/5 | ⚠️ PARTIAL | Add explicit sanitization tests |
| **F. Network/Headers** | 0/5 | 🔴 NOT DONE | Add middleware, HTTPS redirect |
| **G. Backup/Export** | 1/5 | 🔴 NOT DONE | Implement export endpoint, DB backups |
| **H. Release Procedure** | 2/5 | ⚠️ PARTIAL | Automate checklist in CI |
| **Overall** | 24/40 | ⚠️ DEVELOPMENT | See action plan |

---

## Action Plan (Priority Order)

### Immediate (Before Phase 4 DB goes live)

1. **Add security middleware** (`app/middleware.ts`): CSP, X-Frame-Options, HTTPS redirect.
2. **Add zod validation** to all `/api/db/*` routes and `/api/agent`.
3. **Implement `/api/db/export`** endpoint for backups.
4. **Add rate-limiting** to `/api/agent` and `/api/markets` (via Upstash or simple in-memory for dev).

### Short-term (Phase 4)

5. **Implement auth** and user scoping for DB routes.
6. **Enable DB backups** via Supabase or managed Postgres (pg_dump scheduled).
7. **Add explicit HTML sanitization** to note/idea/snippet rendering.

### Medium-term

8. **Set up centralized logging** (e.g. Sentry) for error tracking.
9. **Add XSS unit tests** for all text-rendering components.
10. **Document security procedure** in CI/CD pipeline (pre-deploy checklist).

---

## Checklist for Go-Live

Before deploying to production, verify:

- [ ] `.env.local` is in `.gitignore` and not committed.
- [ ] All API keys are scoped/restricted at the provider (OpenAI: IP limits, Etherscan: read-only).
- [ ] HTTPS is enforced (redirect HTTP to HTTPS).
- [ ] Security headers middleware is active.
- [ ] Rate-limiting is configured for expensive endpoints.
- [ ] DB backups are configured and tested.
- [ ] Export endpoint works and exports clean JSON.
- [ ] All user input is escaped/sanitized before rendering.
- [ ] No secrets appear in logs or error messages.
- [ ] Team has read `security/*` docs.

---

## References

- `security/SECURITY_OVERVIEW.md` — Goals & risks.
- `security/SECURITY_CHECKLIST.md` — Detailed checklist.
- `security/DATA_FLOW.md` — Data movement & controls.
- `security/THREAT_MODEL.md` — Actor/asset/threat analysis.
- `security/LLM_SECURITY.md` — LLM-specific guidance.
- `security/DOOMSDAY.md` — Incident response plan.

---

**Report prepared**: 2025-12-25  
**Next audit**: After Phase 4 DB deployment + auth implementation.
