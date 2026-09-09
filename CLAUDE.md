# Project: Outfit Creator

## What this is

Outfit Creator helps young women and men who have trouble deciding what to wear
for special occasions — weddings, job interviews, galas, funerals. You build a
digital closet of your own clothes, combine them into outfits, and save each
outfit against the occasion it is meant for.

## Stack

- **Next.js 16** (React + TypeScript) — the web app itself.
- **Tailwind CSS** — styling.
- **Dexie / IndexedDB** — saves your closet *inside your own browser*. No database
  server, no login, no accounts, nothing leaves your device. (Chosen over
  Supabase to keep things simple — revisit only if you need the closet to sync
  between devices.)
- **Vercel** — hosting and the live URL.

## Rules

- Explain changes in plain English. I am not a programmer.
- Prefer the simplest solution that works.
- Ask before adding any new service or library.
- After each feature, remind me to commit.

## Current focus

- Manual outfit builder — **done**.
- Add "want to buy" items by pasting an Amazon / Shein / Temu link — **done**.
  The app reads the product page for a photo, title, and price; outfits show a
  running "need to buy" total with links.
- Next feature: _not chosen yet — update this line each week with the one thing
  we are working on._

## How the code is organized (for future Claude sessions)

Almost everything runs in the browser. Every page file starts with `"use client"`.
The **only** server code is `app/api/preview/route.ts`.

- `lib/types.ts` — what a "clothing item" and an "outfit" are made of, plus the
  fixed lists of categories, formality levels, seasons, occasions, and stores. An
  item with `owned: false` is a "want to buy" item and also carries `price`,
  `sourceUrl`, and `store`. `isOwned()` treats a missing flag as owned.
- `lib/db.ts` — the in-browser database setup (Dexie). Two tables: `items`,
  `outfits`. An outfit stores a list of item ids. Schema is still version 1; the
  buy fields are optional so no migration was needed.
- `lib/store.ts` — the hooks screens use to read and change saved data; they
  live-update automatically after any write. Also holds `deleteItem` (which also
  removes that item from every outfit) and `deleteOutfit`.
- `lib/image.ts` — `resizeImage` shrinks any image Blob before saving;
  `dataUrlToBlob` converts the base64 image the preview API returns.
- `lib/util.ts` — `storeFromUrl` (guess Amazon/Shein/Temu from a link) and
  `formatPrice`.
- `app/api/preview/route.ts` — server-only. Given `?url=`, fetches the product
  page, pulls Open Graph `title` / `image` / `price` with regex (no library),
  downloads the image, and returns it as a base64 data URL. Blocks
  localhost/private addresses. Always returns JSON; the form falls back to manual
  entry when it can't read a page (common for Shein/Temu).
- `components/` — `Nav`, `ItemForm` (own clothes), `AddFromLinkForm` (paste a
  link), `ItemCard` / `ItemThumb`, `OutfitCard`.
- `app/` — four screens: `/` closet (filter: All / My clothes / Want to buy, plus
  both add forms), `/outfits` list, `/outfits/new` builder, `/occasions`
  grouped-by-occasion view.

When adding a field to an item or outfit: edit `lib/types.ts`, then the matching
form, and only bump the version number in `lib/db.ts` if the field needs to be
searchable.

## Commands

```bash
npm install     # one-time setup
npm run dev     # preview locally at http://localhost:3000
npm run build   # check that everything compiles (also the type check)
```

There is no test runner or linter yet; `npm run build` is the current safety net.

## Deploy (get a live URL)

`vercel` uploads the current folder directly — no Git push needed first. The
`/api/preview` route needs a real server, which Vercel provides automatically for
Next.js — no extra config.

```bash
vercel                 # upload; prints a preview URL like https://entp4332-xxxx.vercel.app
                       #   (first run asks a few setup questions and writes .vercel/)
vercel --prod          # publish to the production URL
vercel ls              # list past deployments and their URLs
vercel inspect <url>   # details for one deployment
vercel domains ls      # the project's permanent domains
```

The last line `vercel` prints ("Production:" / "Preview:") is the live link. It is
also copied to your clipboard.

## Environment

Installed via Homebrew, already on `PATH`:

- `git`, `gh` (GitHub CLI, logged in as `OsiK20`), `vercel` (logged in as
  `dal725927-8285`), `node` v26 + `npm`.

Commit identity for this repo: `OsiK20 <dal725927@utdallas.edu>`.
Repo: https://github.com/OsiK20/entp4332 (private). Default branch `main`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
