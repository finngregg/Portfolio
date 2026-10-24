# Tandem on the portfolio: positioning and what's new

> Handoff for a Claude Code session in this repo. Written 24 October 2026 from the Tandem repo
> (`/Users/greggfinn/Documents/Tandem`, readable from here: `STATUS.md` and `docs/store-listing.md`).
> It updates `TANDEM_UPDATE.md` (22 October); where they disagree, this file wins. Follow `AGENTS.md`
> first: read `node_modules/next/dist/docs/` before writing code.

The goal: the Tandem page (`app/tandem/page.tsx`) and the components page (`app/components/page.tsx`)
should sell Tandem as it is now, and show Gregg's product design thinking, not a feature list.

---

## 1. The positioning (changed)

**Old:** a training partner app for endurance athletes (long runs, marathons).
**New:** *Find what's on around you, and the people to do it with.* Everything happening near you
(run clubs, padel, rides, studio classes with booking links), not only endurance, and the people to do
it with. Endurance is still where it started and still the sharpest example.

Use the same line as the App Store, so the site and the store say one thing:

- Subtitle: **Sessions and people near you**
- Lead: *Find what's on around you, and the people to do it with. Run clubs, padel games, long rides,
  studio classes and the Sunday long run: Tandem shows what's happening near you and who's going, so
  you never have to train alone.*

Status: **in testing on TestFlight**, launching on the App Store from Tel Aviv, globally (never "a
Cape Town app" or one city). Android follows the launch. Co-founded with **Adam Angel**: credit him
wherever the work is described as a whole.

## 2. What to say, and how

Voice: first person, plain, the same as the home page. Whole sentences, no slogans, no marketing words
(seamless, unlock, effortless). Every number says what it is. "Session" is the general word; name a sport
only when it really is that sport. Terms: **host** (never organiser), **weekly session**, **vouch**.

**Never name other apps.** The current page mentions Strava twice; there is already an uncommitted
edit in `app/tandem/page.tsx` that rewords both lines without it. Review and keep that edit. Say
"the watch or app you already use" instead.

Don't invent figures (users, sessions, growth). There are none to quote yet.

## 3. The story to tell (case-study angles)

Pick three or four; each is a decision with a reason, which is what the page is for.

1. **From partner app to "what's on".** People rarely find someone free at the same time, at the same
   pace, training for the same thing. Showing everything happening nearby (clubs, games, classes) and
   who's going solves the empty-map problem a partner app has on day one.
2. **Trust is the product.** Show-up rate comes from attendance; your Apple Health workout proves you
   were there (check-ins were removed: easy to forget, easy to fake). A session only counts once
   someone's workout shows it happened, so a group can't invent a run. Leaving in the last two hours is
   a "late bail", half a no-show. **Vouches** replaced partner tags, because people noticed which tag
   was left out.
3. **Safety as a feature, not a setting.** Sessions and clubs can be for everyone, women only, men only,
   or women and non-binary people; people outside the group never see them. "Ask to join" sessions show
   the area and a point shifted 150 to 400 m; the exact spot only after approval. Tandem never tracks
   location.
4. **Studios without owning the booking.** A studio links to its own booking and payment site. Tandem
   can't know who got a place, so tapping Book never marks you as going; when you come back it asks
   "Did you get a place?", and only a yes adds you. Attendance still comes from workouts.
5. **It never records workouts.** It reads what your watch saved to Apple Health (Apple Watch, Garmin,
   COROS and others) and puts it with the session. Competing on analysis would be a worse version of
   something people already have.
6. **Numbers that don't change under you.** A wrap ("your 4th session", "3rd run with Ava") is worked
   out as of that session, so reopening an old one shows what it showed on the day.

## 4. What's new since 22 October (for the page and the components)

- **One Share screen.** Card, Sticker and Poster are tabs of one dark screen: close, the format tabs and
  one control across the top, the preview, its choices, then "Instagram story". The story card comes in
  three styles, dark or light (warm paper white, #F7F7F5): **Dots** (your splits as columns of dots, the
  fastest in full ink), **Route** (the line alone in its own box) and **Ledger** (every split on a dotted
  line, a total at the foot). Six stickers lead (Card, Ledger, Splits, Route, Together with name
  bubbles, Number), each ending on three numbers under a rule; the rest sit under More. Mock:
  claude.ai/artifact/6F9bJ3QEjtR6Cn2i2zL64K.
- **Creating a session, step by step:** what, when, where (with a map preview), how far, check. Distance,
  length and pace are wheels with defaults per sport.
- **Find people** ranks everyone within 25 km on goals, sports, pace, habits and mutual partners, each
  with a line saying what you share; **Clubs** are ranked the same way, nearby first.
- **Gender and age** are asked at sign-up and stay private unless you choose to show them.

## 5. Components (already updated, and what to add)

Done in this repo on 24 October (commit `3f78cc8`, not pushed):

- The live dot is **green, #2EB872**, at the normal size in both themes (lime was hard to see on white).
  `--live` in `app/globals.css`; copy updated on both pages.
- **Poster** type is **White or Black** (lime is gone), default White.

Worth adding to `/components`, each live on the page, ported from the app the way the poster was:

1. **Story card, Dots**: the split columns are the interesting part. Data: 10 splits of a 10.1 km run,
   5:18 down to 5:03 per km; 8 rows of dots per column, lit to its pace, the fastest column in full ink.
   A Dark | Light switch. Source: `src/components/wrap/ShareCard.tsx` (`SplitColumns`).
2. **Ledger sticker**: the receipt: label, a row of dots, value; a rule; "Total 10.1 km". Source:
   `ReceiptSticker` in `src/components/wrap/MoreStickers.tsx`.
3. **Share tabs**: the dark frame with underline tabs (Card / Sticker / Poster) and the round controls.
   Source: `src/components/wrap/ShareShell.tsx`.

Keep the site's language: `max-w-2xl`, hairline rows, mono 11px uppercase labels at 0.15em, the
`enter` stagger, dark and light. No UI library.

## 6. Checks before committing

`npx next build` must pass. Look at both pages in dark and light at phone width. Ask Gregg before
pushing: a push may publish the live site.
