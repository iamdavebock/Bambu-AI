# Business Map

Conduct a structured business mapping interview and produce a comprehensive `business.md` document. This maps the business's teams, workflows, tools, and pain points — and recommends which Ember agents and skills are most relevant.

---

## The Interview

Run the interview in 5 sections. Ask each section's questions **all at once**, then wait for the full response before moving to the next section. Do not ask follow-up questions mid-section — capture what's given and move on.

---

### Section 1 — Identity

Ask these questions together:

1. What is the business name?
2. What industry are you in?
3. How big is the team? (approximate headcount)
4. What stage is the business at? (idea / startup / growth / established / enterprise)
5. In one sentence: what does the business sell or deliver?

---

### Section 2 — Teams & Structure

Ask these questions together:

1. What are the main teams or departments?
2. What are the key roles in each team? (just the critical ones)
3. Who are the primary decision-makers?
4. Are there any external partners, contractors, or agencies involved in the core work?

---

### Section 3 — Core Workflows

Ask these questions together:

Walk me through your **3 most important business processes**. Common examples: lead to close, project delivery, customer onboarding, support resolution, product launch, invoice to payment. For each workflow, describe:
- What triggers it (the starting event)
- The key steps from start to finish
- Who is involved at each stage
- What system or tool handles each step
- How it ends (the successful outcome)

---

### Section 4 — Tools & Systems

Ask these questions together:

1. List the tools each team uses day-to-day. (CRM, PM tool, comms, file storage, billing, dev tools, etc.)
2. Which integrations between tools are critical — where does data move automatically between systems?
3. Where are the biggest manual handoffs — steps someone does by hand that feel like they should be automated?
4. Are there any systems the business has outgrown or is planning to replace?

---

### Section 5 — Pain Points & Goals

Ask these questions together:

1. What takes the most time in the business but shouldn't?
2. What breaks most often — recurring failures, drop-offs, or errors in your workflows?
3. Where do things fall through the cracks — work that gets lost between people or systems?
4. What would "AI working well in this business" look like in 90 days? What would be visibly different?

---

## The Output

After all 5 sections are complete, produce the following:

### 1. Save `business.md` to the project root

```markdown
# [Business Name] — Business Map
*Generated: [date] via /business-map*

---

## Overview
[2–3 sentence summary of the business: what it does, who it serves, current stage]

---

## Business Identity
| Field | Detail |
|-------|--------|
| Industry | |
| Team size | |
| Stage | |
| Core offering | |

---

## Teams & Structure
| Team | Key Roles | Primary Responsibilities |
|------|-----------|------------------------|
| | | |

---

## Core Workflows

### Workflow 1 — [Name]
**Trigger:** [what starts it]
**Steps:** [numbered list]
**People:** [who is involved]
**Tools:** [systems used]
**Pain points:** [friction in this workflow]

[Repeat for each workflow]

---

## Tools & Systems
| Tool | Team(s) | Purpose | Integration status |
|------|---------|---------|-------------------|
| | | | |

---

## Pain Points (ranked by impact)
1. [Highest impact]
2.
3.
...

---

## 90-Day AI Goals
[What the business wants to be visibly different after 90 days with AI]

---

## Ember Agent Recommendations
| Workflow / Area | Recommended Agents | Why |
|----------------|-------------------|-----|
| | | |

---

## Recommended Skills
[List of `/skill-name` commands most relevant to this business's workflows]

---

## Diagram Opportunities
The following workflows are strong candidates for swimlane / process flow diagrams:

[List each workflow with a brief note on why it's worth visualising]

To generate diagrams: connect the draw.io MCP (`mcp.draw.io/mcp`) and ask:
"Generate a draw.io swimlane diagram for [workflow name] based on the business.md in this project."
```

---

### 2. Summary to Director

After saving `business.md`, present a brief summary (5–8 lines max):
- Business profile (1 sentence)
- Top 3 pain points
- Top 5 recommended agents
- Top 3 recommended skills
- Most valuable diagram to build first
- Suggested next action
