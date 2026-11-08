import Image from 'next/image'

// Screens from the app, side by side, each with a line under it (2026-11-08:
// in place of the earlier screen recordings, which showed older versions)
export type Phone = { src: string; alt: string; caption: string }

export function Phones({ phones }: { phones: Phone[] }) {
  return (
    <div className="my-10 grid grid-cols-2 gap-3 sm:gap-4">
      {phones.map((p) => (
        <figure key={p.src}>
          <Image src={p.src} alt={p.alt} width={600} height={1303} className="w-full rounded-[22px] border border-border" />
          <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{p.caption}</figcaption>
        </figure>
      ))}
    </div>
  )
}
