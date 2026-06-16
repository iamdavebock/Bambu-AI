# Spec — [Goal in one sentence]

## Goal

[One sentence. What end-state does this loop achieve?]

---

## Done-when (Acceptance Criteria)

Deterministic criteria are preferred. The loop agent checks these each cycle and stops when all are met.

- [ ] [Specific, binary criterion — e.g. "All 42 endpoints in api.md are implemented and return 200"]
- [ ] [Specific, binary criterion — e.g. "Test suite passes with zero failures"]
- [ ] [Specific, binary criterion — e.g. "No TypeScript errors on `tsc --noEmit`"]
- [ ] [LLM-judge criterion if needed — e.g. "Reviewer agent confirms code quality meets project standards"]

> Deterministic criteria (tests, linters, explicit counts) are preferred over LLM-judge criteria. Use LLM-judge only when quality cannot be expressed as a binary check.

---

## Out of scope

[What this loop must NOT do. Be explicit to prevent scope creep across cycles.]

- [e.g. "Do not modify the authentication module"]
- [e.g. "Do not change the database schema"]

---

## Verification method

- [ ] Deterministic — `tester` agent / `/test` / CI green
- [ ] LLM-judge — `reviewer` agent / `/verify`
- [ ] Both (deterministic first, LLM-judge on pass)

---

## Budget ceiling

**USD ceiling:** $[amount]

Set with: `ember budget set --ceiling <usd>`
Check with: `ember budget check --interval <interval> --duration <duration>`

---

## Trigger type

- [ ] Human (manual `/loop` run)
- [ ] Schedule (`/loop every <interval>` or VM cron)
- [ ] Event (GitHub Action — `templates/github/ember-loop-pr.yml`)

**Interval:** [e.g. every 5 minutes / every 30 minutes / on PR open]
**Max duration:** [e.g. 2 hours / 1 day / 3 days]
**Max iterations:** [e.g. 20]

---

## Owner agent(s)

**Builder:** [e.g. `fullstack`, `backend`, `coder`]
**Verifier:** [e.g. `reviewer`, `tester`]
