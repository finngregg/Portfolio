'use client'

import { useEffect, useRef, useState } from 'react'

// After a group run, Tandem tells the story of it in plain words, from everyone's splits:
// how long you ran together, and who picked up the pace when. Ported from togetherStory in
// the app's TogetherRan.tsx: two people are together on a kilometre when their paces are
// within 10 s/km; the headline is the longest stretch together, then what came after.

const TOGETHER_S = 10

type Runner = { name: string; you?: boolean; splits: number[] }

const runners: Runner[] = [
  { name: 'You', you: true, splits: [332, 330, 329, 331, 330, 328, 331, 330, 341, 345] },
  { name: 'Noah', splits: [334, 331, 330, 330, 333, 329, 330, 318, 311, 304] },
]

const pace = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`
const total = (r: Runner) => r.splits.reduce((a, b) => a + b, 0)
const time = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`

function story(a: Runner, b: Runner) {
  const together = a.splits.map((s, i) => Math.abs(s - b.splits[i]) <= TOGETHER_S)
  let km = 0
  while (km < together.length && together[km]) km++
  const rest = together.length - km
  if (!rest) return { together: km, headline: `You ran together for all ${km} km.`, then: null }
  const faster = b.splits.slice(km).reduce((x, y) => x + y, 0) < a.splits.slice(km).reduce((x, y) => x + y, 0) ? b : a
  return {
    together: km,
    headline: `You ran together for ${km} km.`,
    then: `Then ${faster.you ? 'you' : faster.name} picked up the pace for the last ${rest} km.`,
  }
}

// The chart: one line per person, faster higher, kilometre by kilometre
const W = 560
const H = 180
const PAD = { l: 8, r: 8, t: 14, b: 14 }

export function RanTogether() {
  const [you, noah] = runners
  const s = story(you, noah)
  const all = runners.flatMap((r) => r.splits)
  const [lo, hi] = [Math.min(...all) - 6, Math.max(...all) + 6]
  const n = you.splits.length
  const x = (i: number) => PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r)
  const y = (sec: number) => PAD.t + ((sec - lo) / (hi - lo)) * (H - PAD.t - PAD.b)
  const path = (r: Runner) => r.splits.map((sec, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(sec).toFixed(1)}`).join(' ')

  // Drawn in when it scrolls into view, and again on Replay
  const ref = useRef<HTMLDivElement>(null)
  const [drawn, setDrawn] = useState(false)
  const [run, setRun] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setDrawn(true), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const replay = () => {
    setDrawn(false)
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setRun((r) => r + 1)
      setDrawn(true)
    }))
  }

  return (
    <div ref={ref} className="w-full max-w-md">
      <p className="text-sm font-medium text-foreground">{s.headline}</p>
      {s.then ? <p className="mt-1 text-sm text-muted">{s.then}</p> : null}

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-5 block w-full" role="img" aria-label={`Pace per kilometre. ${s.headline} ${s.then ?? ''}`}>
        {/* The stretch run together, shaded */}
        <rect x={x(0)} y={0} width={x(s.together - 1) - x(0)} height={H} className="fill-current text-border" opacity={0.45} />
        {runners
          .slice()
          .reverse()
          .map((r, i) => (
            <path
              key={`${r.name}-${run}`}
              d={path(r)}
              fill="none"
              strokeWidth={r.you ? 2.5 : 2}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              className={r.you ? 'text-foreground' : 'text-muted'}
              stroke="currentColor"
              style={{
                strokeDasharray: 1,
                strokeDashoffset: drawn ? 0 : 1,
                transition: `stroke-dashoffset 1.4s var(--ease-out) ${i * 120}ms`,
              }}
            />
          ))}
      </svg>
      <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
        <span>1 km</span>
        <span>{n} km</span>
      </div>

      <table className="mt-6 w-full border-t border-border text-left text-sm tabular-nums">
        <thead>
          <tr className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
            <th className="py-2 font-normal" />
            <th className="py-2 font-normal">Pace</th>
            <th className="py-2 font-normal">Last km</th>
            <th className="py-2 font-normal">Time</th>
          </tr>
        </thead>
        <tbody>
          {runners.map((r) => (
            <tr key={r.name} className="border-t border-border">
              <td className={`py-2 ${r.you ? 'text-foreground' : 'text-muted'}`}>{r.name}</td>
              <td className="py-2 text-foreground">{pace(total(r) / n)} /km</td>
              <td className="py-2 text-foreground">{pace(r.splits[n - 1])}</td>
              <td className="py-2 text-foreground">{time(total(r))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" onClick={replay} className="pressable mt-5 rounded-full border border-border px-3 py-1.5 text-xs text-foreground">
        Replay
      </button>
    </div>
  )
}
