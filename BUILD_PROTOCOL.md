# BUILD PROTOCOL — ops-home

**Purpose**: Structured workflow to build ops-home efficiently without losing focus.  
**Status**: Active  
**Last Updated**: 2026-01-01

---

## Core Principles

1. **One goal per session** — No sidetracking
2. **Ship before perfecting** — Working > polished
3. **Test immediately** — Catch issues fast
4. **Document decisions** — No re-litigating
5. **Clean handovers** — Next session starts smooth

---

## Session Structure

Every conversation follows this pattern:

### 1. SESSION START (2 min)
```
You: "Starting session X. Current goal: [from CURRENT_SPRINT.md]"
Me: Reviews context, confirms goal, states approach
```

### 2. EXECUTION (Main work)
- I deliver code/fixes in focused batches
- You test immediately
- Report results: "✅ Works" or "❌ Error: [exact message]"
- I fix issues in same session

### 3. SESSION END (3 min)
```
Me: Updates CURRENT_SPRINT.md with:
- ✅ Completed
- 🚧 In progress
- ⏭️ Next session goal
- 📝 Any blockers
```

### 4. HANDOVER
- Commit all changes
- Update sprint tracker
- Clear, single next action defined

---

## File Structure for Tracking

### CURRENT_SPRINT.md (Updated every session)
```markdown
# Current Sprint: [Phase Name]
Goal: [What we're building]
Deadline: [Target date]
Status: [X/Y tasks complete]

## This Session
- [ ] Task 1
- [ ] Task 2

## Completed
- [x] Previous task

## Next Session
- [ ] Clear next goal

## Blockers
- None / [Issue description]

## Decisions Made (Don't Revisit)
- [Date]: [Decision] — [Rationale]
```

### ISSUES.md (Running log)
```markdown
# Known Issues

## Active (Need fixing)
- [ ] Issue #1: [Description] — [Session discovered]

## Parked (Future)
- [ ] Issue #2: [Description] — [Why parked]

## Resolved
- [x] Issue #3: [Description] — [How fixed]
```

### DECISIONS.md (Append-only)
```markdown
# Decision Log

## 2026-01-01: Database Choice
**Decision**: PostgreSQL via Supabase  
**Rationale**: Free tier, real-time support, familiar  
**Status**: LOCKED — Don't revisit

## 2026-01-02: [Next decision]
```

---

## Question Protocol

### If You Have a Quick Question Mid-Session

**Format**:
```
[QUICK Q]: [Question]
```

I'll answer in 1-2 sentences and **return to main task immediately**.

### If It's a Bigger Question

**Format**:
```
[PARKING LOT]: [Question/idea]
```

I'll acknowledge, add to ISSUES.md under "Parked", and **we address it in a dedicated session later**.

### If It's Blocking Current Work

**Format**:
```
[BLOCKER]: [Issue]
```

We **stop current task**, resolve blocker, then resume.

---

## Sprint Breakdown (8-Week Plan)

### Sprint 1 (Week 1-2): Data Layer
**Goal**: Real data flowing, no localStorage

**Sessions**:
1. Setup Supabase + migrate schema
2. Wire Market Strip to CoinGecko
3. Wire Wallet Manager to Alchemy
4. Test all CRUD operations
5. Deploy + verify live

**Success Criteria**:
- ✅ Market prices update every 30s
- ✅ Wallet balances show real USD values
- ✅ All data persists across browser refresh

---

### Sprint 2 (Week 3-4): Trading + Tasks
**Goal**: Trading Dashboard + Task Manager functional

**Sessions**:
1. Database tables for Bot, Trade, Task
2. Build Trading Dashboard UI
3. Wire bot start/stop logic
4. Build Task Manager UI
5. Agent integration (suggest tasks)
6. Test full workflow

**Success Criteria**:
- ✅ Start/stop a DCA bot
- ✅ Create task from agent suggestion
- ✅ See real bot performance metrics

---

### Sprint 3 (Week 5-6): Agent Enhancement
**Goal**: PA Mode, Poker Coach, Social Feed

**Sessions**:
1. Add PA mode to Agent Console
2. Build Social Feed panel
3. Wire Twitter/Farcaster APIs
4. Build Poker Lab (hand replayer)
5. Agent poker coaching logic
6. Test all new modes

**Success Criteria**:
- ✅ Agent schedules my day
- ✅ Twitter feed shows relevant posts
- ✅ Poker hand analysis works

---

### Sprint 4 (Week 7-8): Polish + Ship
**Goal**: Production-ready, daily use

**Sessions**:
1. Learning Lab implementation
2. Full Project Manager
3. Performance optimization
4. Bug bash (test everything)
5. Mobile responsive tweaks
6. Deploy final version

**Success Criteria**:
- ✅ Zero critical bugs
- ✅ All panels load <500ms
- ✅ Using daily for real ops

---

## Rules of Engagement

### My Commitments to You

1. **Focused responses** — No rambling, just actionable code/guidance
2. **Clear next steps** — Every session ends with "Do this next"
3. **No assumptions** — I ask before making big decisions
4. **Honest estimates** — I tell you if something will take longer
5. **No scope creep** — We finish current goal before adding features

### What I Need From You

1. **Test immediately** — Run code as soon as I deliver it
2. **Exact error messages** — Copy/paste, don't paraphrase
3. **Single focus per session** — Resist side quests
4. **Mark progress** — Check off tasks in CURRENT_SPRINT.md
5. **Voice blockers early** — Don't struggle alone

---

## Emergency Protocols

### If You're Stuck

**Format**:
```
[STUCK]: [What you tried] | [Error message] | [Expected outcome]
```

I'll provide step-by-step fix.

### If We're Off Track

**Format**:
```
[RESET]: Let's refocus on [original goal]
```

I'll acknowledge and course-correct immediately.

### If You Need a Break

**Format**:
```
[PAUSE]: Stopping here. Resume at [task name]
```

I'll update CURRENT_SPRINT.md and prepare clean handover.

---

## Success Metrics (Weekly Check-In)

Every Friday:

```markdown
# Week X Check-In

## Completed
- [List finished features]

## Using Daily?
- [ ] Yes, for [X] hours/day
- [ ] Not yet, because [blocker]

## Velocity
- Sessions this week: X
- Tasks completed: Y
- Pace: On track / Ahead / Behind

## Adjust?
- Continue as-is / Speed up / Slow down
```

---

## Communication Standards

### Starting a Session

**You write**:
```
🚀 Session [number]
Goal: [from CURRENT_SPRINT.md]
Ready to build.
```

**I respond**:
```
✅ Confirmed. Building [specific task].
[Code/instructions follow]
```

### Reporting Test Results

**Format**:
```
✅ PASS: [Feature] works as expected
```
OR
```
❌ FAIL: [Feature]
Error: [exact message]
Steps: [what you did]
```

### Ending a Session

**I write**:
```
📦 Session complete.

✅ Done: [List]
⏭️ Next: [Clear action]
📝 Notes: [Any important context]

Updated: CURRENT_SPRINT.md
```

---

## Tools We'll Use

### GitHub (Primary)
- **Issues**: One per major feature (e.g., "Trading Dashboard")
- **Labels**: `sprint-1`, `sprint-2`, `bug`, `enhancement`, `blocker`
- **Milestones**: One per sprint
- **Project Board**: Kanban (To Do / In Progress / Done)

### Tracking Files (In Repo)
- `CURRENT_SPRINT.md` — Active work
- `ISSUES.md` — Bug/feature backlog
- `DECISIONS.md` — Locked choices
- `BUILD_PROTOCOL.md` — This file

### External (Optional)
- **Supabase Dashboard**: Check database state
- **Vercel Logs**: Debug deployment issues

---

## What "Done" Means

A feature is complete when:

1. ✅ Code committed to `main`
2. ✅ You tested it successfully
3. ✅ Documented in relevant files
4. ✅ No known critical bugs
5. ✅ You're using it in daily workflow

**"Good enough to ship" > "Perfect but unused"**

---

## Commit Message Format

```
<type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code restructure (no behavior change)
- docs: Documentation only
- test: Add/update tests
- chore: Tooling/config

Examples:
feat: Add Trading Dashboard bot manager
fix: Market Strip now updates every 30s
docs: Update CURRENT_SPRINT.md with week 2 progress
```

---

## Starting Right Now

### Immediate Next Steps

1. **I'll create**: `CURRENT_SPRINT.md` with Sprint 1 goals
2. **I'll create**: GitHub Project Board structure
3. **You review**: Confirm Sprint 1 priorities
4. **We start**: Session 1 — Supabase setup

---

## Sanity Checks (Red Flags)

🚩 **Stop if**:
- We've been on same task for 3+ sessions without progress
- You're not testing code I deliver
- We're building features not in COMPONENT_SPECIFICATIONS.md
- I'm explaining the same concept 3+ times
- You feel lost or overwhelmed

**Action**: Call `[RESET]` and we troubleshoot.

---

## Final Notes

This isn't just a project. It's your operational foundation and income path.

**We will**:
- Build it right
- Ship it fast
- Make it useful
- Keep you focused
- Get you to profitable

**We won't**:
- Chase perfect
- Get distracted
- Rebuild endlessly
- Miss deadlines
- Burn you out

---

**Ready to start?**

Say: `🚀 Let's build` and I'll create CURRENT_SPRINT.md + kick off Session 1.

---

**Last Updated**: 2026-01-01  
**Status**: Active  
**Next Review**: After Sprint 1 (Week 2)