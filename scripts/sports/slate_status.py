#!/usr/bin/env python3
import json
from datetime import datetime
from pathlib import Path

slate_file = Path.home() / "dojo/projects/ops-home/data/sports/nba/slates" / f"{datetime.now().strftime('%Y-%m-%d')}.json"

with open(slate_file) as f:
    data = json.load(f)

bets = data.get("bets", [])
settled = [b for b in bets if b.get("result")]
pnl = sum(b["pnl_units"] for b in settled)

print(f"\n{len(data['games'])} games | {len(bets)} bets | {len(settled)} settled | P&L: {pnl:+.2f}u\n")

for g in [x for x in data["games"] if x["priority"] == "A"][:5]:
    marker = "💰" if any(b["game_id"] == g["id"] for b in bets) else "⚪"
    print(f"{marker} {g['away']} @ {g['home']} | {g['market']['spread']} | {g['market']['total']}")
