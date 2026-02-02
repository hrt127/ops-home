# Ops-Home Agent Setup Guide

## Quick Start

The Ops-Home agent is now **Phase 2 Ready** — it can call real LLMs (OpenAI or Anthropic). By default, it runs in **stub mode** (no API key = demo responses). To activate the real agent, configure your LLM provider.

---

## Setup Instructions

### Step 1: Copy Environment Template
```bash
cp .env.example .env.local
```

### Step 2: Choose Your LLM Provider

#### Option A: OpenAI (Recommended for Beginners)

1. Visit [OpenAI API Keys](https://platform.openai.com/account/api-keys)
2. Create a new API key
3. Edit `.env.local`:
   ```
   LLM_PROVIDER=openai
   LLM_API_KEY=sk-...your-key...
   LLM_MODEL=gpt-3.5-turbo
   ```
4. Costs: ~$0.001 per agent request (gpt-3.5-turbo)

**Recommended Models:**
- `gpt-3.5-turbo` (fastest, cheapest, 70% of GPT-4 quality)
- `gpt-4-turbo` (slower, more expensive, best quality)
- `gpt-4o` (newer, well-balanced)

#### Option B: Anthropic Claude (Recommended for Quality)

1. Visit [Anthropic Console](https://console.anthropic.com/account/keys)
2. Create an API key
3. Edit `.env.local`:
   ```
   LLM_PROVIDER=anthropic
   LLM_API_KEY=sk-ant-...your-key...
   LLM_MODEL=claude-3-5-sonnet-20241022
   ```
4. Costs: ~$0.003 per agent request

**Recommended Models:**
- `claude-3-5-sonnet-20241022` (balanced, ~$3/million input tokens)
- `claude-3-opus-20250219` (best quality, ~$15/million input tokens)

### Step 3: Restart Dev Server
```bash
npm run dev
```

The server automatically picks up `.env.local` changes.

### Step 4: Test the Agent

1. Go to http://localhost:3000
2. Fill in:
   - **Mode**: Select "Daily plan", "Risk audit", or "Market scan"
   - **Focus**: e.g., "Rebalance portfolio, prepare for FOMC"
   - **Risk level**: Drag to 1–10
   - **Non-negotiables**: e.g., "Keep cold storage untouched"
   - **Extra context**: (optional) "BTC and ETH up 15%, should I take profits?"

3. Click **"Run agent"**
4. Watch the response stream in (check console)

---

## How It Works

### Agent Request Flow
```
User Input (page.tsx)
  ↓
AgentConsole serializes to AgentRequestPayload
  ↓
POST /api/agent
  ↓
lib/prompt-builder formats into system + user prompt
  ↓
lib/llm calls OpenAI or Anthropic API
  ↓
lib/response-parser validates and structures response
  ↓
AgentResponsePayload returned to UI
  ↓
Display summary, bullets, warnings
```

### Prompt Example

For **mode=daily-plan** with wallets and events, the system sends:

**System Prompt:**
```
You are a concise, expert financial advisor...
For daily planning, prioritize:
1. Wallet operations and spending goals
2. Upcoming events and deadlines
...
```

**User Prompt:**
```
## Today's Context
Focus: Rebalance portfolio
Risk level: 6/10 (elevated)
Non-negotiables: Cold storage safety

## Wallets
- Cold storage [SAFE] — Long-term safety
- Ops core [OPERATIONAL] — Daily spend

## Upcoming Events
Today: BTC options expiry [HIGH]
Tomorrow: FOMC meeting [HIGH]

## Additional Context
(user's optional question)

Please provide concise, actionable guidance...
```

---

## Pricing & Budget

### Typical Usage
- 1 agent request ≈ 200–400 input tokens + 100–300 output tokens
- 10 requests/day = ~$0.01–0.05/day (OpenAI) or ~$0.03–0.15/day (Anthropic)

### Cost Monitoring
- OpenAI: https://platform.openai.com/account/billing/usage
- Anthropic: https://console.anthropic.com/account/usage

### Budget Tips
1. Use `gpt-3.5-turbo` to minimize cost
2. Set `max_tokens` in `lib/llm.ts` (currently 1000)
3. Cache identical prompts if you run multiple agents
4. Monitor usage in the details field (token count shown)

---

## Troubleshooting

### "Error: LLM request failed"

**Check 1: API Key Valid?**
```bash
# OpenAI test
curl -H "Authorization: Bearer $LLM_API_KEY" \
  https://api.openai.com/v1/models | head -20

# Anthropic test
curl -H "x-api-key: $LLM_API_KEY" \
  https://api.anthropic.com/v1/models
```

**Check 2: Quota Exceeded?**
- Visit OpenAI/Anthropic console → Billing → Check usage
- Add payment method or increase spending limit

**Check 3: Network Error?**
- Ensure you have internet access
- Try again in a few seconds (transient issue)

### "Agent returns stub response"

**This means:**
- `LLM_API_KEY` is not set in `.env.local`
- Dev server hasn't restarted since adding the key
- Use stub responses for testing (they're actually quite good!)

### Response is garbled or malformed

**The parser handles this:**
- If JSON parsing fails, it extracts text from markdown blocks
- If that fails, it treats the entire response as summary
- Check server logs: `npm run dev` will show errors

---

## Advanced Configuration

### Custom Model Selection

Edit `.env.local`:
```
LLM_MODEL=gpt-4-turbo
```

Or dynamically in code (later phase):
```typescript
// In lib/llm.ts callLLM function
const model = config.model || "gpt-3.5-turbo";
```

### Temperature & Token Limits

Edit `app/api/agent/route.ts`:
```typescript
{
  systemPrompt,
  userPrompt,
  temperature: 0.7,        // 0 = deterministic, 1 = creative
  maxTokens: 1000,         // Limit response length
}
```

### Streaming Responses (Future)

For real-time streaming (Phase 2B), update the route to use streaming APIs:
```typescript
// Future: return NextResponse with SSE stream
```

---

## Next Steps After Setup

1. **Test Different Modes** — Daily plan, risk audit, market scan each have unique prompts
2. **Refine Wallets & Events** — More detailed context → better agent advice
3. **Phase 3** — Wire external data (prices, wallet balances, news feeds)
4. **Phase 4** — Add database persistence for multi-device sync

---

## Security Notes

- **Never commit `.env.local`** — it's in `.gitignore`
- **Rotate API keys regularly** — if you accidentally commit one, it's compromised
- **Use least-privilege keys** — if the provider allows, restrict API key usage
- **Monitor costs** — set spending alerts in your provider dashboard
- **Use `/api/agent` as proxy** — never expose API key to frontend

---

**Questions or Issues?**
- Check server logs: `npm run dev`
- Review prompt output in browser console
- Test with different wallet/event data
- Reduce `maxTokens` if costs are high

Happy planning! 🚀
