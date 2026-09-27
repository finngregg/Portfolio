import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

const links = [{ href: '/work', label: 'Work' }]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="pressable hover-underline text-sm font-medium text-foreground"
        >
          Gregg Finn
        </Link>
        <div className="flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="pressable hover-underline text-sm text-muted hover:text-foreground"
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
