'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StatusDot } from './status-dot'

// Tandem's Discover map pins, ported from SessionPin, DeckPin and groupPins in the app's
// DiscoverMap.tsx. Pins stay minimal but carry meaning in their styling: solid = at your
// pace, outline = not, lime = today, faded = full, ↻ = weekly. Selection never changes a
// pin's size (MapKit anchors a marker by its first measured size, so a growing pin
// jumped): a ring that is always there, transparent until selected, keeps the box fixed.

type Session = {
  id: string
  title: string
  when: string
  km: number
  /** Where it leaves from, in the demo map's 800 × 600 space */
  at: [x: number, y: number]
  today?: boolean
  yourPace?: boolean
  full?: boolean
  weekly?: boolean
  /** Ask to join, not approved: the point is shifted, so it is drawn as an area */
  spotHidden?: boolean
}

// Listed soonest first, so the soonest session leads its stack
const sessions: Session[] = [
  { id: 'a', title: 'Tayelet tempo', when: '18:30', km: 10, at: [262, 300], today: true, yourPace: true },
  { id: 'd', title: 'Yarkon loop', when: '19:00', km: 8, at: [500, 92], today: true, full: true },
  { id: 'k', title: 'Easy evening miles', when: 'WED 19:00', km: 6, at: [384, 214], yourPace: true },
  { id: 'e', title: 'Park intervals', when: 'THU 06:00', km: 12, at: [530, 104], yourPace: true },
  { id: 'i', title: 'Hill reps', when: 'FRI 17:30', km: 14, at: [440, 330], spotHidden: true },
  { id: 'f', title: 'Marathon block', when: 'SAT 06:30', km: 30, at: [214, 520] },
  { id: 'b', title: 'Long run to Jaffa', when: 'SAT 07:00', km: 21, at: [262, 300], weekly: true },
  { id: 'g', title: 'Half pace', when: 'SAT 07:00', km: 25, at: [236, 510], yourPace: true },
  { id: 'h', title: 'Recovery shuffle', when: 'SAT 07:15', km: 18, at: [258, 530], weekly: true },
  { id: 'c', title: 'Beach easy run', when: 'SUN 06:30', km: 16, at: [306, 384] },
  { id: 'j', title: 'Ayalon out and back', when: 'SUN 07:00', km: 15, at: [640, 400] },
]

const WORLD_W = 800
const WORLD_H = 600
// The area drawn for a hidden spot, about 500 m on this map
const AREA_R = 34
const MIN_Z = 0.8
const MAX_Z = 4

// Pins that would mostly cover each other on screen are drawn as one: a box around the
// soonest session's spot, about half a pin wide. Pins that only touch read fine.
// Sessions from the same spot are always one, at any zoom.
const GROUP_W = 48
const GROUP_H = 15

type Point = { x: number; y: number }
type Group = { key: string; at: Point; sessions: Session[] }

function groupPins(pins: { session: Session; at: Point }[]): Group[] {
  const groups: Group[] = []
  for (const p of pins) {
    const g = groups.find(
      (g) =>
        g.sessions[0].at.join() === p.session.at.join() ||
        (Math.abs(g.at.x - p.at.x) < GROUP_W && Math.abs(g.at.y - p.at.y) < GROUP_H),
    )
    if (g) g.sessions.push(p.session)
    else groups.push({ key: p.session.id, at: p.at, sessions: [p.session] })
  }
  return groups.map((g) => ({ ...g, key: g.sessions.map((s) => s.id).join('+') }))
}

// The map: a stand-in for Tel Aviv in the app's greys. The coast runs north-north-east
// with Jaffa bulging out at the south, Yarkon Park across the north.
const coastX = (y: number) => 300 - y / 6 - 26 * Math.exp(-(((y - 540) / 34) ** 2))
const coast = Array.from({ length: 101 }, (_, i) => -200 + i * 10).map((y) => `${coastX(y).toFixed(1)},${y}`)
const sea = `-400,-200 ${coast.join(' ')} -400,800`
const land = `${coast.join(' ')} 1200,800 1200,-200`
// Avenues parallel to the coast, then cross streets square to them
const avenue = (offset: number) => `M${300 + offset + 200 / 6} -200 L${300 + offset - 800 / 6} 800`
const avenues = [22, 70, 140, 230, 320]
const crossStreets = Array.from({ length: 16 }, (_, i) => -120 + i * 55)
const HIGHWAY = 430

const labels: { text: string; at: [number, number] }[] = [
  { text: 'Mediterranean', at: [160, 230] },
  { text: 'Yarkon Park', at: [650, 128] },
  { text: 'Old North', at: [400, 150] },
  { text: 'City Centre', at: [470, 420] },
  { text: 'Jaffa', at: [290, 580] },
  { text: 'Ayalon', at: [700, 300] },
]

const lift = '0 2px 4px rgb(0 0 0 / 0.18)'

function Count({ n, onSolid }: { n: number; onSolid: boolean }) {
  return (
    <span
      className={`-mr-1.5 ml-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-[1.5px] px-[5px] font-mono text-[10px] leading-none font-medium ${
        onSolid ? 'border-foreground bg-background text-foreground' : 'border-background bg-foreground text-background'
      }`}
    >
      {n}
    </span>
  )
}

function Pill({ session, selected, count }: { session: Session; selected: boolean; count?: number }) {
  const solid = !!session.yourPace || selected
  const ink = solid ? 'text-background' : 'text-foreground'
  return (
    // Shadows as in the app: on the pill normally, on the ring once selected
    <span
      className="block rounded-[15px] p-[2px] transition-colors duration-150"
      style={{ background: selected ? 'var(--foreground)' : 'transparent', boxShadow: selected ? lift : 'none' }}
    >
      <span
        className={`flex h-[26px] items-center gap-1.5 rounded-[13px] border px-2.5 font-mono text-[11px] font-medium whitespace-nowrap tabular-nums transition-colors duration-150 ${ink} ${
          solid ? 'bg-foreground' : 'bg-background'
        } ${selected ? 'border-background' : 'border-foreground'}`}
        style={{ boxShadow: selected ? 'none' : lift }}
      >
        {session.today ? <StatusDot live size={6} /> : null}
        <span>{session.when}</span>
        <span className="h-[11px] w-px bg-current opacity-30" />
        <span className="opacity-55">{session.km}km</span>
        {session.weekly ? <span className="text-[10px] font-normal opacity-60">↻</span> : null}
        {count ? <Count n={count} onSolid={solid} /> : null}
      </span>
    </span>
  )
}

// Several sessions from one spot: the soonest in front, the edges of the others behind
// it (one for two, two for more, so two never look like three), and a count. It keeps
// the front session's styling and stays the same size however many there are.
function Edges({ n }: { n: number }) {
  const edge = (top: number, inset: number) => (
    <span
      className="absolute h-[26px] rounded-[13px] border border-foreground bg-muted-bg"
      style={{ top, left: inset, right: inset }}
    />
  )
  return (
    <>
      {n > 2 ? edge(0, 14) : null}
      {edge(5, 7)}
    </>
  )
}

function describe(g: Group) {
  const s = g.sessions
  if (s.length === 1) return `${s[0].title}, ${s[0].when}, ${s[0].km}km`
  return `${s.length} sessions here: ${s.map((x) => x.when).join(', ')}`
}

type View = { cx: number; cy: number; z: number }

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const clampView = (v: View): View => ({ z: clamp(v.z, MIN_Z, MAX_Z), cx: clamp(v.cx, 0, WORLD_W), cy: clamp(v.cy, 0, WORLD_H) })
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

const control =
  'pressable flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border bg-background font-mono text-sm text-foreground shadow-sm'

export function MapPins() {
  const frame = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [view, setView] = useState<View>({ cx: 420, cy: 330, z: 0.95 })
  const [selected, setSelected] = useState<string | null>('a')

  // The latest view, for handlers that start in one render and run on in later ones
  const viewRef = useRef(view)
  useEffect(() => {
    viewRef.current = view
  }, [view])
  const tween = useRef(0)

  useEffect(() => {
    const el = frame.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Pixels per map unit: at z = 1 the map's middle 600 units fill the frame's width
  const k = (size.w / 600) * view.z
  const toScreen = useCallback(
    ([x, y]: [number, number]): Point => ({ x: size.w / 2 + (x - view.cx) * k, y: size.h / 2 + (y - view.cy) * k }),
    [size, view, k],
  )

  const apply = useCallback((next: View) => {
    cancelAnimationFrame(tween.current)
    const v = clampView(next)
    viewRef.current = v
    setView(v)
  }, [])

  // Zoom so the map point under (px, py) stays under it, the way maps zoom to the cursor
  const zoomAt = useCallback(
    (px: number, py: number, z: number): View => {
      const from = viewRef.current
      const k0 = (size.w / 600) * from.z
      const nz = clamp(z, MIN_Z, MAX_Z)
      const k1 = (size.w / 600) * nz
      const wx = from.cx + (px - size.w / 2) / k0
      const wy = from.cy + (py - size.h / 2) / k0
      return { z: nz, cx: wx - (px - size.w / 2) / k1, cy: wy - (py - size.h / 2) / k1 }
    },
    [size],
  )

  // Buttons, keys and double-clicks glide; drags and pinches follow the hand exactly
  const animateTo = useCallback(
    (target: View) => {
      cancelAnimationFrame(tween.current)
      const to = clampView(target)
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return apply(to)
      const from = viewRef.current
      const start = performance.now()
      const step = (now: number) => {
        const t = easeOut(Math.min(1, (now - start) / 300))
        const v = { cx: from.cx + (to.cx - from.cx) * t, cy: from.cy + (to.cy - from.cy) * t, z: from.z + (to.z - from.z) * t }
        viewRef.current = v
        setView(v)
        if (t < 1) tween.current = requestAnimationFrame(step)
      }
      tween.current = requestAnimationFrame(step)
    },
    [apply],
  )

  // Pinch on a trackpad arrives as a wheel event with ctrlKey; ⌘ or Ctrl + scroll also
  // zooms. A plain scroll is left to the page, so the map never traps it.
  useEffect(() => {
    const el = frame.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      const r = el.getBoundingClientRect()
      const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002))
      apply(zoomAt(e.clientX - r.left, e.clientY - r.top, viewRef.current.z * factor))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [apply, zoomAt])

  // Drag to pan with one pointer, pinch with two. A drag that moved swallows the click
  // that follows, so letting go over a pin doesn't select it.
  const pointers = useRef(new Map<number, Point>())
  const dragged = useRef(false)
  const local = (e: React.PointerEvent | React.MouseEvent) => {
    const r = frame.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    if (!pointers.current.size) dragged.current = false
    pointers.current.set(e.pointerId, local(e))
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId)
    if (!prev) return
    const p = local(e)
    const v = viewRef.current
    if (pointers.current.size === 1) {
      // Small wobbles during a tap are not a drag
      if (!dragged.current && Math.hypot(p.x - prev.x, p.y - prev.y) < 4) return
      if (!dragged.current) {
        dragged.current = true
        frame.current!.setPointerCapture(e.pointerId)
      }
      const kNow = (size.w / 600) * v.z
      apply({ ...v, cx: v.cx - (p.x - prev.x) / kNow, cy: v.cy - (p.y - prev.y) / kNow })
    } else if (pointers.current.size === 2) {
      dragged.current = true
      const other = [...pointers.current].find(([id]) => id !== e.pointerId)![1]
      const before = Math.hypot(prev.x - other.x, prev.y - other.y)
      const after = Math.hypot(p.x - other.x, p.y - other.y)
      if (before > 0) apply(zoomAt((p.x + other.x) / 2, (p.y + other.y) / 2, (v.z * after) / before))
    }
    pointers.current.set(e.pointerId, p)
  }
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId)
  }

  const zoomBy = (factor: number) => animateTo({ ...viewRef.current, z: viewRef.current.z * factor })

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return
    const v = viewRef.current
    const pan = 60 / ((size.w / 600) * v.z)
    const moves: Record<string, Partial<View>> = {
      ArrowLeft: { cx: v.cx - pan },
      ArrowRight: { cx: v.cx + pan },
      ArrowUp: { cy: v.cy - pan },
      ArrowDown: { cy: v.cy + pan },
      '+': { z: v.z * 1.5 },
      '=': { z: v.z * 1.5 },
      '-': { z: v.z / 1.5 },
    }
    if (!moves[e.key]) return
    e.preventDefault()
    animateTo({ ...v, ...moves[e.key] })
  }

  const groups = useMemo(() => {
    if (!size.w) return []
    // Hidden spots are areas, not pins, so they never stack
    const pinned = sessions.filter((s) => !s.spotHidden).map((s) => ({ session: s, at: toScreen(s.at) }))
    return groupPins(pinned)
  }, [size.w, toScreen])

  const areas = size.w ? sessions.filter((s) => s.spotHidden) : []
  const selectedGroup = groups.find((g) => g.sessions.some((s) => s.id === selected))
  const selectedArea = areas.find((s) => s.id === selected)
  // Streets keep a steady width on screen, thickening a little as you zoom in
  const road = (base: number) => base * Math.sqrt(view.z)

  return (
    <div className="w-full">
      <div
        ref={frame}
        tabIndex={0}
        role="application"
        aria-label="Map of sessions in Tel Aviv. Drag or use the arrow keys to move, plus and minus to zoom."
        className="relative aspect-[3/2] w-full cursor-grab touch-none overflow-hidden rounded-xl border border-border bg-muted-bg outline-offset-2 select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        onClickCapture={(e) => {
          if (!dragged.current) return
          e.stopPropagation()
          dragged.current = false
        }}
        onClick={(e) => {
          if (!(e.target as Element).closest('button')) setSelected(null)
        }}
        onDoubleClick={(e) => {
          if ((e.target as Element).closest('button')) return
          const p = local(e)
          animateTo(zoomAt(p.x, p.y, viewRef.current.z * 2))
        }}
      >
        {size.w ? (
          <svg width={size.w} height={size.h} className="absolute inset-0" aria-hidden="true">
            <defs>
              <clipPath id="tandem-map-land">
                <polygon points={land} />
              </clipPath>
            </defs>
            <g transform={`translate(${size.w / 2 - view.cx * k} ${size.h / 2 - view.cy * k}) scale(${k})`}>
              <polygon points={sea} className="fill-border dark:fill-background" />
              <g clipPath="url(#tandem-map-land)">
                {/* Yarkon Park with the river through it */}
                <path d="M370 30 L1200 0 L1200 150 L470 160 Q400 150 370 30 Z" className="fill-border" opacity={0.45} />
                <path d="M180 92 C320 70 400 120 500 82 S660 46 1200 64" fill="none" className="stroke-border dark:stroke-background" strokeWidth={9} />
                <g className="stroke-background dark:stroke-border" fill="none" strokeLinecap="round">
                  {crossStreets.map((y) => (
                    <path key={y} d={`M0 ${y} L1200 ${y + 200}`} strokeWidth={road(2)} vectorEffect="non-scaling-stroke" />
                  ))}
                  {avenues.map((o) => (
                    <path key={o} d={avenue(o)} strokeWidth={road(o === 140 ? 5 : 3.5)} vectorEffect="non-scaling-stroke" />
                  ))}
                  <path d={avenue(HIGHWAY)} strokeWidth={road(9)} vectorEffect="non-scaling-stroke" />
                </g>
              </g>
              {/* The Tayelet, the promenade along the beach */}
              <polyline
                points={coast.join(' ')}
                transform="translate(8 0)"
                fill="none"
                className="stroke-background dark:stroke-border"
                strokeWidth={road(3)}
                strokeDasharray="1 6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </svg>
        ) : null}

        {/* Place names stay the same size at any zoom, as on a real map */}
        {size.w
          ? labels.map((l) => {
              const p = toScreen(l.at)
              return (
                <span
                  key={l.text}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] tracking-[0.2em] whitespace-nowrap text-muted uppercase opacity-80"
                  style={{ left: p.x, top: p.y }}
                >
                  {l.text}
                </span>
              )
            })
          : null}

        {areas.map((s) => {
          const p = toScreen(s.at)
          const isSelected = selected === s.id
          const r = AREA_R * k
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${s.title}, ${s.when}, ${s.km}km. Ask to join: the exact spot shows once the host approves you.`}
              onClick={() => setSelected(isSelected ? null : s.id)}
              className="absolute flex cursor-pointer items-center justify-center rounded-full border border-dashed border-foreground/40 bg-foreground/5"
              style={{ left: p.x - r, top: p.y - r, width: r * 2, height: r * 2 }}
            >
              <Pill session={s} selected={isSelected} />
            </button>
          )
        })}

        {groups.map((g) => {
          const isSelected = g === selectedGroup
          const n = g.sessions.length
          const front = g.sessions[0]
          return (
            <button
              key={g.key}
              type="button"
              aria-pressed={isSelected}
              aria-label={describe(g)}
              onClick={() => setSelected(isSelected ? null : front.id)}
              className="absolute cursor-pointer"
              style={{ left: g.at.x, top: g.at.y, transform: 'translate(-50%, -100%)', zIndex: isSelected ? 2 : 1 }}
            >
              <span
                className="pin-in flex flex-col items-center transition-opacity duration-150"
                style={{ opacity: front.full && !isSelected ? 0.4 : 1 }}
              >
                <span className="relative block" style={{ paddingTop: n > 1 ? 10 : 0 }}>
                  {n > 1 ? <Edges n={n} /> : null}
                  <span className="relative block">
                    <Pill session={front} selected={isSelected} count={n > 1 ? n : undefined} />
                  </span>
                </span>
                <span className="h-1.5 w-px bg-foreground" />
              </span>
            </button>
          )
        })}

        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button type="button" aria-label="Zoom in" onClick={() => zoomBy(1.6)} className={control}>
            +
          </button>
          <button type="button" aria-label="Zoom out" onClick={() => zoomBy(1 / 1.6)} className={control}>
            −
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-6">
        <p>Drag to move · Pinch to zoom</p>
        <p aria-live="polite" className="text-foreground sm:text-right">
          {selectedGroup ? describe(selectedGroup) : selectedArea ? `${selectedArea.title}, approximate area` : 'Tap a pin'}
        </p>
      </div>
    </div>
  )
}
