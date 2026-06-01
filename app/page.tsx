export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 sm:px-6">
      <section className="pt-24 pb-16">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Gregg Finn
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted max-w-md">
          Design engineer based in Tel Aviv. I build interfaces that feel as
          good as they work. Engineering and design as the same decision.
        </p>
      </section>

      <section className="pb-24">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted mb-8">
          Selected work
        </h2>
        <div className="space-y-px border-t border-border">
          {/* Featured pieces will go here */}
        </div>
      </section>
    </main>
  )
}
