'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { FORM_MS, STAGGER_MS, clamp01, easeInOutCubic, easeOutCubic, markDots } from './logo-geometry'

const SPACING = 3
const SETTLE_MS = FORM_MS + STAGGER_MS
// Once formed, a faint wave travels left to right through the chevrons: forward motion
const SHIMMER_DEPTH = 0.22
const SHIMMER_FADE_IN_MS = 900

// The burst: the intro played backwards, then forwards. Dots blast outwards from the
// mark's centre, hang for a beat, then re-form with exactly the intro's timing.
const BURST_MS = 650
const BURST_STAGGER_MS = 120
const BURST_HOLD_MS = 140
const REFORM_AT_MS = BURST_MS + BURST_STAGGER_MS + BURST_HOLD_MS
const BURST_TOTAL_MS = REFORM_AT_MS + SETTLE_MS
const BURST_SPREAD_DEG = 70
const DIM = 0.3 // dot opacity while scattered

type Scatter = { x: number[]; y: number[]; out: number[]; back: number[] }

type Props = {
  /** Canvas size in px; the room around the mark is where the dots scatter */
  size: number
  /** Rendered size of the 120-unit mark */
  markSize: number
  /** Start formed instead of playing the intro */
  startFormed?: boolean
  /** Burst on click or tap */
  tappable?: boolean
  /** How strongly the idle wave dims the dots; stronger reads as "working" */
  shimmer?: number
  className?: string
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The Tandem mark, ported from the app's Skia canvas to SVG. Each frame only moves
// circles that React drew once, so React never re-renders while it animates.
export function DotLogo({ size, markSize, startFormed, tappable = true, shimmer = SHIMMER_DEPTH, className }: Props) {
  const field = useMemo(() => {
    const dots = markDots(SPACING)
    const k = markSize / 120
    const x = dots.map((d) => size / 2 + d.x * k)
    const y = dots.map((d) => size / 2 + d.y * k)
    return {
      count: dots.length,
      x,
      y,
      // Blast from the dots' centroid, so it reads as coming from the mark itself
      cx: x.reduce((sum, v) => sum + v, 0) / x.length,
      cy: y.reduce((sum, v) => sum + v, 0) / y.length,
      alpha: dots.map((d) => d.alpha),
      // Position along the mark, drives the shimmer phase
      nx: dots.map((d) => (d.x + 30) / 58),
      radius: SPACING * k * 0.34,
    }
  }, [size, markSize])

  const svgRef = useRef<SVGSVGElement>(null)
  const circles = useRef<(SVGCircleElement | null)[]>([])
  const anim = useRef({ start: 0, burstAt: 0, busyUntil: 0, scatter: null as Scatter | null })

  // Each burst throws dots outwards along their own bearing from the centre
  const burstScatter = useCallback((): Scatter => {
    const reach = size * 0.6
    const spread = (BURST_SPREAD_DEG * Math.PI) / 180
    const x: number[] = []
    const y: number[] = []
    for (let i = 0; i < field.count; i++) {
      const dx = field.x[i] - field.cx
      const dy = field.y[i] - field.cy
      const bearing = (Math.hypot(dx, dy) > 1 ? Math.atan2(dy, dx) : Math.random() * Math.PI * 2) + (Math.random() - 0.5) * spread
      const dist = Math.hypot(dx, dy) + reach * (0.3 + Math.random() * 0.7)
      x.push(field.cx + Math.cos(bearing) * dist)
      y.push(field.cy + Math.sin(bearing) * dist)
    }
    return {
      x,
      y,
      out: x.map(() => Math.random() * BURST_STAGGER_MS),
      back: x.map(() => Math.random() * STAGGER_MS),
    }
  }, [field, size])

  const draw = useCallback(
    (t: number) => {
      const a = anim.current
      const s = a.scatter
      const ts = t - a.burstAt
      const wave = clamp01((t - (startFormed ? 0 : SETTLE_MS)) / SHIMMER_FADE_IN_MS) * shimmer
      for (let i = 0; i < field.count; i++) {
        const el = circles.current[i]
        if (!el) continue
        let alpha = field.alpha[i]
        if (wave > 0) alpha *= 1 - wave * (0.5 - 0.5 * Math.sin(field.nx[i] * Math.PI * 2 - t / 450))
        let away = 0
        if (s) {
          const out = easeOutCubic(clamp01((ts - s.out[i]) / BURST_MS))
          const back = easeInOutCubic(clamp01((ts - REFORM_AT_MS - s.back[i]) / FORM_MS))
          away = out * (1 - back)
          alpha += (DIM - alpha) * away
        }
        el.setAttribute('cx', (field.x[i] + ((s?.x[i] ?? field.x[i]) - field.x[i]) * away).toFixed(2))
        el.setAttribute('cy', (field.y[i] + ((s?.y[i] ?? field.y[i]) - field.y[i]) * away).toFixed(2))
        el.setAttribute('fill-opacity', alpha.toFixed(3))
      }
    },
    [field, shimmer, startFormed],
  )

  // The intro starts already scattered across the canvas, before the first paint
  useLayoutEffect(() => {
    const a = anim.current
    a.start = performance.now()
    if (!startFormed && !reducedMotion()) {
      a.scatter = {
        x: field.x.map(() => (Math.random() * 1.2 - 0.1) * size),
        y: field.y.map(() => (Math.random() * 1.2 - 0.1) * size),
        out: field.x.map(() => 0),
        back: field.x.map(() => Math.random() * STAGGER_MS),
      }
      a.burstAt = -REFORM_AT_MS
      a.busyUntil = SETTLE_MS
      draw(0)
    }
    if (svgRef.current) svgRef.current.style.opacity = '1'
  }, [field, size, startFormed, draw])

  // Runs only while on screen
  useEffect(() => {
    const svg = svgRef.current
    if (!svg || reducedMotion()) return
    let raf = 0
    const tick = (now: number) => {
      draw(now - anim.current.start)
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf)
      if (entry.isIntersecting) raf = requestAnimationFrame(tick)
    })
    io.observe(svg)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [draw])

  const burst = () => {
    const a = anim.current
    const t = performance.now() - a.start
    // Taps are ignored until the current formation has settled
    if (reducedMotion() || t < a.busyUntil) return
    a.busyUntil = t + BURST_TOTAL_MS
    a.scatter = burstScatter()
    a.burstAt = t
  }

  const svg = (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      overflow="visible"
      aria-hidden="true"
      // Hidden until the intro has scattered the dots, so the formed mark never flashes first
      style={{ opacity: startFormed ? 1 : 0 }}
    >
      <g fill="currentColor">
        {field.x.map((x, i) => (
          <circle
            key={i}
            ref={(el) => {
              circles.current[i] = el
            }}
            cx={x}
            cy={field.y[i]}
            r={field.radius}
            fillOpacity={field.alpha[i]}
          />
        ))}
      </g>
    </svg>
  )

  if (!tappable) return <span className={className}>{svg}</span>
  return (
    <button
      type="button"
      onClick={burst}
      aria-label="Tandem logo, two chevrons formed from dots. Press to scatter them."
      className={`cursor-pointer rounded-xl outline-offset-4 ${className ?? ''}`}
    >
      {svg}
    </button>
  )
}
