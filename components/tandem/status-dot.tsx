import type { CSSProperties } from 'react'

// The live marker: a solid dot whose ring grows to 3.5x and fades from 50% to 0 every
// 2.4s (styles in globals.css). `live` turns it green, for anything happening now.
export function StatusDot({ live, size, label }: { live?: boolean; size?: number; label?: string }) {
  return (
    <span
      className="status-dot"
      data-live={live || undefined}
      style={size ? ({ '--dot-size': `${size}px` } as CSSProperties) : undefined}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  )
}
