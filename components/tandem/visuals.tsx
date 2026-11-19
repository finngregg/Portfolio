// Tandem's signature pieces, drawn from the app's new look (2026-11-19) rather than shown as
// whole phones: the map's pins, the trust line on a profile, how a group ran, the story card.
// Colours are the app's own (src/theme/tokens.ts, newLight and newDark), the same in either theme.

const T = { ground: '#F4F4F3', card: '#FFFFFF', ink: '#070707', muted: '#555555', faint: '#8A8A87', chip: '#F0F0EE', live: '#22C55E' }

const mono = 'font-mono text-[10px] tracking-[0.15em]'

function Pin({ x, y, time, detail, count, live, selected }: { x: string; y: string; time: string; detail?: string; count?: number; live?: boolean; selected?: boolean }) {
  return (
    <span
      className="absolute flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 font-mono text-[11px] sm:text-[12px]"
      style={{ left: x, top: y, background: selected ? T.ink : T.card, color: selected ? '#FFFFFF' : T.ink, boxShadow: '0 6px 18px rgba(0,0,0,0.10)' }}
    >
      {live ? <span className="h-2 w-2 rounded-full" style={{ background: T.live }} /> : null}
      <span>{time}</span>
      {detail ? <span style={{ color: selected ? '#A6A6A6' : T.faint }}>{detail}</span> : null}
      {count ? (
        <span className="rounded-full px-1.5 text-[10px]" style={{ background: T.ink, color: '#FFFFFF' }}>
          {count}
        </span>
      ) : null}
    </span>
  )
}

/** The Discover map: pins that say when and how far, green for today, stacked with a count */
export function MapScene() {
  return (
    <div
      role="img"
      aria-label="A map with session pins: Saturday 07:00 21 km with two stacked, today 17:00 10 km selected, today 19:00 five-a-side, Sunday 06:00 45 km"
      className="relative h-[260px] overflow-hidden rounded-3xl sm:h-[300px]"
      style={{ background: '#ECEEE9' }}
    >
      <span className="absolute left-0 top-0 h-full w-[22%]" style={{ background: '#CFE4F2' }} />
      <span className="absolute left-[-5%] top-[40%] h-2.5 w-[110%] -rotate-[9deg] bg-white" />
      <span className="absolute left-[38%] top-[-15%] h-[130%] w-2 rotate-[14deg] bg-white" />
      <span className="absolute left-[68%] top-[-15%] h-[130%] w-1.5 -rotate-[22deg]" style={{ background: '#F7F8F5' }} />
      <Pin x="30%" y="14%" time="SAT 07:00" detail="21 km" count={2} />
      <Pin x="56%" y="34%" time="17:00" detail="10 km" live selected />
      <Pin x="26%" y="58%" time="19:00" detail="5-a-side" live />
      <Pin x="58%" y="74%" time="SUN 06:00" detail="45 km" />
      <span className="absolute left-[48%] top-[50%] h-4 w-4 rounded-full border-[3px] border-white" style={{ background: '#2F7BF6', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} />
    </div>
  )
}

/** The top of a profile: who they are and the three things that make meeting them easier */
export function TrustCard() {
  return (
    <div className="flex justify-center rounded-3xl p-5 sm:p-7" style={{ background: T.ground }}>
      <div className="flex w-full max-w-[440px] flex-col items-center gap-2.5 rounded-[22px] p-6" style={{ background: T.card, color: T.ink }}>
        <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full text-[22px] font-medium" style={{ background: '#E4E4E1', color: T.muted }}>
          AF
        </span>
        <div className="text-[22px] font-semibold tracking-[-0.02em]">Ava Fischer</div>
        <div className="flex flex-wrap justify-center gap-2">
          {['Shows up 100%', 'Vouched for by 7', 'Runs 5:18/km'].map((c) => (
            <span key={c} className="rounded-full px-3 py-1.5 text-[13px] font-medium" style={{ background: T.chip }}>
              {c}
            </span>
          ))}
        </div>
        <div className="text-center text-[13px]" style={{ color: T.muted }}>
          “I&apos;d train with them again”, from people who have.
        </div>
      </div>
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
