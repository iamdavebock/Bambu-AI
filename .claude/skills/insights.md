# Insights

> Analyse how you're using your AI operating system — what's working, what's friction, what to improve.

## When to Use
- After several sessions to find inefficiencies
- When sessions feel slow or repetitive
- Before a planning session to surface improvement opportunities

## Steps

1. **Gather data** — run these in parallel:
   - `cat SESSION.md` — current state, recent activity
   - `git log --oneline -30` — last 30 commits, types and patterns
   - `ls .claude/memory/` — memory files present
   - `ls .claude/agents/` — agents installed
   - `ls .claude/skills/ 2>/dev/null || echo "no skills dir"` — skills in use

2. **Analyse patterns** from the data:
   - Which commit types appear most (feat/fix/chore/docs)?
   - Which agents are referenced in SESSION.md or commit messages?
   - What tasks recur across sessions?
   - Are there repeated blockers, errors, or "again" moments?
   - What context is frequently re-explained that could be captured?

3. **Identify friction** — look for:
   - Tasks with no agent match (done manually, could be delegated)
   - Missing skills (multi-step procedures run repeatedly without a `/command`)
   - Missing memory (context re-stated each session)
   - Commits that are vague or too large (signals unclear workflow)

4. **Generate the report** in this exact format:

```
## Insights Report — [Project Name]
**Period:** [earliest commit date] → [today]
**Sessions analysed:** [count from git log or SESSION.md]

### What's Working
- [Effective patterns, agents used well, clean workflows]

### Friction Points
- [Inefficiencies, repeated mistakes, missing context, slow paths]

### Quick Wins
- [New skill to create, memory file to add, agent to use, context to improve]

### Usage Patterns
- Most common task types: [from commit types]
- Most used agents: [from SESSION.md / commit messages]
- Session complexity: [light / medium / heavy — based on commit density]

### Recommendations
1. [Highest-impact improvement]
2. [Second priority]
3. [Third priority]
```

5. After the report, ask: "Want me to action any of these now?"

## Notes
- If SESSION.md is missing, derive sessions from git log clustering (gaps > 4hrs = new session)
- Keep each bullet to one line — this is a scan, not an essay
- Recommendations must be actionable, not generic ("add logging" not "improve observability")
- If fewer than 3 sessions exist, note limited data and report what's available
