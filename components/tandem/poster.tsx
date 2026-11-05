'use client'

import { Anton, Archivo_Black, Instrument_Serif } from 'next/font/google'
import Image from 'next/image'
import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { Segmented } from './segmented'

const wide = Archivo_Black({ weight: '400', subsets: ['latin'] })
const tall = Anton({ weight: '400', subsets: ['latin'] })
const serif = Instrument_Serif({ weight: '400', style: ['normal', 'italic'], subsets: ['latin'] })

// A session photo as a poster, ported from Tandem's PhotoStory.tsx and TypePanel.tsx: the
// photo, then the numbers and the route, then the runners cut out of the photo on top, so
// the type sits behind them. The type is the app's: five families (Geist, Mono, Serif,
// Wide, Tall), weights and italic where the family has them, white or black, and dragged
// up or down to sit where it looks best. Laid out at the app's 360 × 640 in container
// units, so it scales as one. The cut-out was made with Apple's Vision framework.

const W = 360
const u = (n: number) => `calc(${n} * 100cqw / ${W})`

type Family = 'geist' | 'mono' | 'serif' | 'wide' | 'tall'
type Weight = 300 | 400 | 700 | 900

const FAMILIES: { id: Family; label: string; weights: boolean; italic: boolean }[] = [
  { id: 'geist', label: 'Geist', weights: true, italic: true },
  { id: 'mono', label: 'Mono', weights: true, italic: true },
  { id: 'serif', label: 'Serif', weights: false, italic: true },
  { id: 'wide', label: 'Wide', weights: false, italic: false },
  { id: 'tall', label: 'Tall', weights: false, italic: false },
]
const WEIGHTS: { id: Weight; label: string }[] = [
  { id: 300, label: 'Light' },
  { id: 400, label: 'Regular' },
  { id: 700, label: 'Bold' },
  { id: 900, label: 'Black' },
]

// As in the app: each family sized to sit well at the same width; `gap` from the big
// number's top to the row under it
const SIZE: Record<Family, { big: number; spacing: number; small: number; gap: number }> = {
  geist: { big: 56, spacing: -2, small: 13, gap: 64 },
  mono: { big: 46, spacing: -1.5, small: 12, gap: 56 },
  serif: { big: 66, spacing: -1, small: 16, gap: 70 },
  wide: { big: 50, spacing: -1.5, small: 12, gap: 58 },
  tall: { big: 72, spacing: 0, small: 16, gap: 86 },
}

// The highest and lowest the numbers can sit, and where they start: behind the runners'
// upper body
const TOP = { min: 100, max: 520 }
const PEOPLE_TOP = 299
const PEOPLE_H = 232
const START = Math.min(470, Math.max(120, PEOPLE_TOP + PEOPLE_H * 0.12 - 30))

// White or black type, as in the app (2026-10-24: black replaced lime)
const BLACK = '#0D0D0D'

// A loose hand-drawn line where the route goes, as the app draws one without GPS
const route = [0, 0.12, 0.3, 0.5, 0.7, 0.88, 1]
  .map((t, i) => `${130 + 100 * (0.1 + t * 0.8 + (i % 2 ? 0.04 : -0.04))},${96 + 86 * t}`)
  .join(' ')

function fontFor(family: Family, weight: Weight, italic: boolean): CSSProperties {
  const style: CSSProperties = { fontStyle: italic ? 'italic' : 'normal' }
  if (family === 'geist') return { ...style, fontFamily: 'var(--font-geist-sans)', fontWeight: weight }
  if (family === 'mono') return { ...style, fontFamily: 'var(--font-geist-mono)', fontWeight: weight }
  if (family === 'serif') return { ...style, fontFamily: serif.style.fontFamily, fontWeight: 400 }
  return { fontFamily: (family === 'wide' ? wide : tall).style.fontFamily, fontWeight: 400, fontStyle: 'normal' }
}

function TandemDots() {
  return (
    <span className="grid grid-cols-3" style={{ gap: u(1.5) }}>
      {[1, 0, 1, 0, 1, 0, 1, 0, 1].map((on, i) => (
        <span key={i} className="rounded-full bg-white" style={{ width: u(5), height: u(5), opacity: on ? 1 : 0.3 }} />
      ))}
    </span>
  )
}

export function Poster() {
  const [look, setLook] = useState<'mono' | 'colour'>('colour')
  const [accent, setAccent] = useState<'white' | 'black'>('white')
  const [depth, setDepth] = useState<'on' | 'off'>('on')
  const [family, setFamily] = useState<Family>('geist')
  const [weight, setWeight] = useState<Weight>(700)
  const [italic, setItalic] = useState(false)
  const [top, setTop] = useState(START)
  const [dragging, setDragging] = useState(false)

  const def = FAMILIES.find((f) => f.id === family)!
  const size = SIZE[family]
  const type = fontFor(family, def.weights ? weight : 400, def.italic && italic)
  const ink = accent === 'black' ? BLACK : '#FFFFFF'

  // Dragging the numbers: screen pixels into the poster's 360-wide points, kept on the photo
  const frame = useRef<HTMLDivElement>(null)
  const drag = useRef<{ y: number; top: number } | null>(null)
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { y: e.clientY, top }
    setDragging(true)
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !frame.current) return
    const scale = W / frame.current.clientWidth
    setTop(Math.min(TOP.max, Math.max(TOP.min, drag.current.top + (e.clientY - drag.current.y) * scale)))
  }
  const onUp = () => {
    drag.current = null
    setDragging(false)
  }

  // Black and white is the same photo through a filter, so the switch can cross-fade
  const tone: CSSProperties = {
    filter: look === 'mono' ? 'grayscale(1) contrast(1.08)' : 'none',
    transition: 'filter 0.3s ease, opacity 0.3s ease',
  }
  const mono = (n: number, color: string): CSSProperties => ({
    fontSize: u(n),
    letterSpacing: '0.16em',
    color,
    transition: 'color 0.3s ease',
  })

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={frame}
        className="@container relative aspect-[9/16] w-full max-w-[300px] shrink-0 overflow-hidden rounded-xl bg-[#0D0D0D] select-none"
        role="img"
        aria-label="Poster from a 10.1 km sunset run at Sea Point: two runners in front of the distance"
      >
        <Image src="/tandem/sea-point.webp" alt="" fill sizes="300px" className="object-cover" style={tone} />

        <p className="absolute inset-x-0 text-center font-mono uppercase" style={{ top: u(60), ...mono(9, ink) }}>
          Tue 20 Oct // 17:42
        </p>
        <svg viewBox={`0 0 ${W} 640`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          <polyline points={route} fill="none" stroke="#FFFFFF" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {/* The numbers, dragged up or down as in the app */}
        <div
          className={`absolute inset-x-0 touch-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ top: u(top - 10), height: u(size.gap + size.small + 26) }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <p
            className="absolute text-center leading-none whitespace-nowrap"
            style={{ ...type, top: u(10), left: u(18), right: u(18), fontSize: u(size.big), letterSpacing: u(size.spacing), color: ink, transition: 'color 0.3s ease' }}
          >
            10.1 KM
          </p>
          <div
            className="absolute flex justify-between whitespace-nowrap"
            style={{ ...type, top: u(10 + size.gap), left: u(32), right: u(32), fontSize: u(size.small), color: ink, transition: 'color 0.3s ease' }}
          >
            <span>5&apos;10&quot;</span>
            <span>52 MIN</span>
            <span>158 BPM</span>
          </div>
        </div>

        <Image
          src="/tandem/sea-point-people.webp"
          alt=""
          fill
          sizes="300px"
          className="pointer-events-none object-cover"
          style={{ ...tone, opacity: depth === 'on' ? 1 : 0 }}
        />

        <div className="pointer-events-none absolute inset-x-0 flex items-center justify-center" style={{ bottom: u(30), gap: u(8) }}>
          <TandemDots />
          <span className="font-mono uppercase" style={mono(8.5, '#FFFFFF')}>
            Tandem · Sea Point
          </span>
        </div>
      </div>

      <div className="flex w-full max-w-[300px] flex-col items-center gap-3">
        <Segmented
          label="Photo"
          options={[
            { id: 'mono', label: 'B&W' },
            { id: 'colour', label: 'Colour' },
          ]}
          value={look}
          onChange={setLook}
        />
        <Segmented
          label="Depth"
          options={[
            { id: 'off', label: 'Flat' },
            { id: 'on', label: 'Depth' },
          ]}
          value={depth}
          onChange={setDepth}
        />

        {/* The type, as in the app's Aa panel: family, weight, italic, colour */}
        <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Type</div>
        <div className="flex flex-wrap justify-center gap-1.5" role="radiogroup" aria-label="Typeface">
          {FAMILIES.map((f) => (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={family === f.id}
              onClick={() => setFamily(f.id)}
              className={`pressable rounded-full border px-3 py-1.5 text-sm ${family === f.id ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground'}`}
              style={fontFor(f.id, f.weights ? 700 : 400, false)}
            >
              {f.label}
            </button>
          ))}
        </div>
        {def.weights ? (
          <Segmented label="Weight" options={WEIGHTS.map((w) => ({ id: String(w.id), label: w.label }))} value={String(weight)} onChange={(v) => setWeight(Number(v) as Weight)} />
        ) : null}
        <div className="flex flex-wrap justify-center gap-1.5">
          {def.italic ? (
            <button
              type="button"
              aria-pressed={italic}
              onClick={() => setItalic((i) => !i)}
              className={`pressable rounded-full border px-3 py-1.5 text-sm italic ${italic ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground'}`}
            >
              Italic
            </button>
          ) : null}
          <Segmented
            label="Type colour"
            options={[
              { id: 'white', label: 'White' },
              { id: 'black', label: 'Black' },
            ]}
            value={accent}
            onChange={setAccent}
          />
        </div>
        <p className="mt-1 text-xs text-muted">Drag the numbers to move them.</p>
      </div>
    </div>
  )
}
