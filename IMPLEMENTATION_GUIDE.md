# Phase 3→4 Implementation Guide
**Ops-Home Dashboard Development**

---

## 🎯 Overview

This document tracks the implementation of the 12-panel Ops-Home dashboard following the Phase 3→4 architecture with SQLite as the primary data layer.

**Architecture Decision**: SQLite-first, not JSON-first. The `wallets.json` and `projects.json` files serve as "genesis state" that seeds the database.

---

## ✅ Completed Components

### 1. Market Strip (Panel 1)
**File**: `src/components/MarketStripEnhanced.tsx`

**Features**:
- Live price ticker (BTC, ETH, SOL, BNB)
- 24h change indicators (green/red)
- Machi Samurai branding
- Live clock with date
- Status indicator (Online)

**Design**:
- Dark background with glassmorphism
- Gradient branding badge
- Monospace fonts for prices
- Color-coded price changes

---

### 2. Wallet Manager (Panel 2)
**File**: `src/components/WalletManager.tsx`

**Features**:
- Wallets grouped by lane (Identity, Trading, Treasury, LP)
- Collapsible lane sections
- Wallet selection state
- Risk band badges (Safe, Medium, High)
- Balance display (stubbed - needs live data)
- Last activity timestamp

**Design**:
- Hierarchical lane structure
- Color-coded lanes (cyan, amber, emerald, purple)
- Selected wallet highlight (cyan border)
- Status dots (green = active, gray = inactive)

**Data Flow**:
```
GET /api/wallets → WalletManager → onSelectWallet → ActiveSession
```

---

### 3. Active Session (Panel 2b)
**File**: `src/components/ActiveSession.tsx`

**Features**:
- Selected wallet details
- Live balance display (4.2045 ETH example)
- USD conversion
- Risk band badge
- Permission gating:
  - Allowed actions (green pills with checkmarks)
  - Forbidden actions (red pills with X, strikethrough)
  - Allowed dapps (blue pills)
- Session status indicator

**Design**:
- Gradient header
- Large balance display (5xl font)
- Grouped permission sections
- Color-coded action badges

**Data Source**:
- Wallet object from `WalletManager`
- Balance from `/api/wallets/[id]/balance`

---

### 4. System Log (Panel 6)
**File**: `src/components/SystemLog.tsx`

**Features**:
- Terminal-style log display
- Color-coded log levels:
  - Success (emerald)
  - Info (cyan)
  - Warning (amber)
  - Error (rose)
- Auto-scroll toggle
- Clear button
- Timestamp formatting (HH:MM:SS)
- Entry counter

**Design**:
- Black background with monospace font
- Thin scrollbar
- Window controls (minimize, maximize, close)
- Footer with stats

**Sample Logs**:
- System connection status
- Authentication events
- Network monitoring
- Security alerts

---

### 5. Calendar Panel (Panel 3)
**File**: `src/components/CalendarPanel.tsx`

**Features**:
- Event list with importance levels
- Time display
- Event type badges (ongoing, time-bound)
- Add event button

**Status**: Scaffolded - needs database integration

---

### 6. Notes Panel (Panel 4)
**File**: `src/components/NotesPanelEnhanced.tsx`

**Features**:
- Quick capture input
- Timestamped notes
- Scrollable list
- Note counter

**Status**: Scaffolded - needs database persistence

---

### 7. Ideas Panel (Panel 5)
**File**: `src/components/IdeasPanelEnhanced.tsx`

**Features**:
- Idea cards with status badges
- Status pipeline: Idea → Shaping → Live
- Color-coded statuses

**Status**: Scaffolded - needs database persistence

---

### 8. Project Manager (Panel 12)
**File**: `src/components/ProjectManager.tsx`

**Features**:
- Project grid (2 columns)
- Status badges (live, paused, idea)
- Project paths
- Project counter

**Status**: Scaffolded - needs database integration

---

## 📊 Dashboard Layout

**File**: `src/app/dashboard/page.tsx`

**Grid Structure** (12 columns):
```
┌─────────────────────────────────────────────┐
│  Market Strip (Full Width)                  │
├───────────┬─────────────────┬───────────────┤
│  Wallet   │  Calendar       │  Active       │
│  Manager  │  (Panel 3)      │  Session      │
│  (Panel 2)│                 │  (Panel 2b)   │
│  3 cols   ├─────────────────┤  4 cols       │
│           │  Notes          ├───────────────┤
│           │  (Panel 4)      │  Ideas        │
│           │                 │  (Panel 5)    │
│           ├─────────────────┤               │
│           │  System Log     ├───────────────┤
│           │  (Panel 6)      │  Projects     │
│           │  5 cols         │  (Panel 12)   │
└───────────┴─────────────────┴───────────────┘
```

**Responsive**: 
- Desktop: 12-column grid
- Tablet: Stack to 2 columns
- Mobile: Single column

---

## 🗄️ Database Architecture

### Schema
**File**: `src/lib/db-schema.ts`

**Tables**:
1. `wallets` - Wallet registry with risk bands, lanes, permissions
2. `projects` - Project metadata
3. `contracts` - Smart contract addresses
4. `liquidity` - Liquidity pool tracking
5. `events` - Activity log
6. `notes` - User notes
7. `ideas` - Idea pipeline
8. `daily_context` - Daily focus/tasks
9. `sync_metadata` - Change tracking

### Database Singleton
**File**: `src/lib/db.ts`

Provides application-wide access to the SQLite database at:
```
~/dojo/projects/ops-home/data/ops-home.db
```

### Type Schemas
**Files**: 
- `src/lib/wallets.ts` - Wallet types and Zod schemas
- `src/lib/projects.ts` - Project types and Zod schemas

---

## 🔌 API Endpoints

### Implemented

#### `GET /api/wallets`
**File**: `src/app/api/wallets/route.ts`

Returns all wallets from SQLite database.

**Response**:
```json
{
  "wallets": [
    {
      "id": "IDENTITY_FARCASTER_BASE",
      "address": "0x...",
      "lane": "identity",
      "risk_band": "high",
      "allowed_actions": ["sign_message"],
      "forbidden_actions": ["trade", "lp_provide"],
      ...
    }
  ]
}
```

#### `POST /api/wallets`
**File**: `src/app/api/wallets/route.ts`

Add or update a wallet in the database.

**Request Body**:
```json
{
  "id": "NEW_WALLET",
  "address": "0x...",
  "lane": "trading",
  "risk_band": "medium",
  ...
}
```

#### `GET /api/wallets/[id]/balance`
**File**: `src/app/api/wallets/[id]/balance/route.ts`

Fetches live ETH balance for a wallet using Etherscan API.

**Response**:
```json
{
  "wallet_id": "IDENTITY_FARCASTER_BASE",
  "address": "0x...",
  "balance_eth": 4.2045,
  "balance_wei": "4204500000000000000"
}
```

### Planned

- `GET /api/projects` - Fetch all projects
- `GET /api/market` - Market data (CoinGecko)
- `GET /api/events` - Calendar events
- `POST /api/notes` - Create/update notes
- `POST /api/ideas` - Create/update ideas

---

## 🎨 Design System

### Colors

**Primary Palette**:
- Background: `slate-950` (#020617)
- Panels: `gray-900/50` with backdrop-blur
- Borders: `gray-800` (#1f2937)

**Accent Colors**:
- Cyan: `cyan-400` (#22d3ee) - Primary actions, links
- Emerald: `emerald-400` (#34d399) - Success, allowed, safe
- Amber: `amber-400` (#fbbf24) - Warning, medium risk
- Rose: `rose-400` (#fb7185) - Error, forbidden, high risk
- Purple: `purple-400` (#c084fc) - LP lane, special features

**Risk Bands**:
- Safe: Emerald (green)
- Medium: Amber (yellow)
- High: Rose (red)

### Typography

**Fonts**:
- UI Text: System sans-serif
- Data/Code: Monospace (font-mono)

**Sizes**:
- Headers: `text-sm` to `text-lg`, `font-bold`, `uppercase`, `tracking-wide`
- Body: `text-sm` to `text-base`
- Labels: `text-xs`, `uppercase`, `tracking-wide`
- Code: `text-xs` to `text-sm`, `font-mono`

### Components

**Panel Structure**:
```tsx
<div className="rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
  {/* Header */}
  <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 px-4 py-3">
    <h2>Panel Title</h2>
  </div>
  
  {/* Content */}
  <div className="p-4">
    {/* Panel content */}
  </div>
  
  {/* Footer (optional) */}
  <div className="bg-gray-900/80 border-t border-gray-800 px-4 py-2">
    {/* Footer content */}
  </div>
</div>
```

**Badges**:
- Rounded: `rounded-full`
- Padding: `px-2 py-0.5` or `px-3 py-1`
- Border: `border`
- Background: `bg-{color}-500/20`
- Text: `text-{color}-400`

**Buttons**:
- Primary: `bg-cyan-500 hover:bg-cyan-600 text-white`
- Secondary: `bg-gray-800 hover:bg-gray-700 border border-gray-700`
- Text: `text-cyan-400 hover:text-cyan-300`

---

## 🚀 Next Steps

### 1. Environment Setup (BLOCKER)
- [ ] Upgrade Node.js from v18.19.1 to v20.9.0+
- [ ] Run `npm install` successfully
- [ ] Verify all dependencies installed

### 2. Database Seeding
- [ ] Run `npx tsx scripts/load_registries.ts`
- [ ] Verify wallets loaded into SQLite
- [ ] Verify projects loaded into SQLite
- [ ] Test API endpoints return data

### 3. API Configuration
- [ ] Add `ETHERSCAN_API_KEY` to `.env`
- [ ] Test live balance endpoint
- [ ] Add `COINGECKO_API_KEY` (if needed)

### 4. Component Integration
- [ ] Test dashboard page renders
- [ ] Verify wallet selection flow
- [ ] Test live balance display
- [ ] Verify permission gating logic

### 5. Database Persistence
- [ ] Connect Notes panel to database
- [ ] Connect Ideas panel to database
- [ ] Connect Calendar panel to database
- [ ] Connect Projects panel to database

### 6. Live Data Integration
- [ ] Market data API (CoinGecko)
- [ ] Social feeds (Farcaster/Twitter)
- [ ] Market events
- [ ] Implement caching/rate limiting

### 7. Testing & Refinement
- [ ] Browser testing (Chrome, Firefox)
- [ ] Responsive design testing
- [ ] Performance optimization
- [ ] Error handling

### 8. Documentation
- [ ] Update PROJECT_CONTEXT.md
- [ ] Run `dojo sync` to update snapshot
- [ ] Create user guide
- [ ] Document API endpoints

---

## 📝 Development Notes

### Wallet Permission Gating

The `useWalletGating` hook (in `src/hooks/useWalletGating.ts`) provides:

```typescript
const { canPerformAction, canInteractWithDapp } = useWalletGating(wallet);

// Check if action is allowed
const result = canPerformAction("trade");
// result = { allowed: false, reason: "Explicitly forbidden" }

// Check if dapp is allowed
const result = canInteractWithDapp("uniswap");
// result = { allowed: true, reason: "Explicitly allowed" }
```

**Logic**:
1. If action/dapp is in `forbidden_*` → DENY
2. If action/dapp is in `allowed_*` → ALLOW
3. If neither → DENY (default-deny)

### Data Loading Pattern

All panels follow this pattern:

```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("/api/endpoint")
    .then(res => res.json())
    .then(data => {
      setData(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
}, []);
```

### Live Updates

For real-time data (balances, prices):

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    // Fetch updated data
  }, 10000); // 10 seconds

  return () => clearInterval(interval);
}, []);
```

---

## 🐛 Known Issues

1. **Node.js Version**: v18.19.1 is incompatible with Next.js 16 and better-sqlite3
2. **NPM Install**: Fails due to network timeouts and Node version
3. **Type Definitions**: Some lint errors for missing type declarations (will resolve after npm install)

---

## 📚 References

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [better-sqlite3 Docs](https://github.com/WiseLibs/better-sqlite3)
- [Zod Docs](https://zod.dev)
- [Etherscan API Docs](https://docs.etherscan.io)

---

**Last Updated**: 2026-01-31 06:40 UTC+2
