# Ops-Home Security Overview

This document describes security goals, risks, and controls for the Ops-Home cockpit across all phases (agent, markets, DB, multi-device).

## Security Goals

- Keep **secrets** (API keys, seeds, passwords) out of the frontend and source control.
- Protect **operational context** (wallet lanes, rules, events, tasks, notes).
- Ensure **data integrity** (no corrupt or arbitrary writes).
- Be resilient to **web threats** (XSS, CSRF, injection, abuse).
- Keep **LLM usage** safe (no secret leakage, prompt injection awareness).

## High-Level Risks

- Exposure of API keys (LLM, CoinGecko, Etherscan, etc.).
- Over-exposure of wallet metadata and strategies.
- XSS via notes/snippets or external content.
- Abuse of internal APIs (mass event/notes edits, agent spam).
- LLM prompt injection or over-trusting external text.

Controls for each are detailed in `SECURITY_CHECKLIST.md`.
