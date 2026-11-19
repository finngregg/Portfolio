import type { CSSProperties, ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { StatusDot } from '@/components/tandem/status-dot'
import { KodieMascot } from '@/components/kodie/mascot'
import { GitPath, HabitRow, QuestionCard } from '@/components/kodie/visuals'
import { ScreenRow } from '@/components/tandem/visuals'

export const metadata: Metadata = {
  title: 'Kodie',
  description:
    'A daily practice app that keeps an engineer’s fundamentals sharp in five minutes a day. In development. Product, design and development by Gregg Finn.',
}

const step = (i: number) => ({ '--i': i }) as CSSProperties

// Real screens from a simulator build (2026-11-19) close the page; the visuals above are drawn
// from the app's own colours, code and pixel art (Gregg chose built visuals over screenshots)
const screens = [
  { src: '/kodie/screens/3-output.jpg', alt: 'A question: predict what two timers and a log print', caption: 'A question' },
  { src: '/kodie/screens/4-answer.jpg', alt: 'The answer panel: git gud, with a one-line explanation', caption: 'Its answer' },
  { src: '/kodie/screens/5-kodie.jpg', alt: 'Your Kodie: the mascot in a propeller cap, with hats to earn', caption: 'What you earn' },
]

const facts: { label: string; value: ReactNode }[] = [
  { label: 'Role', value: 'Product, design and development' },
  { label: 'Stack', value: 'React Native, Expo, Supabase, Skia' },
  { label: 'Started', value: 'November 2026' },
  {
    label: 'Status',
    value: (
      <span className="inline-flex items-center gap-2.5 text-foreground">
        <StatusDot />
        In development, testing on TestFlight
      </span>
    ),
  },
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border py-12">
      <h2 className="mb-6 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">{title}</h2>
      <div className="space-y-4 text-base leading-relaxed text-muted">{children}</div>
    </section>
  )
}

// A bold lead-in, then the reasoning
function Points({ items }: { items: [lead: string, body: ReactNode][] }) {
  return (
    <ul className="mt-6 space-y-5">
      {items.map(([lead, body]) => (
        <li key={lead}>
          <span className="font-medium text-foreground">{lead}</span> {body}
        </li>
      ))}
    </ul>
  )
}

export default function KodiePage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 sm:px-6">
      <header className="pt-20 pb-12">
        <div className="enter flex justify-center text-foreground">
          <KodieMascot pixel={8} />
        </div>
        <h1 className="enter mt-6 text-2xl font-semibold tracking-tight text-foreground" style={step(2)}>
          Kodie
        </h1>
        <p className="enter mt-1 font-mono text-[11px] tracking-[0.15em] text-muted" style={step(2)}>
          git gud.
        </p>
        <p className="enter mt-4 max-w-md text-base leading-relaxed text-muted" style={step(3)}>
          A daily practice app for software engineers: one short lesson a day, in the languages and tools you choose, to keep
          the fundamentals sharp. I&apos;m building it now, from product and design to the code and the questions.
        </p>
        <dl className="enter mt-10 border-t border-border" style={step(4)}>
          {facts.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-[6rem_1fr] items-baseline gap-x-4 border-b border-border py-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{label}</dt>
              <dd className="text-sm text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="enter" style={step(5)}>
        <Section title="Why Kodie">
          <p>
            AI has changed the job. Engineers write less code by hand and review more of it, so the fundamentals fade: how
            the event loop orders things, why an effect holds a stale value, what a binary search does when the pointers meet.
          </p>
          <p>
            Interviews still test exactly those things, which means a weekend of cramming before every one. Grinding
            problems keeps you sharp only if you do it daily, and almost nobody does. Kodie keeps you ready in five minutes
            a day, the way a language app keeps a language alive.
          </p>
          <p>
            It is also where you can learn something in the first place. Every course runs from someone who has never
            written code to an engineer being challenged, and anyone who knows the basics can jump ahead with a short test.
          </p>
        </Section>

        <Section title="What it does">
          <Points
            items={[
              [
                'A path that reads like git.',
                'Each lesson is a commit on a unit’s branch, and each unit ends in a boss: a pull request, harder than the lessons, that merges the unit into main. It is the history engineers already know, in place of a trail of circles.',
              ],
              [
                'Questions you answer with your thumbs.',
                'Predict the output, spot the bug, order the lines, move the pointers, step through a trace, sort logs into the event loop, review an agent’s pull request, or type the one line that matters. Nothing asks you to write a whole program on a phone.',
              ],
              [
                'A habit, kept honestly.',
                'A streak drawn as a contribution grid, lives that a wrong answer costs (half a life when you are half right), a daily goal, and a Stash that saves a missed day. Practice brings back what you got wrong.',
              ],
              [
                'A daily puzzle.',
                'One interview problem a day in parts: choose the approach in a mock interview, trace it on a tricky input, find the input that breaks it, then build it.',
              ],
              [
                'Kodie, the mascot.',
                'A pixel face inside curly braces that breathes, blinks, winces at a wrong answer and dozes off when you have been away. You dress it in what you earn.',
              ],
            ]}
          />
          <div className="mt-10 space-y-3">
            <GitPath />
            <QuestionCard />
          </div>
        </Section>

        <Section title="Correctness first">
          <p>One wrong answer key and an engineer stops trusting the app, so every answer is proven before it ships.</p>
          <Points
            items={[
              ['Outputs are run.', 'Every “what does this print” runs in Node or Python, and the answer comes from the run, not from whoever wrote the question.'],
              ['Types are compiled.', 'Every “does this compile” claim goes through the TypeScript compiler.'],
              ['Git is replayed.', 'Git questions run in a real repository, and every graph puzzle’s solution is replayed in git and compared with the goal.'],
              ['Content is code.', 'Courses live in the repository as typed files, checked by a validator on every change, and published without an app release.'],
            ]}
          />
        </Section>

        <Section title="Craft">
          <Points
            items={[
              [
                'An editor that plays like a game.',
                'A code editor’s dark theme and syntax colours, each with one job (green for right, red for lives, yellow for XP, purple for bosses), and buttons with a solid edge that press down under your thumb with a haptic.',
              ],
              [
                'Code that fits a phone.',
                'Snippets are written to 46 characters a line. Anything longer shrinks a little, then scrolls sideways with a tag saying so, and is never wrapped.',
              ],
              [
                'Calm motion.',
                'Quick ease-out timings and no springs. A right answer slides up a green panel with a haptic and nothing else moves; a wrong one gets one small shake. With Reduce Motion on, Kodie keeps its faces and loses the movement.',
              ],
              [
                'Plain words on buttons.',
                'The git flavour lives in titles and celebrations (“git gud.”, “Merge into main”). Buttons and headers say what they do: Start, Redo, Jump ahead.',
              ],
            ]}
          />
          <div className="mt-10">
            <HabitRow />
          </div>
        </Section>

        <Section title="In the app">
          <ScreenRow screens={screens} dark />
        </Section>

        <Section title="Where it stands">
          <p>
            Built over a week, and testing on TestFlight. JavaScript, TypeScript, Git and Interview patterns are written,
            with about 680 lesson questions, a boss for every unit, eight daily puzzles and a 60-second speed round. Python,
            React, SQL, System design, Go and the terminal are on the way.
          </p>
          <p>
            Next is Kodie Pro, a subscription for unlimited lives, every course and past puzzles, then more daily puzzles
            and a launch on the App Store.
          </p>
        </Section>

        <Section title="Stack">
          <p>
            React Native with Expo, TypeScript, Expo Router, TanStack Query and Zustand, with zod checking every lesson that
            loads. Supabase for Postgres, sign-in with Apple, Google and GitHub, and edge functions, with row-level security
            on every table. Skia draws the mascot and its animations. The same foundations as Tandem, so what I learn in one
            carries over to the other.
          </p>
        </Section>

        <Link href="/tandem" className="group mb-24 flex items-center justify-between gap-6 border-y border-border py-6">
          <span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Next</span>
            <span className="hover-underline mt-2 inline-block text-sm font-medium text-foreground">Tandem</span>
            <span className="mt-1 block text-sm leading-relaxed text-muted transition-colors duration-200 group-hover:text-foreground">
              A community app for finding your people, live on the App Store.
            </span>
          </span>
          <span
            aria-hidden="true"
            className="font-mono text-sm text-muted transition-transform duration-300 ease-(--ease-out) group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </main>
  )
}
