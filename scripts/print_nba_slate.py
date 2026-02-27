#!/usr/bin/env python3
import json
from pathlib import Path

SLATE_PATH = Path("data/sports/nba/slates/2026-02-07.json")

def main():
    data = json.loads(SLATE_PATH.read_text())
    games = data.get("games", [])
    for g in games:
        print(f"{g['id']}: {g['away']} at {g['home']} ({g['priority']})")

if __name__ == "__main__":
    main()
