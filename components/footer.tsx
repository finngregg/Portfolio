const links = [
  { href: 'mailto:finngregg@gmail.com', label: 'Email' },
  { href: 'https://instagram.com/greggfinn', label: 'Instagram', external: true },
]

export function Footer() {
  return (
    <footer className="mx-auto mt-auto w-full max-w-2xl px-4 sm:px-6">
      <div className="flex items-center justify-between border-t border-border py-8 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
        <span>© {new Date().getFullYear()} Gregg Finn</span>
        <div className="flex items-center gap-6">
          {links.map(({ href, label, external }) => (
            <a
              key={href}
              href={href}
              {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
              className="pressable hover-underline hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
