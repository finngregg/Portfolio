'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Segmented } from './segmented'

// A session's photos as one rounded tile, from FeedTile in Tandem's FeedCard.tsx: the
// first photo leads at two thirds with two stacked beside it, the last saying how many
// more. Two equal thirds of the width minus the gap is just `2fr 1fr`.

const library = [
  '/images/cape-town-clifton-beach.jpg',
  '/images/tel-aviv-wing-foiling.jpg',
  '/images/cape-town-golden-hour.jpg',
  '/images/kyoto-kamo-river.jpg',
  '/images/cape-town-sunset-rocks.jpg',
  '/images/copenhagen-rundetarn.jpg',
]

function Photo({ src, more = 0 }: { src: string; more?: number }) {
  return (
    <div className="relative h-full w-full">
      <Image src={src} alt="" fill sizes="(min-width: 672px) 420px, 66vw" className="object-cover" />
      {more > 0 ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-base font-medium text-white">
          +{more}
        </div>
      ) : null}
    </div>
  )
}

export function FeedTile({ photos }: { photos: string[] }) {
  if (!photos.length) return null
  const rest = photos.slice(1)
  const besides = !rest.length ? null : rest.length === 1 ? (
    <Photo src={rest[0]} />
  ) : (
    <div className="grid h-full grid-rows-2 gap-[3px]">
      <Photo src={rest[0]} />
      <Photo src={rest[1]} more={rest.length - 2} />
    </div>
  )
  return (
    <div
      role="img"
      aria-label={`${photos.length} photo${photos.length === 1 ? '' : 's'}`}
      className="grid aspect-[100/66] w-full gap-[3px] overflow-hidden rounded-xl"
      style={{ gridTemplateColumns: besides ? '2fr 1fr' : '1fr' }}
    >
      <div className="min-w-0 overflow-hidden">
        <Photo src={photos[0]} />
      </div>
      {besides ? <div className="min-w-0 overflow-hidden">{besides}</div> : null}
    </div>
  )
}

const counts = ['1', '2', '3', '4', '6'] as const

export function PhotoCollage() {
  const [count, setCount] = useState<(typeof counts)[number]>('4')
  return (
    <div className="w-full">
      <FeedTile photos={library.slice(0, Number(count))} />
      <div className="mt-4 flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Photos</span>
        <Segmented label="Photos" width={36} options={counts.map((c) => ({ id: c, label: c }))} value={count} onChange={setCount} />
      </div>
    </div>
  )
}
