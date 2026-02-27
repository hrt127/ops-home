# Project Context: ops-home

## Purpose
The primary "Cockpit UI" for the Dojo environment. A 12-panel dashboard designed for high-intensity crypto operations, strategic oversight, and personal intelligence management.

## Goals
- **Context Centralization**: Aggregating state from `~/dojo` (Filesystem), `latest.json` (Snapshot), and local SQLite.
- **Operational Clarity**: Real-time visibility into active focus (Gravity), market conditions, and tactical schedules.
- **Workflow Efficiency**: Instant capture of notes/ideas and execution of "Blessed Commands" from a single surface.

## Status
🟢 Active (Phase 3: Eyes & Memory)

## Current Features
- **Gravity Focus Card**: Deep integration with `FOCUS.json`; polling every 60s to reflect system-wide mode/project/topic changes.
- **NBA Intelligence**: Live schedule and market data pipeline (balldontlie + The Odds API). Multi-day tactical view with grouping.
- **Wallet Lanes**: Risk-banded wallet registry with live balance fetching.
- **Standard Panels**: Notes, Ideas, Snippets, Events, and Daily Focus tracking.

## Dependencies
- **Internal**: `~/dojo2-clean` (CLI), `~/dojo/system/FOCUS.json`, `~/.config/dojo/sync/latest.json`.
- **External**: Etherscan API (Wallets), The Odds API (Sports), balldontlie API (Sports).

## Maintenance
- **Frequency**: Daily use for orientation and task execution.
- **Owner**: Heart (Automated feed processing).

## Evolution
- **Created**: Dec 2024 (Original dashboard)
- **Refactor**: Feb 2025 (WSL-native v2 alignment)
- **NBA Expansion**: Feb 2026 (Live intelligence pipeline & Multi-day UI)

## Documentation
- **Specs**: `~/dojo/system/FOCUS_SPEC.md`, `~/dojo/system/EVENT_BUS_SPEC.md`
- **Guides**: `docs/OPERATOR_CHEATSHEET.md` (Planned)
