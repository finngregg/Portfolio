'use client'

import { useEffect, useRef } from 'react'

export type ReelClip = { src: string; poster: string; label: string; caption: string }

// A muted, looping clip that plays only while on screen. With reduced motion it waits
// on its poster frame and shows controls instead.
export function Reel({ src, poster, label, caption }: ReelClip) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    // Waiting on the poster frame, so the viewer needs a way to start it
    const still = () => (video.controls = true)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return void still()
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(still)
        else video.pause()
      },
      { threshold: 0.4 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])

  return (
    <figure>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        className="aspect-[9/16] w-full rounded-xl border border-border bg-muted-bg object-cover"
      />
      <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{caption}</figcaption>
    </figure>
  )
}

export function Reels({ clips }: { clips: ReelClip[] }) {
  return (
    // A lone clip takes one column's width, centred, rather than sitting off to one side
    <div className={`my-10 grid gap-3 sm:gap-4 ${clips.length > 1 ? 'grid-cols-2' : 'mx-auto w-1/2'}`}>
      {clips.map((c) => (
        <Reel key={c.src} {...c} />
      ))}
    </div>
  )
}
