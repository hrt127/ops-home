# Dojo Integration

**How Ops-Home Integrates with the Dojo Filesystem**

---

## Overview

Ops-Home is **not a standalone application**—it is a Layer 4 cockpit that sits on top of the Dojo filesystem and respects its system law. This document explains the integration boundary, data flows, and operational rules.

---

## Critical Context: Local WSL Environment

### Canonical Paths

```
Dojo Root:     ~/dojo
Ops-Home:      ~/dojo/projects/ops-home
Dojo CLI:      ~/dojo2-clean
Snapshot:      ~/.config/dojo/sync/latest.json
```

### Environment

- **OS**: Ubuntu 22.04 (WSL2)
- **Shell**: bash
- **User**: heart
- **Home**: /home/heart
- **Node**: v20+ (via nvm, **required**)
- **Python**: 3.12

**Important**: This GitHub repository is a **mirror** of `~/dojo/projects/ops-home` in WSL. The WSL filesystem contains additional integration points (Dojo system files, knowledge base, CLI) that are **not in this repo**.

---

## Dojo Filesystem Structure

Ops-Home exists within this larger structure:

```
~/dojo/
├── system/               # System law, identity, policies
│   ├── SYSTEM.md
│   ├── SYSTEM_STATE.md
│   ├── IDENTITY.md
│   ├── SOFTWARE_POLICY.md
│   ├── TOOLS_POLICY.md
│   └── ...
│
├── projects/
│   ├── ops-home/        # THIS PROJECT ⬅️
│   └── elfa-tools/
│
├── knowledge/           # Long-term memory, RAG source
│   ├── inbox/
│   ├── notes/
│   ├── notebooks/
│   ├── prompts/
│   ├── threads/
│   ├── ideas.json
│   └── tasks.json
│
├── agents/              # Agent definitions (future)
│
├── scratch/             # Temporary work
│
└── archive/             # Legacy material

~/.config/dojo/sync/
└── latest.json          # Machine-readable Dojo snapshot
```

---

## Integration Layers

### 1. Filesystem Integration

Ops-Home **reads** from Dojo directories:

- `~/dojo/system/*.md` — System identity and policies
- `~/dojo/knowledge/*` — Notes, threads, inbox, prompts (for Notes, Learning Lab, and Knowledge panels)
- `~/.config/dojo/sync/latest.json` — Structured snapshot of ideas, tasks, projects

Ops-Home **writes** to:

- `~/dojo/projects/ops-home/data/ops-home.db` — Primary SQLite database (wallets, events, notes, ideas, etc.)
- `~/dojo/knowledge/inbox/` — Quick capture notes (via Notes Panel)

### 2. CLI Integration

The Dojo CLI (`~/dojo2-clean/dojo`) operates on `~/dojo` and provides:

```bash
dojo sync       # Generate snapshot → ~/.config/dojo/sync/latest.json
dojo goto ops-home
dojo ls
dojo whereami
dojo doctor
```

Ops-Home can call these commands or read the snapshot file directly.

### 3. Knowledge Base Integration

Ops-Home panels integrate with Dojo knowledge:

| Panel | Reads From | Writes To |
|-------|-----------|----------|
| Notes Panel | `~/dojo/knowledge/notes/` | `~/dojo/knowledge/inbox/` |
| Learning Lab | `~/dojo/knowledge/notebooks/` | `data/ops-home.db` (progress) |
| Ideas Panel | `~/.config/dojo/sync/latest.json` (ideas) | `~/dojo/knowledge/ideas.json` |
| Tasks Panel | `~/.config/dojo/sync/latest.json` (tasks) | `~/dojo/knowledge/tasks.json` |
| Project Manager | `~/dojo/projects/*/PROJECT_CONTEXT.md` | `data/ops-home.db` |

### 4. System Law Integration

Ops-Home must respect Dojo system law:

- **No silos**: All data under `~/dojo` or in `data/ops-home.db`
- **Context-first development**: Every feature must have clear purpose
- **Local-first**: SQLite + JSON/Markdown, no mandatory cloud
- **Agent protocol**: Agents must read `SYSTEM.md` + `IDENTITY.md` before acting

Relevant system files:

- `~/dojo/system/SYSTEM.md` — Core system rules
- `~/dojo/system/SOFTWARE_POLICY.md` — Tech stack rules (Python + TypeScript, Next.js + Tailwind)
- `~/dojo/system/TOOLS_POLICY.md` — Tool selection rules

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────┐
│  Dojo Filesystem (~/dojo)                       │
│                                                 │
│  system/  knowledge/  projects/  agents/        │
│    │         │           │          │           │
│    │         │           │          │           │
│    └─────────┴───────────┴──────────┘           │
│              │                                   │
└──────────────┼───────────────────────────────────┘
               │
               ↓
        ┌──────────────┐
        │ Dojo CLI     │
        │ dojo sync    │
        └──────────────┘
               │
               ↓
   ~/.config/dojo/sync/latest.json
               │
               ↓
┌──────────────────────────────────────────────────┐
│  Ops-Home (~/dojo/projects/ops-home)             │
│                                                  │
│  ┌────────────┐    ┌─────────────────┐         │
│  │ Next.js UI │───>│ SQLite DB       │         │
│  │ (Panels)   │<───│ data/ops-home.db│         │
│  └────────────┘    └─────────────────┘         │
│         │                                        │
│         ├──> ~/dojo/knowledge/* (reads)         │
│         ├──> ~/dojo/system/* (reads)            │
│         └──> ~/.config/dojo/sync/* (reads)      │
└──────────────────────────────────────────────────┘
```

---

## Development Workflow

### Opening Ops-Home in WSL

```bash
cd ~/dojo/projects/ops-home
code .    # or cursor .
```

### Running the Development Server

```bash
cd ~/dojo/projects/ops-home
nvm use 20
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

### Syncing Dojo State

```bash
cd ~/dojo
./dojo2-clean/dojo sync
```

This generates `~/.config/dojo/sync/latest.json` which ops-home can read for ideas, tasks, and projects.

---

## Integration Rules

### DO

✅ Read system law from `~/dojo/system/*.md`  
✅ Read knowledge from `~/dojo/knowledge/*`  
✅ Read snapshot from `~/.config/dojo/sync/latest.json`  
✅ Store ops-home-specific data in `data/ops-home.db`  
✅ Respect Dojo filesystem layout and policies  
✅ Use Dojo CLI commands when appropriate  

### DON'T

❌ Write to `~/dojo/system/` (system law is append-only via explicit edits)  
❌ Assume ops-home owns `~/dojo/knowledge` (it's a shared resource)  
❌ Hard-code paths outside `~/dojo` structure  
❌ Bypass Dojo CLI for operations it handles (sync, navigation)  
❌ Store canonical data outside `~/dojo` or `data/ops-home.db`  

---

## For New Contributors

If you're cloning this repo:

1. **This repo is a mirror** of `~/dojo/projects/ops-home` in the author's WSL environment.
2. It integrates with `~/dojo/system` and `~/dojo/knowledge` which are **not in this repo**.
3. To run it standalone (without Dojo integration):
   - The app will work, but panels that read from `~/dojo` will show empty/mock data.
   - You can mock the integration by creating stub files in `~/dojo/knowledge` or disabling those panels.

4. To run it with full Dojo integration:
   - Set up the full Dojo structure as documented in the author's `DOJO_DIRECTORY_MAP.md`.
   - Clone this repo into `~/dojo/projects/ops-home`.
   - Install the Dojo CLI at `~/dojo2-clean`.

---

## Summary

- Ops-Home lives at `~/dojo/projects/ops-home` in WSL
- It respects Dojo system law and integrates with Dojo knowledge base
- Primary data store: SQLite (`data/ops-home.db`)
- Secondary data sources: `~/dojo/knowledge`, `~/dojo/system`, `~/.config/dojo/sync/latest.json`
- This GitHub repo is a **partial view**—full context requires the WSL Dojo environment

---

**For more details:**

- [LOCAL_SETUP.md](./LOCAL_SETUP.md) - WSL setup guide
- [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) - Project goals and constraints
- [README.md](./README.md) - General project overview
