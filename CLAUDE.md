# Fiduciary Alliance Website — Project Context

## What this project is
A website redesign for **Fiduciary Alliance, LLC**, a registered investment adviser network based in Greenville, SC with 24 member firms across 10 states. Built with **Astro 5.0.0** as the frontend framework and **Sanity CMS** for content management.

- **Live preview:** https://fa-preview.vercel.app
- **GitHub repo:** https://github.com/cj-pf/fa-preview
- **Deployed via:** Vercel (auto-deploys on push to main)

---

## Folder structure

```
~/fa-website/                  ← Astro site (frontend)
  src/
    pages/                     ← One .astro file per page/route
    components/                ← Reusable Astro components
    layouts/                   ← Layout wrappers (e.g. Site.astro)
  public/                      ← Static assets (logo, favicon)

~/studio-fa-web-redesign/      ← Sanity Studio (CMS)
  schemaTypes/                 ← One .js file per content type
```

---

## Critical two-file rule

Any new Sanity content field requires changes in **both** places:

1. **Schema** — `~/studio-fa-web-redesign/schemaTypes/[schemaName].js`
2. **Query + display** — `~/fa-website/src/pages/[pageName].astro`

Never add a field in just one place.

> **Two-folder reminder:** This Claude Code session is pointed at `~/fa-website`. If a task requires a Sanity schema change, always remind the user to also open `~/studio-fa-web-redesign` in a separate Claude Code session (or edit manually) to update the schema file there.

---

## Content types (Sanity schemas) built so far

| Schema | Description |
|---|---|
| `firm` | 24 member firms — name, location, state, website, etc. |
| `compliance` | SEC PDF documents (ADV, ADV Part 1A, ADV Part 2B, Form CRS) |
| `teamMember` | name, title, photo (with hotspot), bio, displayOrder |

---

## Pages built so far

| Route | File | Notes |
|---|---|---|
| `/` | `index.astro` | Homepage |
| `/firms` | `firms.astro` | Grid of all 24 firms, "24 FIRMS. 10 STATES." header |
| `/disclosures` | `disclosures.astro` | Links to all 4 SEC PDFs |
| `/team` | `team.astro` | Portrait cards with hover effects + bio modals |
| `/summit` | `summit.astro` | Advisor Summit landing page — hero, GROW/SCALE/CONNECT pillars, why-attend, venue (AC Hotel Greenville), give-back, sponsor placeholders, CTA. Content is hardcoded in the page (not Sanity). Speakers/agenda/gallery intentionally omitted. Hotel links point to the Marriott group-booking URL; venue photo is hotlinked from Marriott's CDN (`gspac-exterior-5022`). Registration link is still a `#` placeholder. |

---

## Design details

- **Header:** Fixed, always dark translucent — `rgba(10, 26, 36, 0.88)` + backdrop blur
- **Navigation:** Astro `ClientRouter` View Transitions enabled; `transition:persist` on Header for smooth page changes
- **Team modals:** Flexbox layout with `min-height: 0` fix for scroll inside modals
- **Logo:** Static file in `public/`; referenced via `Logo.astro` component
- **Favicon:** Linked in `Site.astro`

---

## Dev server setup

Three Terminal windows are always running during development:

- **Window 1:** `cd ~/studio-fa-web-redesign && npm run dev` — Sanity Studio at **localhost:3333** (never type into this window)
- **Window 2:** `cd ~/fa-website && npm run dev` — Astro site at **localhost:4321** (never type into this window)
- **Window 3:** Working terminal for all commands

Preview the site at: http://localhost:4321

---

## Sanity notes

- **Project ID:** `mg8jdbar`
- **Dataset:** `production`
- Drafts do NOT appear on the site — content must be explicitly **Published** in Sanity Studio
- Hard refresh (`⌘+Shift+R`) is the first debugging step if published content doesn't appear

---

## Git workflow

After completing any change, commit and push from `~/fa-website`:

```bash
cd ~/fa-website
git add .
git commit -m "Brief description of what changed"
git push
```

GitHub credentials are saved to Mac keychain — no login prompt needed.

Pushing to main **automatically deploys to Vercel** — no extra step required. Live at https://fa-preview.vercel.app within ~1 minute.

---

## Design reference

- **Mockups:** `~/Documents/Claude/Projects/Web Design/mockups-v3-branded.html` — reference this file for visual direction on new pages or sections

---

## On the horizon

- Integrate map (from `mockups-v3-branded.html` in `~/Documents/Claude/Projects/Web Design/`) onto the firms page
- Build Insights/blog Sanity schema and page
- Deploy Sanity Studio to a public URL
- Optionally consolidate `~/fa-website` and `~/studio-fa-web-redesign` into one parent folder

---

## Key rules

- **Never use `sudo npm`** — causes permission issues
- **Publish vs. Save in Sanity** — always publish, don't just save draft
- **macOS smart substitutions are disabled** — em-dashes and smart quotes won't mangle code
- The user prefers **exact terminal commands** over conceptual explanations
- The user prefers **Finder** for file management wherever Terminal isn't strictly required
