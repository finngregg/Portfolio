import type { CSSProperties, ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Reels } from '@/components/reel'
import { DotLogo } from '@/components/tandem/dot-logo'
import { StatusDot } from '@/components/tandem/status-dot'

export const metadata: Metadata = {
  title: 'Tandem',
  description:
    'Find what’s on around you, and the people to do it with. Co-founded with Adam Angel. Product, design and development by Gregg Finn.',
}

const step = (i: number) => ({ '--i': i }) as CSSProperties

const facts: { label: string; value: ReactNode }[] = [
  { label: 'Role', value: 'Product, design and development' },
  { label: 'Team', value: 'Co-founded with Adam Angel' },
  { label: 'Stack', value: 'React Native, Expo, Supabase, Swift' },
  {
    label: 'Status',
    value: (
      <span className="inline-flex items-center gap-2.5">
        <StatusDot live />
        In testing on TestFlight
      </span>
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
          Find what&apos;s on around you, and the people to do it with. Co-founded with Adam Angel. I lead product,
          design and development.
        </p>
        <dl className="enter mt-10 border-t border-border" style={step(4)}>
          {facts.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-[6rem_1fr] items-baseline gap-x-4 border-b border-border py-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{label}</dt>
              <dd className="text-sm text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="enter" style={step(5)}>
        <Section title="The problem">
          <p>
            It started with long runs. People training for a half marathon, a marathon or a long ride often end up doing
            their longest sessions alone, because finding someone free at the same time, at the same pace and training for
            the same thing is hard to arrange. Run clubs help, but most of their runs stop at 5 or 10 km.
          </p>
          <p>
            Building it showed the problem is wider. People want to know what&apos;s on near them, from a club run or a
            padel game to a ride or a studio class, and who they&apos;d be doing it with. Tandem shows both, and builds
            enough trust between strangers that they actually meet.
          </p>
        </Section>

        <Section title="How it works">
          <Points
            items={[
              [
                'See what’s on.',
                <>
                  Discover shows what&apos;s happening near you, on a map and in a list: runs, rides, padel games and
                  studio classes. Each pin says when it starts, how far it goes and whether it&apos;s at your pace, and one
                  search covers sessions, clubs and people. <Demo id="map-pins">Try the map</Demo>.
                </>,
              ],
              [
                'Host your own.',
                'Creating a session takes five short steps: what, when, where, how far, then a check. Distance, length and pace are wheels with sensible defaults for each sport, and the end time works itself out.',
              ],
              [
                'Meet people who train like you.',
                'Find people ranks everyone near you on shared goals, sports, pace and partners, and says in one line what you have in common. Profiles lead with people: sessions done, show-up rate, partners and who vouches for them.',
              ],
              [
                'Clubs and studios.',
                'A club hosts one-off and weekly sessions the same way a person does. A studio is a club with a booking link: its classes are booked on its own site, so tapping Book doesn’t mark you as going. When you come back, Tandem asks whether you got a place.',
              ],
              [
                'On the day.',
                'Sessions you join go straight into your calendar. An hour before the start, a Live Activity counts down on the Lock Screen and Apple Watch, with who is going and directions to the meeting point.',
              ],
              [
                'After the session.',
                <>
                  The workout from your own watch sits beside the session, and you can see how the group ran. Share it as
                  a story card, a sticker for your own photo, or a poster with your numbers set behind you, and vouch for
                  the people you&apos;d train with again. <Demo id="story-card">Try the story card</Demo>.
                </>,
              ],
            ]}
          />
          <Reels
            clips={[
              {
                src: '/tandem/discover.mp4',
                poster: '/tandem/discover.jpg',
                label: 'Discover: planned sessions on a map of Tel Aviv, each pin showing when and how far',
                caption: 'Discover',
              },
              {
                src: '/tandem/together.mp4',
                poster: '/tandem/together.jpg',
                label: 'After a run: two runners’ workouts drawn together, showing where one pulled ahead',
                caption: 'After the run',
              },
            ]}
          />
        </Section>

        <Section title="What it deliberately isn't">
          <p>Some of the most important decisions were about what to leave out.</p>
          <Points
            items={[
              [
                'It never records workouts.',
                'People already track their training with a watch or an app they love. Tandem brings that workout in from Apple Health and shows it beside the session.',
              ],
              [
                'It never tracks location live.',
                'The map shows planned sessions only. Nobody is ever watched.',
              ],
              ['Chat is for logistics.', 'Each session has a chat for meeting up. It is not trying to be a messaging app.'],
            ]}
          />
        </Section>

        <Section title="Built on trust">
          <p>
            Meeting a stranger for a three-hour run takes trust, so it&apos;s built into the basics rather than added on
            later.
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
                'Numbers that stay put.',
                'A wrap that says “your 4th session” or “3rd run with Ava” is worked out as of that session, so opening an old one shows what it showed on the day.',
              ],
              [
                'Faces open people.',
                'A session of 40 or a club of 300 shows two rows of faces and “See all”. Tapping a face anywhere opens that person, and the high five count opens who gave one.',
              ],
              [
                'One visual language.',
                'Greys only, Geist and Geist Mono, hairline rows, and a single colour: a green dot for anything happening now. Loading is always dots, never a spinner.',
              ],
            ]}
          />
          <Reels
            clips={[
              {
                src: '/tandem/poster.mp4',
                poster: '/tandem/poster.jpg',
                label: 'Making a poster from a run photo: switching colour, type colour and the depth effect',
                caption: 'Poster',
              },
            ]}
          />
        </Section>

        <Section title="Stack">
          <p>
            React Native with Expo, TypeScript, Expo Router, TanStack Query and Zustand. Supabase for Postgres, auth,
            storage, scheduled jobs and edge functions, with row-level security on every table and no separate backend.
            Native pieces in Swift: the Live Activity, widgets and a Watch layout. Small changes ship as over-the-air
            updates; native ones as TestFlight builds.
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
