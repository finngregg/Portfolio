import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { KodieFace } from './mascot'

// Kodie's own type, only on its page: code in JetBrains Mono, the interface in Space Grotesk
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '600'] })
// The app uses JetBrains Mono NL: == and => stay as typed, never arrows
const noLigatures = { fontVariantLigatures: 'none' as const, fontFeatureSettings: '"calt" 0, "liga" 0' }
const ui = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600'] })

// The app's dark editor theme (src/theme/tokens.ts)
const K = {
  bg: '#0C0F15',
  surface: '#151A23',
  editor: '#0F131A',
  line: '#262E3B',
  text: '#E8ECF2',
  muted: '#9AA5B5',
  faint: '#677284',
  green: '#3DD68C',
  goodBg: '#10261C',
  blue: '#5EA2FF',
  orange: '#FF9F5A',
  purple: '#A78BFA',
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`${ui.className} overflow-hidden rounded-3xl ${className}`} style={{ background: K.bg, color: K.text }}>
      {children}
    </div>
  )
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className={`${mono.className} text-[11px] tracking-[0.15em]`} style={{ color: K.muted }}>
    {children}
  </div>
)

/** A lesson question with its answer: the code, the choice, then "git gud." and why */
export function QuestionCard() {
  const fn = (s: string) => <span style={{ color: K.blue }}>{s}</span>
  const str = (s: string) => <span style={{ color: K.green }}>{s}</span>
  const num = (s: string) => <span style={{ color: K.orange }}>{s}</span>
  const lines = [
    <>
      {fn('setTimeout')}(() =&gt; console.{fn('log')}({str("'slow'")}), {num('20')});
    </>,
    <>
      {fn('setTimeout')}(() =&gt; console.{fn('log')}({str("'fast'")}), {num('10')});
    </>,
    <>
      console.{fn('log')}({str("'now'")});
    </>,
  ]
  return (
    <Panel>
      <figure className="m-0 flex flex-col gap-3.5 p-6 sm:p-8" aria-label="A Kodie question: predict what two timers and a log print, answered correctly">
        <Label>PREDICT THE OUTPUT</Label>
        <div className="text-xl font-semibold sm:text-2xl">What does this log?</div>
        <div className={`${mono.className} overflow-x-auto rounded-xl border px-4 py-3 text-[12.5px] leading-[24px] sm:text-[14.5px] sm:leading-[26px]`} style={{ background: K.editor, borderColor: K.line, ...noLigatures }}>
          {lines.map((l, n) => (
            <div key={n} className="whitespace-nowrap">
              <span className="mr-4" style={{ color: K.faint }}>
                {n + 1}
              </span>
              {l}
            </div>
          ))}
        </div>
        <div className={`${mono.className} grid grid-cols-1 gap-2.5 text-[14px] sm:grid-cols-2`}>
          <span className="rounded-xl border border-b-4 px-4 py-3" style={{ background: K.surface, borderColor: K.line }}>
            now slow fast
          </span>
          <span className="rounded-xl border border-b-4 px-4 py-3" style={{ background: K.goodBg, borderColor: K.green, color: K.green }}>
            now fast slow ✓
          </span>
        </div>
        <div className="-mx-6 -mb-6 mt-2 flex items-start gap-3.5 px-6 pt-5 pb-6 sm:-mx-8 sm:-mb-8 sm:px-8" style={{ background: K.goodBg }}>
          <span className="mt-1 shrink-0">
            <KodieFace pixel={3} braces={K.green} happy />
          </span>
          <div>
            <div className="text-lg font-semibold" style={{ color: K.green }}>
              git gud.
            </div>
            <div className="mt-1 text-[15px] leading-[22px]" style={{ color: '#C9D2DE' }}>
              Both timers wait their turn: &apos;now&apos; logs first, then the shorter timer, then the longer one.
            </div>
          </div>
        </div>
      </figure>
    </Panel>
  )
}

type Commit = { title: string; meta: string; state: 'done' | 'here' | 'next' | 'boss' }
const COMMITS: Commit[] = [
  { title: 'docs: README', meta: 'unit/02-event-loop', state: 'done' },
  { title: 'feat: What Runs When', meta: '+120 XP', state: 'done' },
  { title: 'feat: Promises Before Timers', meta: 'YOU', state: 'here' },
  { title: 'feat: Async and Await', meta: '', state: 'next' },
  { title: 'Merge The Event Loop into main', meta: 'BOSS', state: 'boss' },
]

/** The path: lessons as commits on a unit's branch, the boss a pull request into main */
export function GitPath() {
  return (
    <Panel>
      <ol className={`${mono.className} m-0 list-none px-6 py-5 sm:px-8`} aria-label="A unit as a git branch: two lessons done, you at the third, one to go, then the boss">
        {COMMITS.map((c, n) => {
          const colour = c.state === 'boss' ? K.purple : c.state === 'next' ? K.faint : c.state === 'here' ? K.green : K.text
          const dot = c.state === 'done' ? K.green : c.state === 'boss' ? K.purple : K.bg
          const ring = c.state === 'next' ? K.line : c.state === 'boss' ? K.purple : K.green
          const rail = n === COMMITS.length - 1 ? 'transparent' : c.state === 'done' ? K.green : K.line
          return (
            <li key={c.title} className="flex h-[52px] items-center gap-4">
              <span className="relative h-[52px] w-11 shrink-0" aria-hidden="true">
                <span className="absolute top-[26px] bottom-[-26px] left-[21px] w-0.5" style={{ background: rail }} />
                <span className="absolute top-[19px] left-[14px] h-3.5 w-3.5 rounded-full border-2" style={{ background: dot, borderColor: ring }} />
              </span>
              <span className="truncate text-[13px] sm:text-[14px]" style={{ color: colour }}>
                {c.title}
              </span>
              <span className="ml-auto shrink-0 text-[11px] tracking-[0.12em]" style={{ color: c.state === 'here' ? K.green : c.state === 'boss' ? K.purple : K.faint }}>
                {c.meta}
              </span>
            </li>
          )
        })}
      </ol>
    </Panel>
  )
}

/** The streak as a contribution grid, and Kodie in some of the colours you can earn */
export function HabitRow() {
  const shades = ['#151A23', '#10361F', '#1A6B3C', '#2AA35B', '#3DD68C']
  const cells = Array.from({ length: 126 }, (_, n) => {
    const v = (n * 37 + (n % 7) * 11) % 10
    return shades[n > 84 ? 4 - (v % 2) : v < 2 ? 0 : v < 4 ? 1 : v < 7 ? 2 : v < 9 ? 3 : 4]
  })
  const colours = [K.purple, K.green, K.blue, K.orange, '#FF6369', '#5EE0D6']
  return (
    <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr]">
      <Panel className="flex flex-col gap-3.5 p-6">
        <Label>STREAK · 41 DAYS</Label>
        <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1" role="img" aria-label="A contribution grid of green squares, solid for the last six weeks">
          {cells.map((c, n) => (
            <span key={n} className="aspect-square rounded-[3px]" style={{ background: c }} />
          ))}
        </div>
      </Panel>
      <Panel className="grid grid-cols-3 content-center justify-items-center gap-2.5 p-6">
        {colours.map((c, n) => (
          <KodieFace key={c} pixel={4} braces={c} happy={n % 2 === 1} />
        ))}
      </Panel>
    </div>
  )
}
