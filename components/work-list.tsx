'use client'

import { useState } from 'react'

export type WorkItem = {
  title: string
  summary: string
  details: string[]
  tags: string[]
}

// Numbered rows that expand in place; only the one-liner shows until opened
export function WorkList({ items }: { items: WorkItem[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <ol className="border-t border-border">
      {items.map((item, i) => {
        const isOpen = open === i
        const panelId = `work-${i}`
        return (
          <li key={item.title} className="border-b border-border">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
              className="group grid w-full cursor-pointer grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-2 py-5 text-left sm:grid-cols-[3.5rem_1fr_auto]"
            >
              <span className="font-mono text-xs text-muted tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className="hover-underline text-sm font-medium text-foreground" data-selected={isOpen || undefined}>
                  {item.title}
                </span>
                <span
                  className={`mt-1 block text-sm leading-relaxed transition-colors duration-200 group-hover:text-foreground ${
                    isOpen ? 'text-foreground' : 'text-muted'
                  }`}
                >
                  {item.summary}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`font-mono text-sm text-muted transition-transform duration-300 ease-(--ease-out) ${
                  isOpen ? 'rotate-45 text-foreground' : ''
                }`}
              >
                +
              </span>
            </button>

            {/* Animating grid rows from 0fr to 1fr gives a smooth height transition */}
            <div
              id={panelId}
              className={`grid transition-[grid-template-rows] duration-300 ease-(--ease-out) ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <div
                  // Indent = number column + column gap, so details line up under the title
                  className={`pb-6 pl-[3rem] pr-6 transition-opacity duration-300 sm:pl-[4rem] ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <ul className="space-y-2">
                    {item.details.map((d) => (
                      <li key={d} className="text-sm leading-relaxed text-muted">
                        {d}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                    {item.tags.join(' · ')}
                  </p>
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
