# LLM Security – Ops-Home

This doc focuses on protecting secrets and context when using LLMs.

## Principles

- Do not send secrets (API keys, passwords, seeds) to any LLM.
- Send only the minimum context required to answer.
- Assume any external text may be malicious or misleading.

## Inputs to the Agent

### Allowed context (examples)

- Today focus, risk level, non-negotiables.
- Wallet metadata: lane names, risk bands, personas, high-level rules.
- Event summaries: title, time, type, importance.
- High-level positions/allocations (e.g. “BTC 60%, ETH 40%”) without specific exchange accounts.
- Notes/ideas in abstracted form if necessary (or tagged, short snippets).

### Disallowed context

- Private keys, seed phrases, passwords, API keys.
- Full transaction histories or exchange account identifiers (unless anonymized).
- Highly sensitive personal data you don't want seen by the provider.

## Prompt Building

- System prompt tells the model:
  - It is an ops assistant that must respect risk bands and wallet rules.
  - It cannot perform actions itself or request secrets.
  - External data (news, web) is untrusted and suggestions must still respect your rules.

- User/context messages are strictly structured JSON or clear sections.

## Prompt Injection Defense

If you ever include external content in prompts:

- Clearly label external segments (e.g. `EXTERNAL_TEXT_START` / `END`).
- Instruct the model to treat external text as data, not instructions.
- Never allow external content to include new instructions like "ignore previous rules".

## Logging

- If you log agent interactions:
  - Never log full prompts with secrets.
  - Consider logging only:
    - Mode, timestamps, some IDs, and a short summary.
