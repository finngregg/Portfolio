'use client'

// A small switch between two or three options (a session's Details / Map). The thumb
// slides to the chosen one; segments are a fixed width so the slide is one translate.
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  width = 68,
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
  label: string
  /** Each segment's width */
  width?: number
}) {
  const at = Math.max(0, options.findIndex((o) => o.id === value))
  return (
    <div role="radiogroup" aria-label={label} className="relative inline-flex rounded-2xl border border-border bg-background p-[2px]">
      <span
        aria-hidden="true"
        className="absolute top-[2px] left-[2px] h-7 rounded-[14px] bg-foreground transition-transform duration-250 ease-(--ease-out) motion-reduce:transition-none"
        style={{ width, transform: `translateX(${at * width}px)` }}
      />
      {options.map((o) => {
        const selected = o.id === value
        return (
          // No press scale: it would wobble against the sliding thumb
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.id)}
            className={`relative h-7 cursor-pointer rounded-[14px] font-mono text-[10px] uppercase tracking-[0.15em] transition-colors duration-250 ${
              selected ? 'text-background' : 'text-muted hover:text-foreground'
            }`}
            style={{ width }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
