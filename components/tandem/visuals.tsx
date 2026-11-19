// Tandem's signature pieces, drawn from the app's new look (2026-11-19) rather than shown as
// whole phones: the map's pins, the trust line on a profile, how a group ran, the story card.
// Colours are the app's own (src/theme/tokens.ts, newLight and newDark), the same in either theme.

const T = { ground: '#F4F4F3', card: '#FFFFFF', ink: '#070707', muted: '#555555', faint: '#8A8A87', chip: '#F0F0EE', live: '#22C55E' }

const mono = 'font-mono text-[10px] tracking-[0.15em]'

/** The Discover map, a real capture cropped to the city: every pin a real session, today's in green.
 * Only your location moves, pulsing as it does in the app (2026-11-19: drawn pins looked generic) */
export function MapScene() {
  return (
    <div className="relative overflow-hidden rounded-3xl" style={{ background: '#ECEEE9' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/tandem/map.jpg"
        alt="Tandem's Discover map of Cape Town: session pins say when and how far, today's marked green, sessions at one spot stacked with a count"
        loading="lazy"
        className="block w-full"
        width={1320}
        height={1200}
      />
      <span aria-hidden="true" className="map-ping absolute h-[3.2%] w-[3.2%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: '49.8%', top: '72.7%', background: '#2F7BF6' }} />
    </div>
  )
}

/** The top of a real profile: the chips (show-up, vouches, pace, goal), then the numbers behind them.
 * A crop of the app, not a drawing, so it shows trust exactly as Tandem does */
export function TrustCard() {
  return (
    <div className="flex justify-center rounded-3xl px-4 py-6 sm:py-8" style={{ background: T.ground }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/tandem/profile.jpg"
        alt="A Tandem profile: Ava Fischer, with Shows up 100%, Vouched for by 7, Runs 5:18/km and Training for Full Marathon, then 5 sessions, 100% show-up, 7 partners and 3 weeks in a row"
        loading="lazy"
        className="block w-full max-w-[400px]"
        width={1320}
        height={2045}
      />
    </div>
  )
}

/** After a run: what happened in words first, then everyone's pace on one chart */
export function GroupRan() {
  return (
    <div className="rounded-3xl p-4" style={{ background: T.ground }}>
      <div className="flex flex-col gap-1.5 rounded-[18px] p-5" style={{ background: T.card, color: T.ink }}>
        <div className={mono} style={{ color: T.muted }}>
          HOW THE GROUP RAN
        </div>
        <div className="text-[18px] font-semibold tracking-[-0.02em]">You ran together for 16 km.</div>
        <div className="text-[13px]" style={{ color: T.muted }}>
          Then you and Ava picked up the pace for the last 5 km.
        </div>
        <svg viewBox="0 0 300 120" role="img" aria-label="Three pace lines close together for most of the run; two pull ahead at the end" className="mt-1.5 h-[130px] w-full">
          <path d="M4 92 C 40 86, 70 80, 110 78 S 170 74, 200 72 S 250 40, 292 18" fill="none" stroke="#070707" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M4 88 C 40 84, 70 76, 110 76 S 170 70, 200 70 S 250 46, 292 26" fill="none" stroke="#8F8F8C" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M4 94 C 40 90, 70 84, 110 82 S 170 78, 200 76 S 250 64, 292 54" fill="none" stroke="#B9B9B6" strokeWidth="2.6" strokeDasharray="5 5" strokeLinecap="round" />
          <circle cx="292" cy="18" r="5" fill="#070707" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="292" cy="26" r="4.5" fill="#8F8F8C" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="292" cy="54" r="4.5" fill="#B9B9B6" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
        <div className="flex gap-4 text-[11px]" style={{ color: T.muted }}>
          <span>● You</span>
          <span style={{ color: '#8F8F8C' }}>● Ava</span>
          <span style={{ color: '#9A9A97' }}>◌ Lucas</span>
        </div>
      </div>
    </div>
  )
}

/** The story card, on the app's dark: splits as dots, the distance large */
export function StoryCard() {
  const heights = [3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 8]
  return (
    <div className="flex rounded-3xl p-4" style={{ background: '#171717' }}>
      <figure className="m-0 flex flex-1 flex-col gap-2.5 rounded-2xl p-4" style={{ background: '#1E1E1E', color: '#EEEEEE' }} aria-label="A story card: 21.1 km, Morning long run, Sea Point, 1h 50m at 5:13 per km">
        <div className="flex justify-between font-mono text-[8px] tracking-[0.15em]" style={{ color: '#8C8C8C' }}>
          <span>TANDEM</span>
          <span>CAPE TOWN · WED 18 NOV</span>
        </div>
        <div className="mt-1.5 grid grid-cols-[repeat(12,6px)] gap-[5px]" aria-hidden="true">
          {Array.from({ length: 8 }, (_, r) => 8 - r).flatMap((row) =>
            heights.map((h, col) => <span key={`${row}-${col}`} className="h-1.5 w-1.5 rounded-full" style={{ background: h >= row ? (col === 11 ? '#EEEEEE' : '#8C8C8C') : '#333333' }} />),
          )}
        </div>
        <div className="mt-2 text-[52px] font-semibold leading-none tracking-[-0.05em]">
          21.1<span className="ml-1 font-mono text-[9px] tracking-[0.1em]">KM</span>
        </div>
        <div className="text-[12px]">Morning long run, Sea Point</div>
        <div className="flex gap-3.5 border-t pt-2 text-[13px]" style={{ borderColor: 'rgba(238,238,238,0.18)' }}>
          <span>1h 50m</span>
          <span>5:13</span>
          <span>149</span>
        </div>
      </figure>
    </div>
  )
}

/** Real screens closing a page: three phones, staggered, on a soft panel */
export function ScreenRow({ screens, dark }: { screens: { src: string; alt: string; caption: string }[]; dark?: boolean }) {
  return (
    <div>
      <div className="grid h-[300px] grid-cols-3 items-start gap-3 overflow-hidden rounded-3xl px-4 pt-7 sm:h-[460px] sm:gap-4 sm:px-7 sm:pt-10" style={{ background: dark ? '#0C0F15' : T.ground }}>
        {screens.map((s, n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={s.src} src={s.src} alt={s.alt} loading="lazy" className="w-full rounded-[18px] border sm:rounded-[22px]" style={{ marginTop: n * 22, borderColor: dark ? '#262E3B' : '#E3E3E1' }} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 px-4 sm:gap-4 sm:px-7">
        {screens.map((s) => (
          <span key={s.caption} className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
            {s.caption}
          </span>
        ))}
      </div>
    </div>
  )
}
