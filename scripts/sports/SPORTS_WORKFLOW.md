# Sports Workflow (Manual + Scripted)

This workflow governs how betting slates are created, wagered, and settled.

## Location
- **Scripts**: `~/dojo/projects/ops-home/scripts/sports/`
- **Data**: `~/dojo/projects/ops-home/data/sports/nba/slates/`

## Tools

The primary tool is the helper script:
```bash
~/dojo/projects/ops-home/scripts/sports/slate.sh
```
Alias this to `slate` in your `.bashrc` or `dojo_profile.sh` if desired.

## Workflow

### 1. New Day / Setup
Initialize today's slate file.
```bash
./slate.sh setup
```
- Opens/creates `data/sports/nba/slates/YYYY-MM-DD.json`.
- Manually populate games/odds from external source (or use `fetch_odds.py` if available).

### 2. Place Bet
Log a bet onto the slate.
```bash
./slate.sh bet <game_id>
```
- Interactive prompt for: Market, Selection, Odds, Units, Book, Notes.
- Appends to the `.json` file.

### 3. Status Check
View current open bets and exposure.
```bash
./slate.sh status
```

### 4. Settle Slate
Mark bets as won/lost.
```bash
./slate.sh settle
```
- Interactively iterate through open bets to update result/PnL.

## Integration

- **Ops-Home**: Reads the JSON slates to display the "Betting" panel.
- **Logs**: Major wins/losses should be manually logged to `~/dojo/knowledge/threads/BETTING_LOG.md` (or similar).
