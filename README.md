# HealthyfiKey — Static Site

Production-ready static build: semantic HTML5, Tailwind CSS (official CDN,
zero build step), and vanilla JS. Clone, commit, and deploy as-is — nothing
to compile.

## Structure

```
├── index.html                      Homepage (logo is the <h1>, instant category filter)
├── css/style.css                   Overrides Tailwind can't express (see below)
├── js/main.js                      Mobile menu, category filter, Netlify Forms handling
├── articles/
│   ├── fat-loss-strategies.html
│   ├── mediterranean-diet-guide.html
│   ├── premium-probiotic-review.html   Supplement review template (buy box, pros/cons, ingredients table)
│   ├── morning-superfoods.html
│   └── chronic-stress-gut-health.html
├── legal/
│   ├── about-us.html
│   ├── contact-us.html             Working Netlify Forms contact form
│   ├── privacy-policy.html
│   ├── terms-and-conditions.html
│   ├── affiliate-disclosure.html
│   └── medical-disclaimer.html
├── images/                         Self-hosted SVG illustrations + favicons/OG image
├── 404.html                        Custom not-found page
├── _redirects                      Netlify clean-URL + redirect rules
├── robots.txt
└── sitemap.xml
```

Every inner page follows the H1 rule you specified: the logo is a plain
`<a>` and the page's own headline is the only `<h1>` on the page. Only
`index.html` wraps the logo in `<h1>`.

## Before you go live — 3 things to update

1. **Affiliate link (the one real launch-blocker).** There's no real
   merchant link yet anywhere in the template. Both CTA buttons on
   `articles/premium-probiotic-review.html` ("Check Latest Price" and "Buy
   Now") point to the placeholder `#buy-premium-probiotic`. Search that file
   for `buy-premium-probiotic` and replace both instances with your real
   affiliate URL.

2. **Legal page review.** Privacy Policy, Terms, Affiliate Disclosure, and
   Medical Disclaimer are complete, realistic starting documents — not
   placeholders — but given the CCPA/GDPR/FTC references, it's worth having
   them reviewed by a lawyer before treating them as final. They currently
   point to `hello@`, `editorial@`, `privacy@`, and `legal@healthyfikey.com`
   — set up those inboxes (or swap in addresses you already use).

3. **Placeholder photography.** Every hero/card image is a custom SVG
   illustration rather than a stock photo. This was a deliberate choice —
   the Stitch export's images were temporary AI-preview URLs that would
   have shown as broken images the moment they expired, which would have
   failed your "no broken links" requirement on day one. The SVGs are fully
   on-brand and will never break, but you'll likely want real product/food
   photography eventually — swap files in `images/` (same filenames, any
   aspect ratio works with `object-cover`) whenever you're ready.

## Deploying to Netlify

1. Push this folder to a GitHub repo (root of the repo = root of the site).
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Build command: leave blank. Publish directory: `/` (repo root).
4. Deploy. That's it — `_redirects` and `404.html` are already in place, so
   there's nothing extra to configure in the Netlify UI.
5. **Forms:** the newsletter form (appears on every page) and the contact
   form (`legal/contact-us.html`) already use Netlify Forms
   (`data-netlify="true"` + a hidden `form-name` field + a honeypot).
   Submissions will start appearing under **Site settings → Forms**
   automatically after your first deploy — no extra setup needed. JS
   progressively enhances both forms with an AJAX submit + inline
   success/error message; if JavaScript is ever unavailable, they still
   submit as plain HTML POSTs and Netlify still captures them.

## Notable implementation decisions

- **Instant filter + mobile menu** (`js/main.js`): vanilla JS, no
  dependencies. The filter also syncs the URL hash (e.g.
  `index.html#nutrition`), so a filtered view is shareable/bookmarkable.
- **Tailwind config is inlined in every page's `<head>`**, not split into a
  shared file. That's intentional: it means no page's styling can ever
  break because of one wrong relative path. All 13 pages carry a
  byte-identical config (verified during build) — there's no drift to
  worry about if you edit one, just keep them in sync.
- **SEO:** unique title/meta description per page, canonical URLs, Open
  Graph + Twitter Card tags, and JSON-LD structured data — `Organization`
  + `WebSite` on the homepage, `Article` + `BreadcrumbList` on every
  article, and `Product` + `Review` + `FAQPage` on the probiotic review
  (the last one makes it eligible for star-rating rich snippets in Google
  Search — keep the visible rating and the schema in sync if you change
  either).
- **Accessibility:** skip-to-content link, visible keyboard focus rings,
  `prefers-reduced-motion` support, semantic landmarks throughout, and a
  sticky footer that behaves on short pages.
- **Netlify clean URLs:** `_redirects` rewrites `/articles/some-slug` (no
  `.html`) to the matching file, plus a few memorable short redirects
  (`/privacy`, `/about`, etc.) to the real `/legal/...` paths.

## Local preview

No build step, but browsers block `fetch()` on `file://` pages, so the
newsletter/contact forms need an actual server to test locally:

```bash
python3 -m http.server 8000
# or: npx serve .
```

Then open `http://localhost:8000`.
