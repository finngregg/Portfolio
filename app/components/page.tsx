import type { CSSProperties, ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { DotLogo } from '@/components/tandem/dot-logo'
import { DotLoader, DotPulse } from '@/components/tandem/dots'
import { HighFive } from '@/components/tandem/high-five'
import { MapPins } from '@/components/tandem/map-pins'
import { RanTogether } from '@/components/tandem/ran-together'
import { SegmentedDemo } from '@/components/tandem/segmented-demo'
import { PullDots, UnreadBell, VouchPill } from '@/components/tandem/small-pieces'
import { StatusDot } from '@/components/tandem/status-dot'

export const metadata: Metadata = {
  title: 'Components',
  description: 'Pieces of Tandem’s interface, rebuilt for the web by Gregg Finn. Everything on the page works.',
}

const step = (i: number) => ({ '--i': i }) as CSSProperties

type Piece = { id: string; title: string; why: string; detail: string; demo: ReactNode }

const pieces: Piece[] = [
  {
    id: 'status-dot',
    title: 'Live Dot',
    why: 'Tandem uses one colour: green, for anything happening right now. The grey version marks work in progress on this site.',
    detail:
      'Every 2.4 seconds a ring grows to three and a half times the dot’s size and fades out, so it reads as a calm pulse rather than a blink.',
    demo: (
      <div className="flex items-center gap-10 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
        <span className="inline-flex items-center gap-2.5">
          <StatusDot live />
          Live
        </span>
        <span className="inline-flex items-center gap-2.5">
          <StatusDot />
          In testing
        </span>
      </div>
    ),
  },
  {
    id: 'dots',
    title: 'Loading States',
    why: 'Tandem never uses a spinner. Loading is shown with the same dots that make up the logo, so even waiting looks like part of the app.',
    detail:
      'Each dot brightens over 320 ms and dims over 420 ms, starting just after the one before, so the three never pulse at once. For full-screen loading, the logo itself shimmers.',
    demo: (
      <div className="grid w-full grid-cols-2 items-center">
        <div className="flex justify-center text-muted">
          <DotPulse />
        </div>
        <DotLoader />
      </div>
    ),
  },
  {
    id: 'logo',
    title: 'Interactive Logo',
    why: 'The Tandem logo is two chevrons, one behind the other, drawn entirely in dots. It is made the same way as the dotted globe on my home page.',
    detail:
      'The dots are placed row by row on a grid rather than traced from an outline, so the edges step evenly towards the point. Click it to scatter the dots and watch them come back together.',
    demo: (
      <div className="text-foreground">
        <DotLogo size={160} markSize={180} startFormed />
      </div>
    ),
  },
  {
    id: 'segmented',
    title: 'Segmented Switch',
    why: 'On a session, this switch flips between the details and the map without leaving the page.',
    detail:
      'Every option is the same width, so the dark pill only ever slides sideways. The options don’t shrink when pressed, because that would look like a wobble against the moving pill.',
    demo: <SegmentedDemo />,
  },
  {
    id: 'pull-to-refresh',
    title: 'Pull to Refresh',
    why: 'Lists refresh when you pull them down. Instead of the system spinner, the logo’s dots arrive one at a time as you pull.',
    detail:
      'Each dot fades and grows in over its own stretch of the pull, so the three fill up in order and you can see how far is far enough. Let go past the line and they turn into the pulse while it loads.',
    demo: <PullDots />,
  },
  {
    id: 'high-five',
    title: 'High Five',
    why: 'Under a finished session, a high five says well done without needing words. The hand gives one; the count shows who.',
    detail:
      'The two sat so close that a tap between them could do either, so their tap areas now stop short of each other. The hand fills and pops the moment you tap, before the server answers, and settles back if it says no.',
    demo: <HighFive />,
  },
  {
    id: 'vouch',
    title: 'Vouch',
    why: 'After a session, you can vouch for anyone you’d train with again. It replaced rating people, because people noticed which rating they didn’t get.',
    detail:
      'One vouch per person, however many sessions you share. Tapping it again takes it back quietly: nobody is told, and the count on their profile simply goes down.',
    demo: <VouchPill />,
  },
  {
    id: 'unread',
    title: 'Unread Count',
    why: 'New notifications show as a number on the bell, never a dot, so you know whether it’s one thing or many.',
    detail:
      'Past nine it reads 9+, so the badge never widens enough to cover the bell. Opening it marks everything read at once, without waiting for the server, so the number is gone before the list appears.',
    demo: <UnreadBell />,
  },
  {
    id: 'map-pins',
    title: 'Map Pins',
    why: 'Each pin on the Discover map says when a session starts, how far it goes and whether it suits your pace, before you tap anything. Every state a pin can be in is set out here: tap one to select it.',
    detail:
      'Selecting a pin swaps its colours and shows a ring that was there all along, clear. Its size never changes, because Apple Maps fixes a marker’s size the first time it is drawn, and a pin that grows when selected jumps.',
    demo: <MapPins />,
  },
  {
    id: 'ran-together',
    title: 'Ran Together',
    why: 'After a group run, Tandem puts everyone’s workouts side by side and says what happened in plain words: how long you ran together, and who picked up the pace when.',
    detail:
      'Two people count as together on a kilometre when their paces are within ten seconds of each other. The headline is the longest stretch together, then what came after. Rides use speed, swims every hundred metres.',
    demo: <RanTogether />,
  },
]

export default function ComponentsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 sm:px-6">
      <section className="pt-20 pb-12">
        <h1 className="enter text-2xl font-semibold tracking-tight text-foreground">Components</h1>
        <p className="enter mt-3 max-w-md text-base leading-relaxed text-muted" style={step(1)}>
          Pieces of{' '}
          <Link href="/tandem" className="hover-underline text-foreground">
            Tandem
          </Link>
          &apos;s interface, rebuilt for the web. Everything here works, so try it.
        </p>
        <ol className="enter mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted" style={step(2)}>
          {pieces.map((p) => (
            <li key={p.id}>
              <a href={`#${p.id}`} className="pressable hover-underline hover:text-foreground">
                {p.title}
              </a>
            </li>
          ))}
        </ol>
      </section>

      <div className="enter pb-24" style={step(3)}>
        {pieces.map((p, i) => (
          <section key={p.id} id={p.id} className="scroll-mt-20 border-t border-border py-12">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-muted tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="text-sm font-medium text-foreground">{p.title}</h2>
            </div>
            <div className="mt-6 flex min-h-48 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted-bg/50 p-6 sm:p-8">
              <div className="w-full flex justify-center">{p.demo}</div>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-muted">{p.why}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground">The detail</span>
              <span className="mx-2 text-border">/</span>
              {p.detail}
            </p>
          </section>
        ))}
      </div>
    </main>
  )
}
