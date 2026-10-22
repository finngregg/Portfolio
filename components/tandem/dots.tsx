import type { CSSProperties } from 'react'
import { DotLogo } from './dot-logo'

// Loading states built from the same dots as the logo, so waiting feels like part of
// the brand rather than a stock spinner. There are no spinners anywhere in Tandem.

/** Inline "working": three dots pulsing in turn, for buttons and rows */
export function DotPulse({ size = 5, className }: { size?: number; className?: string }) {
  return (
    <span
      role="progressbar"
      aria-label="Working"
      className={`dot-pulse inline-flex items-center ${className ?? ''}`}
      style={{ gap: size, '--dot-size': `${size}px` } as CSSProperties}
    >
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ '--i': i } as CSSProperties} />
      ))}
    </span>
  )
}

/** Full-area loading: the mark, already formed, shimmering harder than at rest */
export function DotLoader() {
  return (
    <div role="progressbar" aria-label="Loading" className="flex items-center justify-center py-12 text-muted">
      <DotLogo size={84} markSize={100} startFormed tappable={false} shimmer={0.7} />
    </div>
  )
}
