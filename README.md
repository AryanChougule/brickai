# BrickAI

Company website implementing the **BrickAI** Claude Design project — a dark
remix of the Modernist design system.

The design source of truth is the handoff spec (`Developer Handoff.dc.html`) in
the Claude Design project. Its rules — 2px section rules, `border-radius: 0`
everywhere, flush-left type, Archivo 400/600/800, hover states that tint but
never scale or lift — are encoded in `styles/theme.css` and enforced by the UI
primitives rather than repeated per component.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · React Three Fiber ·
Three.js · Drei · GSAP (ScrollTrigger) · Framer Motion · Lenis · React Icons

**Live:** https://brickai-rouge.vercel.app · **Admin:** /admin

## Getting started

```bash
npm run dev
```

```bash
npm run build
```

## Deployment

Deployed on Vercel from this repository. Required environment variables are
documented in `.env.example`; generate the admin pair with
`npm run admin:password -- "your-password"`.

### ⚠ One thing is not yet live: enquiry delivery

Vercel's filesystem is read-only, so the append-only enquiry log and the admin's
content overrides **cannot be written in production**. This deployment is
configured webhook-only, which means:

| Feature | Production status |
| --- | --- |
| Every public page, media, video, OG images | Fully working |
| Admin login and session | Fully working |
| Admin viewing (inventory, testimonials) | Fully working |
| Admin **saving** edits | Read-only — edits do not persist |
| Contact form | **Needs `ENQUIRY_WEBHOOK_URL`** |

Until a webhook is set the contact form tells visitors it cannot deliver, rather
than accepting a message that would reach nobody. Set it with:

```bash
vercel env add ENQUIRY_WEBHOOK_URL production
```

To restore the durable inbox and persistent admin edits, add a database and
reimplement `lib/cms/enquiries.ts` and `lib/cms/overrides.ts` — they are the
only two modules that touch storage.

## Architecture

```
app/            Routes. Server components; they never import content directly.
components/     UI, grouped by role — ui/ primitives, sections/, and feature folders.
three/          WebGL: scene, procedural objects, config, GLB slot registry.
animations/     Motion system — GSAP setup, Lenis provider, Reveal, load gate.
hooks/          Reusable client behaviour (canvas loop, pointer, media queries).
lib/            Content layer, CMS adapter, types, metadata, server actions.
styles/         Design tokens, base layer, structural utilities.
public/         Static assets, including the GLB drop point.
```

### Content is a layer, not a scatter

Routes call `lib/cms`, never `lib/content` directly. The accessors are all
`async` today even though they read local modules, so swapping in a real CMS
means reimplementing that one module and nothing else — no caller changes.

### The design tokens are the system

`styles/theme.css` is the only place colours, type ramps and rhythm are defined.
Everything else consumes them through Tailwind utilities (`bg-ground`,
`text-h2`, `rule-b`, `grid-hairline`, `px-page`). If a value needs changing, it
changes there once.

### WebGL

The hero scene is entirely procedural: an instanced node field (two draw calls,
no per-frame allocation), a shader grid plane, and edge-drawn stand-ins at the
reserved GLB slots. See [`public/models/README.md`](public/models/README.md) for
how to drop in real assets.

Performance is managed in three places:

- `useCanvas2D` pauses any 2D canvas loop when it scrolls out of view
- `HeroCanvas` parks the WebGL render loop off-screen and steps DPR down under
  sustained load via drei's `PerformanceMonitor`
- three/R3F/drei load in a client-only chunk, so they are absent from the
  initial payload

### Motion, and what happens when it fails

Every animated surface degrades deliberately:

- `prefers-reduced-motion` renders one static frame and starts no loop at all —
  canvases, the WebGL scene, Lenis and scroll timelines all read the same hook
- The hero entrance is a **CSS** animation with `fill-mode: both`, so the most
  important text on the site never depends on a JavaScript animation frame to
  become visible
- Scroll reveals carry `data-reveal`; a `<noscript>` rule in the root layout
  forces their final state, so a JS-disabled visitor does not get a page of
  invisible sections
- The preloader unmounts on a **state change driven by a timer**, never on an
  animation completing — `requestAnimationFrame` does not run in a hidden tab,
  and a full-screen overlay must not be able to trap a visitor

### Accessibility

Skip link, `:focus-visible` rings at 2px accent, 44px minimum hit targets, a
real accordion pattern on the catalogue, a roving-tabindex tablist on the
industry selector, and a keyboard-operable index mirroring the (decorative,
`aria-hidden`) knowledge-graph canvas.

## Media

```bash
npm run media
```

`lib/media/manifest.ts` declares every third-party asset with its source and
licence; the script downloads them into `public/media` at ~3200px and writes
`public/media/credits.json` with measured dimensions and provenance. Assets are
**vendored, not hotlinked**, so the site has no runtime dependency on a
third-party CDN. Re-runs skip existing files; `npm run media -- --force`
re-fetches.

All bundled photography and video is [Pexels](https://www.pexels.com/license/):
commercial use permitted, modification permitted, attribution not required, no
watermark.

### Why some slots are still placeholders

Media slots come in two kinds, and the admin labels them:

- **photo** — physical context (a line, a warehouse, a site). Licensed stock
  fills these legitimately. All 18 are populated.
- **product UI** — our own consoles and dashboards. No stock image can fill one
  without the page presenting someone else's software as ours, so these stay on
  labelled placeholders until a real capture exists. 49 slots are waiting.

## Contact enquiries

Submissions are **stored before anything else is attempted**, so a lead is never
lost because a notification channel was down.

- `content/enquiries.jsonl` — append-only, one JSON object per line. Appending
  cannot race, so two simultaneous submissions can't overwrite each other.
- `content/enquiry-status.json` — read/archived flags, written atomically and
  kept separate so triage never rewrites the log being appended to.
- Both are **gitignored**: they contain names, email addresses and free text.
  Set a retention policy before this handles real traffic.

Read them at `/admin#enquiries` — filter by new/read/archived, reply via a
one-click `mailto`, mark read or archive. Enquiries can never be deleted from
the UI.

**To get notified without opening the admin**, set one environment variable:

```bash
ENQUIRY_WEBHOOK_URL="https://hooks.slack.com/services/T000/B000/xxxx"
```

Any endpoint accepting JSON works — Slack, Teams, Discord, Zapier, or your own.
The payload has a `text` summary (what chat apps render) plus the full `enquiry`
object. Delivery is fire-and-forget and never blocks the visitor's confirmation;
if it fails, the enquiry is still in the inbox.

For email instead, replace the `fetch` in `notifyOwner()`
(`lib/cms/enquiries.ts`) with your provider's call — it is one function.

## Admin

`/admin` manages enquiries, every media slot and testimonials in one place. It writes
`content/overrides.json`, which the CMS adapter merges over the defaults in
`lib/content` — source files are never modified, so any override can be reset.

The slot inventory is **derived** by walking the content layer, so adding a
screenshot to a capability adds a row automatically and nothing can be
forgotten.

**Access.** Enabled in development, and elsewhere only when `ADMIN_ENABLED=true`.
That is a deployment switch, not authentication — put real auth in front of it
before exposing it to the internet. It also needs a writable filesystem; on a
read-only serverless target it degrades to read-only, which is the point to swap
`lib/cms/overrides.ts` for a database.

## Placeholder content

Deliberately unfinished, and marked as such in the source:

| What               | Where                                                     |
| ------------------ | --------------------------------------------------------- |
| Testimonial quotes | `lib/content/testimonials.ts` — all carry `sample: true`   |
| Product UI shots   | 49 slots, listed in `/admin`                               |
| Demo videos        | 15 slots, listed in `/admin`                               |
| Contact delivery   | `lib/actions/contact.ts` — marked delivery point           |

### Testimonials are not real quotes

Every entry carries `sample: true`. **Nobody said those words.** They exist so
the section can be designed against realistic length and tone. They render with
a visible "sample" marker on the page, and the admin refuses to clear the flag
unless the quote has a real name, role and company — publishing an unapproved
quote as a genuine endorsement would be a fabricated review.

Set `NEXT_PUBLIC_SITE_URL` before deploying; canonical URLs, OG tags, the
sitemap and robots.txt all derive from it.
