# Fiduciary Alliance Website — Project Notes

> Complete handoff document. If all other context is lost, this file plus the codebase should be enough to continue work. Last updated 2026-07-16 (rebuilt `/assessment` as a branded landing page — hero + click-to-play preview video + "Start Now" reveals the survey — replacing the bare iframe embed; see §9).

---

## 1. Project overview

A website redesign for **Fiduciary Alliance, LLC** — a registered investment adviser (RIA) network based in Greenville, SC. Member firms across ~10 states (counts are now derived live from the CMS, not hardcoded).

**Positioning:** advisor-owned, no private equity, a "federation / alliance — not a rollup or aggregator." Two audiences: independent advisors (breakaway IARs/RRs) and existing RIA owners.

**Tech stack:**
- **Astro 5.x** — static site generator. Everything is built to static HTML at build time; there is no server runtime.
- **Sanity CMS** (project ID `mg8jdbar`, dataset `production`) — content source, fetched at build time.
- **Vercel** — hosting. Auto-deploys on push to `main`. Live preview: https://fa-preview.vercel.app
- **GitHub:** `cj-pf/fa-preview`
- Build-time-only libraries: `d3-geo` + `topojson-client` (US map projection), `@sanity/image-url` (hotspot-aware image transforms).

**Two-repo setup:** the Astro frontend lives in `~/fa-website` (this repo). The Sanity Studio lives separately in `~/studio-fa-web-redesign`. Any new Sanity field requires changes in BOTH places — schema in the studio repo, query+display here. This session is pointed at the frontend repo only.

---

## 2. Pages built so far

| Route | File | Status | Notes |
|---|---|---|---|
| `/` | `src/pages/index.astro` | **Done, actively iterated** | Homepage. See section breakdown below. |
| `/firms` | `src/pages/firms.astro` | **Done** | Grid of all member firms from Sanity. Heading "N FIRMS. M STATES." auto-derived from live firm count + unique states. Cards are stretched-links to each firm's website with blue hover. |
| `/team` | `src/pages/team.astro` | **Done** | Portrait card grid, ordered by `orderRank` (drag-and-drop in Studio). Click a card → bio modal. Photos honor Studio hotspot/crop via `@sanity/image-url`. Modal photos preload on hover. |
| `/insights` | `src/pages/insights.astro` | **Done** | Pulls latest videos from the Fiduciary Alliance YouTube channel RSS feed at build time. Lite-embed cards (thumbnail → iframe on click). "More →" button to the channel. |
| `/disclosures` | `src/pages/disclosures.astro` | **Done** | Links to the 4 SEC PDFs (ADV, ADV Part 1A, ADV Part 2B, Form CRS) from the `compliance` Sanity doc. |
| `/why-fa/breakaway` | `src/pages/why-fa/breakaway.astro` | **Done** | "For Advisors" page. Hero + 5 pain points + shared `<WhyFaShared />` body. |
| `/why-fa/ria-owners` | `src/pages/why-fa/ria-owners.astro` | **Done** | "For RIA Owners" page. Hero + 5 pain points + shared `<WhyFaShared />` body. |
| `/summit` | `src/pages/summit.astro` | **Done** | Advisor Summit landing page — hero (background video `summithero.mp4` + official `summitlogo.png` mark), GROW/SCALE/CONNECT pillar cards w/ icons, why-we-gather, venue (AC Hotel Greenville), give-back section w/ photo, sponsors, CTA. Editable fields pull from the `summitPage` Sanity singleton (each falls back to a hardcoded default when blank): `showRegisterButton` + `registerUrl`, `hotelUrl`, `heroImage`, `useCustomVenuePhoto` + `venueImage` (defaults to a hotlinked Marriott CDN photo), `giveBackImage`, `ctaImage` + `ctaParallax`, `showSponsorsSection` + `sponsors[]`. Speakers/agenda/gallery intentionally omitted. |
| `/assessment` | `src/pages/assessment.astro` | **Done, rebuilt as a landing page** | Firm Assessment landing page (matching the redesigned site) — hero (full-width headline + click-to-play preview video), a restyled "Why This Assessment Matters" section with outcome cards, and a "Start Now" button that reveals + scrolls to the embedded survey (deferred until clicked). Survey app is `claude-assessment-sigma.vercel.app/embed`; page title + iframe URL read from an `assessmentPage` Sanity singleton (fallbacks baked in). See §9 for the full breakdown. |
| `/contact` | `src/pages/contact.astro` | **Placeholder** | Phone/email/address (from site settings) + "form coming soon." Qualifier form not built. |
| `/how-it-works` | `src/pages/how-it-works.astro` | **Placeholder** | "From first call to launch" heading + "coming soon." Linked from homepage hero secondary button. |
| `/about` | `src/pages/about.astro` | **Placeholder** | "A federation, not a rollup" heading + "coming soon." Not linked in main nav. |

**Deleted pages (do not recreate):** `for-iars.astro`, `for-ria-owners.astro`, `why.astro` — these were replaced by the `/why-fa/*` structure.

### Homepage section order (`index.astro`)
1. **Hero** — looping background video (`/hero.mp4`), headline "YOUR GROWTH, OUR MISSION.", eyebrow "Advisor-owned · No private equity", lede "A network of independent RIAs designed to grow." Primary CTA → Calendly, secondary → How it works.
2. **Stats** — 3 animated count-up stats: firm count (live), state count (live), AUM ("$1.8B", verbatim text). No top/bottom border lines.
3. **Context strip** (`.home-context`) — "You deserve more FREEDOM, FLEXIBILITY, AND SCALE with your advisory practice. Keep more of what you earn." Sits close under the stats.
4. **Choose your path** — two persona cards → `/why-fa/breakaway` and `/why-fa/ria-owners`.
5. **We are / We're not** — "AN ALLIANCE — NOT A ROLLUP." Uses base `--bg` (NOT `.surface-elev`) to match the AI section.
6. **AI section** (`<AISection />`) — "WE'RE NOT AFRAID OF AI." + tool pills (Zocks, Claude, Black Diamond, + more). **Responsive treatment differs by breakpoint** — desktop is the two-column layout with the image in a bordered card; ≤820px the photo becomes a full-bleed blurred parallax background behind the copy (see §8).
7. **National network / map** — real US map (see Automations §4), pins per firm, hover tooltip with firm name(s). Right column = "Our footprint" state list (capped at top 7 states).
8. **Four steps** (`.surface-elev`) — "FOUR STEPS. NO SURPRISES." TALK / DILIGENCE / PLAN / LAUNCH.
9. **Quote** — placeholder testimonial ("Member firm principal · Quote placeholder · TBD").
10. **CTA strip** — "CURIOUS WHAT THIS COULD LOOK LIKE FOR YOU?" → Calendly + Explore firms.

**Visual-break sections were removed** — three full-bleed break sections ("INDEPENDENCE. BUILT TO LAST.", "24 FIRMS. ONE ALLIANCE.", "READY TO SEE IF YOU'RE A FIT?") were added then deleted as redundant. The `.visual-break` CSS may still exist in `global.css` but is unused on the homepage.

---

## 3. Design system

**Source of truth:** `src/styles/tokens.css` (CSS custom properties). `src/styles/global.css` holds all component styles. Change tokens to retheme the whole site.

### Colors
| Token | Hex | Use |
|---|---|---|
| `--brand-green` | `#355F3D` | Primary button background |
| `--brand-green-bright` | `#4F8458` | Accent — eyebrows, active states, hovers, emphasis |
| `--brand-teal` | `#115671` | Deep teal |
| `--brand-teal-bright` | `#2E89B5` | Blue accent — firm-card hover, tab underline, focus rings |
| `--brand-teal-light` | `#88C2C7` | Map pins, light teal accents |
| `--neutral-gray` | `#717271` | |
| `--light-gray` | `#D9D9D9` | |
| `--white` | `#FFFFFF` | |
| `--bg` | `#0A1A24` | Default section background (dark navy) |
| `--bg-elev` | `#112C3F` | Elevated section background (`.surface-elev`) |
| `--bg-deep` | `#061520` | Footer background |
| `--surface` | `#1A3C53` | Cards, pills, tiles |
| `--surface-2` | `#234B68` | Secondary surface |
| `--ink` | `#FFFFFF` | Primary text |
| `--ink-soft` | `#DBE3EC` | Body text |
| `--ink-mute` | `#8B9DB0` | Muted text / labels |
| `--line` | `rgba(255,255,255,0.10)` | Hairline borders |
| `--line-strong` | `rgba(255,255,255,0.18)` | Stronger borders |

The **What We Provide tabs section** (on the Why FA pages) is a deliberate **light** section — it locally overrides `--ink`, `--ink-soft`, `--ink-mute`, `--line` to dark-on-light values against a `#F4F6F8` background, so nested components flip automatically.

### Fonts
The real brand typefaces (per the "Typefaces / Print & Web" brand book page) are now live:
- `--display`: **`trade-gothic-next-condensed`** (falls back to Barlow Condensed → Trade Gothic → Impact) — all headings, eyebrows, labels, buttons, nav. Licensed weights: 400 (Regular) and 700 (Bold), both roman (non-italic).
- `--body`: **`museo-sans`** (falls back to Mulish → system sans) — body paragraphs. Licensed weights: 100, 300, 500, 500 italic, 700, 900.
- Loaded via **Adobe Fonts** (Creative Cloud, `<link rel="stylesheet" href="https://use.typekit.net/gut5szx.css">` in `src/layouts/Site.astro`), with the original Google Fonts `<link>` (Barlow Condensed / Mulish) left in place as a fallback while the Adobe stylesheet loads or if it ever fails.
- **Originally** (until 2026-07-16) the site used **Barlow Condensed** as a stand-in for Trade Gothic and **Mulish** as a stand-in for Museo Sans, because the real fonts weren't licensed for web yet. A brand-book PDF (`Type face for FA.pdf`) confirmed the actual typefaces are **Trade Gothic** (primary/display — brand book lists "Trade Gothic LT Std Condensed No. 18", "Bold Condensed No. 20", etc.) and **Museo Sans** (tagline/body, weights 100–900). Carey activated both as a web project in Adobe Fonts (Creative Cloud) — Adobe's naming for them is `trade-gothic-next-condensed` and `museo-sans`.
- **Gotcha hit along the way:** the first Adobe Fonts pass only had **italic** condensed weights activated (no roman/non-italic bold), so large bold numerals (`.stat .num`, `.step .num`) rendered via browser font-synthesis — visibly chunkier/bigger than intended. Fixed by activating the **roman, non-italic Bold** style of Trade Gothic Next Condensed in the Adobe Fonts project (same `gut5szx.css` kit URL — no code change needed to pick it up, just a republish on Adobe's side).
- Headings render **ALL CAPS in the markup** (not via `text-transform`) — match this when adding headings.
- The **"Fiduciary Alliance Design System"** project in Design (`claude.ai/design`) was updated to match — `tokens/fonts.css` there now imports the same Adobe Fonts kit and uses the same family names, so wireframes built there match the live site's type. Note: that Design project's **color tokens** (`tokens/colors.css`) are still from an older/different brandkit source and do **not** match the live site's palette — left as-is per explicit instruction; only fonts were reconciled.

### Spacing / layout
- `--max: 1240px` — max content width (`.container`).
- `--pad: clamp(1.25rem, 4vw, 3rem)` — container horizontal padding.
- `--section: clamp(5rem, 10vw, 8rem)` — default vertical section padding. `.section-sm` is a smaller variant.
- `--shadow` — standard elevation shadow.
- Card corners: `12px` (cards like persona/network/AI), `4px` (small tiles/pills).

### Branding decisions
- **Header:** fixed, always dark translucent `rgba(10,26,36,0.88)` + backdrop blur. **Exception:** on `/assessment` it drops into normal flow (`position: relative`, solid bg) so it scrolls away — see §9. This is driven by a `bodyClass="assessment-page"` prop on the `Site` layout + a `body.assessment-page .site-header` rule in `global.css`.
- **Nav:** Home · Why FA (dropdown: Breakaway, RIA Owners) · Firms · Team · Insights · Summit · Health Assessment. Astro `ClientRouter` view transitions, `transition:persist` on Header. Collapses to a hamburger overlay at ≤820px (see §8). The **desktop header phone number was removed** — the nav-right now holds only the "See If You're a Fit" CTA + hamburger.
- **"Why FA" dropdown:** opens on hover; the caret is a separate clickable button (label itself is not a link). Uses pointer cursor.
- **Primary CTA everywhere:** "See If You're a Fit" → `https://calendly.com/boughner` (opens new tab). Driven by site settings (see §7).
- **Logo:** static `public/logo.png` via `Logo.astro`.

---

## 4. Automations & build-time processes

All of these run **at build time** (on each Vercel deploy). There is no client-side server.

### a) Sanity content → site
All page content (firms, team, compliance PDFs, homepage AUM, site settings) is fetched from Sanity at build time via `src/lib/sanity.ts`. `useCdn: false` so a publish-triggered rebuild always gets fresh data.
- **Trigger:** a Sanity webhook (configured in sanity.io/manage) pings a Vercel deploy hook on publish → Vercel rebuilds → live in ~1 min. Also any `git push` to `main` rebuilds.

### b) Auto firm & state counts
Homepage stats and the `/firms` heading derive `firmCount` from `memberFirms.length` and `stateCount` from the unique set of firm states. **Add/remove a firm in Studio → counts update automatically.** The old manual `statFirms`/`statStates` (homePage doc) and `firmsPage.heading` overrides were removed from the code and are now ignored.

### c) US map with geocoded pins (homepage)
- State borders: `src/data/us-states-10m.json` (us-atlas TopoJSON) projected via `d3-geo` `geoAlbersUsa` at build time.
- Firm pins: each firm's **street address** is geocoded to lat/lng by `src/lib/geocode.ts`.
  - Results are cached in `src/data/geocode-cache.json` (all current firms pre-resolved → build makes zero API calls today).
  - Cache misses fall back to the free **Nominatim (OpenStreetMap)** API with progressively broader queries (street → city-level). Rate-limited to ~1 req/sec.
  - **Add a firm with a new address → next build geocodes it once and drops a pin.** If the exact street can't be resolved it still lands at city level.
- Nearby firms (within ~14px on the projected map) merge into one pin; the hover/focus tooltip lists all firm names there.
- HQ = Parallel Financial (Greenville, SC) renders as a slightly larger pin labeled "HQ".
- `src/data/firmCityCoords.ts` now only holds the `FIPS_TO_ABBR` map (the old hardcoded city coords were removed).

### d) Insights YouTube feed
`src/pages/insights.astro` fetches `https://www.youtube.com/feeds/videos.xml?channel_id=UCERu76vbIZfLg8BIpvUT-tQ` at build time, parses title/description/thumbnail, renders lite-embed cards. New uploads appear on the next deploy. Falls back gracefully to a "coming soon" + channel link if the fetch fails.

### e) Client-side scripts (re-bind on view transitions)
Because of Astro `ClientRouter`, any interactive script must run on BOTH initial load and `astro:page-load`, guarded so it doesn't double-bind. Pattern used throughout:
```js
function setupX() { /* guard with dataset.ready */ }
setupX();
document.addEventListener('astro:page-load', setupX);
```
This governs: header dropdown, homepage scroll animations + counters + map tooltip + hero video fallback, Why-FA service tabs + collapsible items, team bio modals + photo preload. **A bug where team cards only worked on hard refresh was exactly this — the handler wasn't re-binding on view transitions. Don't reintroduce it.**

---

## 5. File structure

```
~/fa-website/                         ← Astro frontend (THIS repo)
  PROJECT_NOTES.md                    ← this file
  CLAUDE.md                           ← project instructions for Claude Code
  .claude/launch.json                 ← dev-server config (astro-dev, port 4321)
  public/
    hero.mp4                          ← homepage hero video (~16MB)
    summithero.mp4                    ← summit hero background video
    summitlogo.png                    ← Advisor Summit logo mark (summit hero)
    summit.jpg                        ← summit give-back photo fallback
    assessment-hero.mp4               ← /assessment preview video (~16MB, click-to-play)
    assessment-poster.jpg             ← /assessment video poster (title-card frame, ~124KB)
    logo.png, favicon.png
    images/ai-tools.jpg               ← AI section image
    images/technology-tab.png         ← (legacy) tech-tab illustration, no longer used
  src/
    pages/                            ← one .astro per route (see §2)
      why-fa/breakaway.astro, ria-owners.astro
      summit.astro                    ← Advisor Summit page (summitPage singleton)
      assessment.astro                ← Health Assessment page (iframe embed)
    components/
      Header.astro                    ← nav + dropdown + CTA (reads site settings)
      Footer.astro                    ← footer links + LinkedIn/YouTube social icons
      Logo.astro
      AISection.astro                 ← homepage AI section (self-contained)
      WhyFaShared.astro               ← shared body for both Why-FA pages: comparison
                                        table, FA Difference, "What We Provide" tabs,
                                        "How a Partnership Works" placeholder, CTA
    layouts/
      Site.astro                      ← HTML shell: head, fonts, ClientRouter, Header,
                                        Footer. Accepts an optional `bodyClass` prop
                                        (used by /assessment to un-fix the header).
    lib/
      sanity.ts                       ← Sanity client, getSiteSettings(), phoneToTel(),
                                        urlFor() image builder
      geocode.ts                      ← build-time address → lat/lng (cache + Nominatim)
    data/
      us-states-10m.json              ← US TopoJSON for the map
      geocode-cache.json              ← pre-resolved firm coordinates
      firmCityCoords.ts               ← FIPS_TO_ABBR state-code map
    styles/
      tokens.css                      ← design tokens (colors, fonts, spacing)
      global.css                      ← all component styles
    utils/
      url.ts                          ← url() helper (base-path prefix, passes through externals)

~/studio-fa-web-redesign/             ← Sanity Studio (SEPARATE repo, not open here)
  schemaTypes/                        ← one .js/.ts per content type
```

**Sanity content types:** `memberFirm` (name, streetAddress, city, state, zipCode, phone, numberOfOffices, shortDescription, website, logo), `teamMember` (name, title, bio, photo w/ hotspot, orderRank), `compliance` (4 SEC PDFs), `homePage` (heroHeadline, statAum — stat counts no longer used), `summitPage` singleton (showRegisterButton, registerUrl, hotelUrl, heroImage, useCustomVenuePhoto, venueImage, giveBackImage, ctaImage, ctaParallax, showSponsorsSection, sponsors[]), `summitSponsor` object (name, logo, website — used in `summitPage.sponsors[]`), `assessmentPage` singleton (pageTitle, iframeUrl), plus a planned `siteSettings` singleton.

---

## 6. Open items / known issues

- **NEXT UP: "How a Partnership Works" section needs real content.** Currently a placeholder in `WhyFaShared.astro:230-238` (shared by both `/why-fa/breakaway` and `/why-fa/ria-owners`) — eyebrow "How a partnership works", h2 "FROM FIRST CONVERSATION TO LAUNCH.", and a "Detailed timeline coming soon" body line. Needs to become a real step-by-step walkthrough of onboarding, transition support, and the first 90 days (the homepage already has a simpler 4-step TALK/DILIGENCE/PLAN/LAUNCH section at `index.astro` §2 step 8 that could inform tone/structure, but this section should be more detailed per its own copy).
- **`siteSettings` singleton not yet created in Studio.** The frontend already reads it via `getSiteSettings()` with hardcoded fallbacks (Calendly URL, phone `864·385·7999`, email `admin-fa@fiduciaryalliance.org`, address `135 S Main Street, Suite 600 · Greenville, SC 29601`). Paste-ready schema + setup instructions were written to the session scratchpad (`siteSettings.ts`, `STUDIO-SETUP.md`) — recreate if lost. Until published in Studio, the site uses fallbacks (which currently match reality, so nothing looks broken).
- **`assessmentPage` schema not yet created in Studio.** The `/assessment` page already queries it (`pageTitle`, `iframeUrl`) with baked-in fallbacks (`Health Assessment — Fiduciary Alliance`, `https://claude-assessment-sigma.vercel.app/embed`), so the page works today. Paste-ready schema was provided in chat — add it to `~/studio-fa-web-redesign` (two-file rule) and register it in `schemaTypes/index.js` if the URL/title should become editable.
- **Assessment iframe height is a fixed fallback (940px)** sized to the survey's first step. The iframe is cross-origin, so the parent can't measure it. `/assessment` already listens for `postMessage({type:'assessment:resize', height})` from the embedded app and will auto-fit every step once that app posts its content height — a 5-line `ResizeObserver` snippet was provided for the survey repo. Until then, later steps may not fit the 940px exactly.
- **`firmsPage.heading` field is now dead** in Studio (site derives the heading). Safe to remove from the studio schema; a prompt to do so was provided.
- **`statFirms` / `statStates` fields on the homePage doc are unused** — can be cleaned up in Studio later.
- **Placeholder pages:** `/contact` (no real form), `/how-it-works` (no real content), `/about` (no real content). Testimonial quote on the homepage is a placeholder ("TBD").
- **Domain not yet connected.** User has the domain but is NOT ready to go live. Pre-launch visibility approach (noindex vs. password vs. leave-as-is) and final host (Vercel vs. Cloudflare) were being discussed but not decided. Do not point DNS or launch without explicit confirmation.
- **Custom domain / launch is intentionally deferred** — there is still content work to do.
- **Media hosting ceiling:** `hero.mp4` is ~16MB in `public/`. Fine for now, but hosting many/large videos in the repo is not ideal long-term — use YouTube (already done for Insights) or a video CDN (Mux / Cloudflare Stream) if more video is added.

---

## 7. Key decisions & preferences (non-obvious)

**Workflow:**
- **AUTO-PUSH after every committed change.** The user wants: edit → commit → `git push` in the same turn, no batching, no asking. Vercel auto-deploys from `main`. (This is saved in Claude memory as `feedback-auto-push`.)
- Commit messages end with `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`.
- **"Don't worry about the preview."** The user runs their own dev servers and reviews visually themselves. Do NOT spin up the preview/dev server to verify unless explicitly asked — just make the change, commit, push.
- User prefers **exact terminal commands** over conceptual explanations, and **Finder** for file management where Terminal isn't required.

**Content / brand:**
- Never say "PE-free" — say **"No private equity"**. Tagline is **"Your growth, our mission."**
- Positioning language: **"alliance / federation, NOT a rollup / aggregator."**
- Firm counts, state counts, and map pins must **auto-generate from Sanity** — the user explicitly does not want to hand-edit these numbers.
- "What We Provide" tabs (in `WhyFaShared.astro`): **5 tabs** — Technology, Operations, Investments, Compliance, Growth Coaching. 7 items each except **Investments = 6**. When condensing, **merge existing items — do not invent new capabilities.**
- **Services tab left column:** a small 40px stroke icon (currentColor → brand green `#4F8458`) sits **above** the tab headline and summary. The old "N tech platforms" proof block was removed. Several experiments (per-tab illustrations, a cloud/tower PNG, a tech-icons PNG) were tried and rejected — final direction is the restrained icon-above-headline treatment. Don't reintroduce large illustrations without explicit direction.
- Site settings (Calendly link, phone, email, address) should live in **one place** (the `siteSettings` singleton) so a single edit updates everywhere.

**Technical conventions:**
- **Two-file rule:** any new Sanity field = schema change in `~/studio-fa-web-redesign` AND query+display here. Always remind the user to open the studio repo for schema work.
- **Always publish (not just save)** in Sanity — drafts don't appear on the site.
- **Never `sudo npm`.**
- Interactive scripts must re-bind on `astro:page-load` (see §4e).
- macOS smart substitutions are disabled, so straight quotes/dashes in code are safe.

**Design continuity:**
- New sections must use the existing tokens, fonts (Trade Gothic Next Condensed display / Museo Sans body — see §3), and accent colors — no one-off custom palettes. The AI section was explicitly reworked to remove custom cyan/mint colors and gradient text and to match the site.
- Hero fallback photo should only appear if the video fails to load (desktop); mobile shows the photo (video hidden). No photo "flash" before the video starts.

---

## 8. Mobile / tablet (responsive)

The site is a single responsive build — no separate mobile pages. Layout is fluid via the `clamp()` tokens; the notes below cover the breakpoint-specific behavior. **Key breakpoint: `820px`.** At/below it the site switches to its "mobile/tablet" treatment (hamburger nav + AI blurred background); above it is "desktop." A second, smaller breakpoint at `640px` tightens spacing and eases blur/scrim for phones. The two preview presets used while building were **mobile = 375px** and **tablet = 768px** (both ≤820 → mobile/tablet treatment); **1280px** = desktop.

### a) Header → hamburger menu (`Header.astro` + `global.css`)
- **Desktop (>820px): unchanged** — full nav row + phone + "See If You're a Fit" CTA.
- **≤820px:** the inline nav and the header CTA are hidden; a **hamburger button** (`.nav-toggle`) appears. Tapping it opens a **full-screen overlay** (`.mobile-menu`) listing every page — Home, Why FA → Breakaway / RIA Owners (as a labeled sub-group), Firms, Team, Insights — with the current page highlighted in `--brand-green-bright`, plus the CTA button and phone number pinned at the bottom. Hamburger animates to an X; body scroll locks while open.
- **Critical structural detail:** the `.mobile-menu` is rendered as a **sibling *after* `</header>`, NOT inside it.** The header has `backdrop-filter`, which makes it the containing block for `position:fixed` descendants — a fixed menu nested inside would be trapped to the 84px header height. The open state is therefore keyed off **`body.menu-open`** (toggled in JS), not a class on the header.
- JS (`initHeader()` in `Header.astro`) is guarded with `header.dataset.ready` because the header uses `transition:persist` (persists across view transitions — bind once). Menu closes on link click, Escape, `astro:before-swap`, and on resize above 820px.

### b) Tighter section spacing on phones (`global.css`)
- The `--section` token floor (`clamp(5rem, 10vw, 8rem)` → 5rem min) felt too tall on narrow screens. At **≤640px**, `:root { --section: 3.25rem }` and `.section-sm` drops to `2.5rem`. This tightens vertical rhythm site-wide (every `<section>` uses `--section`).

### c) AI section — blurred parallax background (mobile/tablet only) (`AISection.astro`)
The component ships **both layouts in one markup** and toggles by breakpoint:
- **Desktop (>820px):** original two-column grid — copy left, photo in a bordered card (`.ai-visual`) right. `.ai-bg` and the scrim `::after` are `display:none`. This is the canonical/unchanged desktop design.
- **≤820px:** `.ai-visual` card is hidden; the photo renders as a **full-bleed blurred parallax background** (`.ai-bg`) behind the copy, under a dark scrim (`::after`) that keeps the light text readable.

Hard-won details in the mobile treatment (each fixes a specific bug the user caught — don't regress these):
- **Full-width coverage:** the bg image uses horizontal overscan (`left:-6%; width:112%`) **plus `max-width:none`** — the global `img { max-width:100% }` reset was silently clamping the 112% back to 100%, leaving an uncovered strip on the right.
- **Edge blending:** the top and bottom of the photo dissolve into the neighboring `--bg` sections via the scrim's **vertical gradient to opaque `#0A1A24`** at the 0–5% and 95–100% stops (long ~30% fade ramps). An earlier CSS `mask-image` approach was removed — it glitched on mobile GPUs over the blurred layer.
- **No hairline seam:** the bg image has **no `will-change`**. Promoting a `filter: blur()` layer to its own compositor layer and clipping it with `overflow:hidden` renders a 1px seam at the section's clip edge. Parallax still works (it's driven by the actual `transform`).
- **Parallax:** driven by JS setting a `--parallax-y` CSS variable on all `[data-ai-parallax]` images. The mobile bg consumes the full value (factor `-0.14`); the desktop card **damps it in CSS** (`calc(var(--parallax-y) * 0.3)`) so bumping the shared factor for mobile didn't over-move the desktop card.
- **Reveal:** an `IntersectionObserver` adds `.ai-in` to fade the photo in (opacity 0→1) as the section scrolls into view.
- **Motion/blur tiers:** blur is `2px` (≤820) / `1.5px` (≤640); `prefers-reduced-motion` shows the photo statically (no reveal fade, no parallax).

### d) Verified on both presets
Hero, stats, "We are / We're not" list, AI section, map + footprint, four-step section, firm cards (single column), team portraits, and the Insights video grid all stack and scale cleanly at 375px and 768px. The hamburger, blurred AI background, and tightened spacing were all confirmed in the browser preview.

---

## 9. Firm Assessment page (`/assessment`)

Rebuilt (2026-07-16) from a bare full-width iframe into a proper **landing page** that matches the redesigned site, then reveals the survey on demand. It reuses the site's own component vocabulary (`.hero`, `.eyebrow`, `.btn-primary`, `.section-head`, outcome cards) rather than one-off styles. The old page was just the embed described at the end of this section; the survey embed itself is unchanged, just gated behind a "Start Now" click.

### Page structure (top → bottom)
1. **Hero** (`.hero-assessment`) — eyebrow "Firm Assessment", a full-width headline ("GET A CLEAR SNAPSHOT OF YOUR FIRM'S GROWTH POTENTIAL."), a body paragraph, an "It's not about judgment…" note, and a **Start Now** button — with the preview **video** on the right.
2. **"Why This Assessment Matters"** (`.section-sm`) — restyled from the old page's photo-left/text-right layout into the site's section pattern: eyebrow + h2 + intro, then three **outcome cards** (What's working / What's slowing you down / What's next), then a closing paragraph and a second Start Now button.
3. **`#take-assessment`** — the embedded survey, hidden until Start Now is clicked (see reveal behavior below).

### Layout / styling specifics (each fixes something the user called out — don't regress)
- **Flat hero background:** `.hero-assessment` overrides the global hero's gradient — `::before` is a flat `--bg` and `::after` (the gradient overlay) is `display:none`, so the hero and the section below read as one continuous surface. `min-height` is dropped to `0` with modest padding (no background image to justify a tall hero).
- **Full-width heading:** the hero is a CSS grid (`.hero-assessment-grid`) using `grid-template-areas` so the eyebrow + heading span **both** columns, with copy on the left and the video on the right. The h1 is scaled **down** from the site's full 6rem (`clamp(2.25rem, 4.5vw, 3.75rem)`) because it's a full sentence, not the short phrase other heroes use.
- **Hero body copy = site body size:** the hero paragraph uses `.lede` markup but is overridden to `1.0625rem` / weight 400 (the site's standard 17px body size), **not** the 20px `.lede` size — as a full paragraph the lede size read too big vs. the home page.
- **Mobile/tablet (≤900px):** the grid collapses to a single left-anchored column, reordered via `order` to **heading → body → video → copy → start now**. ⚠️ **Specificity trap fixed here:** the desktop `grid-area: <name>` rules (two-class selectors) outrank a `> *` reset, so the mobile media query must reset each element's `grid-area: auto` with **matching-specificity selectors** — otherwise the named areas persist against `grid-template-areas: none` and all hero items collapse into one overlapping cell.

### Preview video (`public/assessment-hero.mp4` + `public/assessment-poster.jpg`)
- The real 48s "Practice Growth Assessment" promo (1920×1080, H.264, **with audio**). Presented as **click-to-play**: a branded play-badge overlay (`.video-play` button) sits over the poster; clicking hides the overlay, flips the `<video>` to `controls`, and calls `play()` — so it plays **with sound** (user-gesture-initiated) and hands off to native controls.
- **Poster:** `assessment-poster.jpg` is the video's opening title-card frame, extracted with a small **Swift/AVFoundation** script (no ffmpeg on this machine — `swift` + `AVAssetImageGenerator`, then `sips -Z 1280` to downscale/compress to ~124KB). With a real poster the `<video>` uses **`preload="none"`** — the ~16MB video is not fetched until the user clicks (verified: `networkState` idle / `readyState` 0 on load).
- **To replace the video later:** drop the new file at `public/assessment-hero.mp4`; regenerate the poster from its first frame (the scratchpad `poster.swift` does this: `swift poster.swift <in.mp4> <out.jpg>`) → `sips -Z 1280 -s formatOptions 80`.

### "Start Now" reveal (deferred iframe)
- Both Start Now buttons carry `.js-start-assessment`. Clicking: `preventDefault()`, sets the iframe's `src` from its `data-src`, adds `.is-visible` to `#take-assessment` (CSS `display:none` → `block`), and `scrollIntoView({behavior:'smooth'})`.
- **The survey is genuinely absent until clicked** — the iframe ships with `data-src` (not `src`), so no request to the survey app fires on page load (verified in the network panel). This was an explicit requirement.
- The embedded survey keeps `scrolling="no"` + a fallback height (`940px`, sized to step 1) and the same `postMessage({type:'assessment:resize', height})` auto-resize listener as before (origin-checked; also accepts `{type:'resize'}` / bare `{height}` / `"height:N"`). See §6 for the outstanding auto-resize follow-up on the survey app.
- **Note:** the old `bodyClass="assessment-page"` header-scroll-away behavior was **removed** — the page now has real content above the survey, so it uses the normal fixed header like every other page. (The `body.assessment-page .site-header` rule in `global.css` is now unused by this page.)

## Dev / deploy quick reference

```bash
# Studio (separate terminal, separate repo) — localhost:3333
cd ~/studio-fa-web-redesign && npm run dev

# Astro site — localhost:4321
cd ~/fa-website && npm run dev
```
Push to `main` → Vercel auto-deploys → https://fa-preview.vercel.app (~1 min). Sanity project `mg8jdbar`, dataset `production`. Never `sudo npm`.
