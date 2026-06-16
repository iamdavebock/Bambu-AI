# Commit

Create a structured git commit:

1. Run `git diff --staged && git status` to see what's changed
2. Run `git diff` to review unstaged changes — stage anything relevant
3. Stage files: `git add <specific files>` (never `git add -A` blindly)
4. Write a commit message:
   - Format: `[type]: short description`
   - Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`
   - First line ≤ 72 chars
   - Body if needed (what and why, not how)
5. Commit: `git commit -m "[message]"`
6. Report: files committed, message used

Do NOT push. Push requires Director confirmation.
