# Ember Agents

All Ember agents are active Claude Code custom sub-agents in `.claude/agents/`. Claude routes tasks automatically based on each agent's description. For explicit delegation: `"Use the [name] agent to [task]"`.

---

## Teams

| Team | Lead | Members |
|------|------|---------|
| Build | `fullstack` | `coder` · `frontend` · `backend` · `mobile` · `typescript` · `python` · `react` · `nextjs` · `api` |
| Quality | `reviewer` | `tester` · `qa` · `debugger` · `security` · `accessibility` · `performance` |
| Infrastructure | `devops` | `cloud` · `docker` · `terraform` · `monitor` |
| Data & AI | `data` | `postgres` · `analyst` · `data-analyst` · `ml` · `llm` |
| Research | `planner` | `researcher` · `competitive-analyst` · `ba` · `product-manager` · `ux-researcher` · `bizops` |
| Content | `writer` | `documenter` · `seo` · `google-ranking` · `designer` · `copywriter` · `customer-success` |
| Creative | `graphic-designer` | `marketing-creative` |

---

## Quick Routing

| Task | Route to |
|------|----------|
| New feature / complex task | `planner` → Build team |
| General code | `coder` |
| Backend / API | `backend` · `python` |
| Frontend / UI | `frontend` · `react` · `nextjs` |
| Database / schema | `data` · `postgres` |
| Bug investigation | `debugger` |
| Code review | `reviewer` |
| Tests | `tester` · `qa` |
| Security concern | `security` |
| Performance issue | `performance` |
| Third-party API | `api` |
| UI/UX design | `designer` |
| Infrastructure | `docker` · `devops` · `terraform` |
| LLM / AI features | `llm` |
| Documentation | `documenter` · `writer` |
| Requirements unclear | `ba` · `product-manager` |
| Research | `researcher` |
| Refactoring | `refactor` |
| Payments | `payment` |
| Accessibility | `accessibility` |
| Static site / website | `site-builder` |
| Graphics / brand visuals | `graphic-designer` |
| Marketing creative | `marketing-creative` |

---

## Full Roster

### Core
| Agent | Role |
|-------|------|
| `orchestrator` | Session coordinator — never spawned as sub-agent |
| `planner` | Implementation planning, ordered steps |
| `coder` | General code writing across any language/framework |
| `designer` | UI/UX design, component design, design systems |

### Full-Stack Development
`fullstack` · `frontend` · `backend` · `mobile`

### Language Specialists
`typescript` · `python` · `react` · `nextjs`

### Infrastructure
`cloud` · `docker` · `terraform` · `devops`

### Quality & Security
`qa` · `tester` · `debugger` · `reviewer` · `security` · `accessibility` · `performance`

### Data & AI
`data` · `postgres` · `analyst` · `ml` · `llm` · `api`

### Developer Experience
`cli-tool` · `refactor` · `mcp` · `monitor` · `documenter`

### Business, Research & Content
`ba` · `product-manager` · `ux-researcher` · `researcher` · `competitive-analyst`
`payment` · `writer` · `seo` · `google-ranking`

### Creative
`graphic-designer` · `marketing-creative`

### Standalone
`site-builder` — full static site pipeline (design → build → deploy)

Agent definitions: `.claude/agents/`
