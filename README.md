# Fiduciary Alliance — Web

Marketing site for Fiduciary Alliance. Built with [Astro](https://astro.build), source on **GitHub** (`cj-pf/fa-preview`), hosted on **Vercel**.

## How the workflow works

```
   Edit code here (Claude Code)  →  Push to GitHub  →  Vercel auto-deploys  →  Team visits the live URL
                                                       (~30 seconds)
```

Vercel watches the GitHub repo. Every push to `main` triggers a fresh deploy. The team always sees the latest version at the same URL.

## First-time setup

### 1. Get the code to GitHub

The project is already initialized as a git repo with one commit, pointing at `https://github.com/cj-pf/fa-preview.git`. You need to push that commit — three ways, pick whichever:

**Option A — Web upload (no install, slowest for ongoing use)**
On the empty GitHub repo page, click "uploading an existing file" → in Finder press ⌘⇧. to reveal hidden files → ⌘A to select all → drag into GitHub → Commit.

**Option B — GitHub Desktop (GUI, recommended for non-devs)**
Download [desktop.github.com](https://desktop.github.com), sign in, **File → Add Local Repository** → select this folder → click **Push origin**. Once set up, future pushes are one click.

**Option C — Personal Access Token in Terminal.app (no GUI, no chat)**
1. Generate a token at [github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta) — fine-grained, fa-preview repo only, Contents: read+write
2. Open Terminal.app and run:
   ```
   cd "/Users/careyjohnson/Documents/Claude/Projects/Web Design/fa-web"
   git config --global credential.helper osxkeychain
   git push -u origin main
   ```
3. Username: `cj-pf` / Password: paste the token
4. Keychain stores it; future pushes (including from Claude Code) work without prompts

### 2. Import the repo into Vercel

You said Vercel is already connected to your GitHub account, so:

1. Go to [vercel.com/new](https://vercel.com/new)
2. Find `cj-pf/fa-preview` in the list and click **Import**
3. Vercel detects Astro automatically — leave the build settings alone
4. Click **Deploy**
5. ~30 seconds later, your live URL appears: something like `fa-preview-<random>.vercel.app` or `fa-preview.vercel.app`

That URL is what you share with the team.

### 3. Future updates

Every push to GitHub triggers a new Vercel deploy automatically. You don't have to touch Vercel again.

## What's in here

```
fa-web/
├── src/
│   ├── pages/          ← one file per URL
│   ├── components/     ← Header, Footer, Logo (used on every page)
│   ├── layouts/        ← Site.astro — the page shell
│   ├── styles/
│   │   ├── tokens.css  ← brand colors, fonts, spacing (retheme here)
│   │   └── global.css  ← shared component CSS
│   └── utils/url.ts    ← link helper (future-proof for custom domains)
├── .devcontainer/      ← optional Codespaces config (ignore for now)
├── astro.config.mjs    ← Astro config
├── package.json        ← dependencies
└── README.md           ← this file
```

### Pages currently in

| URL | Status | File |
|---|---|---|
| `/` | Ported from v3 | `src/pages/index.astro` |
| `/why` | Ported from v3 | `src/pages/why.astro` |
| `/for-iars` | Ported from v3 | `src/pages/for-iars.astro` |
| `/for-ria-owners` | Ported from v3 | `src/pages/for-ria-owners.astro` |
| `/contact` | Placeholder (qualifier form pending) | `src/pages/contact.astro` |
| `/firms` | Placeholder | `src/pages/firms.astro` |
| `/team` | Placeholder | `src/pages/team.astro` |
| `/how-it-works` | Placeholder | `src/pages/how-it-works.astro` |
| `/about` | Placeholder | `src/pages/about.astro` |
| `/disclosures` | Placeholder | `src/pages/disclosures.astro` |
| `/insights` | Placeholder | `src/pages/insights.astro` |

### Where the design lives

- **Brand tokens** (colors, fonts, spacing) → [`src/styles/tokens.css`](src/styles/tokens.css)
- **Component styles** → [`src/styles/global.css`](src/styles/global.css)
- **Page content** → the data arrays at the top of each `.astro` file are the easiest things to edit

## Known caveats

- **Hero images** are Unsplash CDN URLs (placeholders). Replace with real FA brand photography before launch.
- **Logo SVG** is the approximation from v3, not the real brand asset.
- **Stats** show `$—B (tbd)` — needs the real number from Brian.
- **Qualifier form** isn't built yet — `/contact` is a placeholder.

## Custom domain later

When ready to point `fiduciaryalliance.org` at this site:
- In Vercel: project **Settings → Domains → Add** `fiduciaryalliance.org`
- Vercel walks you through the DNS records to add at your domain registrar
- HTTPS is automatic via Let's Encrypt

## Eventually: Sanity (the CMS)

Today, content is hardcoded in the page files — fast to iterate, but only Claude (or you in this repo) can edit it. Once design is locked, we'll wire in [Sanity](https://www.sanity.io) so Brian, Shelby, and Caroline can edit copy and add firms / team members / blog posts through a clean editor UI. Free for our usage. The data shapes in the page files already match the schemas the Content System doc calls for, so the migration is mostly mechanical.
