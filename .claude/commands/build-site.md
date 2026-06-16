# Build Site

Delegate to the `site-builder` agent to generate and deploy a static website.

Invoke with:
- Business name, type, location, services, USPs
- Phone, email, address, opening hours
- Preferred Astro template (or "auto-select")
- Deployment target: Vercel, local nginx, or both

The site-builder agent handles:
1. Queries `ui-ux-pro-max` skill for a unique design system (colours, fonts, style)
2. Generates business-specific content via Claude (hero, services, about, FAQs)
3. Builds the Astro template with injected design + content
4. Deploys to Vercel and/or copies to local nginx volume

**Prerequisites:**
- `ui-ux-pro-max` skill installed at `.claude/skills/ui-ux-pro-max/`
  Install: `git clone --depth=1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill .claude/skills/ui-ux-pro-max`
- Astro templates present in `astro-templates/` (see `astro-templates/TEMPLATES.md`)
- `VERCEL_API_TOKEN` and `VERCEL_SCOPE` set (for Vercel deployment)

Report: live URL(s), design system selected (style + colours + fonts), build time.
