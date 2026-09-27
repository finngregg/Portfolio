'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export type Photo = {
  src: string
  location: string
  coords?: [lat: number, lon: number]
}

// Halftone grid per photo (3:4, matching the photos)
const COLS = 45
const ROWS = 60

// Intro: dots gather out of scattered noise, then the centred photo develops
const INTRO_MS = 1100
const INTRO_STAGGER_MS = 500
const DEVELOP_DELAY_MS = INTRO_MS + INTRO_STAGGER_MS - 200

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function formatCoords([lat, lon]: [number, number]) {
  const f = (v: number, pos: string, neg: string) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? pos : neg}`
  return `${f(lat, 'N', 'S')}, ${f(lon, 'E', 'W')}`
}

// A tiny optimised copy is enough to read the photo's tones
const sampleUrl = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=64&q=75`

export function Gallery({ photos }: { photos: Photo[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const count = photos.length
    const cells = COLS * ROWS

    // Per-photo luminance (0 dark → 1 light), filled in as samples load
    const lum: (Float32Array | null)[] = photos.map(() => null)
    // Per-dot scatter origin and delay for the intro, shared by every slide
    const scatterX = new Float32Array(cells)
    const scatterY = new Float32Array(cells)
    const delay = new Float32Array(cells)
    for (let i = 0; i < cells; i++) {
      scatterX[i] = Math.random() * 2 - 0.5
      scatterY[i] = Math.random() * 2 - 0.5
      delay[i] = Math.random() * INTRO_STAGGER_MS
    }

    let introStart = reduceMotion ? -Infinity : 0
    let fg = ''
    let darkTheme = false
    let dirty = true
    let raf = 0
    let current = 0

    const readTheme = () => {
      fg = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim()
      darkTheme = document.documentElement.classList.contains('dark')
      dirty = true
    }
    readTheme()

    photos.forEach((photo, index) => {
      const img = new window.Image()
      img.onload = () => {
        const off = document.createElement('canvas')
        off.width = COLS
        off.height = ROWS
        const octx = off.getContext('2d', { willReadFrequently: true })
        if (!octx) return
        octx.drawImage(img, 0, 0, COLS, ROWS)
        const { data } = octx.getImageData(0, 0, COLS, ROWS)
        const values = new Float32Array(cells)
        for (let i = 0; i < cells; i++) {
          values[i] = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255
        }
        lum[index] = values
        dirty = true
      }
      img.src = sampleUrl(photo.src)
    })

    const sizeCanvas = (canvas: HTMLCanvasElement) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    canvasRefs.current.forEach((c) => c && sizeCanvas(c))

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const introElapsed = introStart ? now - introStart : 0
      const introRunning = introStart > 0 && introElapsed < DEVELOP_DELAY_MS + 600
      if (!dirty && !introRunning) return
      dirty = false

      const trackRect = track.getBoundingClientRect()
      const centre = trackRect.left + trackRect.width / 2
      let nearest = 0
      let nearestDist = Infinity

      for (let s = 0; s < count; s++) {
        const slide = slideRefs.current[s]
        const canvas = canvasRefs.current[s]
        const photoEl = imageRefs.current[s]
        if (!slide || !canvas || !photoEl) continue

        const rect = slide.getBoundingClientRect()
        const dist = Math.abs(rect.left + rect.width / 2 - centre)
        if (dist < nearestDist) {
          nearestDist = dist
          nearest = s
        }

        // Skip slides well outside the track
        if (rect.right < trackRect.left - rect.width || rect.left > trackRect.right + rect.width) continue

        // How centred this slide is: 1 in the middle, 0 a slide-width away. The photo
        // only develops over the last stretch so mid-swipe frames stay clean.
        const focus = clamp01(1 - dist / rect.width)
        const develop = introStart ? clamp01((introElapsed - DEVELOP_DELAY_MS) / 600) : 0
        const reveal = easeInOut(clamp01((focus - 0.55) / 0.4)) * (reduceMotion ? 1 : develop)
        photoEl.style.opacity = String(reveal)

        const ctx = canvas.getContext('2d')
        if (!ctx) continue
        const w = rect.width
        const h = rect.height
        ctx.clearRect(0, 0, w, h)
        const tones = lum[s]
        if (!tones || reveal >= 0.999) continue

        // Dots shrink away as the photo develops through them
        const cellW = w / COLS
        const cellH = h / ROWS
        const maxR = Math.min(cellW, cellH) * 0.46 * Math.pow(1 - reveal, 1.5)
        ctx.fillStyle = fg
        ctx.globalAlpha = 0.85
        ctx.beginPath()
        for (let i = 0; i < cells; i++) {
          const tone = darkTheme ? tones[i] : 1 - tones[i]
          const r = maxR * tone
          if (r < 0.25) continue
          let x = ((i % COLS) + 0.5) * cellW
          let y = (Math.floor(i / COLS) + 0.5) * cellH
          if (!reduceMotion) {
            const t = introStart ? easeInOut(clamp01((introElapsed - delay[i]) / INTRO_MS)) : 0
            if (t < 1) {
              x = scatterX[i] * w + (x - scatterX[i] * w) * t
              y = scatterY[i] * h + (y - scatterY[i] * h) * t
            }
          }
          ctx.moveTo(x + r, y)
          ctx.arc(x, y, r, 0, Math.PI * 2)
        }
        ctx.fill()
      }

      if (nearest !== current) {
        current = nearest
        setActive(nearest)
      }
    }

    const markDirty = () => {
      dirty = true
    }

    // Start the intro the first time the gallery is properly on screen; only
    // animate while it is visible
    const visibility = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf)
        if (!entry.isIntersecting) return
        if (introStart === 0) introStart = performance.now()
        dirty = true
        raf = requestAnimationFrame(frame)
      },
      { threshold: 0.35 },
    )
    visibility.observe(track)

    const sizeObserver = new ResizeObserver(() => {
      canvasRefs.current.forEach((c) => c && sizeCanvas(c))
      dirty = true
    })
    sizeObserver.observe(track)

    const themeObserver = new MutationObserver(readTheme)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    track.addEventListener('scroll', markDirty, { passive: true })

    // Mouse drag to scroll (touch and trackpads already scroll natively)
    let dragging = false
    let lastX = 0
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      dragging = true
      lastX = e.clientX
      track.style.scrollSnapType = 'none'
      track.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      track.scrollLeft -= e.clientX - lastX
      lastX = e.clientX
    }
    const onUp = () => {
      if (!dragging) return
      dragging = false
      // Settle on the nearest slide, then hand back to CSS snapping
      const slide = slideRefs.current[current]
      if (slide) {
        const target = slide.offsetLeft + slide.offsetWidth / 2 - track.clientWidth / 2
        track.scrollTo({ left: target, behavior: reduceMotion ? 'auto' : 'smooth' })
      }
      window.setTimeout(() => (track.style.scrollSnapType = ''), 400)
    }
    track.addEventListener('pointerdown', onDown)
    track.addEventListener('pointermove', onMove)
    track.addEventListener('pointerup', onUp)
    track.addEventListener('pointercancel', onUp)

    return () => {
      cancelAnimationFrame(raf)
      visibility.disconnect()
      sizeObserver.disconnect()
      themeObserver.disconnect()
      track.removeEventListener('scroll', markDirty)
      track.removeEventListener('pointerdown', onDown)
      track.removeEventListener('pointermove', onMove)
      track.removeEventListener('pointerup', onUp)
      track.removeEventListener('pointercancel', onUp)
    }
  }, [photos])

  const go = (index: number) => {
    const track = trackRef.current
    const slide = slideRefs.current[index]
    if (!track || !slide) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({
      left: slide.offsetLeft + slide.offsetWidth / 2 - track.clientWidth / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  const photo = photos[active]

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Photographs" className="@container">
      {/* Padding of half the leftover width lets the first and last slides sit centred */}
      <div
        ref={trackRef}
        tabIndex={0}
        className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[14cqw] outline-none active:cursor-grabbing sm:px-[20cqw]"
      >
        {photos.map((p, i) => (
          <div
            key={p.src}
            ref={(el) => {
              slideRefs.current[i] = el
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${photos.length}: ${p.location}`}
            className="relative aspect-[3/4] w-[72cqw] shrink-0 snap-center sm:w-[60cqw]"
          >
            <div
              ref={(el) => {
                imageRefs.current[i] = el
              }}
              className="absolute inset-0 opacity-0"
            >
              <Image
                src={p.src}
                alt={p.location}
                fill
                draggable={false}
                sizes="(max-width: 640px) 72vw, 400px"
                className="select-none object-cover"
              />
            </div>
            <canvas
              ref={(el) => {
                canvasRefs.current[i] = el
              }}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 size-full"
            />
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div key={active} className="enter min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted tabular-nums">
            {String(active + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
          </p>
          <p className="mt-1.5 text-sm text-foreground">{photo.location}</p>
          {photo.coords && (
            <p className="mt-0.5 font-mono text-[11px] text-muted tabular-nums">{formatCoords(photo.coords)}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ArrowButton direction="prev" disabled={active === 0} onClick={() => go(active - 1)} />
          <ArrowButton direction="next" disabled={active === photos.length - 1} onClick={() => go(active + 1)} />
        </div>
      </div>
    </div>
  )
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous photograph' : 'Next photograph'}
      className="pressable group flex size-9 cursor-pointer items-center justify-center rounded-full border border-border text-muted hover:text-foreground disabled:cursor-default disabled:opacity-30 disabled:hover:text-muted"
    >
      <svg
        viewBox="0 0 24 24"
        className={`size-4 transition-transform duration-200 ease-(--ease-out) ${
          direction === 'prev' ? 'rotate-180 group-enabled:group-hover:-translate-x-0.5' : 'group-enabled:group-hover:translate-x-0.5'
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  )
}
