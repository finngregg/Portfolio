'use client'

import { useRef, useState } from 'react'

// The high five from a finished session, ported from HighFiveButton.tsx in the app. The
// hand gives one and the count shows who; their tap areas stop short of each other, so a
// tap between them never does the wrong thing. The hand fills and pops at once
// (optimistic), and the count moves with it.

const others = ['Maya', 'Tom', 'Aisha']

function Hand({ filled }: { filled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 1.4 : 1.6} strokeLinejoin="round" aria-hidden="true">
      <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11V4a1.5 1.5 0 0 1 3 0v7V5.5a1.5 1.5 0 0 1 3 0V12v-3a1.5 1.5 0 0 1 3 0v5a8 8 0 0 1-8 8h-1a7 7 0 0 1-5.6-2.8L3.6 15.4a1.6 1.6 0 0 1 2.4-2.1L8 15" />
    </svg>
  )
}

export function HighFive() {
  const [mine, setMine] = useState(false)
  const [open, setOpen] = useState(false)
  const hand = useRef<HTMLSpanElement>(null)
  const people = mine ? ['You', ...others] : others

  const give = () => {
    const on = !mine
    setMine(on)
    if (on && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hand.current?.animate(
        [{ transform: 'scale(1) rotate(0)' }, { transform: 'scale(1.3) rotate(-18deg)', offset: 0.35 }, { transform: 'scale(1) rotate(0)' }],
        { duration: 340, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
      )
    }
  }

  return (
    <div className="flex w-full max-w-xs flex-col items-center">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={give}
          aria-pressed={mine}
          aria-label={mine ? 'You high-fived this' : 'High five'}
          className={`-m-2.5 mr-0 p-2.5 ${mine ? 'text-foreground' : 'text-muted'}`}
        >
          <span ref={hand} className="block">
            <Hand filled={mine} />
          </span>
        </button>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={`-my-2.5 py-2.5 pr-2.5 font-mono text-[11px] uppercase tracking-[0.15em] tabular-nums ${mine ? 'text-foreground' : 'text-muted'}`}
        >
          {people.length} high fives
        </button>
      </div>
      {open ? (
        <ul className="mt-5 w-full border-t border-border">
          {people.map((p) => (
            <li key={p} className="pin-in flex items-center gap-3 border-b border-border py-2.5 text-sm text-foreground">
              <span className="flex size-6 items-center justify-center rounded-full bg-border font-mono text-[10px] text-muted">{p[0]}</span>
              {p}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
