import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About',
}

const photos = [
  {
    src: '/images/tel-aviv-wing-foiling.jpg',
    location: 'Tel Aviv, Israel',
  },
  {
    src: '/images/cape-town-clifton-beach.jpg',
    location: 'Clifton Beach, Cape Town',
  },
  {
    src: '/images/cape-town-sunset-rocks.jpg',
    location: 'Sea Point, Cape Town',
  },
  {
    src: '/images/cape-town-golden-hour.jpg',
    location: "Lion's Head, Cape Town",
  },
  {
    src: '/images/kyoto-kamo-river.jpg',
    location: 'Kamo River, Kyoto',
  },
  {
    src: '/images/kyoto-arashiyama-bridge.jpg',
    location: 'Arashiyama, Kyoto',
  },
  {
    src: '/images/florence-duomo-sunset.jpg',
    location: 'Piazzale Michelangelo, Florence',
  },
  {
    src: '/images/rome-vatican-staircase.jpg',
    location: 'Vatican Museums, Rome',
  },
  {
    src: '/images/seoul-gyeongbokgung.jpg',
    location: 'Gyeongbokgung Palace, Seoul',
  },
  {
    src: '/images/copenhagen-rundetarn.jpg',
    location: 'Rundetårn, Copenhagen',
  },
  {
    src: '/images/florence-uffizi-doni-tondo.jpg',
    location: 'Uffizi Gallery, Florence',
  },
  {
    src: '/images/puglia-castello-elvira.jpg',
    location: 'Castello Elvira, Puglia',
  },
]

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 sm:px-6">
      <section className="pt-24 pb-12">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          About
        </h1>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
          <p>
            I am a frontend engineer with five years of experience, based in
            Tel Aviv. I studied Electrical and Computer Engineering at UCT.
          </p>
          <p>
            Currently consulting at Business Science Corporation while building
            Tandem, a community app for people who want to work out together.
          </p>
          <p>
            I am transitioning into design engineer and product engineer roles:
            positions where engineering craft meets design taste and product
            thinking.
          </p>
        </div>

        <div className="mt-8 flex items-center gap-5 text-sm">
          <a
            href="mailto:finngregg@gmail.com"
            className="text-muted hover:text-foreground transition-colors duration-200"
          >
            Email
          </a>
          <a
            href="https://instagram.com/greggfinn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground transition-colors duration-200"
          >
            Instagram
          </a>
        </div>
      </section>

      <section className="pb-24">
        <div className="grid grid-cols-2 gap-2">
          {photos.map((photo) => (
            <div key={photo.src}>
              <Image
                src={photo.src}
                alt={photo.location}
                width={750}
                height={1000}
                className="w-full h-auto block"
                sizes="(max-width: 640px) 50vw, 50vw"
              />
              <p className="mt-1.5 text-xs text-muted">{photo.location}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
