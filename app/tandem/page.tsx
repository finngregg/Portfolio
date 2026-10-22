import type { CSSProperties, ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Reels } from '@/components/reel'
import { DotLogo } from '@/components/tandem/dot-logo'
import { StatusDot } from '@/components/tandem/status-dot'

export const metadata: Metadata = {
  title: 'Tandem',
  description:
    'A training partner app for endurance athletes, co-founded with Adam Angel. Product, design and development by Gregg Finn.',
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
        <div className="enter -ml-[22px] text-foreground">
          <DotLogo size={96} markSize={110} />
        </div>
        <h1 className="enter mt-6 text-2xl font-semibold tracking-tight text-foreground" style={step(2)}>
          Tandem
        </h1>
        <p className="enter mt-3 max-w-md text-base leading-relaxed text-muted" style={step(3)}>
          A training partner app for endurance athletes. Co-founded with Adam Angel. I lead product, design and
          development.
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
            People training for a half marathon, a marathon or a long ride often end up doing their longest sessions
            alone. Finding someone who is free at the same time, runs at the same pace and is training for the same
            thing is a coordination problem that Strava doesn&apos;t solve.
          </p>
          <p>
            Tandem plans a session, finds the right people to do it with, and builds enough trust between strangers that
            they will actually meet.
          </p>
        </Section>

        <Section title="How it works">
          <Points
            items={[
              [
                'Find a session.',
                <>
                  Discover shows sessions near you on a map and in a list. Each pin says when it starts, how far it goes
                  and whether it&apos;s at your pace, and one search covers sessions, clubs and people.{' '}
                  <Demo id="map-pins">Try the map</Demo>.
                </>,
              ],
              [
                'Host your own.',
                'Creating a session is one page: once or every week, a meeting point picked on the map, and the end time worked out from the distance and pace.',
              ],
              [
                'Train with people like you.',
                'Profiles lead with people: sessions done, show-up rate, partners and who you train with most, so it’s easy to tell who near you trains like you.',
              ],
              [
                'Clubs.',
                'A club is a community with its own members, hosting one-off sessions and weekly runs the same way a person does.',
              ],
              [
                'On the day.',
                'Sessions you join go straight into your calendar. An hour before the start, a Live Activity counts down on the Lock Screen and Apple Watch, with who is going and directions to the meeting point.',
              ],
              [
                'After the run.',
                <>
                  The workout from your own watch sits beside the session, and you can see how you ran together. Add
                  photos, turn one into a poster, and vouch for the people you&apos;d train with again.{' '}
                  <Demo id="poster">Make a poster</Demo>.
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
                'People already have Apple Watch, Garmin or Strava. Tandem reads what their own app recorded, from Apple Health, rather than competing with it.',
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
              ['Real faces and names.', 'A profile photo and full name are required.'],
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
                'Posters with depth.',
                'The runners are cut out of the photo on the phone and placed in front of the distance, in black and white or colour.',
              ],
              [
                'Photos lead.',
                'A finished session opens on its photos, full width, with the title over them. On Home, they share one tile and “+3” says there are more.',
              ],
              [
                'One visual language.',
                'Greys only, Geist and Geist Mono, hairline rows, and a single colour: a lime dot for anything happening now. Loading is always dots, never a spinner.',
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
