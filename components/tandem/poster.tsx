'use client'

import { Archivo_Black } from 'next/font/google'
import Image from 'next/image'
import { useState, type CSSProperties } from 'react'
import { Segmented } from './segmented'

const wide = Archivo_Black({ weight: '400', subsets: ['latin'] })

// A session photo as a poster, ported from Tandem's PhotoStory.tsx: the photo, then heavy
// type and the route, then the runners cut out of the photo on top, so the type sits
// behind them. Laid out at the app's 360 × 640 in container units, so it scales as one.
// The cut-out was made with Apple's Vision framework (scripts/tandem-media.sh).

const W = 360
const u = (n: number) => `calc(${n} * 100cqw / ${W})`

// Where the runners stand in the cut-out: the type sits behind their upper body
const PEOPLE_TOP = 299
const PEOPLE_H = 232
const TYPE_Y = Math.min(470, Math.max(120, PEOPLE_TOP + PEOPLE_H * 0.12 - 30))

const LIME = '#D6F53A'

// A loose hand-drawn line where the route goes, as the app draws one without GPS
const route = [0, 0.12, 0.3, 0.5, 0.7, 0.88, 1]
  .map((t, i) => `${130 + 100 * (0.1 + t * 0.8 + (i % 2 ? 0.04 : -0.04))},${96 + 86 * t}`)
  .join(' ')

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
  const [accent, setAccent] = useState<'white' | 'lime'>('lime')
  const [depth, setDepth] = useState<'on' | 'off'>('on')

  const ink = accent === 'lime' ? LIME : '#FFFFFF'
  // Black and white is the same photo through a filter, so the switch can cross-fade
  const tone: CSSProperties = {
    filter: look === 'mono' ? 'grayscale(1) contrast(1.08)' : 'none',
    transition: 'filter 0.3s ease, opacity 0.3s ease',
  }
  const mono = (size: number, color: string): CSSProperties => ({
    fontSize: u(size),
    letterSpacing: '0.16em',
    color,
    transition: 'color 0.3s ease',
  })

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
      <div
        className="@container relative aspect-[9/16] w-full max-w-[300px] shrink-0 overflow-hidden rounded-xl bg-[#0D0D0D]"
        role="img"
        aria-label="Poster from a 10.1 km sunset run at Sea Point: two runners in front of the distance in heavy type"
      >
        <Image src="/tandem/sea-point.webp" alt="" fill sizes="300px" className="object-cover" style={tone} />

        <p className="absolute inset-x-0 text-center font-mono uppercase" style={{ top: u(60), ...mono(9, ink) }}>
          Tue 20 Oct // 17:42
        </p>
        <svg viewBox={`0 0 ${W} 640`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          <polyline points={route} fill="none" stroke="#FFFFFF" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p
          className={`${wide.className} absolute text-center leading-none whitespace-nowrap`}
          style={{ top: u(TYPE_Y), left: u(18), right: u(18), fontSize: u(50), letterSpacing: u(-1.5), color: ink, transition: 'color 0.3s ease' }}
        >
          10.1 KM
        </p>
        <div
          className={`${wide.className} absolute flex justify-between`}
          style={{ top: u(TYPE_Y + 58), left: u(32), right: u(32), fontSize: u(12), color: ink, transition: 'color 0.3s ease' }}
        >
          <span>5&apos;10&quot;</span>
          <span>52 MIN</span>
          <span>158 BPM</span>
        </div>

        <Image
          src="/tandem/sea-point-people.webp"
          alt=""
          fill
          sizes="300px"
          className="pointer-events-none object-cover"
          style={{ ...tone, opacity: depth === 'on' ? 1 : 0 }}
        />

        <div className="absolute inset-x-0 flex items-center justify-center" style={{ bottom: u(30), gap: u(8) }}>
          <TandemDots />
          <span className="font-mono uppercase" style={mono(8.5, '#FFFFFF')}>
            Tandem · Sea Point
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
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
          label="Type colour"
          options={[
            { id: 'white', label: 'White' },
            { id: 'lime', label: 'Lime' },
          ]}
          value={accent}
          onChange={setAccent}
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
      </div>
    </div>
  )
}
