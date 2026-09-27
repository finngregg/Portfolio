import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work',
}

export default function WorkPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 sm:px-6">
      <section className="pt-24 pb-16">
        <h1 className="enter text-2xl font-semibold tracking-tight text-foreground">
          Work
        </h1>
        <p
          className="enter mt-3 max-w-md text-base leading-relaxed text-muted"
          style={{ '--i': 1 } as React.CSSProperties}
        >
          Mini projects and components, taken from idea to interface.
        </p>
      </section>

      <section className="border-t border-border pb-24">
        {/* Projects and components go here */}
      </section>
    </main>
  )
}
