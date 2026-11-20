import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { DotLogo } from '@/components/tandem/dot-logo'
import { StatusDot } from '@/components/tandem/status-dot'
import { Bullets, Facts, NextProject, Section, Stage } from '@/components/project'

export const metadata: Metadata = {
  title: 'Tandem',
  description:
    'Tandem helps you find people to train with and see what’s on near you. Co-founded with Adam Angel. Product, design and development by Gregg Finn.',
}

const step = (i: number) => ({ '--i': i }) as CSSProperties

const APP_STORE = 'https://apps.apple.com/us/app/tandem-train-together/id6771069787'

// Screens shown as on trainintandem.com, all from the App Store set (Gregg, 2026-11-20): three phones
// at the top, then two staggered on a soft panel beside the sections they illustrate. The copy is
// plain whole sentences (Gregg, 2026-11-20: no comma lists ending in "and", no fragments)
const app = (n: number, alt: string) => ({ src: `/tandem/app4/${n}.jpg`, alt })

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
        <p className="enter mt-3 text-base leading-relaxed text-muted" style={step(3)}>
          Tandem helps you find people to train with and see what&apos;s on near you. I co-founded it with Adam Angel and
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

      <div className="enter mb-4" style={step(5)}>
        <Image
          src="/tandem/hero4.png"
          alt="Tandem on iPhone: what’s on around you on a map, how a club is growing, and a story card to share after a session"
          width={2160}
          height={1640}
          priority
          className="w-full rounded-3xl border border-border"
        />
      </div>

      <div className="enter" style={step(5)}>
        <Section title="Why Tandem">
          <p>
            Training is easier with other people, but it&apos;s hard to know where to start or who you&apos;d be going with.
            Even at a run club, you only meet a few of the people who are out that week.
          </p>
          <p>Tandem shows you what&apos;s on near you and who&apos;s going, so you can join them.</p>
        </Section>

        <Section title="What it does">
          <Bullets
            items={[
              ['What’s on.', 'The map shows every session near you, who’s going and whether it’s at your pace.'],
              ['Your people.', 'Tandem suggests people near you who train the way you do, and tells you what you have in common.'],
              ['Your club.', 'Clubs post their weekly sessions and keep their members up to date on a club board.'],
              ['On the day.', 'Sessions you join go into your calendar. On the day, a Live Activity counts down to the start and gives you directions.'],
              ['Afterwards.', 'Your workout comes in from Apple Health or Garmin, and the session shows how the group went.'],
            ]}
          />
          <div className="mt-10">
            <Stage front={app(1, 'The Discover map: sessions across Cape Town, today’s marked green')} back={app(8, 'A 28 km run, with the stretch each person is joining for')} />
          </div>
        </Section>

        <Section title="What it isn't">
          <Bullets
            items={[
              ['A tracker.', 'Tandem doesn’t record workouts. It brings in what your watch recorded and shows it next to the people you trained with.'],
              ['A stage.', 'Notes, photos and comments are for the people who were there, not for an audience.'],
              ['Somewhere you’re watched.', 'The map only shows planned sessions. Tandem never tracks anyone’s location.'],
              ['A chat app.', 'Each session has a chat for arranging where to meet, and nothing more.'],
            ]}
          />
        </Section>

        <Section title="Built on trust">
          <Bullets
            items={[
              ['No check-ins.', 'A workout from your watch shows you were there. If you didn’t wear one, someone who came can confirm it.'],
              ['One vouch.', 'After a session, you can vouch for anyone you’d train with again. It replaced a set of tags that people found awkward.'],
              ['Late bails count.', 'Leaving a session in the two hours before it starts counts against your show-up rate.'],
              ['Sessions for one gender.', 'Sessions and clubs can be women only, men only, or women and non-binary.'],
              ['Protected meeting points.', 'When you have to ask to join, the map shows the area. The exact meeting point appears once the host approves you.'],
            ]}
          />
          <div className="mt-10">
            <Stage flip front={app(4, 'A profile: show-up rate, vouches and usual pace')} back={app(3, 'Find people: friends from your contacts, then people near you')} />
          </div>
        </Section>

        <Section title="Craft">
          <Bullets
            items={[
              ['Map pins that never change size.', 'Apple Maps places a pin by its first size, so a pin that grows when you tap it jumps. Selected pins change colour instead.'],
              ['Words before charts.', 'After a group run, the first thing you read is what happened, such as “You ran together for 16 km”. The charts come after.'],
              ['One place to share.', 'The story card, sticker and poster sit on one screen, so you can compare them before you post.'],
              ['A redesign behind one switch.', 'The current design was mocked up first and tested with a few people before it went to everyone at once.'],
              ['One visual language.', 'Tandem uses greys and the Geist typeface. Its only colour is a green dot for anything happening now.'],
            ]}
          />
          <div className="mt-10">
            <Stage front={app(9, 'After a run: a photo from the morning, then how long the group ran together')} back={app(10, 'Sharing a session: a story card, sticker or poster')} />
          </div>
        </Section>

        <Section title="Stack">
          <p>
            Tandem is built in React Native with Expo and TypeScript, using TanStack Query and Zustand. Supabase runs the
            database, sign-in, storage and server functions, with row-level security on every table. The Live Activity and
            widgets are written in Swift. Small changes go out as over-the-air updates, and native changes go out as App
            Store builds.
          </p>
        </Section>

        <NextProject href="/kodie" name="Kodie" line="Learn to code in a few minutes a day." />
      </div>
    </main>
  )
}
