'use client'

import { useRef, useState, type PointerEvent } from 'react'
import { DotPulse } from './dots'

// Three small pieces of Tandem's interface, ported from the app: the pull-to-refresh
// dots (PullRefresh.tsx), the Vouch pill (WhoCame.tsx) and the unread count on the
// bell (IconButton badge).

// ── Pull to refresh ─────────────────────────────────────────────────────────

const TRIGGER = 64
const DOT_GAP = 18

/** Pull the list down: the dots arrive one by one as you pull, then pulse while it refreshes */
export function PullDots() {
  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const start = useRef<number | null>(null)

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (refreshing) return
    e.currentTarget.setPointerCapture(e.pointerId)
    start.current = e.clientY
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (start.current == null) return
    // Resistance, as a scroll view gives: the further you pull, the less it moves
    const d = Math.max(0, e.clientY - start.current)
    setPull(Math.min(110, d * 0.55))
  }
  const onUp = () => {
    if (start.current == null) return
    start.current = null
    if (pull >= TRIGGER) {
      setRefreshing(true)
      setPull(44)
      setTimeout(() => {
        setRefreshing(false)
        setPull(0)
      }, 1400)
    } else setPull(0)
  }

  return (
    <div className="w-full max-w-[280px]">
      <div
        className="relative h-[230px] cursor-grab touch-none select-none overflow-hidden rounded-2xl border border-border bg-background active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className="absolute inset-x-0 top-0 flex h-[44px] items-center justify-center text-muted">
          {refreshing ? (
            <DotPulse />
          ) : (
            <span className="flex" style={{ gap: 5 }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-[5px] rounded-full bg-current"
                  style={{ opacity: Math.min(1, Math.max(0, (pull - 8 - i * DOT_GAP) / DOT_GAP)), transform: `scale(${0.6 + 0.4 * Math.min(1, Math.max(0, (pull - 8 - i * DOT_GAP) / DOT_GAP))})` }}
                />
              ))}
            </span>
          )}
        </div>
        <div
          className="absolute inset-x-0 top-0 bg-background px-4"
          style={{ transform: `translateY(${pull}px)`, transition: start.current == null ? 'transform 0.45s var(--ease-out)' : 'none' }}
        >
          {['Sunset 10K on the prom', 'Doubles after work', 'Reformer, all levels', 'Long run to Clifton'].map((t, i) => (
            <div key={t} className="border-b border-border py-3">
              <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">{['Today 18:00', 'Today 18:30', 'Sun 07:00', 'Sat 06:30'][i]}</div>
              <div className="mt-1 text-[13px] text-foreground">{t}</div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Pull the list down</p>
    </div>
  )
}

// ── Vouch ───────────────────────────────────────────────────────────────────

/** One vouch per person: tap to vouch, tap again to take it back, quietly */
export function VouchPill() {
  const [on, setOn] = useState(false)
  const count = 7 + (on ? 1 : 0)
  return (
    <div className="w-full max-w-[320px]">
      <div className="flex items-center gap-3 border-y border-border py-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-muted-bg font-mono text-[11px] text-muted">A</span>
        <div className="flex-1">
          <div className="text-[14px] text-foreground">Ava Fischer</div>
          <div className="text-[12px] text-muted">Workout · Apple Watch</div>
        </div>
        <button
          type="button"
          onClick={() => setOn(!on)}
          aria-pressed={on}
          className={`pressable h-[30px] rounded-full border px-3.5 text-[13px] transition-colors duration-200 ${on ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground'}`}
        >
          {on ? 'Vouched' : 'Vouch'}
        </button>
      </div>
      <p key={count} className="pin-in mt-4 text-center text-[13px] text-muted">
        Vouched for by <span className="text-foreground tabular-nums">{count}</span> partners
      </p>
    </div>
  )
}

// ── Unread count ────────────────────────────────────────────────────────────

/** Unread is a number on the bell, never a dot; past nine it says 9+. Opening it clears it at once */
export function UnreadBell() {
  const [n, setN] = useState(3)
  return (
    <div className="flex flex-col items-center gap-5">
      <button
        type="button"
        onClick={() => setN(0)}
        aria-label={n ? `Notifications, ${n} unread` : 'Notifications'}
        className="pressable relative flex size-12 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-[0_6px_18px_-8px_rgba(0,0,0,0.25)]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </svg>
        {n ? (
          <span key={n > 9 ? '9+' : n} className="pin-in absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-foreground px-1 font-mono text-[10px] tabular-nums text-background ring-2 ring-background">
            {n > 9 ? '9+' : n}
          </span>
        ) : null}
      </button>
      <button type="button" onClick={() => setN(n + 1)} className="pressable rounded-full border border-border px-3 py-1.5 text-xs text-foreground">
        Send one
      </button>
    </div>
  )
}
