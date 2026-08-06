# Fiduciary Alliance Website — Project Notes

> Complete handoff document. If all other context is lost, this file plus the codebase should be enough to continue work. Last updated 2026-08-05 — **naming + CTA overhaul**: "Health Assessment" renamed **Growth Assessment** sitewide; every "See If You're a Fit" CTA replaced with **"Schedule a Call"**; `/contact` promoted from placeholder to a real scheduling page; Google Fonts dropped in favor of the **Adobe Fonts brand kit only**. See §10 for the CTA / conversion-path architecture and §6 for what's still open.

---

## 1. Project overview

A website redesign for **Fiduciary Alliance, LLC** — a registered investment adviser (RIA) network based in Greenville, SC. Member firms span multiple states; **counts are derived live from published Sanity firms, never hardcoded** (currently 23 firms / 11 states). Whatever is published in Studio is the source of truth — if a count looks wrong, the fix is in Studio, not the code.

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
| `/summit` | `src/pages/summit.astro` | **Done** | Advisor Summit landing page — hero (background video `summithero.mp4` + official `summitlogo.png` mark), GROW/SCALE/CONNECT pillar cards w/ icons, "Why attend" (four unnumbered reason cards — "WORTH CLEARING THE CALENDAR"), venue (AC Hotel Greenville), give-back section w/ photo, sponsors, CTA. Editable fields pull from the `summitPage` Sanity singleton (each falls back to a hardcoded default when blank): `showRegisterButton` + `registerUrl`, `hotelUrl`, `heroImage`, `useCustomVenuePhoto` + `venueImage` (defaults to a hotlinked Marriott CDN photo), `giveBackImage`, `ctaImage` + `ctaParallax`, `showSponsorsSection` + `sponsors[]`. Speakers/agenda/gallery intentionally omitted. |
| `/assessment` | `src/pages/assessment.astro` | **Done, rebuilt as a landing page** | **Growth Assessment** landing page (renamed from "Health Assessment" 2026-08-05) — hero (full-width headline + click-to-play preview video), a restyled "Why This Assessment Matters" section with outcome cards, and a "Start Now" button that reveals + scrolls to the embedded survey (deferred until clicked). Survey app is `claude-assessment-sigma.vercel.app/embed`; page title + iframe URL read from an `assessmentPage` Sanity singleton (fallbacks baked in). See §9 for the full breakdown. |
| `/contact` | `src/pages/contact.astro` | **Done (light)** | Promoted from placeholder 2026-08-05. Heading "LET'S TALK.", a lede, and a primary **Schedule a Call** button → Calendly as the main next step, with phone/email/address (from site settings) as secondary "In the meantime" info, plus the RIA-owner `partnership@` routing note. No qualifier form — booking *is* the next step by design. |
| `/how-it-works` | `src/pages/how-it-works.astro` | **Placeholder** | "From first call to launch" heading + "coming soon." Linked from homepage hero secondary button. |
| `/about` | `src/pages/about.astro` | **Placeholder** | "A federation, not a rollup" heading + "coming soon." Not linked in main nav. |

**Deleted pages (do not recreate):** `for-iars.astro`, `for-ria-owners.astro`, `why.astro` — these were replaced by the `/why-fa/*` structure.

### Homepage section order (`index.astro`)
1. **Hero** — looping background video (`/hero.mp4`), headline "YOUR GROWTH, OUR MISSION.", eyebrow "Advisor-owned · No private equity", lede "A network of independent RIAs designed to grow." Primary CTA "Schedule a Call" → Calendly, secondary → How it works.
2. **Stats** — 3 animated count-up stats: firm count (live), state count (live), AUM ("$1.8B", verbatim text). No top/bottom border lines.
3. **Context strip** (`.home-context`) — "You deserve more FREEDOM, FLEXIBILITY, AND SCALE with your advisory practice. Keep more of what you earn." Sits close under the stats.
4. **Choose your path** — two persona cards → `/why-fa/breakaway` and `/why-fa/ria-owners`.
5. **We are / We're not** — "AN ALLIANCE — NOT A ROLLUP." Uses base `--bg` (NOT `.surface-elev`) to match the AI section.
6. **AI section** (`<AISection />`) — "WE'RE NOT AFRAID OF AI." + tool pills (Zocks, Claude, Black Diamond, + more). **Responsive treatment differs by breakpoint** — desktop is the two-column layout with the image in a bordered card; ≤820px the photo becomes a full-bleed blurred parallax background behind the copy (see §8).
7. **National network / map** — real US map (see Automations §4), pins per firm, hover tooltip with firm name(s). Right column = "Our footprint" state list (capped at top 7 states).
8. **Four steps** (`.surface-elev`) — "FOUR STEPS. NO SURPRISES." TALK / DILIGENCE / PLAN / LAUNCH. (The TALK step's body was rewritten 2026-08-05 to drop "fit" framing — now "A short, candid conversation about your firm and your goals. Both directions.")
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
**Adobe Fonts is the ONLY web font provider — these are the brand kit fonts. Do not add Google Fonts (or any other provider) back.** (Explicit instruction, 2026-08-05.)

- `--display`: **`trade-gothic-next-condensed`** — all headings, eyebrows, labels, buttons, nav. Licensed weights: **400 (Regular) and 700 (Bold)**, both roman (non-italic).
- `--body`: **`museo-sans`** — body paragraphs. Licensed weights: 100, 300, 500, 500 italic, 700, 900.
- Loaded via **Adobe Fonts** (Creative Cloud): `<link rel="stylesheet" href="https://use.typekit.net/gut5szx.css">` in `src/layouts/Site.astro`, preceded by preconnects to `use.typekit.net` and `p.typekit.net`. The trailing entries in each token stack (`"Trade Gothic", Impact, sans-serif` / `-apple-system, …`) are **system fallbacks only**, used if the Typekit CSS ever fails to load.
- **Google Fonts was removed 2026-08-05.** Barlow Condensed / Mulish had been loaded as a second provider but sat *second* in both token stacks — behind the Adobe faces — so they never actually rendered while Typekit loaded. They were pure dead weight (extra render-blocking requests for fonts nobody saw).
- ⚠️ **Weight-coverage caveat:** the kit ships Trade Gothic Next Condensed in **only 400 and 700**, but `global.css` requests 500/600 in a number of places. The browser rounds to the nearest real weight, so nothing breaks — but that's why a heading may render lighter/heavier than the declared weight suggests. The kit *also* includes `trade-gothic-next` and `trade-gothic-next-compressed`, which are currently unused if more range is ever needed.
- ⚠️ **Always use the tokens, never a raw family name.** `team.astro` had hardcoded `font-family: 'Barlow Condensed'` in `.team-name` and `.bio-name`, bypassing `--display` — so advisor names silently rendered in the *wrong* (non-brand) font until it was caught during the Google Fonts removal. Both now use `var(--display)`. If you add type styles, reference `var(--display)` / `var(--body)`.
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
- **Nav:** Home · Why FA (dropdown: Breakaway, RIA Owners) · Firms · Team · Insights · Summit · **Growth Assessment**. Astro `ClientRouter` view transitions, `transition:persist` on Header. Collapses to a hamburger overlay at ≤820px (see §8). The **desktop header phone number was removed** — the nav-right now holds only the "Schedule a Call" CTA + hamburger.
- **"Why FA" dropdown:** opens on hover; the caret is a separate clickable button (label itself is not a link). Uses pointer cursor.
- **Primary CTA everywhere:** **"Schedule a Call"** → `settings.calendlyUrl` (`https://calendly.com/boughner`, confirmed correct), opens in a new tab. Driven by site settings (see §7). See §10 for the full CTA inventory.
- **Logo:** static `public/logo.png` via `Logo.astro`.

---

## 4. Automations & build-time processes

All of these run **at build time** (on each Vercel deploy). There is no client-side server.

### a) Sanity content → site
All page content (firms, team, compliance PDFs, homepage AUM, site settings) is fetched from Sanity at build time via `src/lib/sanity.ts`. `useCdn: false` so a publish-triggered rebuild always gets fresh data.
- **Trigger:** a Sanity webhook (configured in sanity.io/manage) pings a Vercel deploy hook on publish → Vercel rebuilds → live in ~1 min. Also any `git push` to `main` rebuilds.
- **Verified working 2026-08-06:** the three assessment card photos were published in Studio with no code push afterwards, and production served them. So publishing alone is sufficient — no manual redeploy needed. (Worth re-checking if content ever appears stale on prod; the alternative explanation would be a coincidental push.)

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
      assessment.astro                ← Growth Assessment page (deferred iframe embed)
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
  sanity.config.ts                    ← desk structure; singletons are listed here by hand
  schemaTypes/                        ← one .js/.ts per content type
  components/                         ← custom Studio input components
    CardPhotoInput.tsx                ← drag-to-frame 4:3 preview for assessment card photos (§9)
    VideoFileInput.tsx                ← inline player + thumbnail-frame picker
    StudioLogo.tsx
  scripts/
    unset-orphan-fields.mjs           ← clears data left behind by removed schema fields
```

The Studio is **deployed** at **https://fiduciaryalliance.sanity.studio/** (`npx sanity deploy` from that repo; `deployment.appId` is pinned in `sanity.cli.ts`, `autoUpdates: false`). A schema change is only live there after a redeploy — committing and pushing is not enough. Local Studio also needs a **dev-server restart** when `sanity.config.ts` changes.

**Sanity content types:** `memberFirm` (name, streetAddress, city, state, zipCode, phone, numberOfOffices, shortDescription, website, logo), `teamMember` (name, title, bio, photo w/ hotspot, orderRank), `compliance` (4 SEC PDFs), `homePage` (heroHeadline, statAum — stat counts no longer used), `summitPage` singleton (showRegisterButton, registerUrl, hotelUrl, heroImage, useCustomVenuePhoto, venueImage, giveBackImage, ctaImage, ctaParallax, showSponsorsSection, sponsors[]), `summitSponsor` object (name, logo, website — used in `summitPage.sponsors[]`), `assessmentPage` singleton (pageTitle, iframeUrl, card1Image/card2Image/card3Image — the card photos use a custom `CardPhotoInput` drag-to-frame component, see §9), plus a planned `siteSettings` singleton.

---

## 6. Open items / known issues

- **NEXT UP: "How a Partnership Works" section needs real content.** Currently a placeholder in `WhyFaShared.astro:230-238` (shared by both `/why-fa/breakaway` and `/why-fa/ria-owners`) — eyebrow "How a partnership works", h2 "FROM FIRST CONVERSATION TO LAUNCH.", and a "Detailed timeline coming soon" body line. Needs to become a real step-by-step walkthrough of onboarding, transition support, and the first 90 days (the homepage already has a simpler 4-step TALK/DILIGENCE/PLAN/LAUNCH section at `index.astro` §2 step 8 that could inform tone/structure, but this section should be more detailed per its own copy).
- **`siteSettings` singleton not yet created in Studio.** The frontend already reads it via `getSiteSettings()` with hardcoded fallbacks (Calendly URL, phone `864·385·7999`, email `admin-fa@fiduciaryalliance.org`, address `135 S Main Street, Suite 600 · Greenville, SC 29601`). Paste-ready schema + setup instructions were written to the session scratchpad (`siteSettings.ts`, `STUDIO-SETUP.md`) — recreate if lost. Until published in Studio, the site uses fallbacks (which currently match reality, so nothing looks broken).
- ~~`assessmentPage` schema not yet created in Studio.~~ **DONE 2026-08-06** — created (`schemaTypes/assessmentPage.ts`), registered in `schemaTypes/index.ts`, and added to the desk as "Growth Assessment Page" in `sanity.config.ts`. Fields: `pageTitle`, `iframeUrl`, `card1Image` / `card2Image` / `card3Image`. All three card photos are now published. ⚠️ `pageTitle` is now settable in Studio — if it's ever filled in, use **"Growth Assessment"** wording, since a stale value there silently overrides the renamed code default.
- **Assessment iframe height is a fixed fallback (940px)** sized to the survey's first step. The iframe is cross-origin, so the parent can't measure it. `/assessment` already listens for `postMessage({type:'assessment:resize', height})` from the embedded app and will auto-fit every step once that app posts its content height — a 5-line `ResizeObserver` snippet was provided for the survey repo. Until then, later steps may not fit the 940px exactly.
- **`firmsPage.heading` field is now dead** in Studio (site derives the heading). Safe to remove from the studio schema; a prompt to do so was provided.
- ~~`statFirms` / `statStates` fields on the homePage doc are unused.~~ **DONE 2026-08-06** — removed from the schema *and* unset on the stored document. Both steps were needed: deleting a schema field leaves the data behind, which makes Studio show **"Unknown field found."** The stored values (22 firms / 10 states) were also stale against the live-derived 23/11. Cleanup script: `scripts/unset-orphan-fields.mjs` in the Studio repo — reusable for the next removed field (`npx sanity exec scripts/unset-orphan-fields.mjs --with-user-token`).
- **DEFERRED BY DECISION — no prospect screening on the booking flow.** Today every "Schedule a Call" CTA drops straight into an open Calendly with **no qualifying questions**, and the Growth Assessment is **not wired to the booking flow** — a visitor can book without ever taking it, and assessment answers don't gate or route anything. So the funnel currently books *anyone* and does not filter for the ideal prospect profile. **Carey reviewed this on 2026-08-05 and decided the assessment + Calendly links are fine as-is for now** — recorded here as a future idea, not a bug. When it's worth revisiting, the two highest-leverage moves are: (1) add 1–3 screening questions to the Calendly booking form (AUM, RIA owner vs. breakaway, timeline) so unqualified bookings self-select out — this is configured in **Calendly's own UI, not this repo**; and (2) surface a "Schedule a Call" CTA at the **end of the Growth Assessment** so callers arrive pre-qualified and with context. A third option: extend the existing audience split (the `/contact` page already routes RIA-owner partnership inquiries to `partnership@fiduciaryalliance.org`) into the main CTA path.
- **Placeholder pages:** `/how-it-works` (no real content), `/about` (no real content). Testimonial quote on the homepage is a placeholder ("TBD"). `/contact` is **no longer** a placeholder — see §2.
- **`/about` is an orphan page.** It builds and returns 200 but **nothing links to it** — it's absent from both the nav and the footer. Either wire it into the nav/footer or retire it; right now it's unreachable except by direct URL.
- **External link inconsistencies in Sanity data** (content fix, not code): one firm website is plain **`http://parallelfinancial.com/`** while the same firm appears elsewhere as `https://www.parallelfinancial.com/`; and two different YouTube URLs are in use (`youtube.com/@FiduciaryAlliance` vs `youtube.com/@fiduciaryalliance?si=…`). Normalize to `https://` and one canonical YouTube URL in Studio.
- **Page-speed baseline never measured on production.** Can't get real Core Web Vitals from the dev server — run **PageSpeed Insights against `https://fa-preview.vercel.app`** for actual numbers. Known contributors already addressed: Google Fonts removed (one provider now), assessment iframe deferred until "Start Now", map library dynamically imported. Remaining known weight: `hero.mp4` (~16MB) and `assessment-hero.mp4` (~16MB) served from `public/`.
- **No sitemap, robots.txt, or Open Graph / social meta tags.** `Site.astro` emits only `<title>` + `<meta name="description">`. Links shared to LinkedIn/social will have no preview card. Worth adding before launch (`@astrojs/sitemap` + og/twitter tags in the layout).
- **Domain not yet connected.** User has the domain but is NOT ready to go live. Pre-launch visibility approach (noindex vs. password vs. leave-as-is) and final host (Vercel vs. Cloudflare) were being discussed but not decided. Do not point DNS or launch without explicit confirmation.
- **Custom domain / launch is intentionally deferred** — there is still content work to do.
- **Media hosting ceiling:** `hero.mp4` is ~16MB in `public/`. Fine for now, but hosting many/large videos in the repo is not ideal long-term — use YouTube (already done for Insights) or a video CDN (Mux / Cloudflare Stream) if more video is added.

---

## 7. Key decisions & preferences (non-obvious)

**Workflow:**
- **AUTO-PUSH after every committed change.** The user wants: edit → commit → `git push` in the same turn, no batching, no asking. Vercel auto-deploys from `main`. (This is saved in Claude memory as `feedback-auto-push`.)
- Commit messages end with `Co-Authored-By: Claude <model> <noreply@anthropic.com>` — use whichever model is running the session (has ranged 4.7 → 4.8 → Opus 5 as the sessions moved forward).
- **"Don't worry about the preview."** The user runs their own dev servers and reviews visually themselves. Do NOT spin up the preview/dev server to verify unless explicitly asked — just make the change, commit, push. *(Exception in practice: for sitewide sweeps like the CTA rename, browser verification caught real bugs — e.g. the hardcoded Barlow font in `team.astro`. Use judgment on wide-reaching changes.)*
- **Ask before guessing on copy/scope calls.** The user explicitly asked to be questioned on anything ambiguous rather than have a find-and-replace applied blindly. Sitewide copy changes have judgment calls in them (headings vs. buttons, body copy vs. labels) — surface those.
- User prefers **exact terminal commands** over conceptual explanations, and **Finder** for file management where Terminal isn't required.

**Content / brand:**
- Never say "PE-free" — say **"No private equity"**. Tagline is **"Your growth, our mission."**
- Positioning language: **"alliance / federation, NOT a rollup / aggregator."**
- **The assessment is the "Growth Assessment"** — never "Health Assessment" (renamed 2026-08-05) and never "Firm Assessment" or "Practice Growth Assessment" (older inconsistent variants, all standardized).
- **Every scheduling CTA reads "Schedule a Call"** (Title Case, matching the site's button convention) — never "See If You're a Fit" (retired 2026-08-05).
- **"Fit" framing was deliberately scrubbed from body copy too**, not just buttons. The user asked for this explicitly after first agreeing to keep it: don't reintroduce "see if you're a fit" / "see if there's a fit" anywhere. Headings were reworded to scheduling language instead of literal replacement (`LET'S TALK.`, `READY TO TALK?`) because "Schedule a Call" reads badly as a headline.
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
- **Adobe Fonts only** — never add a second web font provider (see §3 Fonts). Reference `var(--display)` / `var(--body)`, never a raw family name.
- **Counts are derived, never hardcoded** — firm/state numbers come from published Sanity docs (see §4b). Don't "correct" a count in code; publish/unpublish in Studio.
- **Sitewide copy sweeps:** verify with a repo-wide `grep -rniE` for the old string *and* its variants (curly vs. straight apostrophes — the markup uses `&rsquo;`) before declaring it done. The CTA rename needed `see if you.?re a fit` to catch both forms.
- **Eyebrow size gotcha:** the base `.eyebrow` is `0.875rem` (14px), but `.section-head p` in `global.css` bumps *any* paragraph inside a `.section-head` to `1.125rem` (18px) — so eyebrows in a `.section-head` render at 18px while eyebrows in a custom wrapper stay 14px. On `/summit` all five eyebrows are standardized to **18px**: the hero and Give-back / venue sections use custom wrappers, so each gets a scoped `.<wrapper> .eyebrow { font-size: 1.125rem; }` override to match the `.section-head` ones.

**Design continuity:**
- New sections must use the existing tokens, fonts (Trade Gothic Next Condensed display / Museo Sans body — see §3), and accent colors — no one-off custom palettes. The AI section was explicitly reworked to remove custom cyan/mint colors and gradient text and to match the site.
- Hero fallback photo should only appear if the video fails to load (desktop); mobile shows the photo (video hidden). No photo "flash" before the video starts.

---

## 8. Mobile / tablet (responsive)

The site is a single responsive build — no separate mobile pages. Layout is fluid via the `clamp()` tokens; the notes below cover the breakpoint-specific behavior. **Key breakpoint: `820px`.** At/below it the site switches to its "mobile/tablet" treatment (hamburger nav + AI blurred background); above it is "desktop." A second, smaller breakpoint at `640px` tightens spacing and eases blur/scrim for phones. The two preview presets used while building were **mobile = 375px** and **tablet = 768px** (both ≤820 → mobile/tablet treatment); **1280px** = desktop.

### a) Header → hamburger menu (`Header.astro` + `global.css`)
- **Desktop (>820px): unchanged** — full nav row + "Schedule a Call" CTA.
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

## 9. Growth Assessment page (`/assessment`)

Rebuilt (2026-07-16) from a bare full-width iframe into a proper **landing page** that matches the redesigned site, then reveals the survey on demand. It reuses the site's own component vocabulary (`.hero`, `.eyebrow`, `.btn-primary`, `.section-head`, outcome cards) rather than one-off styles. The old page was just the embed described at the end of this section; the survey embed itself is unchanged, just gated behind a "Start Now" click.

### Page structure (top → bottom)
1. **Hero** (`.hero-assessment`) — eyebrow "Growth Assessment", a full-width headline ("GET A CLEAR SNAPSHOT OF YOUR FIRM'S GROWTH POTENTIAL."), a body paragraph, an "It's not about judgment…" note, and a **Start Now** button — with the preview **video** on the right.
2. **"Why This Assessment Matters"** (`.section-sm`) — restyled from the old page's photo-left/text-right layout into the site's section pattern: eyebrow + h2 + intro, then three **outcome cards** (What's working / What's slowing you down / What's next), then a closing paragraph and a second Start Now button.
3. **`#take-assessment`** — the embedded survey, hidden until Start Now is clicked (see reveal behavior below).

### Naming (standardized 2026-08-05)
The page previously used **three** different names for the same thing: nav/footer said "Health Assessment", the hero eyebrow and browser title said "Firm Assessment", and the lower section + iframe title said "Practice Health/Growth Assessment". All are now **"Growth Assessment"** — nav label, footer link, browser title (`DEFAULTS.pageTitle`), hero eyebrow, `.assessment-shell-head` eyebrow, and the iframe `title` attribute. The **route is still `/assessment`** — the URL did not change, so no redirects were needed and existing links still work.

### Layout / styling specifics (each fixes something the user called out — don't regress)
- **Flat hero background:** `.hero-assessment` overrides the global hero's gradient — `::before` is a flat `--bg` and `::after` (the gradient overlay) is `display:none`, so the hero and the section below read as one continuous surface. `min-height` is dropped to `0` with modest padding (no background image to justify a tall hero).
- **Full-width heading:** the hero is a CSS grid (`.hero-assessment-grid`) using `grid-template-areas` so the eyebrow + heading span **both** columns, with copy on the left and the video on the right. The h1 is scaled **down** from the site's full 6rem (`clamp(2.25rem, 4.5vw, 3.75rem)`) because it's a full sentence, not the short phrase other heroes use.
- **Hero body copy = site body size:** the hero paragraph uses `.lede` markup but is overridden to `1.0625rem` / weight 400 (the site's standard 17px body size), **not** the 20px `.lede` size — as a full paragraph the lede size read too big vs. the home page.
- **Mobile/tablet (≤900px):** the grid collapses to a single left-anchored column, reordered via `order` to **heading → body → video → copy → start now**. ⚠️ **Specificity trap fixed here:** the desktop `grid-area: <name>` rules (two-class selectors) outrank a `> *` reset, so the mobile media query must reset each element's `grid-area: auto` with **matching-specificity selectors** — otherwise the named areas persist against `grid-template-areas: none` and all hero items collapse into one overlapping cell.

### Outcome cards — background photos (added 2026-08-06)
The three cards ("What's working" / "What's slowing you down" / "What's next") can each carry an **optional background photo**, set in Studio on the `assessmentPage` singleton.

- **The copy is NOT editable — it lives in `assessment.astro`.** An earlier pass made title/body Sanity fields; that was rejected as over-built and removed. Studio supplies **only** the photo. Three flat fields (`card1Image` / `card2Image` / `card3Image`), each titled with its card's actual text so editors don't have to cross-reference the page.
- **A blank field is a first-class state.** No photo → the card keeps its plain `--surface` fill, its check badge, and top-aligned text, exactly as before photos existed. Only `.has-photo` cards change.
- **4:3 is a contract between two files.** `CARD_CROP` in `assessment.astro` requests **1200×900** from Sanity, and `.outcome-card.has-photo` is pinned to `aspect-ratio: 4/3`. **These must match.** They previously didn't (fluid card + fixed 900×700 request), which double-cropped the image — Sanity cropped around the hotspot, then CSS `cover` cropped again — so the editor's hotspot didn't land where they put it and framing drifted with window width. With the ratios equal, `cover` has nothing left to trim and the hotspot alone decides framing.
- `.crop('focalpoint')` makes Sanity center the crop on the hotspot instead of applying its default rules.
- **Photo cards drop the check badge and bottom-anchor the copy** (`justify-content: flex-end`), leaving the top of the frame to the image. The scrim ramps 0.30 → 0.88 top-to-bottom so the photo reads while white text stays legible; a `text-shadow` covers busy photos.
- ⚠️ **Do not add `min-height` back to a photo card** — it fights `aspect-ratio` and silently breaks the 4:3 contract above. (This happened once already.)
- **Tightest case:** 900–1000px viewport gives a 253×190 card where three lines of copy nearly fill the frame (~55px of photo visible). Legible, but favor photos whose subject reads at a glance.

### Studio: drag-to-frame preview (`components/CardPhotoInput.tsx` in the Studio repo)
Sanity's stock crop dialog shows the **source** image at its native aspect ratio, plus four hardcoded preview thumbnails (3:4 / Square / 16:9 / Panorama — `DEFAULT_PREVIEWS` in the `sanity` package). None of those is 4:3, so the editor was choosing a crop against shapes the card never uses. Two fixes, both in the Studio repo:

1. **`options.hotspot` as an object, not `true`.** Undocumented but publicly typed (`HotspotOptions` / `HotspotPreview`): `{hotspot: {previews: [{title, aspectRatio}]}}` replaces the stock thumbnails with the real 4:3. Sanity gates the crop tool on `typeof hotspotOptions == "object" || hotspotOptions === true`, so an object still enables it.
2. **A custom input component** rendering the finished card — 4:3, same scrim, same copy in position — that the editor **drags the photo inside**. The drag writes the standard `hotspot` field, so **the website needs no special handling**. Maths mirror CSS `object-fit: cover` + `object-position`, which is what focalpoint crop reproduces on the site.
   - It renders **above** `props.renderDefault(props)`. Order matters: Sanity's stock input renders a full-height thumbnail of the source, which pushes the preview off-screen exactly when you're dragging in it.
   - `CARD_TEXT` in that component duplicates the card copy from `assessment.astro`. **If the card wording ever changes, update both** — the preview silently goes stale otherwise.

### Preview video (`public/assessment-hero.mp4` + `public/assessment-poster.jpg`)
- The real 48s "Practice Growth Assessment" promo (1920×1080, H.264, **with audio**). Presented as **click-to-play**: a branded play-badge overlay (`.video-play` button) sits over the poster; clicking hides the overlay, flips the `<video>` to `controls`, and calls `play()` — so it plays **with sound** (user-gesture-initiated) and hands off to native controls.
- **Poster:** `assessment-poster.jpg` is the video's opening title-card frame, extracted with a small **Swift/AVFoundation** script (no ffmpeg on this machine — `swift` + `AVAssetImageGenerator`, then `sips -Z 1280` to downscale/compress to ~124KB). With a real poster the `<video>` uses **`preload="none"`** — the ~16MB video is not fetched until the user clicks (verified: `networkState` idle / `readyState` 0 on load).
- **To replace the video later:** drop the new file at `public/assessment-hero.mp4`; regenerate the poster from its first frame (the scratchpad `poster.swift` does this: `swift poster.swift <in.mp4> <out.jpg>`) → `sips -Z 1280 -s formatOptions 80`.

### "Start Now" reveal (deferred iframe)
- Both Start Now buttons carry `.js-start-assessment`. Clicking: `preventDefault()`, sets the iframe's `src` from its `data-src`, adds `.is-visible` to `#take-assessment` (CSS `display:none` → `block`), and `scrollIntoView({behavior:'smooth'})`.
- **The survey is genuinely absent until clicked** — the iframe ships with `data-src` (not `src`), so no request to the survey app fires on page load (verified in the network panel). This was an explicit requirement.
- The embedded survey keeps `scrolling="no"` + a fallback height (`940px`, sized to step 1) and the same `postMessage({type:'assessment:resize', height})` auto-resize listener as before (origin-checked; also accepts `{type:'resize'}` / bare `{height}` / `"height:N"`). See §6 for the outstanding auto-resize follow-up on the survey app.
- **Note:** the old `bodyClass="assessment-page"` header-scroll-away behavior was **removed** — the page now has real content above the survey, so it uses the normal fixed header like every other page. (The `body.assessment-page .site-header` rule in `global.css` is now unused by this page.)

---

## 10. CTA architecture & conversion path

### Every CTA on the site
All primary CTAs read **"Schedule a Call"** and point at `settings.calendlyUrl` (`https://calendly.com/boughner` — confirmed correct 2026-08-05), `target="_blank" rel="noopener"`. Because they all read the same site-settings value, **changing the booking URL is a one-place edit** (the `siteSettings` singleton, or its fallback in `src/lib/sanity.ts` until that doc exists).

| Location | File | Notes |
|---|---|---|
| Header nav-right (desktop) | `Header.astro:62` | `.nav-cta` |
| Mobile menu footer | `Header.astro:94` | full-width in the hamburger overlay |
| Footer link | `Footer.astro:35` | text link, not a button |
| Homepage hero | `index.astro:75` | primary; secondary → `/how-it-works` |
| Homepage closing CTA strip | `index.astro:198` | |
| Why-FA shared closing CTA | `WhyFaShared.astro:300` | under heading "READY TO TALK?" |
| Breakaway hero | `why-fa/breakaway.astro:24` | |
| RIA Owners hero | `why-fa/ria-owners.astro:24` | |
| Contact page | `contact.astro` | primary next step under "LET'S TALK." |

The `/assessment` page is the one exception — its buttons are **"Start Now"** (`.js-start-assessment`), which reveal the in-page survey rather than linking out. See §9.

### Current conversion path
```
Any page  ──"Schedule a Call"──►  Calendly (open booking, no screening)
/assessment  ──"Start Now"──►  embedded survey  ──►  (dead end — no CTA at completion)
```
The two paths **do not connect**. See §6 for the deferred idea to link them and add screening — reviewed and intentionally left as-is on 2026-08-05.

### Analytics
Confirmed 2026-08-05: **no click tracking is tied to these buttons**, so the "See If You're a Fit" → "Schedule a Call" label change has no analytics impact and needed no tag updates. If GA4/Vercel Analytics/pixels are added later and track by label text, note that this rename is a historical break point.

### Site audit findings (2026-08-05)
A full pass over routes, links, and responsive behavior:
- **Routes:** all 12 build and return 200 — `/`, `/about`, `/assessment`, `/contact`, `/disclosures`, `/firms`, `/how-it-works`, `/insights`, `/summit`, `/team`, `/why-fa/breakaway`, `/why-fa/ria-owners`.
- **Broken links: none.** Every internal link resolves. (Findings that *did* surface — the orphaned `/about`, the `http://` firm link, the duplicate YouTube URLs — are logged in §6.)
- **Responsive:** verified at 375px (mobile), 768px (tablet), and desktop. Nav, hamburger overlay + its full-width CTA, contact page, and team grid all render correctly. One open question: at 768px the homepage hero photo covers only the left ~75% with a flat dark band on the right — may be intentional, worth a look.
- **Fonts:** verified only Typekit requests fire; zero `googleapis`/`gstatic`. Both brand faces confirmed active in `document.fonts` (`trade-gothic-next-condensed` 400/700, `museo-sans` 300/500).

---

## Dev / deploy quick reference

```bash
# Studio (separate terminal, separate repo) — localhost:3333
cd ~/studio-fa-web-redesign && npm run dev

# Astro site — localhost:4321
cd ~/fa-website && npm run dev
```
Push to `main` → Vercel auto-deploys → https://fa-preview.vercel.app (~1 min). Sanity project `mg8jdbar`, dataset `production`. Never `sudo npm`.
