# Session End

Wrap up the session cleanly:

1. **Update the Tasks table in SESSION.md:**
   - Mark completed tasks as `done`
   - Add any new tasks started this session (use T001, T002 format)
   - Update statuses to reflect current state

2. **Update task cards in `.claude/tasks/`:**
   - Update the `status` field on any task cards worked on this session
   - Create new task cards for tasks started this session

3. **Move completed work to `.claude/memory/HISTORY.md`:**
   - Append a `## YYYY-MM-DD` block summarising what was done this session
   - Keep SESSION.md lean — do not accumulate completed history there

4. **Update Next Steps** to reflect what's actually left
5. **Clear resolved blockers** (write "None" if clear)
6. **Update the Last Session block** with today's date and one-line status

7. **Commit:** `git add -A && git commit -m "[type]: description"`
   - Do NOT push — push requires Director confirmation

8. **Report to Director:**
   - What was completed this session (3–5 bullets)
   - What's next (top 2–3 items)
   - Any blockers

Keep it concise. Status first, detail second.
