# Threat Model – Ops-Home

## Actors

- You (legitimate user).
- Malicious script running in the browser (XSS).
- External attacker hitting your deployed API endpoints.
- Malicious or compromised external service (e.g. API provider, LLM).

## Assets

- Wallet metadata and risk rules.
- Events, tasks, notes, ideas, snippets, docs registry.
- Agent interactions and recommendations.
- API keys and configuration.

## Main Threats & Mitigations

1. **XSS steals localStorage or manipulates UI**
   - Mitigations:
     - No unsafe HTML injection.
     - Escape all user-generated content.
     - CSP limiting script sources.

2. **API keys leaked to client or repo**
   - Mitigations:
     - Keys only in env, accessed server-side.
     - `.env.local` in `.gitignore`.
     - No client-side `process.env` for secrets.

3. **Abuse of /api routes**
   - Mitigations:
     - Input validation, auth, rate limiting.
     - Internal-only routes protected by shared secret or private network.

4. **LLM over-sharing or manipulated by prompt injection**
   - Mitigations:
     - Minimal context.
     - No secrets in prompts.
     - Clear system messages and separation of external text.

5. **DB compromise (provider or config error)**
   - Mitigations:
     - Encrypt particularly sensitive fields.
     - Regular backups.
     - Least-privilege DB credentials.
