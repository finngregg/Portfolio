'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export type Photo = {
  src: string
  location: string
  coords?: [lat: number, lon: number]
}

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

// Off-centre photos sit back in black and white; the centred one comes forward in colour.
// Everything is driven by scroll position, so the transition follows the finger exactly.
function applyFocus(el: HTMLElement, focus: number) {
  const f = easeInOut(focus)
  el.style.filter = `grayscale(${1 - f})`
  el.style.opacity = String(0.55 + 0.45 * f)
  el.style.transform = `scale(${0.94 + 0.06 * f})`
}

function formatCoords([lat, lon]: [number, number]) {
  const f = (v: number, pos: string, neg: string) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? pos : neg}`
  return `${f(lat, 'N', 'S')}, ${f(lon, 'E', 'W')}`
}

export function Gallery({ photos }: { photos: Photo[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const frameRefs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let current = 0
    let raf = 0

    const update = () => {
      raf = 0
      const trackRect = track.getBoundingClientRect()
      const centre = trackRect.left + trackRect.width / 2
      let nearest = 0
      let nearestDist = Infinity

      slideRefs.current.forEach((slide, i) => {
        const frame = frameRefs.current[i]
        if (!slide || !frame) return
        const rect = slide.getBoundingClientRect()
        const dist = Math.abs(rect.left + rect.width / 2 - centre)
        if (dist < nearestDist) {
          nearestDist = dist
          nearest = i
        }
        applyFocus(frame, clamp01(1 - dist / rect.width))
      })

      if (nearest !== current) {
        current = nearest
        setActive(nearest)
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()

    track.addEventListener('scroll', schedule, { passive: true })
    const sizeObserver = new ResizeObserver(schedule)
    sizeObserver.observe(track)

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
      sizeObserver.disconnect()
      track.removeEventListener('scroll', schedule)
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
            className="aspect-[3/4] w-[72cqw] shrink-0 snap-center sm:w-[60cqw]"
          >
            <div
              ref={(el) => {
                frameRefs.current[i] = el
              }}
              // Matches the resting state before the first measurement, so nothing flashes
              style={i === 0 ? undefined : { filter: 'grayscale(1)', opacity: 0.55, transform: 'scale(0.94)' }}
              className="relative size-full will-change-transform"
            >
              <Image
                src={p.src}
                alt={p.location}
                fill
                draggable={false}
                priority={i === 0}
                sizes="(max-width: 640px) 72vw, 400px"
                className="select-none object-cover"
              />
            </div>
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
        <div className="-mr-2 flex shrink-0 items-center">
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
      className="pressable group flex size-10 cursor-pointer items-center justify-center text-muted hover:text-foreground disabled:cursor-default disabled:opacity-30 disabled:hover:text-muted"
    >
      <svg
        viewBox="0 0 24 24"
        className={`size-5 transition-transform duration-200 ease-(--ease-out) ${
          direction === 'prev' ? 'rotate-180 group-enabled:group-hover:-translate-x-1' : 'group-enabled:group-hover:translate-x-1'
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 12h16M14 6l6 6-6 6" />
      </svg>
    </button>
  )
}
