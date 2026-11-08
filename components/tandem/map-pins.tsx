'use client'

import { useState } from 'react'

// Tandem's Discover map pins, ported from SessionPin and ClubPin in the app's
// DiscoverMap.tsx, set out as a specimen rather than on a map (2026-11-08: the
// interactive map read as messy; then four states, to keep it short): solid = at
// your pace, outline = not, green = today, a square for a club. Tap one to select it: a
// ring appears, but the box never changes size, because MapKit anchors a marker by its
// first measured size and a growing pin jumps.

type Pin = {
  id: string
  label: string
  initial: string
  when: string
  km?: string
  pace?: boolean
  today?: boolean
  full?: boolean
  stack?: number
  club?: boolean
  area?: boolean
  weekly?: boolean
}

const pins: Pin[] = [
  { id: 'pace', label: 'At your pace', initial: 'T', when: 'SAT 07:00', km: '21km', pace: true },
  { id: 'other', label: 'Another pace', initial: 'J', when: 'SUN 06:30', km: '16km' },
  { id: 'today', label: 'Today', initial: 'A', when: '18:30', km: '10km', pace: true, today: true },
  { id: 'club', label: 'A club', initial: 'SP', when: 'TUE 06:00', km: '8km', club: true },
]

function Runner() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="14" cy="4.5" r="2" />
      <path d="M8 21l3-6 3 2v5M6.5 12.5l2.5-3.5 4 1 2.5 3 3 1" />
    </svg>
  )
}

function PinFace({ p, selected }: { p: Pin; selected: boolean }) {
  // Colours say what the pin is (solid = at your pace); selection is only the ring, so two
  // dark pins never read as two selections (2026-11-08)
  const solid = !p.club && (p.pace ?? false)
  const ink = solid ? 'bg-foreground text-background border-foreground' : 'bg-background text-foreground border-foreground'
  return (
    <span
      className={`inline-flex h-[30px] items-center gap-1.5 border pl-1 pr-2.5 font-mono text-[10.5px] tabular-nums transition-[background-color,color,box-shadow] duration-200 ${ink} ${p.club ? 'rounded-[9px]' : 'rounded-full'} ${p.full ? 'opacity-45' : ''}`}
      // The ring is always there, clear until selected, so the box never grows
      style={{ boxShadow: `0 0 0 2px var(--color-background), 0 0 0 4px ${selected ? 'var(--color-foreground)' : 'transparent'}` }}
    >
      {p.club ? (
        <span className={`flex h-[22px] w-[24px] items-center justify-center rounded-[6px] border text-[9px] ${solid ? 'border-background/30' : 'border-border bg-muted-bg'}`}>{p.initial}</span>
      ) : (
        <span className={`flex size-[22px] items-center justify-center rounded-full text-[9px] ${solid ? 'bg-background text-foreground' : 'bg-foreground text-background'}`}>{p.initial}</span>
      )}
      {p.today ? <span className="size-[6px] rounded-full" style={{ background: '#2eb872' }} /> : null}
      <Runner />
      <span>{p.when}</span>
      {p.km ? <span className="opacity-55">| {p.km}</span> : null}
      {p.weekly ? <span aria-label="Every week">↻</span> : null}
      {p.stack ? (
        <span className={`ml-0.5 rounded-full px-1.5 py-px text-[9px] ${solid ? 'bg-background text-foreground' : 'bg-foreground text-background'}`}>+{p.stack}</span>
      ) : null}
    </span>
  )
}

export function MapPins() {
  const [selected, setSelected] = useState<string | null>('today')
  return (
    <div className="grid w-full grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
      {pins.map((p) => (
        <div key={p.id} className="flex flex-col items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSelected(selected === p.id ? null : p.id)}
            aria-pressed={selected === p.id}
            aria-label={`${p.label}: ${p.when}${p.km ? `, ${p.km}` : ''}`}
            className="pressable relative flex h-[48px] items-center justify-center"
          >
            {/* Ask to join: the meeting point is shifted, so the map shows an area, not a spot */}
            {p.area ? (
              <span aria-hidden="true" className="absolute left-1/2 top-1/2 size-[96px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-foreground/30 bg-foreground/[0.05]" />
            ) : null}
            <span className="relative">
              <PinFace p={p} selected={selected === p.id} />
            </span>
          </button>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{p.label}</span>
        </div>
      ))}
    </div>
  )
}
