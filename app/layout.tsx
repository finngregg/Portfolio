import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Nav } from '@/components/nav'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Gregg Finn, Design Engineer',
    template: '%s / Gregg Finn',
  },
  description:
    'Design engineer based in Tel Aviv. I build interfaces that feel as good as they work.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <Nav />
          <div className="flex flex-col flex-1">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
