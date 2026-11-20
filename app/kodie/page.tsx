import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { StatusDot } from '@/components/tandem/status-dot'
import { KodieMascot } from '@/components/kodie/mascot'
import { GitPath, HabitRow, QuestionCard } from '@/components/kodie/visuals'
import { Bullets, Facts, NextProject, Section, Stage } from '@/components/project'

export const metadata: Metadata = {
  title: 'Kodie',
  description:
    'Kodie teaches coding in a few minutes a day, the way language apps teach languages. In development. Product, design and development by Gregg Finn.',
}

const step = (i: number) => ({ '--i': i }) as CSSProperties

// Visuals drawn from the app's own colours, code and pixel art; real screens from a simulator build
// (2026-11-19) on a stage like Tandem's. Kodie's mission, as Gregg puts it (2026-11-20): learning to code
// a little every day, for beginners as much as engineers. Plain whole sentences throughout

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
        <p className="enter mt-4 text-base leading-relaxed text-muted" style={step(3)}>
          Kodie teaches coding in a few minutes a day, the way language apps teach languages. It&apos;s for people learning
          to code from scratch, and for engineers who want to keep their skills sharp.
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
            Learning to code usually means long courses that are hard to keep up with. Engineers have the opposite problem.
            They now review more code than they write, so the basics fade, even though interviews still test them.
          </p>
          <p>Kodie solves both with one short lesson a day.</p>
        </Section>

        <Section title="What it does">
          <Bullets
            items={[
              ['A path to follow.', 'Each course is a path of short lessons. Each unit ends with a harder test, drawn as a pull request that merges the unit into main.'],
              ['Questions you answer with a tap.', 'You might predict what some code prints or find the bug in it. You never have to write a whole program on your phone.'],
              ['A daily habit.', 'A streak keeps you coming back. Each wrong answer costs a life, and a Stash can save your streak if you miss a day.'],
              ['A daily puzzle.', 'There’s one interview problem each day, broken into steps that take a few minutes each.'],
              ['Kodie, the mascot.', 'Kodie is a pixel face that reacts as you play. It winces when you get something wrong and falls asleep if you’ve been away. You can dress it in what you earn.'],
            ]}
          />
          <div className="mt-10 space-y-3">
            <GitPath />
            <QuestionCard />
          </div>
        </Section>

        <Section title="Correctness first">
          <p>One wrong answer and people stop trusting the app, so every answer is checked before it ships.</p>
          <Bullets
            items={[
              ['Outputs are run.', 'Every “what does this print” question runs in Node or Python, so the answer comes from the code itself.'],
              ['Types are compiled.', 'Every claim that code compiles is checked by the TypeScript compiler.'],
              ['Git is replayed.', 'Git questions run in a real repository.'],
              ['Content is code.', 'Courses are stored as typed files and checked on every change. They update without a new app release.'],
            ]}
          />
        </Section>

        <Section title="Craft">
          <Bullets
            items={[
              ['An editor that plays like a game.', 'Kodie looks like a code editor. Each colour has one job, and the buttons press down like keys.'],
              ['Code that fits a phone.', 'Code is written to fit 46 characters a line. Longer lines shrink slightly and then scroll sideways instead of wrapping.'],
              ['Calm motion.', 'Animations are quick and never bounce. With Reduce Motion on, Kodie still changes expression but stops moving.'],
              ['Plain words on buttons.', 'The git jokes stay in the titles. Buttons say what they do, such as Start or Jump ahead.'],
            ]}
          />
          <div className="mt-10">
            <HabitRow />
          </div>
        </Section>

        <Section title="In the app">
          <Stage dark front={{ src: '/kodie/screens/4-answer.jpg', alt: 'The answer panel: git gud, with a one-line explanation' }} back={{ src: '/kodie/screens/3-output.jpg', alt: 'A question: predict what two timers and a log print' }} />
        </Section>

        <Section title="Where it stands">
          <Bullets
            items={[
              ['Written so far.', 'JavaScript, TypeScript, Git and Interview patterns are written, with about 680 questions.'],
              ['Coming next.', 'Python, React, SQL, System design, Go and the terminal are on the way.'],
              ['Before launch.', 'Kodie Pro and more daily puzzles come first, then the App Store.'],
            ]}
          />
        </Section>

        <Section title="Stack">
          <p>
            Kodie is built in React Native with Expo and TypeScript, using TanStack Query, Zustand and zod. Supabase handles
            the database, server functions and sign-in with Apple, Google and GitHub. The mascot is drawn with Skia.
          </p>
        </Section>

        <NextProject href="/tandem" name="Tandem" line="Find people to train with, live on the App Store." />
      </div>
    </main>
  )
}
