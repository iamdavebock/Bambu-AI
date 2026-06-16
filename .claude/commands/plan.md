# Plan

## Step 1 — Interview

Before producing a plan, ask the Director these questions **all at once**:

1. What is the core problem this solves?
2. Who is this for?
3. What does success look like?
4. What should this NOT do?

Summarise the answers back to the Director and confirm before moving to Step 2.

## Step 2 — Delegate to Planner

Invoke the Planner agent with:
- What needs to be built or changed (WHAT)
- Current state of the codebase (what exists, what's relevant)
- Constraints (tech stack, existing patterns, known blockers)
- Success criteria confirmed in Step 1

The Planner returns:
- Step-by-step implementation plan
- Files to create/modify
- Key architectural decisions
- Risks or trade-offs

## Step 3 — Approve

Present the plan to the Director for approval before delegating to the Coder.
