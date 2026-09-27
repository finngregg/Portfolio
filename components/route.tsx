import type { CSSProperties } from 'react'

// Stops sit on a shared baseline, ordered south → north. viewBox is 600 × 160.
const BASELINE = 130

const stops = [
  { id: 'cpt', label: 'Cape Town', x: 60, delay: 1.0 },
  { id: 'jhb', label: 'Johannesburg', x: 200, delay: 0.2 },
  { id: 'tlv', label: 'Tel Aviv', x: 540, delay: 3.1, current: true },
] as const

// The journey in order: grew up in Joburg, uni in Cape Town, back to Joburg, then Tel Aviv
const legs = [
  { d: `M200 ${BASELINE} Q130 80 60 ${BASELINE}`, delay: 0.4, dur: 0.7 },
  { d: `M60 ${BASELINE} Q130 40 200 ${BASELINE}`, delay: 1.2, dur: 0.7 },
  { d: `M200 ${BASELINE} Q370 -20 540 ${BASELINE}`, delay: 2.0, dur: 1.2 },
]

const vars = (v: Record<string, string>) => v as CSSProperties

export function Route() {
  return (
    <div className="relative pb-10" aria-hidden="true">
      <div className="relative aspect-[600/160] w-full">
        <svg viewBox="0 0 600 160" className="absolute inset-0 size-full overflow-visible">
          {legs.map((leg) => (
            <path
              key={leg.d}
              d={leg.d}
              pathLength={1}
              fill="none"
              stroke="var(--muted)"
              strokeWidth={1}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className="route-leg"
              style={vars({ '--delay': `${leg.delay}s`, '--dur': `${leg.dur}s` })}
            />
          ))}
          {stops.map((stop) => (
            <g
              key={stop.id}
              data-stop={stop.id}
              className="route-pop"
              style={vars({ '--delay': `${stop.delay}s` })}
            >
              {'current' in stop && (
                <circle
                  cx={stop.x}
                  cy={BASELINE}
                  r={4}
                  fill="var(--foreground)"
                  className="route-pulse"
                  style={vars({ '--delay': `${stop.delay + 0.3}s` })}
                />
              )}
              <circle
                cx={stop.x}
                cy={BASELINE}
                r={4}
                fill="var(--foreground)"
                className="route-stop"
              />
            </g>
          ))}
        </svg>

        {stops.map((stop) => (
          <span
            key={stop.id}
            data-stop={stop.id}
            className="route-label absolute -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.15em] text-muted"
            style={{
              left: `${(stop.x / 600) * 100}%`,
              top: `calc(${(BASELINE / 160) * 100}% + 14px)`,
              ...vars({ '--delay': `${stop.delay}s` }),
            }}
          >
            {stop.label}
          </span>
        ))}
      </div>
    </div>
  )
}
