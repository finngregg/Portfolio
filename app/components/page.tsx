import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Components',
}

export default function ComponentsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 sm:px-6">
      <section className="pt-24 pb-16">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Components
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted max-w-md">
          Small, polished, open-source React components. Built with care.
        </p>
      </section>

      <section className="pb-24 border-t border-border">
        {/* Components coming soon */}
      </section>
    </main>
  )
}
