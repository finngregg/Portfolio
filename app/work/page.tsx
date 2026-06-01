import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work',
}

export default function WorkPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 sm:px-6">
      <section className="pt-24 pb-16">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Work
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted max-w-md">
          Selected case studies. Engineering depth, product thinking, design
          taste.
        </p>
      </section>

      <section className="pb-24 border-t border-border">
        {/* Case studies coming soon */}
      </section>
    </main>
  )
}
