# Pattern: Sports Automation – NHL/NBA Slate → Ops-Home

## Intent

Turn manual NHL/NBA slate prep and odds comparison into a repeatable pipeline
that feeds ops-home with clean, game-level data and simple edge views.

Experiment ID: exp_sports_automation_ops_home

## Inputs (v0)

- League: NHL / NBA
- Slate date
- Book / exchange APIs or CSV exports (to be decided)
- My current positions / exposure (optional, later)

## Outputs (v0)

- One structured JSON/CSV per slate:
  - game_id
  - teams
  - start_time
  - main lines (spread/total/moneyline)
  - best prices across books
- A minimal view in ops-home:
  - list of today’s games
  - highlight where line diffs exceed a threshold

## Selection Rules (v0)

Only include a game in tonight's slate file if:

- I can name a clear angle (pricing/narrative) in one line, AND
- I would realistically bet or track it if the price moves.

Skip:

- Games where I have no read.
- Games I'm only "kind of" curious about with no angle.


## Steps (v0.1, manual-friendly)

1. Identify today’s slate (e.g., from OddsJam/flashscore/whatever I already use).
## Selection Rules (v0)

Only include a game in tonight's slate file if:

- I can name a clear angle (pricing/narrative) in one line, AND
- I would realistically bet or track it if the price moves.

Skip:

- Games where I have no read.
- Games I'm only "kind of" curious about with no angle.
2. Export or scrape lines for that slate into a local file.
3. Run a small script (later) to normalize and write `data/sports/slate_<DATE>.json`.
4. Point ops-home at that file for a basic “Today’s Slate” panel.
5. Data home created at `data/sports/` with README describing slate JSON schema.

## Constraints

- Keep it manual-friendly first (no heavy infra).
- No live betting logic yet – just pre-game setup.
- Prefer Base/Solana-friendly data sources for later automation.

## Questions

- Which data source(s) do I trust for initial odds?
- Where should `data/sports/` live in the repo?
- How does this integrate with existing ops-home panels?
