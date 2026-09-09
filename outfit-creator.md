# Outfit Creator — project notes

A plain-English reference for this project. Reuse it as your starting point when
you come back to this app or want to explain it to someone (or to a new Claude
Code session).

---

## What the app is

Outfit Creator helps young women and men who have trouble deciding what to wear
for special occasions — weddings, job interviews, galas, funerals. You:

1. Build a **closet** of your own clothes (photo, type, how dressy it is, colour,
   season).
2. Add **"want to buy"** items by pasting a link from Amazon, Shein, or Temu —
   the app tries to grab the photo, name, and price for you.
3. Combine items into **outfits**, tag each one with an occasion and a date.
4. See your outfits **grouped by occasion**, with a "need to buy" total and links
   for anything you don't own yet.

Everything is saved **inside your web browser**. No login, no accounts. That
means your closet doesn't follow you between devices, and anyone you share the
link with starts empty. (Changing that is a future feature — see below.)

---

## Where everything lives

| Thing | Where |
|---|---|
| Live website | https://entp4332-pink.vercel.app |
| Code on your laptop | `~/Desktop/entp4332` |
| Code on GitHub | https://github.com/OsiK20/entp4332 (branch `main`) |
| Hosting | Vercel, project `entp4332`, account `dal725927-8285` |
| Auto-deploy | On — every `git push` republishes the live site |

---

## How to work on it

### See it running on your laptop
Open Terminal, then:

```bash
cd ~/Desktop/entp4332
npm run dev
```

Leave that window open and go to `http://localhost:3000`. Closing the window
stops it (that's normal). If `localhost` says "connection refused," the window
isn't running — start it again.

### Push changes to the live site
From the project folder:

```bash
git push
```

That's it now — Vercel rebuilds and the live site updates in about 30 seconds.
(You only need `vercel --prod` if auto-deploy ever gets disconnected.)

### Check the build works before pushing
```bash
npm run build
```

---

## The rules for working with Claude on this project

(Also in `CLAUDE.md`, which Claude Code reads automatically.)

- Explain changes in plain English. I am not a programmer.
- Prefer the simplest solution that works.
- Ask before adding any new service or library.
- After each feature, remind me to commit.

---

## What's built so far

- Closet with owned clothes and a filter (All / My clothes / Want to buy).
- "Add from link" for Amazon / Shein / Temu, with automatic photo + price when
  the shop allows it, and manual entry when it doesn't (common for Shein/Temu).
- Outfit builder (name, occasion, date, notes, pick items).
- Occasions view — outfits grouped by event type.
- "Need to buy" total and links on each outfit.

## Ideas for later

- **Accounts + sync** so your closet follows you between phone and laptop
  (this is the big one — needs a real database, which we skipped on purpose).
- Suggest outfits automatically for an occasion instead of building by hand.
- Share a single outfit with someone as its own link.
- Mark a "want to buy" item as "bought" so it moves into your real closet.
- Packing / checklist view for a trip with several occasions.

Update the "Current focus" line in `CLAUDE.md` each week with the one thing being
worked on.
