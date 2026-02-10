# Sports Data (NHL/NBA Slates)

This folder holds pre-processed slate files used by the
"Sports Automation – NHL/NBA Slate → Ops-Home" pattern.

Goal (v0):
- One file per slate, e.g. `slate_2026-02-07.json`
- Minimal schema:

```json
{
  "date": "2026-02-07",
  "league": "NHL",
  "games": [
    {
      "game_id": "NHL-2026-02-07-PIT-WSH",
      "home": "WSH Capitals",
      "away": "PIT Penguins",
      "start_time": "2026-02-07T19:00:00Z",
      "moneyline": {
        "home": -120,
        "away": +100
      },
      "total": {
        "line": 6.5,
        "over": -105,
        "under": -115
      },
      "spread": {
        "line": -1.5,
        "home": +190,
        "away": -220
      }
    }
  ]
}
