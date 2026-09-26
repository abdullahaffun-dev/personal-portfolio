# Abdullah Affun — Curiosity Out Of Bounds

Personal portfolio website of Abdullah Affun — a static, custom-built site focused on curiosity, technology, and continuous exploration.

## Build

The site is generated as a static website.

Build it with:

```bash
npm run build
```

The generated deployable site is written to `dist/`.

## Optional production URL

Set `SITE_URL` when building to generate absolute canonical URLs and sitemap entries:

```bash
SITE_URL=https://your-domain.example npm run build
```

Replace the example with the actual production URL when available.

## Project Structure

* `src/content.js` — content and data model
* `src/base.html` — document shell
* `src/styles.css` — global visual system
* `src/site.js` — interaction layer and native WebGL enhancement
* `src/theme-preload.js` — no-flash theme bootstrap
* `scripts/build.mjs` — static site generator
* `dist/` — generated deployable site

## Deployment

The site is designed to be deployed as a static website.

Cloudflare Pages can be connected directly to this GitHub repository so that new deployments can be triggered from repository changes.

## Deployment Security

`dist/_headers` contains a response-header policy for static hosts that support the `_headers` convention.

HSTS is included and should only be considered effective when the site is actually served over HTTPS.

## Local Preview

From the project folder:

```bash
python -m http.server 8000 --directory dist
```

Then open:

```text
http://localhost:8000
```
