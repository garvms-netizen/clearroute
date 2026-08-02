# ClearRoute

Marketing website for **ClearRoute**, a cross-border payment platform.

> **ClearRoute is fictional.** It was created for an academic marketing project.
> It is not a real financial services provider, is not licensed or regulated,
> and does not process real transactions. Every testimonial on the site is a
> written persona and is labelled as illustrative.

The site forks by audience at the front door. Every visitor chooses
**institution** or **individual** before anything else, and that choice changes
the visual identity, copy register, navigation, testimonials, pricing framing
and demo video — not just a colour theme.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Fonts | `next/font/google` — Inter (display, body), IBM Plex Mono (every figure) |
| Charts | Recharts |
| Icons & illustration | Inline SVG authored in `components/art/` — no icon library, no raster assets |
| Hosting | GitHub Pages, static export. **There is no server.** |
| Forms & analytics | Google Apps Script Web App writing to a private Sheet |

---

## Local development

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

`basePath` is empty in development and `/clearroute` in production, so local
URLs have no repo prefix. Build the production output locally with:

```bash
npm run build
```

The static site lands in `out/`.

---

## Project layout

```
app/                    routes (App Router)
components/             shared UI
components/art/         every illustration, authored as inline SVG
lib/mode.ts             mode resolution from the URL path
lib/track.ts            anonymous event tracking
lib/mockAnalytics.ts    illustrative campaign figures for /insights
scripts/apps-script.gs  the Google Apps Script backend
public/video/           demo videos (optional — see below)
```

### Two things that are deliberately absent

**Videos.** `public/video/clearroute-institutional.mp4` and
`clearroute-personal.mp4` are not in the repo. `/demo` renders a bordered
placeholder with the title and intended runtime when a file is missing, so the
site builds and deploys cleanly either way. Drop the files in to replace the
placeholders — no code change needed.

**A form backend.** See below.

---

## Google Sheets setup

Forms and analytics POST to a Google Apps Script Web App that you deploy from
your own Google account. The full click path is in
[`scripts/README.md`](scripts/README.md).

Short version:

1. Create a Google Sheet, copy its ID out of the URL.
2. **Extensions ▸ Apps Script**, paste [`scripts/apps-script.gs`](scripts/apps-script.gs), set `SHEET_ID`.
3. **Deploy ▸ New deployment ▸ Web app** — Execute as **Me**, Access **Anyone**.
4. Copy the `/exec` URL.
5. Put it in the repo at **Settings ▸ Secrets and variables ▸ Actions ▸ Variables** as `NEXT_PUBLIC_SHEETS_ENDPOINT`.

For local development, put the same value in `.env.local`:

```
NEXT_PUBLIC_SHEETS_ENDPOINT=https://script.google.com/macros/s/.../exec
```

**It must be a Variable, not a Secret.** `NEXT_PUBLIC_*` values are inlined
into the client bundle at build time, so a Secret would be masked in the
Actions log while still shipping in the JavaScript. Masking it would be
theatre. This is a public write endpoint by design, and the limitations are
stated plainly in `scripts/README.md`.

If the variable is unset, forms still render and still show their success
state — they simply have nowhere to write. Nothing breaks.

---

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs
`npm ci && npm run build` and publishes `out/` to Pages.

One-time repo setup: **Settings ▸ Pages ▸ Source = GitHub Actions**.

### Things that break GitHub Pages, and why they're handled here

- **`public/.nojekyll`** — without it, Pages runs Jekyll, which strips any
  directory beginning with an underscore. That deletes `_next/`, so every
  script and stylesheet 404s and the deployed site renders blank. This is the
  single most common cause of a blank Next.js deployment.
- **`basePath` / `assetPrefix`** — Pages serves from
  `https://<user>.github.io/clearroute/`, not from a domain root.
- **`trailingSlash: true`** — makes each route export as `route/index.html`, so
  nested paths resolve instead of 404ing.
- **All internal links use `next/link`**, never a bare `<a href="/…">`, so
  `basePath` is applied automatically. Assets outside the Next pipeline
  (`<video src>`, poster frames) prefix `process.env.NEXT_PUBLIC_BASE_PATH`
  explicitly.
- **`app/not-found.tsx`** exports to `out/404.html`, which Pages serves for any
  unmatched path.

---

## Live rate data

`/{mode}/how-it-works` fetches from `https://api.frankfurter.app/latest` — free,
no API key, CORS-enabled, ECB-sourced.

ECB reference rates update **once per working day**. The figure is labelled
*"Indicative rate · ECB reference"* with the date the API reports, and there is
deliberately no animated ticker implying live market movement. On a product
whose pitch is rate honesty, a simulated real-time feed would be the one lie
that undoes the pitch.

If the request fails, the page falls back to static sample figures and says so.
No endless spinner, no blank figure.

---

## Accessibility & quality floor

Responsive to 360px · visible keyboard focus · `prefers-reduced-motion`
respected · semantic landmarks · alt text on every graphic · WCAG AA contrast in
both modes · Lighthouse ≥95 on Performance, Accessibility, Best Practices, SEO.

`/styleguide` renders every component in both modes side by side. It is
excluded from navigation and from `robots.txt`, and is the regression check for
the rest of the build.
