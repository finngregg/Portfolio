import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { WorkList, type WorkItem } from '@/components/work-list'

export const metadata: Metadata = {
  title: 'Work',
}

// Client work is described by domain; client names stay off the public site
const selected: WorkItem[] = [
  {
    title: 'B2B SaaS platform',
    summary:
      'Stabilised the most bug-prone module in a 650,000+ line codebase and led its move from Angular to React.',
    details: [
      'Refactored scheduling logic, time zone handling and complex state management, turning the meetings module into one of the most stable in the platform.',
      'Consolidated a dual-framework codebase onto React, removing the cost of maintaining parallel stacks.',
      'Defined how inactive users are handled across the platform, and introduced AI-assisted workflows later adopted company-wide.',
    ],
    tags: ['React', 'TypeScript', 'Angular'],
  },
  {
    title: 'SME lending platform',
    summary:
      'Built the loan application pipeline from the ground up, and a form engine that became a company-wide standard.',
    details: [
      'An admin workflow board with drag-and-drop state transitions gated by validation rules, alongside a client-facing lifecycle view.',
      'KYC onboarding with document upload and verification gating access to the platform.',
      'A JSON Schema–driven form engine, later adopted across client engagements.',
    ],
    tags: ['Angular', 'TypeScript', 'JSON Schema'],
  },
  {
    title: 'Real-time security monitoring',
    summary: 'A proof of concept for live alarm prioritisation on an interactive map, built alongside a company director.',
    details: [
      'Live alarm ingestion and prioritisation, visualised alongside nearby response vehicles.',
      'Prototyped live CCTV streaming and stress-tested the system to find its limits.',
    ],
    tags: ['Real-time data', 'Mapping', 'Proof of concept'],
  },
  {
    title: 'Enterprise financial services',
    summary: 'Document templating, custom branding and component work across two banking platforms.',
    details: [
      'Refactored document generation for dynamic, personalised outputs across multi-party transactions.',
      'Built customisable branding across the platform and its generated documents.',
      'Built UI components in Storybook and contributed to C# and .NET Core services.',
    ],
    tags: ['Storybook', 'C#', '.NET Core'],
  },
]

const inProgress = [
  {
    title: 'Tandem',
    status: 'In testing',
    description: 'A community fitness app for people who want to train together.',
  },
  {
    title: 'Interface components',
    status: 'Coming soon',
    description: 'A collection of small, considered interface components, designed and built from scratch.',
  },
]

const step = (i: number) => ({ '--i': i }) as CSSProperties

export default function WorkPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 sm:px-6">
      <section className="pt-20 pb-16">
        <h1 className="enter text-2xl font-semibold tracking-tight text-foreground">Work</h1>
        <p className="enter mt-3 max-w-md text-base leading-relaxed text-muted" style={step(1)}>
          Selected client work, and what I am building next.
        </p>
      </section>

      <section className="enter pb-16" style={step(2)}>
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Selected work</h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted opacity-70">Clients withheld</p>
        </div>
        <WorkList items={selected} />
      </section>

      <section className="enter pb-24" style={step(3)}>
        <h2 className="mb-6 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">In progress</h2>
        <ul className="border-t border-border">
          {/* Same columns as the selected work rows: marker, content, then status where the + sits */}
          {inProgress.map((item) => (
            <li
              key={item.title}
              className="grid grid-cols-[2.5rem_1fr_auto] items-start gap-x-2 border-b border-border py-5 sm:grid-cols-[3.5rem_1fr_auto]"
            >
              <span className="flex h-5 items-center" aria-hidden="true">
                <span className="status-dot" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
              <span className="flex h-5 items-center font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
