# Tandem on the portfolio: case study and components

> Handoff for a Claude Code session in this repo. Written 22 October 2026 from the Tandem repo
> (`/Users/greggfinn/Documents/Tandem`), which this session can read. Follow `AGENTS.md` first:
> this Next.js has breaking changes, so read `node_modules/next/dist/docs/` before writing code.
> `PORTFOLIO_BRIEF.md` describes Tandem as it was at build 8; where they disagree, this file wins.

Two pieces of work:

1. **A Tandem case study** at `/work/tandem`, linked from the Tandem row on `/work` (status "In testing").
2. **The components section**, replacing "Interface components · Coming soon": small web versions of
   pieces designed for Tandem, each live on the page.

Keep the site's existing language: `max-w-2xl`, hairline rows, mono 11px uppercase labels with 0.15em
tracking, the `enter` stagger, the `status-dot`, dark and light mode. No UI library. Motion sparingly.

---

## 1. Case study: draft text

Voice: first person, plain, the same as the home page. Credit Adam Angel as co-founder wherever the
work is described as a whole. Around 1,000 words; edit freely.

### Tandem

**A training partner app for endurance athletes.** Co-founded with Adam Angel. I lead product, design
and development. In testing on TestFlight.

#### The problem

Run clubs cap out around 5 or 10 km. People training for a half marathon, a marathon or a long ride end
up doing their longest sessions alone, because finding someone free at the same time, at the same pace
and training for the same thing is a coordination problem that Strava doesn't solve. Tandem plans a
session, finds the right people to do it with, and builds enough trust between strangers that they
will actually meet.

#### What it deliberately isn't

The most important decisions were about what to leave out.

- **It never records workouts.** People already have Apple Watch, Garmin or Strava. Tandem reads what
  their own app recorded, from Apple Health, and puts it beside the session. Competing on analysis
  would be a worse version of something that already exists.
- **It never tracks location live.** The map shows planned sessions only. The one stored location is an
  approximate area on a 5 km grid, used for suggesting people nearby, never shown and never watched.
- **Chat is for logistics.** Each session has a chat, and hosts can make it host-only. It is not trying to
  be a messaging app.

#### Trust is the product

Every feature is weighed against one question: does this help someone trust a stranger enough to meet
them for a three-hour run?

- **Show-up rate.** I started with check-ins at the meeting point and removed them. They were easy to
  forget and easy to fake. Now the workout someone adds from Apple Health proves they were there, and
  the host can confirm the rest. A session only counts towards anyone's stats once at least one
  person's workout shows it happened, so a group can't invent a run.
- **Late bails.** Leaving a partner session in the two hours before it starts counts as half a no-show
  once the session goes ahead, and is undone by rejoining.
- **Vouches instead of tags.** Partners could once tag each other ("Great pacer", "Good company"). People
  noticed which tag had been left out. I replaced them with a single vouch: "I'd train with them again".
- **Faces and names.** A profile photo, first name and surname are required before using the app.

#### Privacy by design

Sessions can start from someone's front door, so the exact meeting point is protected.

- **Ask-to-join sessions** show their area and a point shifted 150 to 400 metres, drawn as a circle. The
  real spot appears only after the host approves you. A weekly session's dates share one shift, which
  only changes when the real point moves, so the shifts can't be averaged back to the spot.
- **Finding friends from contacts** sends only hashes. Each account gets a limited number of lookups
  a day, so the feature can't be used to work out who owns which phone number.
- **Sensitive fields** like gender and age are hidden by default. When shown, people see an age, never a
  birthday.
- **Reports** go to the admins only. Nobody is ever told they were reported.

#### Craft

The details I spent the most time on:

- **Map pins that never change size.** MapKit anchors a marker by its first measured size, so a pin that
  grows when selected jumps. Selection inverts the colours instead. Sessions at the same spot stack into
  one pin, with the edges of the others behind it and a count.
- **The Live Activity.** An hour before a session it starts itself on the Lock Screen, Apple Watch and
  CarPlay, pushed from the server to Apple directly: a countdown, who is going and directions to the
  meeting point.
- **Poster.** After a session, a photo becomes a poster: black and white or colour, the distance in heavy
  type, and the runners cut out of the photo and placed in front of the numbers, all done on the phone.
- **Photos lead.** A finished session opens on its photos, full width under the status bar, with the title
  over them. On Home, the route and photos share one tile, and "+3" says there are more.
- **One visual language.** Greys only, Geist and Geist Mono, hairline rows, and a single colour: a lime
  dot for anything happening now. Loading is always dots, never a spinner.

#### Stack

React Native with Expo, TypeScript, Expo Router, TanStack Query and Zustand. Supabase for Postgres, auth,
storage, scheduled jobs and edge functions, with row-level security on every table and no separate
backend. Native pieces in Swift: the Live Activity, widgets and a Watch layout. Small changes ship as
over-the-air updates; native ones as TestFlight builds.

#### Where it is

In testing with early users on TestFlight, launching from Tel Aviv. Next: Garmin and TrainingPeaks, joining
part of someone's long run, and Android.

---

## 2. Visuals for the case study

All of these are Gregg's own and fine to use.

| What | Where |
|---|---|
| Reels (MP4) and covers | `~/Library/Mobile Documents/com~apple~CloudDocs/Tandem Posts/Instagram week 0N/` (Discover, Together, Live Activity, Calendar, Poster) |
| Instagram slides | same folder, weeks 01, 02 and 04 |
| Beta story (Poster style) | `…/Tandem Posts/Instagram story · beta invite/Beta invite story.png` |
| LinkedIn build log cards | `…/Tandem Posts/LinkedIn build log 02` and `03` |
| App icon and brand marks | `Tandem/assets/` (made by `Tandem/scripts/gen-brand.mts`) |
| Design explorations (HTML) | `Tandem/design/*.html`, e.g. `pins-stacked.html`, `attendance.html`, `depth-story.html` |

Compress video for the web (H.264, about 1 MB a clip). Use posters (`poster=` covers) so nothing pops in.
Never use screenshots that show real testers' names or faces other than Gregg's.

---

## 3. Components

Build each as a small, self-contained React component with a demo on `/components` (or one page per
component if that reads better). Each demo: the component live, a line on why it exists, and the one detail
that makes it work. Respect `prefers-reduced-motion` everywhere. Ease-out curve throughout:
`cubic-bezier(0.23, 1, 0.32, 1)`; press scale 0.97.

Suggested order, smallest first:

1. **Status dot.** The live dot. Source: `Tandem/src/components/ui/StatusDot.tsx`. A solid dot with a ring
   that grows to 3.5x its size and fades from 50% to 0 over 2.4 s, ease-out, repeating. Lime `#D6F53A` for
   live; grey otherwise. (The site already has a `.status-dot`; make this the same component.)
2. **Dot loaders.** Source: `Tandem/src/components/ui/Dots.tsx`. Three dots, each fading 0.25 → 1 over
   320 ms then back over 420 ms, staggered by index. Plus the full-area version. The rule it stands for: no
   spinners anywhere.
3. **The dot logo.** Source: `Tandem/scripts/gen-brand.mts` and the geometry it imports. Draw it in SVG;
   a hover or tap could ripple the dots once.
4. **Segmented switch.** Source: `Tandem/src/components/ui/Segmented.tsx` (the Details / Map switch). A pill
   that slides between options.
5. **Stacked map pin.** Source: `SessionPin`, `DeckPin` and `groupPins` in
   `Tandem/src/components/discover/DiscoverMap.tsx`; design in `Tandem/design/pins-stacked.html`. A demo map
   (static image or simple SVG) with pins: tap one and it inverts without changing size; zoom (a slider)
   and nearby pins merge into a stack, with one edge behind for two sessions and two for more, plus a
   count.
6. **Home photo collage.** Source: `FeedTile` in `Tandem/src/components/home/FeedCard.tsx`. One rounded
   tile (12 px corners): route at two thirds with two photos stacked beside it, "+N" on the last; one
   photo full height; no photos, the route alone; no route, the first photo leads. A demo with toggles for
   the number of photos.
7. **Poster with depth.** Source: `Tandem/src/components/wrap/PhotoStory.tsx`, `app/story/photo.tsx`. The
   heavy type (Archivo Black) behind the cut-out runners, a black and white / colour switch, white or lime
   type. On the web: ship the photo, its cut-out PNG and the colour version as assets; the layering is CSS.
   The Sea Point photo and its cut-outs can be regenerated with Apple's Vision framework (see the Tandem
   session notes) or provided by Gregg.

If time is short, 1, 2, 5 and 7 are the strongest set.

---

## 4. Other updates

- **Home page** (`app/page.tsx`): the Tel Aviv entry and the intro already mention Tandem. Make "Tandem" a
  link to the case study.
- **Work page** (`app/work/page.tsx`): the Tandem row links to `/work/tandem`. Replace "Interface
  components · Coming soon" with a link to the components section once it exists.
- **`PORTFOLIO_BRIEF.md`**: its Tandem section is out of date (QR check-ins, the three-step form,
  gender-only sessions as a headline). Update it to match section 1.
