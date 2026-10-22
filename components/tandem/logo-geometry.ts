// The Tandem mark as a dot field, ported from Tandem's src/components/dot-logo/geometry.ts.
// Coordinates are in the mark's own 120×120 space, centred on 0.

// Two chevrons: the front one solid, the back one at 0.4
export const BACK_ALPHA = 0.4

export type MarkDot = { x: number; y: number; alpha: number }

// Built row by row on the dot grid, not traced from an outline, so every row steps one
// dot towards the point. The front chevron is always 6 dots wide and the back shows 4
// beyond it; the first few rows at each end narrow to round the arm ends.
const ROWS = 25
const TIP = (ROWS - 1) / 2

export function markDots(spacing = 3): MarkDot[] {
  const dots: MarkDot[] = []
  const lastCol = TIP + 6
  for (let r = 0; r < ROWS; r++) {
    const k = TIP - Math.abs(r - TIP) // 0 at the arm ends, 12 at the tip
    const y = (r - TIP) * spacing
    const front = [Math.max(k - 3, 0), k + 2]
    const back = [Math.max(k + 3, 4), k + 6]
    for (let col = front[0]; col <= back[1]; col++) {
      const x = (col - lastCol / 2) * spacing
      if (col >= front[0] && col <= front[1]) dots.push({ x, y, alpha: 1 })
      else if (col >= back[0]) dots.push({ x, y, alpha: BACK_ALPHA })
    }
  }
  return dots
}

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

// Same timeline as the globe: each dot travels FORM_MS, start times spread over STAGGER_MS
export const FORM_MS = 1400
export const STAGGER_MS = 600
