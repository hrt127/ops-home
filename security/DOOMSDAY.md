A “doomsday package” for this app as a short, pre-written plan for: (1) key leak, (2) app compromise, (3) DB/provider compromise, and (4) “nuke & recover.”[1][2]


***

## 1. If an API key is leaked

**Symptoms:** You accidentally push `.env.local`, paste a key in a cast, screenshot, or share it.

Immediate steps:

- [ ] **Revoke and rotate** the key in provider dashboard:
  - OpenAI / Anthropic / CoinGecko / Etherscan / NewsAPI.  
- [ ] **Update `.env.local`** with the new key.
- [ ] **Restart** the app:
  - `npm run dev` (local) or redeploy (prod).
- [ ] **Search repo & history** for the old key:
  - `git grep "old_key_fragment"`  
  - If present in history:
    - In a private repo: scrub it and force-push or mark the leak in docs.
    - In a public repo: treat old key as permanently compromised; rely on provider revocation.[3][4]
- [ ] Add a **note to `CHANGELOG.md`**: “API key rotation due to leak on <date>”.

***

## 2. If the local app looks compromised (weird UI, unknown code)

**Symptoms:** UI behaves unexpectedly, unknown components appear, or code has suspicious changes.

Immediate steps:

- [ ] **Stop the dev server**:
  - `Ctrl + C` in terminal.
- [ ] **Inspect recent changes**:
  - `git status`  
  - `git diff` to see uncommitted changes.
- [ ] If unknown code is present:
  - [ ] Reset to last trusted commit:
    - `git reset --hard <trusted-commit>`
  - [ ] Delete `node_modules` and reinstall:
    - `rm -rf node_modules`
    - `npm install`
- [ ] Run:
  - `npm run lint`  
  - `npm run build`  
  - Confirm no new suspicious errors.[4]

If you suspect malware on the machine (beyond this repo), step away and run OS-level checks.

***

## 3. If your DB/data provider is compromised

**Symptoms:** Your database provider reports a breach, or you see data you didn’t write.

Immediate steps:

- [ ] **Pause writes** from the app:
  - Temporarily disable mutating API routes (`POST/PUT/PATCH/DELETE`) or shut down the app if necessary.
- [ ] **Rotate DB credentials**:
  - New DB user/password or rotated service key.[5]
- [ ] **Check provider’s incident report**:
  - Understand which time window and which data might be affected.
- [ ] **Restore from backup** (if integrity is in doubt):
  - Use the latest good backup from before the incident.
- [ ] **Re-apply migrations** if needed.
- [ ] **Log what happened** in `SECURITY_OVERVIEW.md` and your own notes (date, provider, impact).

---

## 4. If LLM behavior looks dangerous or off

**Symptoms:** Agent suggests clearly unsafe actions (ignoring your risk rules), or outputs seem influenced by “instructions” from external text.

Immediate steps:

- [ ] **Disable the agent route** temporarily:
  - In `/api/agent/route.ts`, early-return a stub with a warning message.
- [ ] **Review prompt-builder** (`lib/prompt-builder.ts`):
  - Ensure system prompt clearly enforces your rules.
  - Ensure external text is clearly marked as untrusted data.[6][7]
- [ ] **Check recent code changes** touching LLM logic.
- [ ] When satisfied:
  - Re-enable `/api/agent`.

If you suspect provider-side issues, you can temporarily switch `LLM_PROVIDER` to a different vendor or stay in stub mode.

---

## 5. If you suspect XSS or browser compromise

**Symptoms:** Notes or snippets render weird content, unexpected popups, or you see strange network calls in dev tools.

Immediate steps:

- [ ] **Close the tab**.
- [ ] **Review UI render paths**:
  - Ensure all notes/snippets/events are rendered via escaped text, not raw HTML.
- [ ] **Search for `dangerouslySetInnerHTML`** in the codebase:
  - If found, verify it’s absolutely necessary and sanitized.
- [ ] **Clear localStorage** for the app origin (if you think malicious payload got stored there).

Once fixed, reopen the app and keep devtools Network tab open for a bit to observe.

***

## 6. “Nuke & Recover” procedure

For worst-case scenarios where you want to **wipe and rebuild locally**:

- [ ] **Export important data** (if DB still trusted):
  - Use provider tools or a small script to dump:
    - `wallets`, `events`, `tasks`, `notes`, `ideas`, `snippets`, `projects`, `docs`.[5]
- [ ] **Archive the current repo**:
  - Zip it or move it aside (`mv ops-home ops-home-archive-<date>`).
- [ ] **Fresh clone**:
  - `git clone <your-repo-url> ops-home`
  - `cd ops-home`
  - `npm install`
- [ ] **Recreate `.env.local`**:
  - With rotated/checked keys.
- [ ] **Run tests/build**:
  - `npm run lint`
  - `npm run build`
- [ ] **Re-import data**:
  - Into the DB from your dump (if data is clean/trusted).

If you suspect the DB itself was poisoned or untrustworthy, start a **new DB instance**, migrate schema only, and selectively import what you trust.

---

## 7. Regular “peace time” drills & hygiene

To make doomsday less painful:

- [ ] Once a quarter, **rotate API keys** (LLM, market, data).[2]
- [ ] Test DB backup restore to a staging environment.
- [ ] Review `SECURITY_CHECKLIST.md` before and after major changes.
- [ ] Keep `CHANGELOG.md` and `security/` docs updated so future you knows what changed and why.


