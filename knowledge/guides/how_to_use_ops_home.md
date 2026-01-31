# How to Use Ops-Home

**Version**: Phase 3→4  
**Last Updated**: 2026-01-31

---

## Overview

Ops-Home is your personal command center. It consolidates:
- Wallet management
- Market awareness
- Task tracking
- Note capture
- Idea pipeline
- Learning progress
- Trading operations
- Project oversight

Everything in one place. No tab-switching.

---

## The 12 Panels

### Panel 1: Market Strip (Top Bar)
**Purpose**: Ambient market awareness

**What it shows**:
- Live prices (BTC, ETH, SOL, BNB)
- 24h price changes
- Current time
- System status

**How to use**:
- Glance at it periodically
- No interaction needed
- Auto-updates every 10 seconds

---

### Panel 2: Wallet Manager (Left Column)
**Purpose**: Organize and access your wallets

**What it shows**:
- Wallets grouped by lane (Identity, Trading, Treasury, LP)
- Risk bands (Safe, Medium, High)
- Balances
- Last activity

**How to use**:
1. Click a lane to expand/collapse
2. Click a wallet to select it
3. Selected wallet appears in Active Session panel

---

### Panel 2b: Active Session (Right Column)
**Purpose**: Detailed view of selected wallet

**What it shows**:
- Wallet ID and address
- Live balance (ETH + USD)
- Risk band
- Allowed actions (green pills)
- Forbidden actions (red pills)
- Allowed dapps

**How to use**:
- Select a wallet from Wallet Manager
- Review permissions before interacting
- Use as a safety check

---

### Panel 3: Calendar (Center Column)
**Purpose**: Tactical 3-day view

**What it shows**:
- Events for today, tomorrow, +2 days
- Importance levels (critical, high, normal, low)
- Event types (ongoing, time-bound)

**How to use**:
1. Click "+ Add" to create new event
2. Review daily to stay on track
3. Color-coded by importance

---

### Panel 4: Notes (Center Column)
**Purpose**: Frictionless capture

**What it shows**:
- Quick capture input
- Timestamped notes
- Scrollable history

**How to use**:
1. Type note in input field
2. Press Enter or click "Add"
3. Notes saved to database
4. Search/filter coming soon

---

### Panel 5: Ideas (Right Column)
**Purpose**: Idea pipeline management

**What it shows**:
- Ideas with status (Idea → Shaping → Live)
- Status badges (color-coded)

**How to use**:
1. Click "+ Add" to create new idea
2. Move ideas through pipeline
3. Archive when complete

---

### Panel 6: System Log (Center Column)
**Purpose**: Activity monitoring

**What it shows**:
- System events (color-coded)
- Authentication logs
- Network activity
- Security alerts

**How to use**:
- Monitor for errors/warnings
- Toggle auto-scroll
- Click "Clear" to reset

---

### Panel 7: Trading Dashboard (Left Column)
**Purpose**: Bot management and P&L tracking

**What it shows**:
- Active positions (DCA, Grid, Manual)
- Total P&L
- Position details
- Bot controls

**How to use**:
1. View positions tab for active bots
2. Click "Adjust" to modify parameters
3. Click "Pause" to stop bot
4. Click "Close" to exit position

---

### Panel 8: Task Manager (Center Column)
**Purpose**: GTD-style task tracking

**What it shows**:
- Tasks with status (Todo → In Progress → Done)
- Priority levels
- Due dates
- Project tags

**How to use**:
1. Type task in input field
2. Click task icon to cycle status
3. Filter by status (all/todo/in-progress/done)

---

### Panel 9: Social Feed (Right Column)
**Purpose**: Curated signal aggregation

**What it shows**:
- Farcaster posts
- Twitter feed
- RSS items
- Engagement metrics

**How to use**:
1. Filter by source (all/farcaster/twitter/rss)
2. Click "Refresh" to update
3. Review tags for topics

---

### Panel 10: Poker Lab (Right Column)
**Purpose**: Deliberate practice tracking

**What it shows**:
- Hand history
- P&L analysis
- Win rate
- Tagged hands

**How to use**:
1. Click "+ Log Hand" after session
2. Add notes and tags
3. Review stats tab for patterns
4. Use ranges tab for study

---

### Panel 11: Learning Lab (Right Column)
**Purpose**: Spaced repetition learning

**What it shows**:
- Topics with mastery levels
- Review schedule
- Difficulty ratings
- Category tags

**How to use**:
1. Click "+ Add Topic" to create
2. Review when "Review Due" appears
3. Track mastery progress
4. Filter by category

---

### Panel 12: Project Manager (Right Column)
**Purpose**: Strategic project oversight

**What it shows**:
- Active projects
- Project status (Live, Paused, Idea)
- Project paths

**How to use**:
1. Click project card to open
2. Click "View All" for full list
3. Status badges show current state

---

## Workflows

### Morning Routine
1. Check Market Strip for overnight moves
2. Review Calendar for today's events
3. Check System Log for alerts
4. Review Tasks for today

### Wallet Operation
1. Select wallet from Wallet Manager
2. Review permissions in Active Session
3. Verify allowed actions
4. Proceed with operation

### Idea Capture
1. Type idea in Ideas panel
2. Set initial status (Idea)
3. Move to Shaping when ready
4. Move to Live when deployed

### Learning Session
1. Check Learning Lab for due reviews
2. Study topic
3. Update mastery level
4. Schedule next review

---

## Data Flow

```
User Input → Ops-Home UI → API Routes → SQLite Database
                                      ↓
                            External APIs (Etherscan, CoinGecko)
```

All data persists in `~/dojo/projects/ops-home/data/ops-home.db`

---

## Keyboard Shortcuts (Coming Soon)

- `Ctrl+N` - New note
- `Ctrl+T` - New task
- `Ctrl+I` - New idea
- `Ctrl+/` - Search
- `Ctrl+,` - Settings

---

## Tips

1. **Use the panels together**: Select wallet → Check permissions → Execute
2. **Capture everything**: Notes, ideas, tasks - get it out of your head
3. **Review regularly**: Calendar, tasks, learning reviews
4. **Trust the system**: If it's in Ops-Home, it's tracked
5. **Stay focused**: One panel at a time, one task at a time

---

## Troubleshooting

**Panel not loading?**
- Check System Log for errors
- Refresh the page
- Check API endpoints

**Data not saving?**
- Verify database connection
- Check browser console
- Review API responses

**Balance not updating?**
- Check Etherscan API key
- Verify wallet address
- Review rate limits

---

## Next Steps

1. Customize panels (hide/show)
2. Configure API keys
3. Import existing data
4. Set up notifications
5. Create custom views
