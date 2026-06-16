---
name: site-builder
description: Static site generation, AI design systems, Astro templates, Vercel deployment, subdomain/custom domain hosting. Use when building tenant websites, generating design systems, or deploying static sites.
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
---

## Site Builder Agent

**Role:** End-to-end static site generation — design intelligence, content generation, Astro builds, and Vercel/nginx deployment.

**Proven stack:** ui-ux-pro-max skill + Claude content + Astro template + Vercel CLI/API.

---

### Core Pipeline

```
1. _query_ui_ux_skill(business_type, services, location)
       ↓ python3 .claude/skills/ui-ux-pro-max/scripts/search.py "{query}" --design-system -f markdown
       ↓ parse: colors, fonts, style_name, key_effects

2. Claude generates content using skill's design as constraint
       ↓ hero, services, testimonials, about, hours — business-specific
       ↓ colors and fonts are LOCKED from skill output (not re-selected)

3. Astro template build
       ↓ Copy template to /tmp/{slug}-build/
       ↓ Write content to template files (custom: site.json + .env / third-party: .astro files)
       ↓ npm install && npm run build  →  dist/

4. Deploy
       ↓ Vercel: stage to .vercel/output/static/ + config.json, then vercel deploy --prebuilt
       ↓ Local: docker cp dist/ sieno-celery-worker:/var/www/sites/{slug}
```

---

### Step 1 — ui-ux-pro-max Skill

**Install (if not present):**
```bash
git clone --depth=1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill \
    .claude/skills/ui-ux-pro-max
```

**Query:**
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
    "{business_type} {services[:3]} {location} local service" \
    --design-system -f markdown
```

**Parse from markdown output:**
- Colors table: `| Primary | #hex |` rows — map CTA → accent
- Typography: `**Heading:** Font`, `**Body:** Font`, `@import url(...)` in code block
- Style: `### Style` section → `**Name:** ...`

**Graceful fallback:** if skill unavailable or parse fails, pass `selected_design=None` — Claude picks its own design.

---

### Step 2 — Claude Content Generation

Pass skill colors/fonts as hard constraints in the prompt:

```
DESIGN SYSTEM — USE THESE EXACT values, do NOT override:
Primary: {primary}  Secondary: {secondary}  Accent: {accent}
Background: {background}  Text: {text}
Heading: "{heading}"  Body: "{body}"
CSS Import: {css_import}

Generate ONLY content: hero headline/subheadline, services (3–6 with descriptions),
why_choose_us (4–5 points), about (narrative + stats + certifications),
testimonials (3–5), hours, tagline.
Return valid JSON.
```

---

### Step 3A — Custom Template Build (trades-v1 / env-var pattern)

Content injected via `.env` + `src/data/site.json` before `npm run build`.

```python
# Write site.json with AI content
with open(f"{build_dir}/src/data/site.json", "w") as f:
    json.dump({"services": ..., "testimonials": ..., "about": ...}, f)

# Write .env with sanitised PUBLIC_* vars
env_lines = [
    f'PUBLIC_SITE_NAME="{_sanitise_env_val(tenant_name)}"',
    f'PUBLIC_COLOR_PRIMARY="{colors["primary"]}"',
    f'PUBLIC_FONT_HEADING="{fonts["heading"]}"',
    # ... all PUBLIC_* vars
]
with open(f"{build_dir}/.env", "w") as f:
    f.write("\n".join(env_lines))
```

Security: always sanitise DB values: `str(v).translate(str.maketrans("", "", "\r\n\"'\\")`

---

### Step 3B — Third-Party Template Build (astrowind / component pattern)

Content injected directly into `.astro` files. Three files to modify:

**`src/config.yaml`** — site name, URL, metadata:
```yaml
site:
  name: Business Name
  site: 'https://slug.sites.domain.com'
metadata:
  title:
    default: Business Name — Location
  description: "SEO description"
  robots:
    index: false
    follow: false
ui:
  theme: 'light:only'   # prevents skill palette being inverted in dark mode
apps:
  blog:
    isEnabled: false
```

**`src/components/CustomStyles.astro`** — inject skill colours:
```html
<style is:global>
  :root {
    --aw-color-primary: #7C3AED;
    --aw-color-secondary: #A78BFA;
    --aw-color-accent: #22C55E;
    --aw-font-family-heading: 'Inter', sans-serif;
    --aw-font-family-body: 'Inter', sans-serif;
  }
</style>
```

**`src/pages/index.astro`** — replace entire file with business content as component props:
```astro
---
import Layout from '~/layouts/PageLayout.astro';
import Hero from '~/components/widgets/Hero.astro';
import Features from '~/components/widgets/Features.astro';
import Steps from '~/components/widgets/Steps.astro';
import FAQs from '~/components/widgets/FAQs.astro';
import Stats from '~/components/widgets/Stats.astro';
import CallToAction from '~/components/widgets/CallToAction.astro';
---
<Layout metadata={{title: "Business Name — Location", ignoreTitleTemplate: true}}>
  <Hero actions={[{variant: 'primary', text: 'Contact Us', href: '#contact'}]}>
    <Fragment slot="title">Compelling Headline</Fragment>
    <Fragment slot="subtitle">Specific supporting copy.</Fragment>
  </Hero>
  <Features id="features" title="What We Do" items={[
    {title: "Service", description: "...", icon: "tabler:tools"},
  ]} />
  <FAQs title="FAQ" items={[{title: "Q?", description: "A."}]} />
  <CallToAction title="Get Started" actions={[{variant:'primary', text:'Contact', href:'#contact'}]} />
</Layout>
```

---

### Step 4A — Vercel CLI Deploy (manual/test)

```bash
# Stage output in Vercel Build Output API format
mkdir -p /tmp/build/.vercel/output/static
echo '{"version":3}' > /tmp/build/.vercel/output/config.json
cp -r /tmp/build/dist/. /tmp/build/.vercel/output/static/

# Deploy — requires --scope (team slug), fails without it in non-interactive mode
npx vercel deploy --prebuilt \
    --token "$VERCEL_TOKEN" \
    --scope "$VERCEL_SCOPE" \
    --yes
```

If you don't know the scope, run once without it — the error message lists available choices.

---

### Step 4B — Vercel API Deploy (automated/Celery)

```python
# 1. Upsert project
r = requests.get(f"https://api.vercel.com/v9/projects/{slug}", headers={"Authorization": f"Bearer {token}"})
project = r.json() if r.ok else requests.post("https://api.vercel.com/v9/projects",
    headers=..., json={"name": slug}).json()

# 2. Upload files
for filepath in Path(dist_path).rglob("*"):
    if filepath.is_file():
        content = filepath.read_bytes()
        sha = hashlib.sha1(content).hexdigest()
        requests.put("https://api.vercel.com/v2/files",
            headers={..., "x-vercel-digest": sha, "Content-Type": "application/octet-stream"},
            data=content)

# 3. Create deployment
requests.post("https://api.vercel.com/v13/deployments", headers=...,
    json={"name": slug, "files": file_list, "target": "production"})
```

---

### Step 4C — Local nginx Deploy

**Critical:** Write via a container that has the volume mounted — NOT the host path.

```bash
# Wrong — writes to host, NOT the Docker named volume:
cp -r dist/ /var/www/sites/my-slug/

# Correct:
docker cp /tmp/build/dist my-celery-worker:/var/www/sites/my-slug
# or from inside the container:
# shutil.copytree(dist_path, "/var/www/sites/my-slug", dirs_exist_ok=True)
```

---

### Nginx Config — Critical Rule

Use `try_files $uri $uri/ $uri.html =404` — NOT `try_files $uri $uri/ /index.html`.

The SPA fallback (`/index.html`) causes an infinite redirect loop (500 error) with multi-page
Astro static builds because nginx re-processes `/index.html` through the same rule.

```nginx
location / {
    try_files $uri $uri/ $uri.html =404;
}
```

---

### Template Registry

Templates cloned into `astro-templates/` — select by setting `website.template`:

| template key | Style | Best for |
|---|---|---|
| `trades-v1` | Custom (env-var) | Trades, services — native pipeline |
| `astrowind` | Component-based | General business, SaaS (5.5k ⭐) |
| `screwfast` | Component-based | Construction, services (1.3k ⭐) |
| `accessible-starter` | Component-based | Any (WCAG AAA, 1.1k ⭐) |
| `pinwheel` | Component-based | SaaS — 17+ pages (MIT) |
| `bigspring` | Component-based | Marketing — 10+ pages (MIT) |
| `landing-page` | Component-based | Single-page service sites |

Full registry: `astro-templates/TEMPLATES.md`

---

### Design Config Structure

```json
{
  "ui_ux_design": {
    "colors": {"primary": "#hex", "secondary": "#hex", "accent": "#hex", "background": "#hex", "text": "#hex"},
    "fonts": {"heading": "Inter", "body": "Inter", "css_import": "https://fonts.googleapis.com/..."},
    "style_name": "Accessible & Ethical",
    "key_effects": "Clear focus rings, skip links, 44x44px touch targets"
  },
  "ai_generated": { "colors": {...}, "fonts": {...}, "hero": {...}, "services": [...], "about": {...} },
  "user_services": { "services": [...] },
  "scraped_data": { "pages": [...], "detected_colors": [...], "detected_fonts": [...] },
  "ai_seo": { "blueprint": { "pages": [...], "schema_markup": {...} } }
}
```

---

### Reference Docs

Full documented patterns: `docs/static-site-generation/` in this repo.
- `skill-integration.md` — complete skill query + parse + Claude integration code
- `vercel-deployment.md` — both deployment paths with all gotchas
- `astro-template.md` — custom vs third-party template comparison
- `nginx-routing.md` — wildcard subdomain + custom domain config
- `docker-setup.md` — volume wiring + write gotcha
