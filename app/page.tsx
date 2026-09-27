import type { CSSProperties } from 'react'
import { Gallery, type Photo } from '@/components/gallery/gallery'
import { Travels, type LivedPlace } from '@/components/travels'
import { COUNTRIES } from '@/lib/places'

const places: LivedPlace[] = [
  {
    city: 'cpt',
    years: '2018 – 2021',
    place: 'Cape Town',
    what: 'Electrical and Computer Engineering at the University of Cape Town.',
  },
  {
    city: 'jhb',
    years: '2021 – 2024',
    place: 'Johannesburg',
    what: 'Software engineer at Business Science Corporation, delivering products for clients in financial services and B2B SaaS, from requirements through to release.',
  },
  {
    city: 'tlv',
    years: '2024 – Present',
    place: 'Tel Aviv',
    what: 'Continuing with Business Science Corporation remotely. Building Tandem, a community fitness app, leading its product direction, design and development.',
  },
]

const photos: Photo[] = [
  { src: '/images/tel-aviv-wing-foiling.jpg', location: 'Tel Aviv, Israel', coords: [32.08, 34.77] },
  { src: '/images/cape-town-clifton-beach.jpg', location: 'Clifton Beach, Cape Town', coords: [-33.94, 18.38] },
  { src: '/images/cape-town-sunset-rocks.jpg', location: 'Sea Point, Cape Town', coords: [-33.92, 18.38] },
  { src: '/images/cape-town-golden-hour.jpg', location: "Lion's Head, Cape Town", coords: [-33.94, 18.39] },
  { src: '/images/kyoto-kamo-river.jpg', location: 'Kamo River, Kyoto', coords: [35.01, 135.77] },
  { src: '/images/kyoto-arashiyama-bridge.jpg', location: 'Arashiyama, Kyoto', coords: [35.01, 135.68] },
  { src: '/images/florence-duomo-sunset.jpg', location: 'Piazzale Michelangelo, Florence', coords: [43.76, 11.27] },
  { src: '/images/rome-vatican-staircase.jpg', location: 'Vatican Museums, Rome', coords: [41.91, 12.45] },
  { src: '/images/seoul-gyeongbokgung.jpg', location: 'Gyeongbokgung Palace, Seoul', coords: [37.58, 126.98] },
  { src: '/images/copenhagen-rundetarn.jpg', location: 'Rundetårn, Copenhagen', coords: [55.68, 12.58] },
  { src: '/images/florence-uffizi-doni-tondo.jpg', location: 'Uffizi Gallery, Florence', coords: [43.77, 11.26] },
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
          Product engineer · Tel Aviv
        </p>
        <div className="enter mt-8 space-y-4 text-base leading-relaxed text-muted" style={step(2)}>
          <p>
            I am a product engineer with five years of experience and a
            specialism in frontend development. My work spans the full product
            cycle: ideation, product design, feature development and delivery.
          </p>
          <p>
            I am currently a software engineer at Business Science Corporation
            and am building Tandem, a community fitness app.
          </p>
        </div>
      </section>

      <section className="enter pb-24" style={step(3)}>
        <Travels lived={places} />
      </section>

      <section className="pb-24">
        <div className="mb-6">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            Life through my eyes
          </h2>
          <p className="mt-2 text-sm text-muted">
            A selection of photographs from the {COUNTRIES.length} countries I have visited.
          </p>
        </div>
        <Gallery photos={photos} />
      </section>
    </main>
  )
}
