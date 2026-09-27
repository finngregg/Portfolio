'use client'

import { useEffect, useRef } from 'react'
import { CITIES, COUNTRIES, CURRENT_CITY, type Place } from '@/lib/places'
import landDots from './land-dots.json'

export type GlobeMode = 'lived' | 'been'

// The journey in order: university in Cape Town, work in Johannesburg, then Tel Aviv
const FLIGHTS: [number, number][] = [
  [0, 1],
  [1, 2],
]

// Starting view frames southern Africa up to Israel, looking slightly from the west
// so the flight arcs read as arcs rather than flat lines
const HOME = { lat: 4, lon: 10 }
// Most visited countries sit north of the equator, so that view tilts up while spinning
const BEEN_LAT = 22

const MODE_FADE_MS = 350
const COUNTRY_STAGGER_MS = 35
const COUNTRY_POP_MS = 300

// Timeline (ms)
const FORM_MS = 1400 // each dot's travel from scatter into the globe
const FORM_STAGGER_MS = 600 // spread of start times across dots
const FLIGHT_START_MS = 2100
const FLIGHT_MS = 1100
const FLIGHT_GAP_MS = 200
const INTRO_MS = FLIGHT_START_MS + FLIGHTS.length * (FLIGHT_MS + FLIGHT_GAP_MS)

const AUTO_SPIN_DEG_PER_S = 5
const IDLE_BEFORE_SPIN_MS = 1500
const ARC_SAMPLES = 64
const DEG = Math.PI / 180

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const wrapDeg = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180

// Points on the great circle between two cities, as [lat, lon] in radians plus arc height
function flightPath(a: Place, b: Place) {
  const toVec = (c: Place) => {
    const la = c.lat * DEG
    const lo = c.lon * DEG
    return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)]
  }
  const va = toVec(a)
  const vb = toVec(b)
  const omega = Math.acos(va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2])
  const height = 0.08 + omega * 0.3

  const points: { lat: number; lon: number; lift: number }[] = []
  for (let i = 0; i <= ARC_SAMPLES; i++) {
    const t = i / ARC_SAMPLES
    const wa = Math.sin((1 - t) * omega) / Math.sin(omega)
    const wb = Math.sin(t * omega) / Math.sin(omega)
    const x = wa * va[0] + wb * vb[0]
    const y = wa * va[1] + wb * vb[1]
    const z = wa * va[2] + wb * vb[2]
    points.push({ lat: Math.asin(y), lon: Math.atan2(x, z), lift: 1 + Math.sin(Math.PI * t) * height })
  }
  return points
}

export function Globe({
  mode,
  selected,
  onSpin,
}: {
  mode: GlobeMode
  /** A tapped/clicked place the globe should turn to and keep highlighted */
  selected: string | null
  /** Called when the visitor starts spinning the globe themselves */
  onSpin?: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // since = 0 means "still on the first load", so the lived view plays its intro
  const modeRef = useRef({ mode, since: 0 })
  const selectedRef = useRef(selected)
  const onSpinRef = useRef(onSpin)

  useEffect(() => {
    if (modeRef.current.mode !== mode) modeRef.current = { mode, since: performance.now() }
  }, [mode])

  useEffect(() => {
    selectedRef.current = selected
    onSpinRef.current = onSpin
  }, [selected, onSpin])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Dot data, precomputed so each frame is only a rotation and a projection
    const count = landDots.length / 2
    const cosLat = new Float32Array(count)
    const sinLat = new Float32Array(count)
    const lon = new Float32Array(count)
    const scatterX = new Float32Array(count)
    const scatterY = new Float32Array(count)
    const delay = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const la = landDots[i * 2] * DEG
      cosLat[i] = Math.cos(la)
      sinLat[i] = Math.sin(la)
      lon[i] = landDots[i * 2 + 1] * DEG
      scatterX[i] = Math.random() * 1.2 - 0.1
      scatterY[i] = Math.random() * 1.2 - 0.1
      delay[i] = Math.random() * FORM_STAGGER_MS
    }
    const paths = FLIGHTS.map(([a, b]) => flightPath(CITIES[a], CITIES[b]))

    // View state
    let viewLat = HOME.lat
    let viewLon = HOME.lon
    let velLon = 0
    let dragging = false
    let lastX = 0
    let lastInteraction = 0
    // Hover wins while it lasts; otherwise the tapped/clicked selection holds
    let hovered: Place | null = null
    let focus: Place | null = null
    const findPlace = (id: string | null) =>
      id ? (CITIES.find((c) => c.id === id) ?? COUNTRIES.find((c) => c.id === id) ?? null) : null
    let startTime = 0

    // Layout
    let width = 0
    let height = 0
    let radius = 0
    let cx = 0
    let cy = 0

    // Theme
    let fg = ''
    let bg = ''
    let muted = ''
    let font = ''
    const readTheme = () => {
      const style = getComputedStyle(document.documentElement)
      fg = style.getPropertyValue('--foreground').trim()
      bg = style.getPropertyValue('--background').trim()
      muted = style.getPropertyValue('--muted').trim()
      font = `10px ${style.getPropertyValue('--font-geist-mono').trim() || 'ui-monospace'}, monospace`
    }
    readTheme()

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      radius = Math.min(width, height) * 0.44
      cx = width / 2
      cy = height / 2
    }
    resize()

    // Orthographic projection of a point on the rotated sphere
    let sinT = 0
    let cosT = 1
    let rotLon = 0
    const project = (cl: number, sl: number, lo: number, lift = 1) => {
      const lr = lo + rotLon
      const x0 = cl * Math.sin(lr)
      const z0 = cl * Math.cos(lr)
      const y = sl * cosT - z0 * sinT
      const z = sl * sinT + z0 * cosT
      return { x: cx + x0 * radius * lift, y: cy - y * radius * lift, z }
    }

    // A point is hidden when it is behind the globe and inside its silhouette
    const hidden = (p: { x: number; y: number; z: number }) =>
      p.z < 0 && Math.hypot(p.x - cx, p.y - cy) < radius

    const cityAppearsAt = (index: number) =>
      index === 0 ? FLIGHT_START_MS : FLIGHT_START_MS + index * (FLIGHT_MS + FLIGHT_GAP_MS) - FLIGHT_GAP_MS

    let raf = 0
    let prev = 0

    const frame = (now: number) => {
      if (!startTime) startTime = now
      const elapsed = reduceMotion ? INTRO_MS + FORM_MS : now - startTime
      const dt = prev ? Math.min(now - prev, 50) : 16
      prev = now
      // Mode layers cross-fade; returning to "lived" replays the flights
      const m = modeRef.current
      const switched = m.since > 0
      const fade = switched && !reduceMotion ? easeOut(clamp01((now - m.since) / MODE_FADE_MS)) : 1
      const livedAlpha = m.mode === 'lived' ? fade : 1 - fade
      const beenAlpha = 1 - livedAlpha
      const livedClock =
        m.mode === 'been' || reduceMotion
          ? Infinity
          : switched
            ? now - m.since + FLIGHT_START_MS - 250
            : elapsed
      const beenClock = m.mode === 'been' && !reduceMotion ? now - m.since : Infinity
      const restLat = m.mode === 'been' ? BEEN_LAT : HOME.lat

      const introDone = elapsed >= INTRO_MS || switched
      focus = hovered ?? findPlace(selectedRef.current)

      // Rotation: timeline focus > inertia > idle auto-spin
      if (introDone && !dragging) {
        if (focus) {
          const k = reduceMotion ? 1 : 1 - Math.pow(0.9, dt / 16)
          viewLon += wrapDeg(focus.lon - viewLon) * k
          viewLat += (Math.max(-15, Math.min(15, focus.lat)) - viewLat) * k
          velLon = 0
        } else if (Math.abs(velLon) > 0.01) {
          viewLon += velLon
          velLon *= Math.pow(0.94, dt / 16)
        } else if (!reduceMotion && now - lastInteraction > IDLE_BEFORE_SPIN_MS) {
          viewLon += (AUTO_SPIN_DEG_PER_S * dt) / 1000
          viewLat += (restLat - viewLat) * 0.01
        }
      }
      rotLon = -viewLon * DEG
      sinT = Math.sin(viewLat * DEG)
      cosT = Math.cos(viewLat * DEG)

      ctx.clearRect(0, 0, width, height)

      // Land dots, forming out of scattered noise on first load
      ctx.fillStyle = fg
      for (let i = 0; i < count; i++) {
        const p = project(cosLat[i], sinLat[i], lon[i])
        const settled = p.z > 0 ? 0.2 + 0.7 * p.z : 0
        const t = easeInOut(clamp01((elapsed - delay[i]) / FORM_MS))
        let x = p.x
        let y = p.y
        let alpha = settled
        if (t < 1) {
          x = scatterX[i] * width + (p.x - scatterX[i] * width) * t
          y = scatterY[i] * height + (p.y - scatterY[i] * height) * t
          alpha = 0.3 + (settled - 0.3) * t
        }
        if (alpha < 0.02) continue
        ctx.globalAlpha = alpha
        ctx.fillRect(x - 0.7, y - 0.7, 1.4, 1.4)
      }

      ctx.font = font
      ctx.textBaseline = 'middle'
      if ('letterSpacing' in ctx) ctx.letterSpacing = '1.5px'

      if (livedAlpha > 0.01) drawLived(livedClock, livedAlpha, now)
      if (beenAlpha > 0.01) drawBeen(beenClock, beenAlpha)

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }

    // Background-coloured halo keeps a label legible over land dots
    const drawLabel = (place: Place, x: number, y: number, active: boolean) => {
      const label = place.label.toUpperCase()
      const lx = x + (place.side === 'left' ? -12 : 12)
      ctx.textAlign = place.side === 'left' ? 'right' : 'left'
      ctx.strokeStyle = bg
      ctx.lineWidth = 5
      ctx.lineJoin = 'round'
      ctx.strokeText(label, lx, y)
      ctx.fillStyle = active ? fg : muted
      ctx.fillText(label, lx, y)
      ctx.fillStyle = fg
    }

    const projectPlace = (place: Place) =>
      project(Math.cos(place.lat * DEG), Math.sin(place.lat * DEG), place.lon * DEG)

    // Where I've lived: flights drawn one after another, then the cities
    const drawLived = (clock: number, layerAlpha: number, now: number) => {
      ctx.strokeStyle = fg
      ctx.lineWidth = 1
      ctx.lineCap = 'round'
      paths.forEach((path, f) => {
        const start = FLIGHT_START_MS + f * (FLIGHT_MS + FLIGHT_GAP_MS)
        const progress = easeInOut(clamp01((clock - start) / FLIGHT_MS))
        if (progress <= 0) return
        const end = progress * ARC_SAMPLES
        ctx.globalAlpha = 0.75 * layerAlpha
        ctx.beginPath()
        let pen = false
        let head: { x: number; y: number; z: number } | null = null
        for (let i = 0; i <= Math.ceil(end); i++) {
          const s = path[Math.min(i, ARC_SAMPLES)]
          const p = project(Math.cos(s.lat), Math.sin(s.lat), s.lon, s.lift)
          if (hidden(p)) {
            pen = false
            continue
          }
          if (pen) ctx.lineTo(p.x, p.y)
          else ctx.moveTo(p.x, p.y)
          pen = true
          head = p
        }
        ctx.stroke()
        if (progress < 1 && head) {
          ctx.globalAlpha = layerAlpha
          ctx.beginPath()
          ctx.arc(head.x, head.y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      CITIES.forEach((city, index) => {
        const shownFor = clock - cityAppearsAt(index)
        if (shownFor < 0) return
        const p = projectPlace(city)
        if (p.z <= 0) return
        const appear = easeOut(clamp01(shownFor / 400))
        const active = focus?.id === city.id
        const alpha = clamp01(p.z * 4) * layerAlpha

        if (city.id === CURRENT_CITY && !reduceMotion) {
          const pulse = (now % 2400) / 2400
          ctx.globalAlpha = 0.5 * (1 - pulse) * alpha
          ctx.beginPath()
          ctx.arc(p.x, p.y, 3 + pulse * 10, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.globalAlpha = appear * alpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, (active ? 4.5 : 3) * appear, 0, Math.PI * 2)
        ctx.fill()
        drawLabel(city, p.x, p.y, active)
      })
    }

    // Where I've been: every country pops in, no connecting lines. Only the one
    // being hovered in the list is labelled, so the globe stays uncluttered.
    const drawBeen = (clock: number, layerAlpha: number) => {
      let labelled: { place: Place; x: number; y: number; alpha: number } | null = null
      for (let index = 0; index < COUNTRIES.length; index++) {
        const country = COUNTRIES[index]
        const appear = easeOut(clamp01((clock - index * COUNTRY_STAGGER_MS) / COUNTRY_POP_MS))
        if (appear <= 0) continue
        const p = projectPlace(country)
        if (p.z <= 0) continue
        const active = focus?.id === country.id
        const alpha = clamp01(p.z * 4) * layerAlpha
        ctx.globalAlpha = appear * alpha * (active ? 1 : 0.85)
        ctx.beginPath()
        ctx.arc(p.x, p.y, (active ? 4.5 : 2.5) * appear, 0, Math.PI * 2)
        ctx.fill()
        if (active) labelled = { place: country, x: p.x, y: p.y, alpha }
      }
      // Label last so it sits above neighbouring markers
      if (labelled) {
        ctx.globalAlpha = labelled.alpha
        drawLabel(labelled.place, labelled.x, labelled.y, true)
      }
    }

    // Only animate while the globe is on screen
    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf)
      prev = 0
      if (entry.isIntersecting) raf = requestAnimationFrame(frame)
    })
    visibility.observe(canvas)

    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(canvas)

    const themeObserver = new MutationObserver(readTheme)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    // Drag sideways to spin, with momentum on release. Spin is horizontal only so it
    // never competes with vertical page scroll; a drag must first commit to the
    // horizontal axis before it moves the globe.
    const AXIS_LOCK_PX = 6
    let pressed = false
    let downX = 0
    let downY = 0
    const onDown = (e: PointerEvent) => {
      pressed = true
      downX = lastX = e.clientX
      downY = e.clientY
    }
    const onMove = (e: PointerEvent) => {
      if (!pressed) return
      if (!dragging) {
        const dx = Math.abs(e.clientX - downX)
        const dy = Math.abs(e.clientY - downY)
        if (dx < AXIS_LOCK_PX && dy < AXIS_LOCK_PX) return
        if (dy > dx) {
          pressed = false // vertical intent: leave it to the page
          return
        }
        dragging = true
        hovered = null
        onSpinRef.current?.()
        velLon = 0
        canvas.setPointerCapture(e.pointerId)
      }
      const dLon = ((e.clientX - lastX) / radius) * (180 / Math.PI)
      viewLon -= dLon
      velLon = -dLon
      lastX = e.clientX
      lastInteraction = performance.now()
    }
    const onUp = () => {
      pressed = false
      dragging = false
      lastInteraction = performance.now()
    }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)

    // Hovering a place in the lists below turns the globe to it
    const PLACE_SELECTOR = '[data-city], [data-country]'
    const onOver = (e: PointerEvent) => {
      const row = (e.target as Element).closest?.(PLACE_SELECTOR)
      // Touch has no real hover; taps are handled as selection instead
      if (!row || e.pointerType !== 'mouse') return
      hovered = findPlace(row.getAttribute('data-city') ?? row.getAttribute('data-country'))
    }
    const onOut = (e: PointerEvent) => {
      const row = (e.target as Element).closest?.(PLACE_SELECTOR)
      if (row && !row.contains(e.relatedTarget as Node)) {
        hovered = null
        lastInteraction = performance.now()
      }
    }
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)

    return () => {
      cancelAnimationFrame(raf)
      visibility.disconnect()
      sizeObserver.disconnect()
      themeObserver.disconnect()
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={
        mode === 'lived'
          ? 'A dotted globe tracing a route from Cape Town to Johannesburg to Tel Aviv'
          : `A dotted globe marking the ${COUNTRIES.length} countries I have visited`
      }
      className="block aspect-[4/3] w-full cursor-grab touch-pan-y active:cursor-grabbing"
    />
  )
}
