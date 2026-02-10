#!/usr/bin/env python3
import json, sys
from datetime import datetime
from pathlib import Path

game_id = sys.argv[1] if len(sys.argv) > 1 else sys.exit("Need game_id")
slate_file = Path.home() / "dojo/projects/ops-home/data/sports/nba/slates" / f"{datetime.now().strftime('%Y-%m-%d')}.json"

with open(slate_file) as f:
    data = json.load(f)

game = next((g for g in data["games"] if g["id"] == game_id), None)
if not game: sys.exit(f"{game_id} not found")

print(f"\n{game['away']} @ {game['home']} | {game['market']['spread']} | {game['market']['total']}\n")

bet = {
    "game_id": game_id,
    "market": input("Market (spread/total/ml): "),
    "selection": input("Selection: "),
    "odds_decimal": float(input("Odds: ")),
    "stake_units": float(input("Units: ")),
    "book": input("Book [primary]: ") or "primary",
    "notes": input("Notes: "),
    "result": None,
    "pnl_units": 0,
    "placed_at": datetime.now().isoformat()
}

data.setdefault("bets", []).append(bet)

with open(slate_file, "w") as f:
    json.dump(data, f, indent=2)

print(f"✓ {bet['selection']} @ {bet['odds_decimal']} for {bet['stake_units']}u")
