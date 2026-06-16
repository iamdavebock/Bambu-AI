# Loop Build

Design and launch a spec-driven, budget-capped, verified build loop.

## Step 1 — Capture the goal

State the loop's goal in one sentence. It must describe an end-state that can be verified, not an ongoing activity.

Example: "All endpoints in spec.md return correct responses and all tests pass."

## Step 2 — Establish spec.md

Locate or create `spec.md` using the Ember spec template (`templates/spec.template.md`).

The spec is the loop's contract. Every cycle, the agent reads spec.md and asks: "Is this done?" It must contain at least one deterministic done-when criterion.

## Step 3 — Choose a trigger

| Trigger | When to use | How |
|---------|-------------|-----|
| Human | One-off build sprint | Run `/loop` manually |
| Schedule | Recurring maintenance or monitoring | `/loop every <interval>` or VM cron |
| Event | React to PR, push, or webhook | GitHub Action at `templates/github/ember-loop-pr.yml` |

## Step 4 — Choose verification

**Deterministic (preferred):** tests pass, linter clean, no errors.
- Delegate to the `tester` agent or invoke `/test` inside the loop prompt.
- CI green counts as deterministic.

**LLM-judge:** quality cannot be expressed as a binary check.
- Delegate to the `reviewer` agent or invoke `/verify` inside the loop prompt.
- Use sparingly — LLM-judge adds cost per cycle.

You can combine both: deterministic first, then LLM-judge only if tests pass.

## Step 5 — Pre-flight the budget

Before running, check the cost projection:

```bash
ember budget check --interval <interval> --duration <duration>
```

If it exits non-zero (estimate exceeds ceiling or no ceiling set):

```bash
ember budget set --ceiling <usd>
```

Then re-run the check. Do not proceed until it passes.

To estimate cost first:

```bash
ember budget estimate --interval <interval> --duration <duration> --model sonnet
```

## Step 6 — Emit the loop command

Construct the `/loop` command using this pattern:

```
/loop every <interval> "Read spec.md. Delegate the next incomplete section to the [specialist] agent to implement. When implementation is done, invoke the [reviewer/tester] agent to verify. If all done-when criteria in spec.md are met, stop. Otherwise continue. Max iterations: <n>."
```

Replace `[specialist]` with the appropriate Ember agent (e.g. `fullstack`, `backend`, `coder`).
Replace `[reviewer/tester]` with the appropriate verifier.
Set `<n>` to a safe maximum — e.g. 50 for a long build, 10 for a short fix cycle.

The stop condition must be explicit in the prompt. Do not rely on Claude deciding to stop without a prompt instruction.

## Step 7 — State persistence

Before starting, confirm that `SESSION.md` and `MEMORY.md` exist and are current. The loop agent reads these at the start of each cycle — this is how Ember maintains continuity across iterations that a bare `/loop` cannot provide.

Update `MEMORY.md` with the loop goal and spec location so any cycle can orient itself without re-reading conversation history.

## Notes

- Loops are session-bound. If the Claude Code session ends, the loop ends.
- Claude Code enforces a hard cap of 3 days on loop duration.
- For always-on or multi-day loops, schedule via VM cron on the Ember VM (10.108.14.194) or use `/schedule`.
- Pause a running loop with Escape. Resume by re-running the `/loop` command.
