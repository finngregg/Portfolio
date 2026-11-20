import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { DotLogo } from '@/components/tandem/dot-logo'
import { StatusDot } from '@/components/tandem/status-dot'
import { Bullets, Facts, NextProject, Section } from '@/components/project'

export const metadata: Metadata = {
  title: 'Tandem',
  description:
    'A community app for finding people to train with, and what’s on around you. Co-founded with Adam Angel. Product, design and development by Gregg Finn.',
}

const step = (i: number) => ({ '--i': i }) as CSSProperties

const APP_STORE = 'https://apps.apple.com/us/app/tandem-train-together/id6771069787'

// The App Store screenshots, the map first (Gregg, 2026-11-20: the app's own screenshots over
// drawn visuals); every section below is bullets
const screens: [string, string][] = [
  ['1-discover', 'Find what’s on around you.'],
  ['2-this-week', 'Plan your week and join your friends.'],
  ['3-people', 'Find people who train like you.'],
  ['4-profile', 'Know who you’re meeting.'],
  ['5-host', 'Host a session in a minute.'],
  ['6-clubs', 'Run your club and watch it grow.'],
  ['7-calendar', 'See your month at a glance.'],
  ['8-join-for-part', 'Join for the part that suits you.'],
  ['9-stats', 'See your stats, then vouch for who came.'],
  ['10-share', 'Share it to your story.'],
]

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
          A community app for finding people to train with, and what&apos;s on around you. Co-founded with Adam Angel; I
          lead product, design and development.
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
        <div className="enter mt-10" style={step(4)}>
          <Facts
            items={[
              { label: 'Role', value: 'Product, design and development' },
              { label: 'Team', value: 'Co-founded with Adam Angel' },
              { label: 'Stack', value: 'React Native, Expo, Supabase, Swift' },
              {
                label: 'Status',
                value: (
                  <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="hover-underline inline-flex items-center gap-2.5 text-foreground">
                    <StatusDot live />
                    Live on the App Store
                  </a>
                ),
              },
            ]}
          />
        </div>
      </header>

      {/* The App Store screenshots, swiped sideways */}
      <div className="enter -mx-4 mb-12 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:scroll-px-6 sm:px-6" style={step(5)}>
        {screens.map(([file, caption]) => (
          <Image
            key={file}
            src={`/tandem/store/${file}.jpg`}
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
            People want to be fit, and it&apos;s easier with others, but plenty don&apos;t know where to start, who&apos;s a
            beginner or who they&apos;d be going with. Even at a run club you meet a handful of people, not everyone who&apos;s
            out that week.
          </p>
          <p>Tandem puts what&apos;s on and who&apos;s going in front of you, so you can join them.</p>
        </Section>

        <Section title="What it does">
          <Bullets
            items={[
              ['What’s on.', 'Every session near you on one map, with who’s going and whether it’s at your pace.'],
              ['Your people.', 'People near you who train like you, each with a line on what you share.'],
              ['Your club.', 'Weekly sessions, a club board, and who keeps coming back.'],
              ['On the day.', 'Sessions go into your calendar, and a Live Activity counts down with directions.'],
              ['Afterwards.', 'Workouts come in from Apple Health or Garmin; the session tells you how the group went.'],
            ]}
          />
        </Section>

        <Section title="What it isn't">
          <Bullets
            items={[
              ['A tracker.', 'It brings in what your watch recorded and puts it with the people you trained with.'],
              ['A stage.', 'Notes, photos and comments are for the people there, not an audience.'],
              ['Somewhere you’re watched.', 'The map shows planned sessions only. Nobody’s location is followed.'],
              ['A chat app.', 'Each session has a chat for meeting up, and that’s all.'],
            ]}
          />
        </Section>

        <Section title="Built on trust">
          <Bullets
            items={[
              ['No check-ins.', 'A workout, or someone who was there, marks you as there.'],
              ['One vouch.', '“I’d train with them again” replaced a set of tags people found awkward.'],
              ['Late bails count.', 'Leaving in the last two hours counts as half a no-show.'],
              ['Sessions for one gender.', 'Women only, men only, or women and non-binary people.'],
              ['Protected meeting points.', 'Ask-to-join sessions show an area until the host approves you.'],
            ]}
          />
        </Section>

        <Section title="Craft">
          <Bullets
            items={[
              ['Map pins that never change size.', 'MapKit anchors a pin by its first size, so selection inverts its colours instead.'],
              ['Words before charts.', '“You ran together for 16 km” comes first, the lines after.'],
              ['One place to share.', 'Story card, sticker and poster are tabs of one dark screen.'],
              ['A redesign behind one switch.', 'Mocked first, trialled with named testers, released at once.'],
              ['One visual language.', 'Greys, Geist, one green dot for anything happening now, dots for loading.'],
            ]}
          />
        </Section>

        <Section title="Stack">
          <p>
            React Native with Expo and TypeScript, TanStack Query and Zustand. Supabase for Postgres, auth, storage and edge
            functions, with row-level security on every table. Swift for the Live Activity and widgets. Small changes ship
            over the air; native ones as App Store builds.
          </p>
        </Section>

        <NextProject href="/kodie" name="Kodie" line="Five minutes a day to keep an engineer’s fundamentals sharp." />
      </div>
    </main>
  )
}
