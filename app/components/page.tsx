import type { CSSProperties, ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { DotLogo } from '@/components/tandem/dot-logo'
import { DotLoader, DotPulse } from '@/components/tandem/dots'
import { MapPins } from '@/components/tandem/map-pins'
import { PhotoCollage } from '@/components/tandem/photo-collage'
import { Poster } from '@/components/tandem/poster'
import { SegmentedDemo } from '@/components/tandem/segmented-demo'
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
    why: 'Tandem uses one colour: lime, for anything happening right now. The grey version marks work in progress on this site.',
    detail:
      'Every 2.4 seconds a ring grows to three and a half times the dot’s size and fades out, so it reads as a calm pulse rather than a blink. On light backgrounds the lime dot is a pixel larger so it stays visible.',
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
    id: 'map-pins',
    title: 'Map Pins',
    why: 'Each pin on the Discover map shows when a session starts, how far it goes and whether it suits your pace, before you tap anything.',
    detail:
      'Selecting a pin swaps its colours instead of making it bigger, because Apple Maps fixes a pin’s size the first time it is drawn. Zoom out and pins that would overlap combine into a stack with a count.',
    demo: <MapPins />,
  },
  {
    id: 'photo-collage',
    title: 'Photo Collage',
    why: 'On the Home feed, each finished session shows its photos in a single tile, so the feed stays tidy however many photos people add.',
    detail:
      'The first photo takes two thirds of the width, with two more stacked beside it. When there are more than three, the last one shows how many are left.',
    demo: <PhotoCollage />,
  },
  {
    id: 'poster',
    title: 'Poster',
    why: 'After a session, any photo can become a poster to share, made entirely on the phone.',
    detail:
      'The runners are cut out of the photo and placed on top of the text, so the distance sits behind them. Switch to Flat to see it without the cut-out.',
    demo: <Poster />,
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
