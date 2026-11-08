import type { CSSProperties, ReactNode } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { DotLogo } from '@/components/tandem/dot-logo'
import { Phones } from '@/components/tandem/phones'
import { StatusDot } from '@/components/tandem/status-dot'

export const metadata: Metadata = {
  title: 'Tandem',
  description:
    'A community app for finding your people, the ones who do what you do and do it like you do, and what’s on around you. Co-founded with Adam Angel. Product, design and development by Gregg Finn.',
}

const step = (i: number) => ({ '--i': i }) as CSSProperties

const APP_STORE = 'https://apps.apple.com/us/app/tandem-train-together/id6771069787'

// The App Store screenshots, the map first
const screens: [string, string][] = [
  ['1-discover', 'Find what’s on around you.'],
  ['2-this-week', 'Plan your week and join your friends.'],
  ['3-people', 'Find people who train like you.'],
  ['4-profile', 'Know who you’re meeting.'],
  ['5-host', 'Host a session in a minute.'],
  ['6-clubs', 'Run your club and watch it grow.'],
  ['7-on-the-day', 'Never forget a session again.'],
  ['8-join-for-part', 'Join for the part that suits you.'],
  ['9-stats', 'See your stats, then vouch for who came.'],
  ['10-share', 'Share it to your story.'],
]

const facts: { label: string; value: ReactNode }[] = [
  { label: 'Role', value: 'Product, design and development' },
  { label: 'Team', value: 'Co-founded with Adam Angel' },
  { label: 'Stack', value: 'React Native, Expo, Supabase, Swift' },
  {
    label: 'Status',
    value: (
      <a
        href={APP_STORE}
        target="_blank"
        rel="noopener noreferrer"
        className="hover-underline inline-flex items-center gap-2.5 text-foreground"
      >
        <StatusDot live />
        Live on the App Store
      </a>
    ),
  },
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border py-12">
      <h2 className="mb-6 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">{title}</h2>
      <div className="space-y-4 text-base leading-relaxed text-muted">{children}</div>
    </section>
  )
}

// A bold lead-in, then the reasoning
function Points({ items }: { items: [lead: string, body: ReactNode][] }) {
  return (
    <ul className="mt-6 space-y-5">
      {items.map(([lead, body]) => (
        <li key={lead}>
          <span className="font-medium text-foreground">{lead}</span> {body}
        </li>
      ))}
    </ul>
  )
}

function Demo({ id, children }: { id: string; children: ReactNode }) {
  return (
    <Link href={`/components#${id}`} className="hover-underline text-foreground">
      {children}
    </Link>
  )
}

export default function TandemPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 sm:px-6">
      <header className="pt-20 pb-12">
        <div className="enter flex justify-center text-foreground">
          <DotLogo size={96} markSize={110} />
        </div>
        <h1 className="enter mt-6 text-2xl font-semibold tracking-tight text-foreground" style={step(2)}>
          Tandem
        </h1>
        <p className="enter mt-3 max-w-md text-base leading-relaxed text-muted" style={step(3)}>
          A community app for finding your people, the ones who do what you do and do it like you do, and what&apos;s on
          around you. Co-founded with Adam Angel. I lead product, design and development.
        </p>
        <a
          href={APP_STORE}
          target="_blank"
          rel="noopener noreferrer"
          className="pressable enter mt-6 inline-flex h-10 items-center rounded-full border border-border px-4 text-sm text-foreground"
          style={step(3)}
        >
          Get it on the App Store
        </a>
        <dl className="enter mt-10 border-t border-border" style={step(4)}>
          {facts.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-[6rem_1fr] items-baseline gap-x-4 border-b border-border py-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{label}</dt>
              <dd className="text-sm text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* The App Store screenshots, swiped sideways */}
      <div className="enter -mx-4 mb-12 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:scroll-px-6 sm:px-6" style={step(5)}>
        {screens.map(([file, caption]) => (
          <Image
            key={file}
            src={`/tandem/screens/${file}.jpg`}
            alt={`Tandem: ${caption}`}
            width={660}
            height={1434}
            className="w-[200px] shrink-0 snap-start rounded-xl border border-border sm:w-[220px]"
          />
        ))}
      </div>

      <div className="enter" style={step(5)}>
        <Section title="Why Tandem">
          <p>
            We live in an incredibly social and, at the same time, very antisocial era. People want to be fit, and
            it&apos;s much easier to be fit with others. But plenty of people are intimidated: they don&apos;t know how to
            start, where to go, who&apos;s a beginner, or who they&apos;d be going with.
          </p>
          <p>
            Even if you go to a run club, you don&apos;t know every run, or who from the club is out during the week. You
            meet a handful of people, not everybody. Put it all on a map in front of you, and you can see what&apos;s on,
            who&apos;s going, and join them.
          </p>
          <p>
            That&apos;s what Tandem is for: real connections, in person. Finding your people, the ones who do what you do
            and do it like you do. Keeping clubs and their members in touch through the week. Giving clubs, Pilates
            studios and everyone else who runs something the exposure to be found.
          </p>
          <p>
            It started with long runs: an app for finding someone to do your longest sessions with. Plenty of people want
            to train for endurance together, and not everyone has a community of a hundred people to do it with. That&apos;s
            still in it, but Tandem has become much more than that.
          </p>
        </Section>

        <Section title="What it does">
          <Points
            items={[
              [
                'Know what’s on.',
                <>
                  Everything happening near you is on one map: club runs, rides, padel games, studio classes, and who&apos;s
                  going to each. Every session says when it starts, how far it goes and whether it&apos;s at your pace, so
                  starting out is less daunting: you can see where you&apos;d fit in before you go.{' '}
                  <Demo id="map-pins">See the pins</Demo>.
                </>,
              ],
              [
                'Find your people.',
                'People near you who do what you do, and do it like you do: the same goals, the same sport, a similar pace. Each comes with one line saying what you have in common, so it’s a person, not a profile, that you’re meeting.',
              ],
              [
                'Keep your club together.',
                'Clubs post their weekly sessions and talk to everyone on the club board. Members see who from the club is out through the week, not only at the big group run, so the people you meet once become people you train with. Each club chooses who sees it: everyone, members only, or nobody outside it.',
              ],
              [
                'Be found.',
                'Anyone who runs something, from a run club to a Pilates studio, can put it where people nearby are already looking. A studio links to its own booking site; when you come back from booking, Tandem asks whether you got a place.',
              ],
              [
                'Make it happen.',
                'Hosting takes a few steps, once or every week, and the sessions you repeat are saved as favourites: choose one and a time, and it’s set up as before, with the same friends invited. Sessions you join go into your calendar, and an hour before the start a Live Activity on the Lock Screen and Apple Watch shows who’s going and how to get there.',
              ],
              [
                'Remember it together.',
                <>
                  Your workouts come in from Apple Health by themselves, or only when you add them, and sit with the session
                  they belong to. Afterwards the session tells the story of how it went: how long you ran together, who picked
                  up the pace, the climb, how hard everyone worked. Add a note to your workout, comment on each other&apos;s,
                  vouch for the people you&apos;d train with again, and share a story card or a poster.
                </>,
              ],
            ]}
          />
          <Phones
            phones={[
              { src: '/tandem/phone/5.jpg', alt: 'Hosting a session: the last step, with the plan to check before it goes out', caption: 'Host a session' },
              { src: '/tandem/phone/7.jpg', alt: 'The Lock Screen an hour before: a countdown, who is going, Running late and Directions', caption: 'On the day' },
            ]}
          />
        </Section>

        <Section title="What it isn't trying to be">
          <p>Some of the most important decisions were about what to leave to others.</p>
          <Points
            items={[
              [
                'A tracker.',
                'People already record their training with a watch or an app they love. Tandem brings those workouts in and puts them with the people you did them with.',
              ],
              [
                'A stage.',
                'Friends see your sessions, your notes and each other’s comments, but it’s all for the people you train with and the next time you meet, not for an audience.',
              ],
              ['Somewhere you’re watched.', 'The map shows planned sessions only. Nobody’s location is ever followed.'],
              ['A chat app.', 'Each session has a chat for meeting up, and that’s all it needs to be.'],
            ]}
          />
        </Section>

        <Section title="Built on trust">
          <p>
            Meeting someone new to train with takes trust, so it&apos;s built into the basics rather than added on later.
          </p>
          <Points
            items={[
              [
                'Proof, not check-ins.',
                'Attendance comes from the workout people add from Apple Health, so show-up rates are real and a group can’t invent a run.',
              ],
              ['One vouch.', '“I’d train with them again” replaced a set of tags, which made people notice the ones left out.'],
              [
                'Late bails count.',
                'Leaving a session in the two hours before it starts counts as half a no-show once it goes ahead, and rejoining undoes it.',
              ],
              [
                'Sessions for one gender.',
                'A session or club can be for women only, men only, or women and non-binary people. Everyone else never sees it.',
              ],
              [
                'Clubs choose their privacy.',
                'A club is open, members only or private. A members-only club’s sessions, members and activity stay with its members, unless a host opens a session to everyone.',
              ],
              [
                'Your workouts, your call.',
                'You choose who sees your numbers and whether workouts come in by themselves. A club can keep everyone’s workouts on its sessions to the person who recorded them, which a beginners’ group asked for.',
              ],
              ['Real faces and names.', 'A profile photo and full name are required. Gender and age are asked for, and stay private unless you choose to show them.'],
              [
                'Protected meeting points.',
                'Sessions can start from someone’s front door. For ask-to-join sessions the map shows an area, and the exact spot appears once the host approves you.',
              ],
            ]}
          />
        </Section>

        <Section title="Craft">
          <p>The details I spent the most time on.</p>
          <Points
            items={[
              [
                'Map pins that never change size.',
                'MapKit anchors a marker by its first measured size, so a pin that grows when selected jumps. Selection inverts the colours instead, and sessions at the same spot stack into one pin with a count.',
              ],
              [
                'One place to share.',
                'Story card, sticker and poster are tabs of one dark screen, so every option is judged on the same ground. Posters cut the people out of the photo on the phone and set the distance behind them.',
              ],
              [
                'Words before charts.',
                <>
                  After a group run the first thing you read is what happened: “You ran together for 7 km. Then Noah picked up
                  the pace for the last 3 km.” Runs, rides, swims and rows compare splits; other sports compare who was there
                  when, and how hard everyone worked. Up to twenty people compare at once: past four, your line stays dark
                  and everyone else’s turns one faint grey, and the table keeps your column while the others page across.
                </>,
              ],
              [
                'Your names for places.',
                'Save the gym down the road under your own name for it, and every session there, yours or a friend’s, shows by that name, to you. Nobody else’s view changes.',
              ],
              [
                'Faces open people.',
                <>
                  A session of 40 or a club of 300 shows two rows of faces and “See all”. Tapping a face anywhere opens that
                  person, and the high five count opens who gave one. <Demo id="high-five">Try the high five</Demo>.
                </>,
              ],
              [
                'One visual language.',
                'Greys only, Geist and Geist Mono, hairline rows, and a single colour: a green dot for anything happening now. Loading is always dots, never a spinner.',
              ],
            ]}
          />
          <Phones
            phones={[
              { src: '/tandem/phone/9.jpg', alt: 'After a run: “You stayed together for the whole 10 km”, everyone’s splits on one chart, then the group’s pace', caption: 'How the group ran' },
              { src: '/tandem/phone/10.jpg', alt: 'Sharing a session: a story card, sticker or poster, in black or white', caption: 'Share it' },
            ]}
          />
        </Section>

        <Section title="Stack">
          <p>
            React Native with Expo, TypeScript, Expo Router, TanStack Query and Zustand. Supabase for Postgres, auth,
            storage, scheduled jobs and edge functions, with row-level security on every table and no separate backend.
            PostHog for usage and Sentry for crashes, both in the EU. iOS-only pieces sit behind one seam each, so Android
            can follow.
            Native pieces in Swift: the Live Activity, widgets and a Watch layout. Small changes ship as over-the-air
            updates; native ones as new App Store builds.
          </p>
        </Section>

        <Link href="/components" className="group mb-24 flex items-center justify-between gap-6 border-y border-border py-6">
          <span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Next</span>
            <span className="hover-underline mt-2 inline-block text-sm font-medium text-foreground">Components</span>
            <span className="mt-1 block text-sm leading-relaxed text-muted transition-colors duration-200 group-hover:text-foreground">
              Pieces of Tandem&apos;s interface, rebuilt for the web.
            </span>
          </span>
          <span
            aria-hidden="true"
            className="font-mono text-sm text-muted transition-transform duration-300 ease-(--ease-out) group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </main>
  )
}
