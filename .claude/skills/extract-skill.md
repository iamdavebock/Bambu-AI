# Extract Skill

Reverse-engineer a reusable skill file from the current conversation.

1. Review the conversation history — identify the task just completed, the steps taken, tools used, questions asked, and decisions made.

2. Derive a clean, reusable procedure from that history:
   - Strip out context specific to this project/conversation
   - Keep only the steps that would apply in any similar situation
   - Note edge cases or decisions that weren't obvious

3. Generate a skill file using this format:

```markdown
# Skill Name

> One-line description of what this skill does

## When to Use
- Trigger conditions (what situation calls for this skill)

## Steps
1. Step-by-step process, imperative voice
2. ...

## Tools Required
- List of tools or MCP servers needed (omit if none beyond standard)

## Example Prompt
> The prompt or command a user would type to trigger this skill

## Notes
- Edge cases, gotchas, or decisions observed during the original task
```

4. Choose a kebab-case filename that matches the skill name (e.g. `deploy-to-vercel.md`).

5. Write the file to `.claude/skills/<filename>.md` in the current project.

6. Report: skill name, filename, and a one-line summary of what was captured.

Keep the output skill file under 60 lines. Strip anything project-specific — the skill must work in any Ember project.
