#!/usr/bin/env python3
import json
from datetime import datetime
from pathlib import Path

slate_file = Path.home() / "dojo/projects/ops-home/data/sports/nba/slates" / f"{datetime.now().strftime('%Y-%m-%d')}.json"

with open(slate_file) as f:
    data = json.load(f)

unsettled = [b for b in data.get("bets", []) if not b.get("result")]
if not unsettled: sys.exit("No bets to settle")

for game_id in set(b["game_id"] for b in unsettled):
    game = next(g for g in data["games"] if g["id"] == game_id)
    print(f"\n{game['away']} @ {game['home']}")
    
    game.setdefault("result", {})["final_score_away"] = int(input(f"{game['away']} score: "))
    game["result"]["final_score_home"] = int(input(f"{game['home']} score: "))

print("\n--- Settle Bets ---")
for bet in unsettled:
    print(f"\n{bet['selection']} @ {bet['odds_decimal']} for {bet['stake_units']}u")
    result = input("win/loss/push: ")
    bet["result"] = result
    bet["pnl_units"] = bet["stake_units"] * (bet["odds_decimal"] - 1) if result == "win" else (-bet["stake_units"] if result == "loss" else 0)

with open(slate_file, "w") as f:
    json.dump(data, f, indent=2)

print(f"\n✓ P&L: {sum(b['pnl_units'] for b in data['bets'] if b.get('result')):+.2f}u")
