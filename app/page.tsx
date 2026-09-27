import type { CSSProperties } from 'react'
import Image from 'next/image'
import { Route } from '@/components/route'

const places = [
  {
    city: 'tlv',
    years: '2024 – Now',
    place: 'Tel Aviv',
    what: 'Frontend engineer at Business Science Corporation, remote. Building Tandem, a community app for people who want to work out together.',
  },
  {
    city: 'jhb',
    years: '2021 – 2024',
    place: 'Johannesburg',
    what: 'Joined Business Science Corporation straight out of university. Five years of React and TypeScript across fintech and B2B SaaS.',
  },
  {
    city: 'cpt',
    years: '2018 – 2021',
    place: 'Cape Town',
    what: 'Electrical and Computer Engineering at the University of Cape Town.',
  },
  {
    city: 'jhb',
    years: 'Until 2016',
    place: 'Johannesburg',
    what: 'Grew up here. School at King David Linksfield.',
  },
]

const photos = [
  { src: '/images/tel-aviv-wing-foiling.jpg', location: 'Tel Aviv, Israel' },
  { src: '/images/cape-town-clifton-beach.jpg', location: 'Clifton Beach, Cape Town' },
  { src: '/images/cape-town-sunset-rocks.jpg', location: 'Sea Point, Cape Town' },
  { src: '/images/cape-town-golden-hour.jpg', location: "Lion's Head, Cape Town" },
  { src: '/images/kyoto-kamo-river.jpg', location: 'Kamo River, Kyoto' },
  { src: '/images/kyoto-arashiyama-bridge.jpg', location: 'Arashiyama, Kyoto' },
  { src: '/images/florence-duomo-sunset.jpg', location: 'Piazzale Michelangelo, Florence' },
  { src: '/images/rome-vatican-staircase.jpg', location: 'Vatican Museums, Rome' },
  { src: '/images/seoul-gyeongbokgung.jpg', location: 'Gyeongbokgung Palace, Seoul' },
  { src: '/images/copenhagen-rundetarn.jpg', location: 'Rundetårn, Copenhagen' },
  { src: '/images/florence-uffizi-doni-tondo.jpg', location: 'Uffizi Gallery, Florence' },
  { src: '/images/puglia-castello-elvira.jpg', location: 'Castello Elvira, Puglia' },
]

const step = (i: number) => ({ '--i': i }) as CSSProperties

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 sm:px-6">
      <section className="pt-24 pb-12">
        <h1 className="enter text-2xl font-semibold tracking-tight text-foreground" style={step(0)}>
          Gregg Finn
        </h1>
        <p className="enter mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted" style={step(1)}>
          Design engineer · Tel Aviv
        </p>
        <div className="enter mt-8 space-y-4 text-base leading-relaxed text-muted" style={step(2)}>
          <p>
            I build interfaces that feel as good as they work. Five years of
            frontend engineering, now moving into design engineering: the place
            where engineering craft, design taste and product thinking are the
            same decision.
          </p>
          <p>
            Currently consulting at Business Science Corporation while building
            Tandem, a community app for people who want to work out together.
          </p>
        </div>
      </section>

      <section className="enter pb-12" style={step(3)}>
        <Route />
      </section>

      <section className="enter pb-24" style={step(4)}>
        <h2 className="mb-6 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
          Where I&apos;ve been
        </h2>
        <ol className="border-t border-border">
          {places.map((p) => (
            <li
              key={p.years}
              data-city={p.city}
              className="group grid gap-1 border-b border-border py-5 sm:grid-cols-[8rem_1fr] sm:gap-6"
            >
              <span className="font-mono text-xs text-muted tabular-nums">{p.years}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{p.place}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted transition-colors duration-200 group-hover:text-foreground">
                  {p.what}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="pb-24">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            Life through my eyes
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            30 countries
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {photos.map((photo) => (
            <figure key={photo.src}>
              <Image
                src={photo.src}
                alt={photo.location}
                width={750}
                height={1000}
                className="block h-auto w-full"
                sizes="(max-width: 672px) 50vw, 336px"
              />
              <figcaption className="mt-1.5 text-xs text-muted">{photo.location}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  )
}
