# Phase 3: External Data APIs — Planning & Implementation Guide

## Overview

Phase 3 brings live market data, wallet balances, and event sources into Ops-Home. This keeps your cockpit current without manual updates.

---

## APIs to Integrate

### 1. Market Data Feed (For MarketStrip)

**Purpose:** Display live BTC/ETH prices, 24h change, and market cap

#### Option A: CoinGecko (Free, No API Key)
- **Endpoint**: `https://api.coingecko.com/api/v3/simple/price`
- **Pros**: Free, simple, no auth needed
- **Cons**: Rate-limited to 10–50 req/min, no historical data
- **Example**:
```typescript
const prices = await fetch(
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_market_cap=true&include_24hr_change=true'
).then(r => r.json());
// Returns: { bitcoin: { usd: 42000, usd_24h_change: 3.5, usd_market_cap: 820000000000 }, ... }
```

#### Option B: Alchemy (Premium, Better Data)
- **Endpoint**: `https://api.alchemy.com/v2/{API_KEY}`
- **Pros**: Fast, reliable, token data, NFT support
- **Cons**: Requires API key, costs scale with volume
- **Use for**: Token holdings, balance updates

#### Option C: Chainlink (On-Chain Oracles)
- **Use case**: Integrate price feeds directly in smart contracts (future)
- **Pros**: Decentralized, on-chain verified
- **Cons**: More complex, for contract-level integration

**Recommendation**: Start with **CoinGecko** (free), upgrade to **Alchemy** if you need wallet balances.

### 2. Wallet Balance & Transaction Data (For WalletBriefing)

**Purpose:** Show current holdings, recent transactions, NFT portfolio

#### Option A: Etherscan API (Free)
- **Endpoint**: `https://api.etherscan.io/api`
- **Pros**: Free tier available, simple balance/transaction queries
- **Cons**: Limited to Ethereum, slow response
- **Example**:
```typescript
const balance = await fetch(
  'https://api.etherscan.io/api?module=account&action=balance&address=0x...&apikey=YOUR_KEY'
).then(r => r.json());
// Returns: { result: "1234567890000000000" } (in wei)
```

#### Option B: Alchemy NFT API
- **Endpoint**: `https://nft-api.alchemy.com/v3/{API_KEY}`
- **Pros**: Fast, supports multiple chains, NFT data
- **Cons**: Paid API
- **Example**:
```typescript
const nfts = await fetch(
  `https://nft-api.alchemy.com/v3/{API_KEY}/getNFTs?owner=0x...`
).then(r => r.json());
// Returns: { ownedNfts: [...], totalCount: 42 }
```

#### Option C: Covalent API (Multi-Chain)
- **Endpoint**: `https://api.covalenthq.com/v1/{CHAIN_ID}/address/{ADDRESS}`
- **Pros**: Supports 200+ blockchains, token + NFT data
- **Cons**: Requires API key
- **Example**:
```typescript
const portfolio = await fetch(
  `https://api.covalenthq.com/v1/1/address/0x.../balances_v2/?key=YOUR_KEY`
).then(r => r.json());
// Returns: { data: { items: [{ contract_address, balance, ... }] } }
```

**Recommendation**: Start with **Etherscan** (free), upgrade to **Covalent** for multi-chain support.

### 3. Event Sources (For EventsPanel)

**Purpose:** Import upcoming events from markets, macro calendars, sports

#### Option A: Polymarket API (Prediction Markets)
- **Endpoint**: `https://clob.polymarket.com`
- **Pros**: Crypto-native, active markets, real-time
- **Cons**: Complex order book format, requires parsing
- **Example**:
```typescript
// Fetch active markets
const markets = await fetch(
  'https://clob.polymarket.com/markets?limit=100'
).then(r => r.json());
// Returns: [ { id, question, endDate, ... } ]
```

#### Option B: NewsAPI (Headlines)
- **Endpoint**: `https://newsapi.org/v2/everything`
- **Pros**: Free tier, easy to use, crypto news available
- **Cons**: Limited to news, no real events
- **Example**:
```typescript
const news = await fetch(
  'https://newsapi.org/v2/everything?q=bitcoin&sortBy=publishedAt&apiKey=YOUR_KEY'
).then(r => r.json());
// Returns: { articles: [ { title, description, url, ... } ] }
```

#### Option C: Economic Calendar API (Macro Events)
- **Options**: TradingEconomics, Investing.com, AlphaVantage
- **Pros**: FOMC, inflation, GDP releases
- **Cons**: Most require paid APIs
- **Manual**: Hardcode key dates (FOMC, CPI releases) in seed data

**Recommendation**: Start with **hardcoded seed data** (you already have this), add NewsAPI for crypto headlines.

### 4. Farcaster Integration (Phase 4 Preview)

**Purpose:** Social signals, trends, network activity

#### Option: Farcaster Hub API
- **Endpoint**: `https://hub.pinata.cloud`
- **Pros**: Open source, trustless, live feed
- **Cons**: Complex data model
- **Future use**: Display trending casts, follower activity, tip opportunities

---

## Implementation Pattern

All Phase 3 APIs follow this pattern:

### 1. Create Utility in `lib/`
```typescript
// lib/market-data.ts
export async function getPrices(): Promise<MarketPrices> {
  const res = await fetch('...');
  return res.json();
}
```

### 2. Create Server API Route
```typescript
// app/api/market/route.ts
export async function GET() {
  const prices = await getPrices();
  return NextResponse.json(prices);
}
```

### 3. Call from Frontend
```typescript
// components/MarketStrip.tsx
const [prices, setPrices] = useState(null);
useEffect(() => {
  fetch('/api/market').then(r => r.json()).then(setPrices);
}, []);
```

### 4. Cache Responses
```typescript
// Use Next.js built-in caching
export const revalidate = 300; // Cache for 5 minutes
```

---

## Recommended Phase 3 Implementation Order

### Priority 1 (Week 1)
- [ ] CoinGecko price feed → `MarketStrip`
- [ ] Etherscan balance → `WalletBriefing` (optional)
- [ ] NewsAPI crypto headlines → `EventsPanel` (as feed)

### Priority 2 (Week 2)
- [ ] Covalent multi-chain balances
- [ ] Polymarket active markets
- [ ] Refine `EventsPanel` with external sources

### Priority 3 (Week 3)
- [ ] Cache optimization
- [ ] Error handling for API downtime
- [ ] Fallback to hardcoded data

---

## Environment Variables for Phase 3

Add to `.env.local`:

```env
# Market Data
COINGECKO_API_KEY=free  # Optional, for priority requests
ALCHEMY_API_KEY=your-key
ETHERSCAN_API_KEY=your-key
COVALENT_API_KEY=your-key

# Events
NEWSAPI_KEY=your-key
POLYMARKET_API_KEY=optional

# Cache settings
CACHE_MARKET_DATA=300  # Seconds
CACHE_WALLET_DATA=600
```

---

## Testing Phase 3 APIs

### Without Auth (CoinGecko)
```bash
curl 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
```

### With Auth (Alchemy, Etherscan)
```bash
curl 'https://api.etherscan.io/api?module=account&action=balance&address=0x...&apikey=YOUR_KEY'
```

### In Code (Next.js Test Route)
```typescript
// app/api/test-markets/route.ts
export async function GET() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
// Visit: http://localhost:3000/api/test-markets
```

---

## Cost Analysis

| API | Free Tier | Cost | Notes |
|-----|-----------|------|-------|
| CoinGecko | Yes, 10–50 req/min | Free | Start here |
| Etherscan | Yes, 5 req/sec | Free | Balance lookups |
| NewsAPI | Yes, 100 req/day | ~$30/mo | Upgrade for unlimited |
| Alchemy | No | ~$100+/mo | For wallet data |
| Covalent | Limited free | ~$50+/mo | Multi-chain balance |
| Polymarket | Yes | Free | Market data |

**Budget Recommendation**: Start with free tier ($0), upgrade to Alchemy ($100/mo) if managing multiple wallets.

---

## Next Steps

1. **Pick one API** to start (suggest: CoinGecko)
2. **Create test route** in `app/api/test-coingecko/route.ts`
3. **Verify response format**
4. **Integrate into component** (MarketStrip, WalletBriefing)
5. **Add caching** with Next.js revalidate
6. **Move to production**

---

**Ready to implement Phase 3?** Start with CoinGecko and WalletBriefing balance lookups. Both are free and give instant value! 🚀
