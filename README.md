# Eki Hautea — Portfolio

Portfolio site for Eki Hautea, editor, photographer and videographer.
Built with Next.js 16 (App Router), TypeScript and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint
```

Secrets live in a git-ignored `.env`; copy `.env.example` and fill it in. The site runs
without any of them — see [Contact form](#contact-form).

## Where things live

Two ideas cover almost everything:

- **Words** are in `src/content/`, as TypeScript files.
- **Media** is in `public/`, discovered by folder. Nothing to register in code.

```
src/
  app/
    layout.tsx              root layout: header, footer, metadata, fonts
    page.tsx                home (hero, carousel, featured work, services, CTA)
    not-found.tsx           404
    globals.css             Tailwind entry, theme tokens, marquee animation
    icon.png                browser tab icon (circular crop of the portrait)
    apple-icon.png          iOS home screen icon (square, opaque on purpose)
    about/page.tsx
    work/page.tsx           project archive
    work/[slug]/page.tsx    project detail (static, one page per project)
    contact/page.tsx
    api/contact/route.ts    contact form handler
  components/
    layout/                 Header (with avatar), Footer
    media/                  MediaFrame + MediaGallery, ShowcaseVideo
    sections/               Hero, Marquee, FeaturedWork, Services, CTA
    ui/                     Container, Button, Badge, SectionHeading, ProjectCard
    ContactForm.tsx         the only client component on the site
  content/
    site.ts                 name, role, tagline, email, photo, nav, socials
    projects.ts             every project's words; each becomes /work/<slug>
    services.ts             the three blocks on the home page
  lib/
    media.ts                folder scanning: dimensions, ordering, naming rules
    carousel.ts             reads public/carousel
    projects-media.ts       reads public/projects/<slug>
    env.ts resend.ts ratelimit.ts utils.ts
  types/index.ts            the shape of everything above
public/
  profile_pic.jpg           the portrait, used in the header and on About
  carousel/                 home page strip — drop files here
  projects/<slug>/          that project's images and videos
```

## Editing the words

`src/content/site.ts` holds the identity: name, role, tagline, email, socials, and the
path to the portrait. The role string feeds both the browser tab title and the small line
above the home page headline.

`src/content/projects.ts` is a list. Each entry becomes a page at `/work/<slug>` with no
routing to set up. `featured: true` also places it on the home page; `false` means it only
appears in the archive at `/work`.

`src/content/services.ts` is the three-column block on the home page.

## Adding media

No code involved. Each folder has a `HOW-TO-ADD-MEDIA.txt` next to the files repeating
these rules.

**A project's media** goes in `public/projects/<slug>/`, where `<slug>` matches the project's
slug in `projects.ts` exactly. Everything in the folder appears on that project's page in
filename order. Videos there have normal play controls and do not autoplay, so a page of
them stays quiet until someone presses play.

**The home page carousel** is whatever sits in `public/carousel/`. It scrolls right to
left, pauses on hover, and stops entirely for anyone who has asked for reduced motion.
Videos there play a looping five-second window, muted.

Supported: `.jpg .jpeg .png .webp .avif .gif` and `.mp4 .mov .webm .m4v`.

Optional filename conventions, handled by `src/lib/media.ts`:

| Want | Name it |
| --- | --- |
| A particular order | `01-`, `02-` prefixes |
| A caption | `wide-establishing-shot.jpg` reads as "Wide establishing shot" |
| A specific card image | `cover.jpg` — it leads, and gets no caption |
| A video's poster frame | `process.jpg` beside `process.mp4` — it is not shown twice |
| A clip to start at 0:12 | `reel@12s.mp4` |

Tile shapes come from each file's real pixel dimensions, read at build time, so portrait
and landscape mix without either being cropped to fit.

Two consequences of scanning at build time: a new file appears immediately under
`npm run dev`, but the live site needs a rebuild to see it; and **a project with no folder
shows empty grey blocks** — if a slug has no matching folder, create one.

Keep videos small. A raw camera export of 50+ Mbps will stall on anything but fast wifi.
Around 720p and a few MB is the target:

```bash
ffmpeg -i input.mp4 -ss 2 -t 5 -vf scale=-2:720 \
  -c:v libx264 -crf 24 -preset slow -an -movflags +faststart output.mp4
```

## Contact form

`src/app/api/contact/route.ts` validates the submission, silently drops honeypot hits,
rate limits by IP through Upstash, then sends the message with Resend. The visitor's
address is set as the reply-to, so replying from your inbox reaches them directly.

Copy `.env.example` to `.env` and fill in:

| Variable | Where it comes from |
| --- | --- |
| `RESEND_API_KEY` | resend.com → API Keys |
| `CONTACT_FROM_EMAIL` | An address on a domain verified in Resend. `onboarding@resend.dev` works for testing, but only delivers to the address that owns the Resend account. |
| `CONTACT_TO_EMAIL` | Where enquiries land. |
| `UPSTASH_REDIS_REST_URL` | console.upstash.com → your Redis database → REST API |
| `UPSTASH_REDIS_REST_TOKEN` | Same page as the URL above. |

Both integrations degrade gracefully. With no Resend keys the submission is logged to the
server console instead of emailed; with no Upstash keys rate limiting is skipped. The form
keeps working either way, so local development needs no secrets — but a misconfigured
deploy also fails quietly, so check the logs after the first real submission.

Rate limit is 5 submissions per IP per hour, set in `src/lib/ratelimit.ts`. Env vars are
read at startup, so restart the dev server after editing `.env`.

## Before going live

- [ ] Set `url` in `src/content/site.ts` to the real domain — Open Graph links are built from it.
- [ ] Replace the placeholder projects in `src/content/projects.ts`, and create a
      `public/projects/<slug>/` folder for each.
- [ ] Replace the bio, Clients and Recognition placeholders in `src/app/about/page.tsx`.
- [ ] Confirm `location` in `site.ts`.
- [ ] Add the five environment variables to the hosting provider.
- [ ] Verify a sending domain in Resend so mail is not limited to the account owner.
- [ ] Compress anything large in `public/carousel/` and `public/projects/`.
- [ ] Consider an Open Graph image (`src/app/opengraph-image.png`, 1200×630) so shared
      links show a picture.
