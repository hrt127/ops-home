# Knowledge Management Patterns

Extracted from `~/dojo/knowledge` and refined for Ops-Home integration.

---

## Pattern 1: Capture → Refine → Surface

### Flow
```
Raw Capture (Inbox/Notes Panel)
    ↓
Refinement (Review, tag, categorize)
    ↓
Surface (Dashboard, Learning Lab, Project Manager)
```

### Implementation
1. **Capture**: Use Notes Panel for quick capture
2. **Refine**: Add tags, summary, related links
3. **Surface**: Appears in relevant panels automatically

---

## Pattern 2: Idea Pipeline

### Stages
```
Idea → Shaping → Live
```

### Criteria
- **Idea**: Raw concept, no structure
- **Shaping**: Defined goal, architecture, phases
- **Live**: Deployed, in use, maintained

### Implementation
- Use Ideas Panel for tracking
- Move cards between stages
- Archive when complete

---

## Pattern 3: LLM Session Protocol

### Before Session
1. Define goal
2. Gather context
3. Set constraints
4. Choose format

### During Session
1. Keep thread file open
2. Paste important exchanges
3. Use clear headings

### After Session
1. Summarize outcomes
2. Extract rules → Notes
3. Extract patterns → Guides
4. Extract tasks → Task Manager
5. Extract ideas → Ideas Panel

---

## Pattern 4: Daily Review

### Morning
1. Check Calendar for events
2. Review Tasks for today
3. Check System Log for alerts
4. Review Market Strip

### Evening
1. Log completed tasks
2. Capture new notes/ideas
3. Update project status
4. Plan tomorrow

---

## Pattern 5: Project Lifecycle

### Stages
```
Idea → Planning → Building → Shipping → Maintaining
```

### Checkpoints
- **Idea**: Clear goal, context, value
- **Planning**: Architecture, phases, tech stack
- **Building**: Incremental progress, tests
- **Shipping**: Deployed, documented, monitored
- **Maintaining**: Updates, fixes, improvements

### Implementation
- Use Project Manager for tracking
- Use Task Manager for execution
- Use Notes for documentation

---

## Pattern 6: Learning Workflow

### Spaced Repetition
```
Learn → Review (1 day) → Review (3 days) → Review (7 days) → Review (30 days)
```

### Mastery Levels
- 0-20%: Beginner
- 21-60%: Intermediate
- 61-80%: Advanced
- 81-100%: Expert

### Implementation
- Use Learning Lab for tracking
- Set review schedules
- Update mastery after each review

---

## Pattern 7: Wallet Safety Protocol

### Before Any Operation
1. Select wallet in Wallet Manager
2. Review Active Session panel
3. Verify allowed actions
4. Check forbidden actions
5. Confirm risk band

### Decision Matrix
- **Safe + Allowed** → Proceed
- **Safe + Forbidden** → Block
- **Medium + Allowed** → Caution
- **Medium + Forbidden** → Block
- **High + Allowed** → Double-check
- **High + Forbidden** → Block

---

## Pattern 8: Task Breakdown

### Large Task
```
Epic Task
├── Subtask 1
│   ├── Action 1.1
│   └── Action 1.2
├── Subtask 2
│   ├── Action 2.1
│   └── Action 2.2
└── Subtask 3
```

### Implementation
1. Break into subtasks (< 2 hours each)
2. Assign priority
3. Set due dates
4. Track in Task Manager

---

## Pattern 9: Note Organization

### Structure
```
# Topic

## Summary
One sentence.

## Content
Detailed explanation.

## Related
Links to other notes.

## Metadata
Tags, dates, status.
```

### Tagging Strategy
- **Category**: solidity, trading, defi, system
- **Type**: rule, pattern, example, reference
- **Status**: draft, reviewed, archived

---

## Pattern 10: Trading Bot Workflow

### Setup
1. Define strategy (DCA, Grid, Manual)
2. Set parameters (entry, size, limits)
3. Test on small size
4. Monitor in Trading Dashboard

### Monitoring
1. Check P&L daily
2. Review position details
3. Adjust if needed
4. Pause if market changes

### Closing
1. Review performance
2. Log lessons learned
3. Update strategy notes
4. Archive position

---

## Anti-Patterns (Avoid These)

### ❌ Capture Without Review
- Capturing notes but never refining them
- **Fix**: Schedule weekly review

### ❌ Idea Hoarding
- Collecting ideas but never executing
- **Fix**: Limit to 3 active ideas

### ❌ Task Overload
- Adding too many tasks
- **Fix**: Focus on top 3 daily

### ❌ Ignoring Permissions
- Operating wallet without checking permissions
- **Fix**: Always review Active Session first

### ❌ Learning Without Practice
- Reading without applying
- **Fix**: Build projects to reinforce learning

---

## Best Practices

1. **Capture Fast**: Don't overthink, just capture
2. **Refine Later**: Set aside time for refinement
3. **Surface Automatically**: Let the system surface relevant info
4. **Review Regularly**: Daily, weekly, monthly reviews
5. **Trust the System**: If it's in Ops-Home, it's tracked
