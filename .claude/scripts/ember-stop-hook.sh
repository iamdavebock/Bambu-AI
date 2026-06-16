#!/usr/bin/env bash
# Ember Stop Hook — ACTIVITY.log + budgets.json
# Installed to .claude/scripts/ember-stop-hook.sh
# Called by .claude/settings.json Stop hook after each Claude response.

# Only run in Ember projects
[ -f "SESSION.md" ] || exit 0

mkdir -p .claude

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DATE=$(date -u +"%Y-%m-%d")

# --- Resolve agent, team, task from in-progress task card ---
AGENT="unknown"
TASK_DESC=""
TEAM="unknown"

if command -v python3 &>/dev/null; then
  RESULT=$(python3 - <<'PYEOF'
import json, glob, os, sys

agent = "unknown"
task  = ""
team  = "unknown"

# Find first in-progress task card
for f in sorted(glob.glob(".claude/tasks/*.json")):
    try:
        d = json.load(open(f))
        if d.get("status") == "in_progress":
            agent = d.get("agent", "unknown")
            task  = d.get("task", "").replace('"', '\\"')
            break
    except Exception:
        pass

# Look up team from teams.json
for tf in [".claude/teams.json", "agents/teams.json"]:
    if os.path.exists(tf):
        try:
            teams = json.load(open(tf))
            for tname, tdata in teams.items():
                if tdata.get("lead") == agent or agent in tdata.get("members", []):
                    team = tname
                    break
        except Exception:
            pass
        break

print(f"{agent}|{task}|{team}")
PYEOF
  )
  AGENT=$(echo "$RESULT"    | cut -d'|' -f1)
  TASK_DESC=$(echo "$RESULT" | cut -d'|' -f2)
  TEAM=$(echo "$RESULT"     | cut -d'|' -f3)
fi

# Token counts — populated when hook payload exposes usage data
TOKENS_IN=0
TOKENS_OUT=0
COST="0.0"

# --- Append JSON line to ACTIVITY.log ---
echo "{\"ts\":\"$TIMESTAMP\",\"agent\":\"$AGENT\",\"team\":\"$TEAM\",\"task\":\"$TASK_DESC\",\"tokens_in\":$TOKENS_IN,\"tokens_out\":$TOKENS_OUT,\"cost_usd\":$COST}" \
  >> .claude/ACTIVITY.log

# --- Update budgets.json ---
if command -v python3 &>/dev/null; then
python3 - <<PYEOF
import json, os

budget_file = ".claude/budgets.json"
date        = "$DATE"
agent       = "$AGENT"

# Load or initialise
if os.path.exists(budget_file):
    try:
        data = json.load(open(budget_file))
    except Exception:
        data = {}
else:
    data = {}

# Reset on new day
if data.get("date") != date:
    data = {"date": date, "agents": {}, "total_cost_usd": 0.0, "budget_limit_usd": 5.0}

if agent not in data["agents"]:
    data["agents"][agent] = {"invocations": 0, "tokens_in": 0, "tokens_out": 0, "cost_usd": 0.0}

data["agents"][agent]["invocations"] += 1
data["total_cost_usd"] = round(sum(v["cost_usd"] for v in data["agents"].values()), 6)

with open(budget_file, "w") as f:
    json.dump(data, f, indent=2)
PYEOF
fi

# Remind to close session cleanly
echo "💡 Run /session-end to update SESSION.md and commit."
