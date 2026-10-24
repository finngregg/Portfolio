'use client'

import { useState, type CSSProperties } from 'react'
import { Segmented } from './segmented'

// The story card, ported from Tandem's ShareCard.tsx: a session as an Instagram story.
// Dots draws the splits as columns of dots, taller for faster, the fastest in full ink;
// Ledger lists every split on a dotted line, like a receipt. Laid out at the app's
// 360 × 640 in container units, so it scales as one.

const W = 360
const u = (n: number) => `calc(${n} * 100cqw / ${W})`

// A 10.1 km run, seconds per km
const SPLITS = [318, 315, 314, 313, 312, 311, 309, 308, 306, 303]
const FAST = Math.min(...SPLITS)
const SLOW = Math.max(...SPLITS)
const ROWS = 8
const pace = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

const THEMES = {
  dark: { ground: '#0D0D0D', ink: '#EEEEEE', muted: '#8C8C8C', off: '#232323', line: 'rgba(238,238,238,0.18)' },
  light: { ground: '#F7F7F5', ink: '#0D0D0D', muted: '#6B6B6B', off: '#E4E4E1', line: 'rgba(13,13,13,0.16)' },
}

export function StoryCard() {
  const [style, setStyle] = useState<'dots' | 'ledger'>('dots')
  const [tone, setTone] = useState<'dark' | 'light'>('dark')
  const c = THEMES[tone]
  const mono = (size: number, color: string): CSSProperties => ({ fontSize: u(size), letterSpacing: '0.15em', color, transition: 'color 0.3s ease' })
  const lit = (s: number) => Math.max(2, Math.round(2 + ((SLOW - s) / (SLOW - FAST)) * (ROWS - 2)))

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
      <div
        className="@container relative aspect-[9/16] w-full max-w-[300px] shrink-0 overflow-hidden rounded-xl border border-border"
        style={{ background: c.ground, transition: 'background 0.3s ease' }}
        role="img"
        aria-label={`A story card for a 10.1 km run, ${style === 'dots' ? 'with the splits as columns of dots' : 'with every split listed'}`}
      >
        {style === 'dots' ? (
          <>
            <div className="absolute flex justify-between font-mono uppercase" style={{ top: u(66), left: u(28), right: u(28) }}>
              <span style={mono(8.5, c.ink)}>Tandem</span>
              <span style={mono(8.5, c.muted)}>Cape Town · Tue 20 Oct</span>
            </div>
            <div className="absolute flex items-end justify-between" style={{ top: u(112), left: u(28), right: u(28), height: u(170) }}>
              {SPLITS.map((s, i) => (
                <span key={i} className="flex flex-col-reverse" style={{ gap: u(14) }}>
                  {Array.from({ length: ROWS }, (_, r) => (
                    <span
                      key={r}
                      className="rounded-full"
                      style={{
                        width: u(9),
                        height: u(9),
                        background: r < lit(s) ? (s === FAST ? c.ink : c.muted) : c.off,
                        transition: 'background 0.3s ease',
                      }}
                    />
                  ))}
                </span>
              ))}
            </div>
            <div className="absolute flex justify-between font-mono uppercase" style={{ top: u(294), left: u(28), right: u(28) }}>
              <span style={mono(7.5, c.muted)}>Splits</span>
              <span style={mono(7.5, c.ink)}>Fastest 5:03 · km 10</span>
            </div>
            <div className="absolute" style={{ left: u(28), right: u(28), bottom: u(124), color: c.ink, transition: 'color 0.3s ease' }}>
              <div className="flex items-baseline">
                <span className="font-medium" style={{ fontSize: u(96), lineHeight: 1, letterSpacing: '-0.054em' }}>
                  10.1
                </span>
                <span className="font-mono uppercase" style={{ ...mono(11, c.ink), marginLeft: u(8) }}>
                  km
                </span>
              </div>
              <div className="font-medium" style={{ fontSize: u(17), marginTop: u(6) }}>
                Sunset run, Sea Point
              </div>
              <div className="grid grid-cols-3" style={{ borderTop: `1px solid ${c.line}`, marginTop: u(16) }}>
                {[
                  ['52:14', 'Time'],
                  ['5:10', 'Per km'],
                  ['158', 'Avg bpm'],
                ].map(([value, label], i) => (
                  <div key={label} style={{ paddingTop: u(12), paddingLeft: i ? u(12) : 0, borderLeft: i ? `1px solid ${c.line}` : undefined }}>
                    <div className="font-medium" style={{ fontSize: u(19) }}>
                      {value}
                    </div>
                    <div className="font-mono uppercase" style={{ ...mono(7.5, c.muted), marginTop: u(4) }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="absolute flex flex-col" style={{ top: u(66), left: u(28), right: u(28), bottom: u(120), color: c.ink }}>
            <div className="text-center font-mono uppercase" style={mono(9, c.ink)}>
              Tandem
            </div>
            <div className="text-center font-mono uppercase" style={{ ...mono(7.5, c.muted), marginTop: u(6) }}>
              Tue 20 Oct · 17:42 · Cape Town
            </div>
            <div className="text-center font-medium" style={{ fontSize: u(19), marginTop: u(26) }}>
              Sunset run, Sea Point
            </div>
            <div style={{ borderTop: `1.4px dashed ${c.line}`, marginTop: u(16), marginBottom: u(4) }} />
            {SPLITS.map((s, i) => (
              <div key={i} className="flex items-end font-mono uppercase" style={{ marginTop: u(10) }}>
                <span style={mono(8, s === FAST ? c.ink : c.muted)}>Km {String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1" style={{ borderBottom: `1.4px dotted ${c.line}`, margin: `0 ${u(6)} ${u(3)}` }} />
                <span style={mono(8, s === FAST ? c.ink : c.muted)}>{pace(s)}</span>
              </div>
            ))}
            <div style={{ borderTop: `1.4px dashed ${c.line}`, marginTop: u(14) }} />
            <div className="flex-1" />
            <div className="flex items-baseline justify-between">
              <span className="font-mono uppercase" style={mono(9, c.ink)}>
                Total
              </span>
              <span className="font-medium" style={{ fontSize: u(52), letterSpacing: '-0.046em' }}>
                10.1 km
              </span>
            </div>
          </div>
        )}
        <div className="absolute flex justify-between font-mono uppercase" style={{ left: u(28), right: u(28), bottom: u(86) }}>
          <span style={mono(7.5, c.ink)}>With Ava and Lucas</span>
          <span style={mono(7, c.muted)}>trainintandem.com</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Segmented
          label="Style"
          options={[
            { id: 'dots', label: 'Dots' },
            { id: 'ledger', label: 'Ledger' },
          ]}
          value={style}
          onChange={setStyle}
        />
        <Segmented
          label="Card"
          options={[
            { id: 'dark', label: 'Dark' },
            { id: 'light', label: 'Light' },
          ]}
          value={tone}
          onChange={setTone}
        />
      </div>
    </div>
  )
}
