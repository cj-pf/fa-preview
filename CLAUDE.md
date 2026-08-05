# Fiduciary Alliance Website — Project Context

## What this project is
A website redesign for **Fiduciary Alliance, LLC**, a registered investment adviser network based in Greenville, SC. Built with **Astro 5.0.0** as the frontend framework and **Sanity CMS** for content management.

Firm and state counts are **derived live from published Sanity firms** — never hardcode them. Whatever is published in Studio is the source of truth (currently 23 firms / 11 states).

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

~/fa-summit-site/              ← Co-branded Advisor Summit partner site (see below)
```

### Sibling project: `~/fa-summit-site`

A **standalone one-page Astro site** serving the Advisor Summit landing page on
its own domain and its own Vercel project, co-branded with **Cornerstone
Planning Group** as presenting sponsor. It exists so Cornerstone can share one
link with the advisor group they're courting without routing through this
website. Seeded from `src/pages/summit.astro`; dev server on port **4323**.

It reads the **same `summitPage` Sanity singleton** this site does, so a Studio
edit updates both. That makes the two-file rule a **three-file rule** whenever a
summit field changes: schema in `~/studio-fa-web-redesign`, query + display
here, and query + display in `~/fa-summit-site/src/lib/summit.ts` and
`src/pages/index.astro`. See `~/fa-summit-site/CLAUDE.md` for its own context.

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
| `memberFirm` | Member firms — name, streetAddress, city, state, zipCode, phone, numberOfOffices, shortDescription, website, logo. Counts on the homepage are derived from these. |
| `compliance` | SEC PDF documents (ADV, ADV Part 1A, ADV Part 2B, Form CRS) |
| `teamMember` | name, title, photo (with hotspot), bio, displayOrder |
| `summitPage` | Singleton — editable content for `/summit`: registerUrl, hotelUrl, heroImage, useCustomVenuePhoto toggle, venueImage, giveBackImage, ctaImage, ctaParallax, sponsors[] |
| `summitSponsor` | Object type used by `summitPage.sponsors[]` — name, logo, website |

---

## Pages built so far

| Route | File | Notes |
|---|---|---|
| `/` | `index.astro` | Homepage — hero video, live stats, persona cards, AI section, US map, four steps, CTA |
| `/firms` | `firms.astro` | `NetworkMap` + "MEMBER FIRMS" grid of all published firms |
| `/disclosures` | `disclosures.astro` | Links to all 4 SEC PDFs |
| `/team` | `team.astro` | Portrait cards with hover effects + bio modals |
| `/insights` | `insights.astro` | YouTube channel RSS pulled at build time → lite-embed video cards |
| `/why-fa/breakaway` | `why-fa/breakaway.astro` | "For Advisors" — hero + pain points + shared `<WhyFaShared />` |
| `/why-fa/ria-owners` | `why-fa/ria-owners.astro` | "For RIA Owners" — hero + pain points + shared `<WhyFaShared />` |
| `/assessment` | `assessment.astro` | **Growth Assessment** landing page → "Start Now" reveals the deferred survey iframe |
| `/contact` | `contact.astro` | "LET'S TALK." + Schedule a Call CTA, phone/email/address |
| `/how-it-works` | `how-it-works.astro` | **Placeholder** — no real content yet |
| `/about` | `about.astro` | **Placeholder** and currently orphaned (not linked from nav or footer) |
| `/summit` | `summit.astro` | Advisor Summit landing page — hero, GROW/SCALE/CONNECT pillars (with icons), why-attend, venue (AC Hotel Greenville), give-back (with photo), sponsors, CTA. Editable fields (register/hotel URLs, hero/venue/give-back/CTA images, sponsors) pull from the singleton `summitPage` Sanity doc, each falling back to a hardcoded default when blank. Speakers/agenda/gallery intentionally omitted. Venue photo defaults to a hotlinked Marriott CDN image (`gspac-exterior-5022`) unless `useCustomVenuePhoto` is toggled on in Studio. Official Advisor Summit logo mark shown in hero. |

---

## Design details

- **Header:** Fixed, always dark translucent — `rgba(10, 26, 36, 0.88)` + backdrop blur
- **Navigation:** Astro `ClientRouter` View Transitions enabled; `transition:persist` on Header for smooth page changes. Nav: Home · Why FA (dropdown) · Firms · Team · Insights · Summit · **Growth Assessment**
- **Fonts:** **Adobe Fonts brand kit ONLY** (`use.typekit.net/gut5szx.css`) — `trade-gothic-next-condensed` (display) + `museo-sans` (body). Never add Google Fonts or another provider. Always use `var(--display)` / `var(--body)`, never a raw family name
- **Primary CTA:** always **"Schedule a Call"** → `settings.calendlyUrl`. Never "See If You're a Fit" (retired)
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

See **PROJECT_NOTES.md §6** for the full, current open-items list. Highlights:

- Real content for "How a Partnership Works" (`WhyFaShared.astro`), `/how-it-works`, and `/about`
- `/about` is orphaned — link it into nav/footer or retire it
- Create the `siteSettings` and `assessmentPage` singletons in Studio (frontend already reads both with fallbacks)
- **Deferred by decision:** no screening on the Calendly booking flow, and the Growth Assessment isn't wired to booking. Reviewed 2026-08-05 and intentionally left as-is
- Add sitemap + Open Graph/social meta tags before launch; measure PageSpeed on production
- Deploy Sanity Studio to a public URL
- Domain not connected — do not point DNS or launch without explicit confirmation
- Optionally consolidate `~/fa-website` and `~/studio-fa-web-redesign` into one parent folder

---

## Key rules

- **Never use `sudo npm`** — causes permission issues
- **Publish vs. Save in Sanity** — always publish, don't just save draft
- **macOS smart substitutions are disabled** — em-dashes and smart quotes won't mangle code
- **Firm/state counts are derived from published Sanity docs — never hardcode them.** If a count looks wrong, fix it in Studio, not in code
- **Adobe Fonts only** — never add a second web font provider
- **Naming:** it's the **Growth Assessment** (not Health/Firm/Practice Assessment); CTAs say **"Schedule a Call"**; avoid "fit" framing in copy
- **Auto-push:** after any change, commit AND `git push` in the same turn — no batching, no asking
- **Sitewide copy sweeps:** grep for both straight and curly apostrophe forms (markup uses `&rsquo;`) before declaring done
- The user prefers **exact terminal commands** over conceptual explanations
- The user prefers **Finder** for file management wherever Terminal isn't strictly required
- **Ask when a change involves judgment calls** (headings vs. buttons, scope) rather than blind find-and-replace
