# Clear Route

Marketing website for **Clear Route**, a cross-border payment platform.

> **Clear Route is fictional.** It was created for an academic marketing project.
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

## Exchange rate data

**Source:** Yahoo Finance daily closes (`USDINR=X`, `EURINR=X`, `GBPINR=X`),
fetched **at build time** by [`scripts/fetch-rates.mjs`](scripts/fetch-rates.mjs)
into `lib/generated/rates.json`.

### Why build time, not the browser

Yahoo's endpoints send no `Access-Control-Allow-Origin` header, so a browser
request from the deployed site fails — verified against `query1`, `query2`, the
v7 quote endpoint and the spark endpoint, all four blocked. That is a *browser*
restriction, not a server one, so the same request succeeds from Node.

GitHub Actions runs the build on a server, so fetching there needs no CORS
workaround, no API key and no proxy. Three things fall out of that:

- **No runtime network call** — no spinner, no failure state, nothing for
  Lighthouse to dock the page for.
- **Nothing to pay for and nothing to leak** — no key exists.
- **The cadence matches the data.** These are daily closes; the workflow
  re-runs on a daily cron, so nothing fresher is being missed.

`lib/generated/rates.json` is **committed**, not gitignored. If Yahoo is
unreachable at build time the script logs a warning, keeps the last known good
data, and lets the build continue — it never fails a deploy over a rate lookup.

Refresh locally with:

```bash
npm run rates
```

### What the site will not do

Every rate shown is a real published close on a real date, and the date is
always displayed beside it. Nothing is interpolated, no point is invented for
days with no print, and **there is no simulated ticker anywhere in this
project**. The only figure that moves is the elapsed counter on the demo's
in-progress row, which is honest because it measures time spent on the page
rather than market movement.

---

## Cost

**This project costs nothing to build, host or run.** Every dependency and
service is free at the tier used:

| Thing | Cost |
|---|---|
| GitHub Pages hosting | Free for public repositories |
| GitHub Actions (build + daily cron) | Free — minutes are unmetered for public repositories |
| Yahoo Finance chart endpoint | Free, no key, no account |
| Google Apps Script + Sheets | Free within standard quotas |
| Inter + IBM Plex Mono | Open licence, downloaded at build time and **self-hosted** — the deployed site makes no request to Google Fonts |
| next, react, react-dom, recharts, tailwindcss, typescript, eslint | Open source, MIT/Apache |

There is **no AI API of any kind** in this project — no Anthropic/Claude,
OpenAI, Gemini, Veo or other model provider. Nothing in the codebase reads an
API key, and no paid service is called at build time or at runtime.

The deployed site makes exactly **one** category of outbound request, and only
if you choose to configure it: form submissions and anonymous analytics to your
own Apps Script endpoint. Leave `NEXT_PUBLIC_SHEETS_ENDPOINT` unset and the
site makes no external requests at all.

---

## Accessibility & quality floor

Responsive to 360px · visible keyboard focus · `prefers-reduced-motion`
respected · semantic landmarks · alt text on every graphic · WCAG AA contrast in
both modes · Lighthouse ≥95 on Performance, Accessibility, Best Practices, SEO.

`/styleguide` renders every component in both modes side by side. It is
excluded from navigation and from `robots.txt`, and is the regression check for
the rest of the build.
