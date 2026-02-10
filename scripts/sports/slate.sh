#!/bin/bash
SLATE_DIR=~/dojo/projects/ops-home/data/sports/nba/slates
TODAY=$(date +%Y-%m-%d)
FILE="$SLATE_DIR/$TODAY.json"

case "$1" in
  setup) code "$FILE" ;;
  bet) python3 ~/dojo/projects/ops-home/scripts/sports/add_bet.py "$2" ;;
  settle) python3 ~/dojo/projects/ops-home/scripts/sports/settle_slate.py ;;
  status) python3 ~/dojo/projects/ops-home/scripts/sports/slate_status.py ;;
  *) echo "slate setup|bet <id>|settle|status" ;;
esac
