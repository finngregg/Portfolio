import type { ReactNode } from 'react'
import Image from 'next/image'
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

/**
 * Two of an app's screens side by side on a soft panel at staggered heights, as on trainintandem.com
 * (Gregg, 2026-11-20: the website shows its screens better); `flip` swaps which side leads
 */
export function Stage({ front, back, flip, dark }: { front: { src: string; alt: string }; back: { src: string; alt: string }; flip?: boolean; dark?: boolean }) {
  const phone = 'absolute w-[40%] rounded-[22px] border shadow-[0_24px_50px_-26px_rgba(0,0,0,0.3)]'
  const edge = dark ? '#262E3B' : undefined
  return (
    <div className={`relative h-[360px] overflow-hidden rounded-3xl border border-border sm:h-[480px] ${dark ? '' : 'bg-muted-bg'}`} style={dark ? { background: '#0C0F15', borderColor: '#0C0F15' } : undefined}>
      <Image src={back.src} alt={back.alt} width={600} height={1303} className={`${phone} top-[76px] ${flip ? 'right-[7%]' : 'left-[7%]'}`} style={{ borderColor: edge }} />
      <Image src={front.src} alt={front.alt} width={600} height={1303} className={`${phone} top-[32px] ${flip ? 'left-[7%]' : 'right-[7%]'}`} style={{ borderColor: edge }} />
    </div>
  )
}
