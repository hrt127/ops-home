# Component Specifications — ops-home

**Purpose**: Living design document defining each panel's functionality, data requirements, and integration points.  
**Status**: v1.0 — Initial specification  
**Last Updated**: 2026-01-01

---

## Design Philosophy

**Everything comes to me. I don't leave the cockpit.**

- All external data flows INTO the dashboard
- No context switching to other apps
- Agent-first interactions for complex tasks
- Single source of truth for daily operations
- Progressive disclosure: simple by default, complex on demand

---

## Panel Architecture

Each panel follows this structure:

```typescript
interface PanelSpec {
  name: string;
  purpose: string;
  dataSources: string[];
  writes_to: string[];
  agent_integration: string;
  mvp_features: string[];
  future_features: string[];
  ui_behavior: {
    collapsible: boolean;
    live_updates: boolean;
    keyboard_shortcuts: string[];
  };
}
```

---

## 1. MARKET STRIP (Top Bar)

### Purpose
Real-time market awareness without leaving focus. Ambient information display.

### MVP Features
- [ ] Live crypto prices (BTC, ETH, SOL, + user watchlist)
- [ ] 24h % change with color coding (green/red)
- [ ] Current time + timezone
- [ ] Gas price (ETH mainnet)
- [ ] Fear & Greed Index
- [ ] Quick add/remove assets to watchlist

### Data Sources
- CoinGecko API (prices, 24h volume, market cap)
- Etherscan/Blocknative (gas prices)
- Alternative.me (Fear & Greed)
- User's wallet holdings (auto-populate watchlist)

### Writes To
- `Market` table (price history for charting)
- `UserPreferences` (watchlist)

### Agent Integration
**Trigger**: "What's moving today?"  
**Response**: Agent surfaces assets with >10% 24h change, correlates with user's portfolio exposure

### UI Behavior
- Always visible (pinned top)
- Auto-refresh: 30 seconds
- Click asset → mini chart modal (7-day sparkline)
- Right-click → "Add to watchlist" / "Analyze with agent"

### Future Features
- [ ] Multi-chain gas (Arbitrum, Base, Polygon)
- [ ] Custom alerts (price thresholds)
- [ ] Twitter sentiment indicators
- [ ] Funding rates for perps

---

## 2. WALLET MANAGER (Left Column)

### Purpose
Single-glance portfolio state. Risk management enforced at interface level.

### MVP Features
- [ ] **Risk band lanes**: SAFE / OPS / SPEC (color-coded)
- [ ] Real-time balance per wallet (USD + native)
- [ ] Transaction count + last activity timestamp
- [ ] Wallet rules enforcement (forbiddenWith / allowedWith)
- [ ] Quick send (with rule validation)
- [ ] Balance history chart (7d/30d sparkline)
- [ ] Export all wallet data (CSV)

### Data Sources
- Alchemy API (balances, transaction history)
- Etherscan/Basescan (transaction details)
- User-defined rules (stored in `Wallet` table)
- Price data from Market Strip

### Writes To
- `Wallet` table (metadata, rules, notes)
- `Transaction` table (initiated sends)
- `WalletSnapshot` table (daily balance snapshots)

### Agent Integration
**Triggers**:
- "Should I rebalance?"
- "What's safe to spend today?"
- "Check for rule violations"

**Agent Actions**:
- Analyze concentration risk
- Suggest rebalancing moves
- Flag suspicious transactions
- Recommend gas-optimal times

### UI Behavior
- Drag-and-drop between risk bands (with confirmation)
- Click wallet → expand full details
- Hover → tooltip with quick stats
- Keyboard: `1/2/3` to jump to SAFE/OPS/SPEC

### Future Features
- [ ] Multi-sig wallet support
- [ ] DeFi position tracking (Aave, Uniswap LP)
- [ ] NFT holdings view
- [ ] Automatic tax lot tracking
- [ ] Simulate transactions before sending

---

## 3. EVENTS & CALENDAR (Center Column)

### Purpose
Time-aware operations. Blend personal schedule with market events and agent reminders.

### MVP Features
- [ ] 3-day view (today, tomorrow, +2)
- [ ] Quick add event (title, time, importance)
- [ ] Event types: `personal`, `market`, `deadline`, `agent-suggested`
- [ ] Importance levels: LOW / NORMAL / HIGH / CRITICAL
- [ ] One-click reschedule (drag to new day)
- [ ] Recurring events (daily, weekly)
- [ ] Agent-generated reminders auto-populate here

### Data Sources
- User input (manual events)
- Agent suggestions (parsed from agent responses)
- Market calendar APIs (CoinMarketCal, Token Unlocks)
- Google Calendar sync (optional)
- Farcaster event aggregation

### Writes To
- `Event` table
- `AgentReminder` table (for tracking agent-generated tasks)

### Agent Integration
**Triggers**:
- "What should I focus on today?"
- "Add reminder: check wallet balances at 4pm"
- "Any important events this week?"

**Agent Actions**:
- Parse natural language → structured events
- Prioritize events based on portfolio exposure
- Suggest optimal task ordering
- Block out "deep work" time

### UI Behavior
- Drag events between days
- Color-coded by importance
- Click → expand to show notes/context
- Snooze button (reschedule +1 day)
- Keyboard: `t` to add event for today

### Future Features
- [ ] Calendar view (month grid)
- [ ] Event templates ("Daily wallet check")
- [ ] Conflict detection
- [ ] Travel time estimates (if location-based)
- [ ] Integration with Polymarket (bet on event outcomes)

---

## 4. NOTES & CAPTURE (Right Column, Top)

### Purpose
Frictionless thought capture. Zero-friction inbox for ideas that need triage.

### MVP Features
- [ ] Quick capture input (always visible)
- [ ] Auto-timestamp on save
- [ ] Full-text search
- [ ] Tag system (`#trading`, `#ideas`, `#bugs`)
- [ ] Pin important notes to top
- [ ] Export to markdown
- [ ] Voice-to-text input

### Data Sources
- User input
- Agent transcripts (save conversations as notes)
- Clipboard monitor (optional: auto-capture links)

### Writes To
- `Note` table
- `NoteTag` table (many-to-many)

### Agent Integration
**Triggers**:
- "Summarize my notes from yesterday"
- "Find notes about rebalancing"
- "Convert this note to a task"

**Agent Actions**:
- Auto-tag notes based on content
- Suggest related notes when writing
- Extract action items → convert to events
- Summarize weekly notes

### UI Behavior
- Auto-save on blur (no save button)
- Markdown preview toggle
- Keyboard: `n` to new note, `/` to search
- Recent notes float to top

### Future Features
- [ ] Rich text editor (bold, lists, code blocks)
- [ ] Attach files/images
- [ ] Note linking (wiki-style)
- [ ] Share note → generate public link
- [ ] OCR for handwritten notes (via phone capture)

---

## 5. IDEAS & STATUS (Right Column, Middle)

### Purpose
Project lifecycle tracking. Move ideas from conception → execution with clear stages.

### MVP Features
- [ ] Status workflow: `idea` → `shaping` → `live` → `paused` → `archived`
- [ ] One-click status change
- [ ] Progress indicator (0-100%)
- [ ] Due date assignment
- [ ] Tag with arena/project type
- [ ] Convert to full project (creates in Project Manager)

### Data Sources
- User input
- Notes (promote note → idea)
- Agent brainstorm sessions

### Writes To
- `Idea` table
- `Project` table (when promoted)

### Agent Integration
**Triggers**:
- "Help me shape this idea: [description]"
- "What should I work on next?"
- "Is this idea feasible?"

**Agent Actions**:
- Ask clarifying questions
- Break idea into subtasks
- Estimate effort/complexity
- Find similar existing projects
- Suggest tech stack

### UI Behavior
- Click status badge → cycle through states
- Drag ideas to reorder priority
- Archive button (soft delete)
- Keyboard: `i` to new idea

### Future Features
- [ ] Idea voting (if multi-user)
- [ ] Dependencies between ideas
- [ ] Time tracking per idea
- [ ] Export to GitHub issue
- [ ] AI-generated project plans

---

## 6. AGENT CONSOLE (Bottom, Full Width)

### Purpose
Primary interface for AI-assisted decision-making. Your PA, analyst, and coach in one.

### MVP Features
- [ ] **Multi-mode interface**:
  - `Daily Plan`: Morning briefing + prioritization
  - `Risk Audit`: Portfolio analysis + rule violations
  - `Market Scan`: Opportunities + threats
  - `PA Mode`: Task management + scheduling
  - `Poker Coach`: Hand analysis + strategy
  - `Learning Lab`: Explain concepts + test skills
- [ ] Context-aware prompts (knows your wallets, events, notes)
- [ ] Conversation history (searchable)
- [ ] Suggested actions (one-click execute)
- [ ] Cost tracking per conversation
- [ ] Export conversation to note

### Data Sources
- All other panels (full dashboard context)
- External APIs (market data, news, etc.)
- User's historical interactions
- Custom knowledge base (uploaded docs)

### Writes To
- `AgentConversation` table
- `AgentAction` table (for audit trail)
- `Event` table (when agent creates reminders)
- `Note` table (when saving transcripts)

### Agent Integration
**This IS the agent.** All interactions flow through here.

**Mode-Specific Behaviors**:

**Daily Plan Mode**:
- "What should I focus on today?"
- Surfaces high-priority events
- Checks wallet rules for planned transactions
- Suggests rebalancing if needed

**Risk Audit Mode**:
- "Any rule violations in last 24h?"
- Analyzes transaction patterns
- Flags unusual activity
- Calculates portfolio concentration

**Market Scan Mode**:
- "What's moving and why?"
- Correlates news with price action
- Suggests positioning changes
- Monitors Farcaster/Twitter sentiment

**PA Mode** (NEW):
- "Schedule my day"
- "Remind me to check wallets at 4pm"
- "What's on my plate this week?"
- Time-boxes tasks based on priority

**Poker Coach Mode** (NEW):
- "Analyze this hand: [paste hand history]"
- "What's my biggest leak?"
- "Quiz me on ICM calculations"
- Tracks win rate, ROI, session stats

**Learning Lab Mode** (NEW):
- "Explain impermanent loss"
- "Test me on options strategies"
- "Walk me through this smart contract"
- Adaptive difficulty based on performance

### UI Behavior
- Collapsible (keyboard: `a` to toggle)
- Mode tabs at top
- Auto-complete for common prompts
- Streaming responses (show tokens as they arrive)
- "Copy response" / "Save as note" buttons

### Future Features
- [ ] Voice input/output
- [ ] Multi-agent workflows (orchestrate specialized agents)
- [ ] Custom agent personalities
- [ ] Fine-tuned model on your data
- [ ] Agent marketplace (load community agents)

---

## 7. TRADING DASHBOARD (New Panel - Left Column Expansion)

### Purpose
Execution layer. Go from analysis → action without leaving the cockpit.

### MVP Features
- [ ] **Bot manager**:
  - List active bots (DCA, grid, arbitrage)
  - Start/stop/configure bots
  - Performance metrics (PnL, win rate)
  - Strategy templates
- [ ] **Manual trading interface**:
  - Quick buy/sell (with slippage protection)
  - Limit order placement
  - Position sizing calculator
  - Risk/reward visualizer
- [ ] **Portfolio analytics**:
  - Asset allocation pie chart
  - Correlation matrix
  - Sharpe ratio / max drawdown
  - Compare vs. BTC/ETH benchmark

### Data Sources
- Exchange APIs (Binance, Coinbase, DEX aggregators)
- Wallet balances (from Wallet Manager)
- Historical price data (from Market Strip)
- Bot performance logs

### Writes To
- `Bot` table (configurations, logs)
- `Trade` table (all executed trades)
- `PortfolioSnapshot` table (daily state)

### Agent Integration
**Triggers**:
- "Should I start a DCA bot for ETH?"
- "Backtest this grid strategy"
- "What's my worst performing bot?"

**Agent Actions**:
- Suggest bot parameters (grid range, DCA frequency)
- Analyze bot performance
- Recommend strategy adjustments
- Alert on bot errors/failures

### UI Behavior
- Toggle between "Bot View" and "Manual View"
- Real-time P&L updates
- One-click bot pause (for emergencies)
- Keyboard: `b` to open bot manager

### Future Features
- [ ] Backtesting engine
- [ ] Paper trading mode
- [ ] Social trading (copy strategies)
- [ ] Custom bot scripting (Python/TS)
- [ ] Multi-exchange aggregation

---

## 8. TASK MANAGER (New Panel - Integrates with Events)

### Purpose
GTD-style task management integrated with time-blocking.

### MVP Features
- [ ] Inbox (unsorted tasks)
- [ ] Today / This Week / Backlog views
- [ ] Project association (link to Ideas/Projects)
- [ ] Subtasks (nested todo items)
- [ ] Time estimates + actual time tracking
- [ ] Recurring tasks (daily standup, weekly review)
- [ ] Completed task archive with stats

### Data Sources
- User input
- Agent-generated tasks (from conversations)
- Email parser (forward tasks via email)

### Writes To
- `Task` table
- `TimeLog` table (Pomodoro tracking)

### Agent Integration
**Triggers**:
- "Plan my day"
- "What can I finish in 30 minutes?"
- "Review my completed tasks this week"

**Agent Actions**:
- Prioritize tasks based on deadlines + importance
- Time-box tasks into calendar
- Break large tasks into subtasks
- Estimate completion time

### UI Behavior
- Drag tasks to reorder
- Click to start timer (Pomodoro)
- Keyboard: `x` to mark complete, `d` to delete

### Future Features
- [ ] Task templates
- [ ] Dependencies (task A blocks task B)
- [ ] Eisenhower matrix view
- [ ] Integration with GitHub issues

---

## 9. SOCIAL FEED AGGREGATOR (New Panel - Right Column Bottom)

### Purpose
Curated information streams. Twitter/Farcaster/news WITHOUT leaving the cockpit.

### MVP Features
- [ ] **Feed sources**:
  - Twitter lists (crypto, traders, devs)
  - Farcaster channels (subscribed channels)
  - RSS feeds (blogs, podcasts)
  - Reddit subreddits (r/CryptoCurrency, etc.)
- [ ] **Smart filtering**:
  - Keyword alerts (your watchlist assets)
  - Sentiment analysis (flag negative news)
  - De-duplicate cross-posts
  - Block spam/low-quality posts
- [ ] **Actions**:
  - Save to notes
  - Ask agent to analyze
  - Share via Farcaster
  - Archive for later

### Data Sources
- Twitter API (paid tier for full access)
- Neynar API (Farcaster)
- RSS parsers
- Reddit API

### Writes To
- `SocialPost` table (cached posts)
- `SavedPost` table (user bookmarks)

### Agent Integration
**Triggers**:
- "Summarize today's Twitter feed"
- "What's the sentiment on SOL today?"
- "Any breaking news I should know?"

**Agent Actions**:
- Summarize threads
- Extract key points from long posts
- Translate foreign language posts
- Fact-check claims

### UI Behavior
- Infinite scroll (lazy load)
- Swipe actions (save, archive, share)
- Keyboard: `f` to open feed, `j/k` to scroll

### Future Features
- [ ] Auto-reply bot (Farcaster engagement)
- [ ] Network graph (who's influential)
- [ ] Post scheduling
- [ ] Analytics (track your engagement)

---

## 10. POKER LAB (New Panel - Full-Screen Mode)

### Purpose
Deliberate poker practice with AI coaching. Study + play in one place.

### MVP Features
- [ ] **Hand replayer**:
  - Paste hand history (PokerStars, GG format)
  - Visualize decision tree
  - Range analysis (GTO vs. exploitative)
  - Agent highlights mistakes
- [ ] **Study mode**:
  - Flashcards (preflop ranges, equity calcs)
  - Quiz mode (agent asks questions)
  - Strategy articles (with search)
- [ ] **Session tracker**:
  - Log results (date, stakes, profit, duration)
  - Graph win rate over time
  - Leak detection (agent analyzes patterns)
- [ ] **Simulator**:
  - Practice hands vs. AI opponents
  - Adjustable opponent profiles (loose/tight/aggro)

### Data Sources
- Hand history files (import)
- GTO solver databases (PioSOLVER exports)
- Poker tracking software APIs (PokerTracker, HM3)

### Writes To
- `PokerHand` table
- `PokerSession` table
- `PokerStudyCard` table

### Agent Integration
**Triggers**:
- "Analyze this hand"
- "What's my biggest leak?"
- "Quiz me on river play"

**Agent Actions**:
- Explain GTO strategy
- Suggest exploitative adjustments
- Generate practice scenarios
- Track improvement over time

### UI Behavior
- Full-screen mode (hide other panels)
- Hand replayer controls (play, pause, step)
- Keyboard: `p` to open poker lab

### Future Features
- [ ] Live hand import (screen scrape)
- [ ] Opponent tracking (notes on players)
- [ ] Bankroll management tools
- [ ] Multi-table session tracking

---

## 11. LEARNING LAB (New Panel - Expandable Modal)

### Purpose
Structured learning for crypto, trading, dev skills. Spaced repetition + agent tutoring.

### MVP Features
- [ ] **Course library**:
  - Topics: DeFi, smart contracts, trading strategies
  - Progress tracking (% complete)
  - Agent-curated content
- [ ] **Flashcard system**:
  - Anki-style spaced repetition
  - Auto-generate cards from notes
  - Image occlusion for diagrams
- [ ] **Sandbox environment**:
  - Embedded code editor (test Solidity)
  - Forked blockchain (Tenderly/Foundry)
  - Safe experimentation (no real funds)
- [ ] **Agent tutor**:
  - Ask questions about concepts
  - Request explanations (ELI5 mode)
  - Get feedback on code

### Data Sources
- Course content (markdown files)
- User-uploaded notes
- Public tutorials (GitHub, YouTube)

### Writes To
- `LearningCard` table
- `LearningProgress` table
- `CodeSnippet` table

### Agent Integration
**Triggers**:
- "Explain this concept"
- "Test my understanding"
- "Review my code"

**Agent Actions**:
- Generate study plans
- Create practice problems
- Grade exercises
- Recommend resources

### UI Behavior
- Modal overlay (doesn't disrupt main dashboard)
- Keyboard: `l` to open learning lab

### Future Features
- [ ] Video course integration
- [ ] Community study groups
- [ ] Certifications (proof of knowledge)
- [ ] AI-generated quizzes

---

## 12. PROJECT MANAGER (Dojo Map Expansion)

### Purpose
High-level project tracking. Connects ideas → execution → completion.

### MVP Features
- [ ] **Project cards**:
  - Name, status (live/paused/idea), progress %
  - Link to Git repo
  - Link to deployed URL
  - Key metrics (users, revenue, etc.)
- [ ] **Kanban board**:
  - Columns: Idea / In Progress / Shipped / Archived
  - Drag projects between columns
- [ ] **Timeline view**:
  - Gantt chart for project milestones
  - Dependencies between projects
- [ ] **Resource allocation**:
  - Time spent per project
  - Budget tracking

### Data Sources
- Git commits (GitHub API)
- Deployment logs (Vercel, Railway)
- User-defined milestones

### Writes To
- `Project` table
- `ProjectMilestone` table
- `ProjectMetric` table

### Agent Integration
**Triggers**:
- "What should I work on next?"
- "Status update on [project]"
- "Help me plan this feature"

**Agent Actions**:
- Suggest priority based on impact
- Break features into tasks
- Estimate completion time
- Flag blocked projects

### UI Behavior
- Click project → expand details
- Keyboard: `m` to open map

### Future Features
- [ ] Team collaboration (if multi-user)
- [ ] Integration with Linear/Jira
- [ ] Automated status reports
- [ ] ROI calculations

---

## Integration Matrix

| Panel | Reads From | Writes To | Agent Triggers |
|-------|-----------|-----------|----------------|
| Market Strip | CoinGecko, Etherscan | Market, UserPreferences | "What's moving?" |
| Wallet Manager | Alchemy, User input | Wallet, Transaction | "Should I rebalance?" |
| Events & Calendar | User, Agent, External APIs | Event, AgentReminder | "What's my focus today?" |
| Notes & Capture | User, Agent transcripts | Note, NoteTag | "Summarize my notes" |
| Ideas & Status | User, Notes | Idea, Project | "Help me shape this idea" |
| Agent Console | All panels | All tables (via actions) | All modes |
| Trading Dashboard | Exchanges, Wallets | Bot, Trade, PortfolioSnapshot | "Backtest this strategy" |
| Task Manager | User, Agent, Email | Task, TimeLog | "Plan my day" |
| Social Feed | Twitter, Farcaster, RSS | SocialPost, SavedPost | "Summarize Twitter today" |
| Poker Lab | Hand histories, User input | PokerHand, PokerSession | "Analyze this hand" |
| Learning Lab | Courses, User notes | LearningCard, LearningProgress | "Explain this concept" |
| Project Manager | Git, User input | Project, ProjectMilestone | "What's next to ship?" |

---

## Database Schema Additions

```prisma
// Trading
model Bot {
  id        String   @id @default(uuid())
  name      String
  strategy  String   // "DCA", "GRID", "ARBITRAGE"
  config    Json     // strategy-specific params
  status    String   // "ACTIVE", "PAUSED", "STOPPED"
  performance Json   // PnL, trades, etc.
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Trade {
  id        String   @id @default(uuid())
  botId     String?
  type      String   // "BUY", "SELL"
  asset     String
  amount    Float
  price     Float
  fee       Float
  timestamp DateTime
  walletId  String
  wallet    Wallet   @relation(fields: [walletId], references: [id])
}

// Tasks
model Task {
  id          String    @id @default(uuid())
  title       String
  description String?
  status      String    // "INBOX", "TODAY", "DONE"
  projectId   String?
  dueDate     DateTime?
  estimate    Int?      // minutes
  actualTime  Int?      // minutes
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  completedAt DateTime?
  project     Project?  @relation(fields: [projectId], references: [id])
}

// Social
model SocialPost {
  id        String   @id @default(uuid())
  platform  String   // "TWITTER", "FARCASTER"
  author    String
  content   String
  url       String   @unique
  sentiment String?  // "POSITIVE", "NEGATIVE", "NEUTRAL"
  saved     Boolean  @default(false)
  createdAt DateTime
}

// Poker
model PokerHand {
  id          String   @id @default(uuid())
  sessionId   String?
  handHistory String   // full text
  result      Float    // profit/loss
  mistakes    Json?    // agent-identified errors
  createdAt   DateTime @default(now())
  session     PokerSession? @relation(fields: [sessionId], references: [id])
}

model PokerSession {
  id        String       @id @default(uuid())
  date      DateTime
  stakes    String       // "1/2", "2/5", etc.
  profit    Float
  duration  Int          // minutes
  hands     PokerHand[]
  createdAt DateTime     @default(now())
}

// Learning
model LearningCard {
  id         String   @id @default(uuid())
  front      String   // question
  back       String   // answer
  category   String
  nextReview DateTime // spaced repetition
  interval   Int      // days until next review
  easiness   Float    // SM-2 algorithm
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

// Projects (expand existing)
model ProjectMilestone {
  id          String   @id @default(uuid())
  projectId   String
  title       String
  dueDate     DateTime
  completed   Boolean  @default(false)
  completedAt DateTime?
  project     Project  @relation(fields: [projectId], references: [id])
}

// Add to existing Project model
model Project {
  // existing fields...
  milestones ProjectMilestone[]
  tasks      Task[]
}
```

---

## Implementation Priority (Phased Rollout)

### Phase 1 (Current) — Foundation ✅
- Market Strip (stub)
- Wallet Manager (localStorage)
- Events & Calendar
- Notes & Capture
- Ideas & Status
- Agent Console (basic modes)

### Phase 2 (Next 2 weeks) — Data Integration
- Market Strip → real prices
- Wallet Manager → live balances
- Agent Console → OpenAI/Anthropic
- Database migration (localStorage → Prisma)

### Phase 3 (Weeks 3-4) — Trading & Tasks
- Trading Dashboard (bot manager + manual trading)
- Task Manager (GTD workflow)
- Enhanced agent modes (PA, trader analyst)

### Phase 4 (Weeks 5-6) — Social & Learning
- Social Feed Aggregator
- Learning Lab
- Poker Lab (basic hand replayer)

### Phase 5 (Weeks 7-8) — Advanced Features
- Project Manager (full Kanban)
- Poker Lab (full simulator)
- Agent fine-tuning
- Multi-device sync

### Phase 6 (Month 3+) — Polish & Scale
- Mobile app (React Native)
- Voice interface
- Custom agent marketplace
- Team features (optional)

---

## Success Metrics

**Engagement**:
- Daily active use (target: 5+ sessions/day)
- Avg session length (target: 20+ min)
- Panels used per session (target: 4+)

**Effectiveness**:
- Tasks completed vs. created (target: >80%)
- Agent interactions per day (target: 10+)
- Time saved vs. manual workflows (target: 2+ hours/day)

**Quality**:
- Zero data loss incidents
- <100ms panel load times
- Agent response accuracy (target: >90% helpful)

---

## Open Questions & Decisions Needed

1. **Authentication**: Single-user local vs. cloud-synced multi-device?
2. **Agent provider**: OpenAI only or multi-provider (Anthropic, local LLMs)?
3. **Trading execution**: Direct API integration or read-only analytics?
4. **Social feeds**: Twitter API costs (~$100/mo) — worth it?
5. **Poker hand import**: Manual paste vs. auto-import from tracker?
6. **Mobile app**: React Native or PWA?

---

## File to Keep Updated

**This document** is your north star. Update as you:
- Add new panels
- Discover better UX patterns
- Change data models
- Integrate new APIs

Treat this as a living spec, not a static plan.

---

**Next Steps**:
1. Review this spec and mark which panels are highest priority
2. Choose one panel from Phase 3 to implement this week
3. Update database schema with new tables
4. Wire agent console to new panel types

**Last Updated**: 2026-01-01  
**Status**: v1.0 — Awaiting feedback
