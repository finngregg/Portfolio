import type { CSSProperties } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work',
}

// From the CV (2026-11-20), clients named: each engagement open, one line on what it is, the work as
// bullets, then the stack. Business Science Corporation frames them, as on the CV.
type Engagement = { client: string; product: string; what: string; points: string[]; tags: string[] }

const engagements: Engagement[] = [
  {
    client: 'Accenture',
    product: 'WiredUp',
    what: 'A B2B SaaS platform.',
    points: [
      'Turned the meetings module, the most bug-prone in the platform with 100+ logged bugs, into one of its most stable.',
      'Made the call to move a 650,000+ line codebase from Angular to React, ending the cost of two stacks.',
      'Defined how inactive users are treated across the platform, adopted platform-wide.',
      'Brought AI-assisted workflows (Claude, Claude Code) into the team, later adopted company-wide.',
    ],
    tags: ['React', 'TypeScript', 'Angular'],
  },
  {
    client: 'Cash Flow Capital',
    product: 'SME finance',
    what: 'A financing platform for small businesses.',
    points: [
      'Owned the loan application pipeline: an admin board with validated drag-and-drop states, and a client view.',
      'Built KYC onboarding that gates the platform until applicants are verified.',
      'Turned a JSON Schema form engine into internal tooling, now the company standard.',
    ],
    tags: ['Angular', 'JSON Schema', 'HubSpot'],
  },
  {
    client: 'CAP Security',
    product: 'Proof of concept',
    what: 'Real-time security monitoring, built with a company director.',
    points: ['Live alarm ingestion and prioritisation on an interactive map, beside nearby response vehicles.'],
    tags: ['Real-time', 'Mapping'],
  },
  {
    client: 'Rand Merchant Bank and Standard Bank',
    product: 'Intengo · Edge',
    what: 'Financial services platforms.',
    points: [
      'Refactored document generation on-site at RMB for personalised, multi-party templates.',
      'Built Storybook UI components and C# / .NET Core services for Standard Bank.',
    ],
    tags: ['Storybook', 'C#', '.NET Core'],
  },
]

const step = (i: number) => ({ '--i': i }) as CSSProperties

export default function WorkPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 sm:px-6">
      <section className="pt-20 pb-12">
        <h1 className="enter text-2xl font-semibold tracking-tight text-foreground">Work</h1>
        <p className="enter mt-3 max-w-md text-base leading-relaxed text-muted" style={step(1)}>
          Five years at Business Science Corporation, building client platforms in fintech and B2B SaaS.
        </p>
      </section>

      <section className="enter pb-24" style={step(2)}>
        <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Business Science Corporation</h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">2021 – now · Remote</p>
        </div>
        {engagements.map((e) => (
          <article key={e.client} className="border-b border-border py-7">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-base font-semibold text-foreground">{e.client}</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{e.product}</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{e.what}</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-muted marker:text-border">
              {e.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {e.tags.map((t) => (
                <span key={t} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
