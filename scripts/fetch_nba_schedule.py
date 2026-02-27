#!/usr/bin/env python3
import json
import os
from pathlib import Path
from datetime import datetime, timedelta, timezone

import requests

DOJO_HOME = Path(os.path.expanduser("~")) / "dojo"
PROJECT_ROOT = DOJO_HOME / "projects" / "ops-home"
SLATES_DIR = PROJECT_ROOT / "data" / "sports" / "nba" / "slates"
CONFIG_PATH = PROJECT_ROOT / "scripts" / "nba_schedule_config.json"

SLATES_DIR.mkdir(parents=True, exist_ok=True)

def load_config():
    return json.loads(CONFIG_PATH.read_text())

def date_range(start: datetime, days: int):
    for i in range(days):
        yield start + timedelta(days=i)

def fetch_balldontlie_games(cfg, day: datetime):
    """
    balldontlie games endpoint using date filter, e.g.
    GET /v1/games?dates[]=YYYY-MM-DD
    """
    base = cfg["balldontlie_base_games"]
    api_key = cfg.get("balldontlie_api_key")  # header-based if required

    date_str = day.strftime("%Y-%m-%d")
    params = {"dates[]": date_str, "per_page": 100}

    headers = {}
    if api_key:
        # adjust header name if provider requires something else
        headers["Authorization"] = f"Bearer {api_key}"

    print(f"[schedule] {date_str} -> {base}")
    resp = requests.get(base, params=params, headers=headers, timeout=10)
    resp.raise_for_status()
    return resp.json()

def fetch_odds_for_day(cfg, day: datetime):
    """
    Use The Odds API:
    GET /v4/sports/basketball_nba/odds?apiKey=...&regions=us&markets=h2h,spreads,totals&oddsFormat=decimal&date=...
    For free plan: limit calls; one per day is fine.
    """
    base = cfg["oddsapi_base_url"]
    api_key = cfg["oddsapi_api_key"]
    regions = cfg.get("oddsapi_region", "us")
    markets = cfg.get("oddsapi_markets", "h2h,spreads,totals")
    bookmakers = cfg.get("oddsapi_bookmakers", "onexbet")

    # date parameter is optional; without it you get upcoming games.
    # We add it to align with schedule day (UTC-based).
    date_str = day.replace(tzinfo=timezone.utc).isoformat()

    params = {
        "apiKey": api_key,
        "regions": regions,
        "markets": markets,
        "bookmakers": bookmakers,
        "oddsFormat": "decimal",
        "date": date_str,
    }

    print(f"[odds]     {day.strftime('%Y-%m-%d')} -> {base}")
    resp = requests.get(base, params=params, timeout=10)
    resp.raise_for_status()
    return resp.json()

def build_odds_lookup(odds_data):
    """
    The Odds API structure: each item is a game with home_team, away_team, bookmakers, markets, etc.
    https://the-odds-api.com/liveapi/guides/v4/#overview
    """
    lookup = {}
    for game in odds_data:
        home = game.get("home_team")
        away = game.get("away_team")
        if not home or not away:
            continue

        key = f"{away} @ {home}"

        spread_val = None
        total_val = None
        ml_home = None
        ml_away = None

        for bm in game.get("bookmakers", []):
            for mkt in bm.get("markets", []):
                key_name = mkt.get("key")
                outcomes = mkt.get("outcomes", [])
                if key_name == "spreads" and outcomes:
                    # pick the home line
                    for o in outcomes:
                        if o.get("name") == home:
                            spread_val = o.get("point")
                elif key_name == "totals" and outcomes:
                    # totals: use the first outcome's point as total line
                    total_val = outcomes[0].get("point")
                elif key_name == "h2h" and outcomes:
                    for o in outcomes:
                        if o.get("name") == home:
                            ml_home = o.get("price")
                        elif o.get("name") == away:
                            ml_away = o.get("price")

        lookup[key] = {
            "spread": spread_val,
            "total": total_val,
            "moneyline_home": ml_home,
            "moneyline_away": ml_away,
        }

    return lookup

def normalize_to_slate(bdl_data, odds_lookup, day: datetime):
    games = []

    for game in bdl_data.get("data", []):
        home_team = game.get("home_team", {}).get("full_name")
        away_team = game.get("visitor_team", {}).get("full_name")
        date_iso = game.get("date")

        if not home_team or not away_team:
            continue

        game_id = f"{away_team[:3].upper()}-{home_team[:3].upper()}-{day.strftime('%Y-%m-%d')}"
        odds_key = f"{away_team} @ {home_team}"
        odds = odds_lookup.get(odds_key, {})

        games.append(
            {
                "id": game_id,
                "home": home_team,
                "away": away_team,
                "tip_local": date_iso,
                "priority": "B",
                "market": {
                    "spread": odds.get("spread"),
                    "total": odds.get("total"),
                    "moneyline_home": odds.get("moneyline_home"),
                    "moneyline_away": odds.get("moneyline_away"),
                    "spread_open": None,
                    "total_open": None,
                    "notes": "",
                },
                "context": {
                    "rest_home": "",
                    "rest_away": "",
                    "travel_home": "",
                    "travel_away": "",
                    "form_home": "",
                    "form_away": "",
                    "intentions_home": "",
                    "intentions_away": "",
                    "trades_home": "",
                    "trades_away": "",
                    "injuries_home": "",
                    "injuries_away": "",
                    "lineup_flags": "",
                },
                "angle": {
                    "summary": "",
                    "side_thoughts": "",
                    "total_thoughts": "",
                    "props_ideas": "",
                },
                "edge": {
                    "lean_side": "",
                    "lean_total": "",
                    "confidence": "",
                    "notes": "",
                },
            }
        )

    slate = {
        "meta": {
            "date": day.strftime("%Y-%m-%d"),
            "bankroll_start": 10000,
            "unit_size": 100,
            "book_list": ["primary"],
        },
        "games": games,
        "bets": [],
    }

    return slate

def write_slate_file(slate):
    date_str = slate["meta"]["date"]
    out_path = SLATES_DIR / f"{date_str}.json"
    out_path.write_text(json.dumps(slate, indent=2))
    print(f"[write] {out_path}")

def main():
    cfg = load_config()

    # Start from today (UTC) and go 3 days forward
    today = datetime.now(timezone.utc).date()
    start = datetime.combine(today, datetime.min.time()).replace(tzinfo=timezone.utc)

    for day in date_range(start, 3):
        try:
            try:
                bdl_data = fetch_balldontlie_games(cfg, day)
            except requests.HTTPError as e:
                if e.response is not None and e.response.status_code == 429:
                    print(f"[rate-limit] {day.strftime('%Y-%m-%d')} balldontlie; skipping")
                    continue
                raise

            odds_data = fetch_odds_for_day(cfg, day)
            odds_lookup = build_odds_lookup(odds_data)
            slate = normalize_to_slate(bdl_data, odds_lookup, day)
            if slate["games"]:
                write_slate_file(slate)
            else:
                print(f"[skip] {day.strftime('%Y-%m-%d')}: no games")
        except Exception as e:
            print(f"[error] {day.strftime('%Y-%m-%d')}: {e}")

if __name__ == "__main__":
    main()
