'use client'

import { useEffect, useRef, useState } from 'react'
import { Globe, type GlobeMode } from '@/components/globe/globe'
import { COUNTRIES, REGIONS } from '@/lib/places'

export type LivedPlace = {
  city: string
  years: string
  place: string
  what: string
}

const TABS: { id: GlobeMode; label: string }[] = [
  { id: 'lived', label: 'Where I’ve lived' },
  { id: 'been', label: 'Where I’ve been' },
]

export function Travels({ lived }: { lived: LivedPlace[] }) {
  const [mode, setMode] = useState<GlobeMode>('lived')
  // Tapped/clicked place the globe holds on (touch devices have no hover)
  const [selected, setSelected] = useState<string | null>(null)
  const toggle = (id: string) => setSelected((s) => (s === id ? null : id))
  const switchMode = (next: GlobeMode) => {
    setMode(next)
    setSelected(null)
  }
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const indicatorRef = useRef<HTMLSpanElement>(null)

  // Slide the underline to the active tab
  useEffect(() => {
    const tab = tabRefs.current[TABS.findIndex((t) => t.id === mode)]
    const indicator = indicatorRef.current
    if (!tab || !indicator) return
    indicator.style.width = `${tab.offsetWidth}px`
    indicator.style.transform = `translateX(${tab.offsetLeft}px)`
  }, [mode])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    const next = TABS[(TABS.findIndex((t) => t.id === mode) + 1) % TABS.length]
    switchMode(next.id)
    tabRefs.current[TABS.indexOf(next)]?.focus()
  }

  return (
    <>
      <div role="tablist" aria-label="Places" className="relative flex gap-6 border-b border-border" onKeyDown={onKeyDown}>
        {TABS.map((tab, i) => {
          const selected = tab.id === mode
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => switchMode(tab.id)}
              className={`pressable cursor-pointer pb-3 font-mono text-[11px] uppercase tracking-[0.15em] ${
                selected ? 'text-foreground' : 'text-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
        <span
          ref={indicatorRef}
          aria-hidden="true"
          className="absolute -bottom-px left-0 h-px w-0 bg-foreground transition-[transform,width] duration-300 ease-(--ease-out)"
        />
      </div>

      <div className="mt-8">
        <Globe mode={mode} selected={selected} onSpin={() => setSelected(null)} />
        <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
          Drag to spin
        </p>
      </div>

      <div key={mode} role="tabpanel" id={`panel-${mode}`} aria-labelledby={`tab-${mode}`} className="enter mt-10">
        {mode === 'lived' ? (
          <LivedList lived={lived} selected={selected} onSelect={toggle} />
        ) : (
          <BeenList selected={selected} onSelect={toggle} />
        )}
      </div>
    </>
  )
}

type SelectProps = { selected: string | null; onSelect: (id: string) => void }

function LivedList({ lived, selected, onSelect }: { lived: LivedPlace[] } & SelectProps) {
  return (
    <ol className="border-t border-border">
      {lived.map((p) => {
        const isSelected = selected === p.city
        return (
          <li key={p.years} data-city={p.city} className="border-b border-border">
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(p.city)}
              className="group grid w-full cursor-pointer gap-1 py-5 text-left sm:grid-cols-[8rem_1fr] sm:gap-6"
            >
              <span className="font-mono text-xs text-muted tabular-nums">{p.years}</span>
              <span>
                <span className="hover-underline text-sm font-medium text-foreground" data-selected={isSelected || undefined}>
                  {p.place}
                </span>
                <span
                  className={`mt-1 block text-sm leading-relaxed transition-colors duration-200 group-hover:text-foreground ${
                    isSelected ? 'text-foreground' : 'text-muted'
                  }`}
                >
                  {p.what}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

function BeenList({ selected, onSelect }: SelectProps) {
  return (
    <ol className="border-t border-border">
      {REGIONS.map((region) => {
        const countries = COUNTRIES.filter((c) => c.region === region)
        return (
          <li key={region} className="grid gap-2 border-b border-border py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
            <div className="flex gap-3 font-mono text-xs text-muted sm:flex-col sm:gap-1">
              <span>{region}</span>
              <span className="tabular-nums opacity-60">{String(countries.length).padStart(2, '0')}</span>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
              {countries.map((c) => {
                const isSelected = selected === c.id
                return (
                  <li key={c.id} data-country={c.id}>
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      data-selected={isSelected || undefined}
                      onClick={() => onSelect(c.id)}
                      className={`pressable hover-underline cursor-pointer text-sm hover:text-foreground ${
                        isSelected ? 'text-foreground' : 'text-muted'
                      }`}
                    >
                      {c.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </li>
        )
      })}
    </ol>
  )
}
