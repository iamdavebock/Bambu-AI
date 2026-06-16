# Sync

> Sync this project's Ember core files (agents, commands, skills) to the latest source.

## When to Use
- After updating Ember source files (agents, commands, skills)
- When a project feels out of date or is missing agents
- To check what would change before applying (`--dry-run`)

## Steps

1. Run the sync script targeting this project:
   ```bash
   /mnt/agents/projects/ember/scripts/ember-sync.sh --project "$(basename "$PWD")"
   ```

2. If you want to preview changes first:
   ```bash
   /mnt/agents/projects/ember/scripts/ember-sync.sh --project "$(basename "$PWD")" --dry-run
   ```

3. To sync ALL projects at once:
   ```bash
   /mnt/agents/projects/ember/scripts/ember-sync.sh
   ```

4. Report what changed: new agents, updated commands/skills, exclusions honoured.

## Exclusions

If this project has custom agent overrides that should NOT be overwritten by sync, create a `.ember-local` file in the project root listing one filename per line:

```
# .ember-local — files to skip during sync
my-custom-agent.md
```

## Notes
- The sync script is idempotent — running it twice produces zero changes
- It only syncs `.md` files from agents, commands, and skills directories
- The Ember source project itself is never synced (it IS the source)
- Runs automatically via daily system cron
