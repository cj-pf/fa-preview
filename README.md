# Fiduciary Alliance — Web

The marketing website for Fiduciary Alliance, built with [Astro](https://astro.build) and deployed to **GitHub Pages** so the team can share a single URL.

## How the workflow works

```
   Edit code here (Claude Code)        →  Push to GitHub  →  GitHub Actions builds  →  Pages serves a public URL
   ~/Documents/Claude/Projects/             github.com/         (~1 min)              https://<you>.github.io/fa-web
   Web Design/fa-web                        <you>/fa-web
```

Every time you push a change to the `main` branch, GitHub rebuilds the site and updates the live URL. The team always sees the latest version.

## First-time setup

### 1. Create the GitHub repo

- Go to **[github.com/new](https://github.com/new)**
- Repository name: **`fa-web`** suggested (any name works — the deploy workflow auto-detects the repo name for internal links)
- Choose **Private** (recommended while in progress — only people you invite can see the code, but the deployed site can still be public)
- **Do not** check "Add a README" / .gitignore / license — this folder already has those
- Click **Create repository**

### 2. Upload the project files

On the empty repo page, find the small grey link **"uploading an existing file"** and click it.

Then in **Finder**:

1. Open `~/Documents/Claude/Projects/Web Design/fa-web`
2. Press **⌘ + Shift + .** (period) to reveal hidden files — you need `.devcontainer/`, `.github/`, and `.gitignore` to come along
3. Press **⌘ + A** to select everything inside (you should see ~24 items)
4. Drag the selected files into the GitHub upload area in your browser
5. Wait until the file list shows everything (including the hidden folders that begin with `.`)
6. Scroll down, leave the commit message as-is or write your own, click **Commit changes**

### 3. Enable GitHub Pages

- In your repo, click **Settings** (top right)
- In the left sidebar, click **Pages**
- Under **Build and deployment → Source**, select **GitHub Actions** (not "Deploy from a branch")
- Save / close

### 4. Watch the first deploy

- Click the **Actions** tab on your repo
- You should see a workflow called **Deploy to GitHub Pages** running
- Click into it to watch progress (~1 minute)
- When it finishes, the live URL appears: `https://<your-username>.github.io/fa-web/`

That URL is what you share with Brian, Shelby, and Caroline.

## Updating the site

Once it's live, the iteration loop is:

1. We edit files together here in Claude Code
2. You push the changes to GitHub (easiest way: install **[GitHub Desktop](https://desktop.github.com)** — free GUI, click-to-commit, click-to-push)
3. GitHub Actions rebuilds within ~1 minute
4. Team refreshes the URL and sees the new version

(If you don't want to install GitHub Desktop, you can keep using the web UI: edit individual files in the GitHub web editor, or re-upload changed files via "Add file → Upload files". Slower, but no install.)

## What's in here

```
fa-web/
├── .devcontainer/      ← Codespaces setup (optional; ignore for now)
├── .github/workflows/  ← auto-deploy to Pages on every push
├── src/
│   ├── pages/          ← one file per URL
│   ├── components/     ← Header, Footer, Logo (used on every page)
│   ├── layouts/        ← Site.astro — the page shell
│   ├── styles/
│   │   ├── tokens.css  ← brand colors, fonts, spacing (retheme here)
│   │   └── global.css  ← shared component CSS
│   └── utils/url.ts    ← helper so links work under /fa-web/ prefix
├── astro.config.mjs
└── package.json
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
- **Page content** → the data arrays at the top of each `.astro` file in `src/pages/` are the easiest things to edit

## Known caveats

- **Hero images** pull from Unsplash CDN URLs (placeholders). Replace with real FA brand photography before launch.
- **Logo SVG** is the approximation from v3, not the real brand asset. Swap when you have the file.
- **Stats** still show `$—B (tbd)` for client assets — needs real number from Brian.
- **Qualifier form** isn't built yet — `/contact` is a placeholder with phone/email.
- **Rename caveat** — if you rename the repo after the first deploy, the live URL changes (it always matches the repo name).

## Custom domain later

Once you're ready to point `fiduciaryalliance.org` at this site, GitHub Pages supports custom domains under **Settings → Pages → Custom domain**. At that point the `/fa-web/` prefix goes away and the site is served at the root.

## Eventually: Sanity (the CMS)

Today, content is hardcoded in the page files — fast to iterate, but only Claude (or you in this repo) can edit it. Once design is locked, we'll wire in [Sanity](https://www.sanity.io) so non-designers (Brian, Shelby, Caroline) can edit copy and add firms / team members / blog posts through a clean editor UI. Free for our usage. The data shapes in the page files already match the schemas the Content System doc calls for, so the migration is mostly mechanical.
