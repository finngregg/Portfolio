'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Kodie's pixel art, from the app (src/kodie/draw.ts): p is the braces, i the face, c the cheeks
const POSES = {
  idle: ['................', '................', '...pp......pp...', '..p..........p..', '..p..........p..', '..p..ii..ii..p..', '.p...ii..ii...p.', '..p..........p..', '..p...i..i...p..', '..p....ii....p..', '...pp......pp...'],
  blink: ['................', '................', '...pp......pp...', '..p..........p..', '..p..........p..', '..p..........p..', '.p...ii..ii...p.', '..p..........p..', '..p...i..i...p..', '..p....ii....p..', '...pp......pp...'],
  wink: ['................', '................', '...pp......pp...', '..p..........p..', '..p..........p..', '..p......ii..p..', '.p...ii..ii...p.', '..p..........p..', '..p...i..i...p..', '..p....ii....p..', '...pp......pp...'],
  glance: ['................', '................', '...pp......pp...', '..p..........p..', '..p..........p..', '..p.ii..ii...p..', '.p..ii..ii....p.', '..p..........p..', '..p...i..i...p..', '..p....ii....p..', '...pp......pp...'],
  happy: ['................', '................', '...pp......pp...', '..p..........p..', '..p..i....i..p..', '..p.i.i..i.i.p..', '.p............p.', '..p.c......c.p..', '..p..i....i..p..', '..p...iiii...p..', '...pp......pp...'],
} as const
type Pose = keyof typeof POSES

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * The mascot, alive as in the app: it breathes, blinks (sometimes twice), glances now and then and
 * winks once in a while; tap it and it smiles. Eased and never springy; with Reduce Motion it keeps
 * its faces and loses the movement.
 */
export function KodieMascot({ pixel = 9, colours }: { pixel?: number; colours?: { braces?: string; face?: string } }) {
  const [pose, setPose] = useState<Pose>('idle')
  const back = useRef<ReturnType<typeof setTimeout>>(undefined)
  const busy = useRef(false)

  const flash = useCallback((next: Pose, ms: number, then?: () => void) => {
    setPose(next)
    clearTimeout(back.current)
    back.current = setTimeout(() => {
      setPose('idle')
      busy.current = false
      then?.()
    }, ms)
  }, [])

  useEffect(() => {
    let tick = 0
    const still = reducedMotion()
    const timer = setInterval(() => {
      if (busy.current) return
      tick += 1
      if (tick % 32 === 0) flash('blink', 140, () => tick % 64 === 0 && setTimeout(() => flash('blink', 120), 180))
      else if (!still && tick % 77 === 0) flash('glance', 900)
      else if (tick % 113 === 0) flash('wink', 420)
    }, 110)
    return () => {
      clearInterval(timer)
      clearTimeout(back.current)
    }
  }, [flash])

  const fill = { p: colours?.braces ?? 'var(--kodie-purple)', i: colours?.face ?? 'currentColor', c: '#F2A7AA' }
  const rows = POSES[pose]
  return (
    <button
      type="button"
      aria-label="Kodie, the mascot. Tap to make it smile"
      onClick={() => {
        busy.current = true
        flash('happy', 1100)
      }}
      className="pressable cursor-pointer border-0 bg-transparent p-4"
    >
      <span className="kodie-breathe block" style={{ display: 'grid', gridTemplateColumns: `repeat(16, ${pixel}px)`, gridAutoRows: `${pixel}px` }}>
        {rows.flatMap((row, y) =>
          [...row].map((ch, x) => <span key={`${y}-${x}`} style={{ background: ch === '.' ? 'transparent' : fill[ch as 'p' | 'i' | 'c'] }} />),
        )}
      </span>
    </button>
  )
}

/** A still face, for the colour row: any braces colour, the face in light ink */
export function KodieFace({ pixel = 4, braces, happy }: { pixel?: number; braces: string; happy?: boolean }) {
  const rows = happy ? POSES.happy : POSES.idle
  return (
    <span aria-hidden="true" style={{ display: 'grid', gridTemplateColumns: `repeat(16, ${pixel}px)`, gridAutoRows: `${pixel}px` }}>
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) => (
          <span key={`${y}-${x}`} style={{ background: ch === 'p' ? braces : ch === 'i' ? '#E8ECF2' : ch === 'c' ? '#F2A7AA' : 'transparent' }} />
        )),
      )}
    </span>
  )
}
