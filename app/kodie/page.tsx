import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { StatusDot } from '@/components/tandem/status-dot'
import { KodieMascot } from '@/components/kodie/mascot'
import { GitPath, HabitRow, QuestionCard } from '@/components/kodie/visuals'
import { Bullets, Facts, NextProject, ScreenRow, Section } from '@/components/project'

export const metadata: Metadata = {
  title: 'Kodie',
  description:
    'A daily practice app that keeps an engineer’s fundamentals sharp in five minutes a day. In development. Product, design and development by Gregg Finn.',
}

const step = (i: number) => ({ '--i': i }) as CSSProperties

// Real screens from a simulator build (2026-11-19) close the page; the visuals above are drawn
// from the app's own colours, code and pixel art. Sections are bullets, as on Tandem's page
const screens = [
  { src: '/kodie/screens/3-output.jpg', alt: 'A question: predict what two timers and a log print', caption: 'A question' },
  { src: '/kodie/screens/4-answer.jpg', alt: 'The answer panel: git gud, with a one-line explanation', caption: 'Its answer' },
  { src: '/kodie/screens/5-kodie.jpg', alt: 'Your Kodie: the mascot in a propeller cap, with hats to earn', caption: 'What you earn' },
]

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
          the fundamentals sharp.
        </p>
        <div className="enter mt-10" style={step(4)}>
          <Facts
            items={[
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
            ]}
          />
        </div>
      </header>

      <div className="enter" style={step(5)}>
        <Section title="Why Kodie">
          <p>
            Engineers now review more code than they write, so the fundamentals fade: the event loop, a stale closure, a
            binary search that never ends. Interviews still test them. Kodie keeps you ready in five minutes a day, and every
            course also starts from zero.
          </p>
        </Section>

        <Section title="What it does">
          <Bullets
            items={[
              ['A path that reads like git.', 'Lessons are commits on a branch; each unit ends in a boss that merges into main.'],
              ['Questions for your thumbs.', 'Predict the output, spot the bug, trace it, review a pull request, type one line.'],
              ['A habit, kept honestly.', 'A streak grid, lives a wrong answer costs, and a Stash that saves a missed day.'],
              ['A daily puzzle.', 'One interview problem in parts: choose the approach, break it, then build it.'],
              ['Kodie, the mascot.', 'A pixel face that blinks, winces and dozes, dressed in what you earn.'],
            ]}
          />
          <div className="mt-10 space-y-3">
            <GitPath />
            <QuestionCard />
          </div>
        </Section>

        <Section title="Correctness first">
          <Bullets
            items={[
              ['Outputs are run', 'in Node or Python, so the answer comes from the code.'],
              ['Types are compiled', 'with the TypeScript compiler.'],
              ['Git is replayed', 'in a real repository, every graph puzzle checked against its goal.'],
              ['Content is code:', 'typed files, validated on every change, published without a release.'],
            ]}
          />
        </Section>

        <Section title="Craft">
          <Bullets
            items={[
              ['An editor that plays like a game.', 'Syntax colours with one job each, and buttons that press down.'],
              ['Code that fits a phone.', '46 characters a line; longer lines shrink, then scroll, never wrap.'],
              ['Calm motion.', 'Ease-out, no springs; Reduce Motion keeps the faces and drops the movement.'],
              ['Plain words on buttons.', 'The git jokes live in titles: Start, Redo, Jump ahead.'],
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
          <Bullets
            items={[
              ['Written:', 'JavaScript, TypeScript, Git and Interview patterns, about 680 questions, a boss for every unit.'],
              ['Coming:', 'Python, React, SQL, System design, Go and the terminal.'],
              ['Next:', 'Kodie Pro, more daily puzzles, then the App Store.'],
            ]}
          />
        </Section>

        <Section title="Stack">
          <p>
            React Native with Expo and TypeScript, TanStack Query, Zustand and zod. Supabase for Postgres, sign-in with Apple,
            Google and GitHub, and edge functions, with row-level security on every table. Skia draws the mascot.
          </p>
        </Section>

        <NextProject href="/tandem" name="Tandem" line="A community app for finding people to train with, live on the App Store." />
      </div>
    </main>
  )
}
