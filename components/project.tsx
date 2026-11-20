import type { ReactNode } from 'react'
import Link from 'next/link'

// The pieces both project pages share (Tandem, Kodie), so they read the same way: a section with a
// mono label, bullets with a bold lead, the facts table and the link to the next project.

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border py-12">
      <h2 className="mb-6 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">{title}</h2>
      <div className="space-y-4 text-base leading-relaxed text-muted">{children}</div>
    </section>
  )
}

/** One line each: a bold lead, then what it means (2026-11-20: prose read as wordy) */
export function Bullets({ items }: { items: [lead: string, body: ReactNode][] }) {
  return (
    <ul className="mt-2 list-disc space-y-2.5 pl-5 marker:text-border">
      {items.map(([lead, body]) => (
        <li key={lead}>
          <span className="font-medium text-foreground">{lead}</span> {body}
        </li>
      ))}
    </ul>
  )
}

export function Facts({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="border-t border-border">
      {items.map(({ label, value }) => (
        <div key={label} className="grid grid-cols-[6rem_1fr] items-baseline gap-x-4 border-b border-border py-3">
          <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{label}</dt>
          <dd className="text-sm text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function NextProject({ href, name, line }: { href: string; name: string; line: string }) {
  return (
    <Link href={href} className="group mb-24 flex items-center justify-between gap-6 border-y border-border py-6">
      <span>
        <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Next</span>
        <span className="hover-underline mt-2 inline-block text-sm font-medium text-foreground">{name}</span>
        <span className="mt-1 block text-sm leading-relaxed text-muted transition-colors duration-200 group-hover:text-foreground">{line}</span>
      </span>
      <span aria-hidden="true" className="font-mono text-sm text-muted transition-transform duration-300 ease-(--ease-out) group-hover:translate-x-1">
        →
      </span>
    </Link>
  )
}

/** Real screens closing a page: three phones, staggered, on a soft panel */
export function ScreenRow({ screens, dark }: { screens: { src: string; alt: string; caption: string }[]; dark?: boolean }) {
  return (
    <div>
      <div className="grid h-[300px] grid-cols-3 items-start gap-3 overflow-hidden rounded-3xl px-4 pt-7 sm:h-[460px] sm:gap-4 sm:px-7 sm:pt-10" style={{ background: dark ? '#0C0F15' : '#F4F4F3' }}>
        {screens.map((s, n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={s.src} src={s.src} alt={s.alt} loading="lazy" className="w-full rounded-[18px] border sm:rounded-[22px]" style={{ marginTop: n * 22, borderColor: dark ? '#262E3B' : '#E3E3E1' }} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 px-4 sm:gap-4 sm:px-7">
        {screens.map((s) => (
          <span key={s.caption} className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
            {s.caption}
          </span>
        ))}
      </div>
    </div>
  )
}
