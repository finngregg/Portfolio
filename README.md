# greggfinn.vercel.app

Personal portfolio site. Product engineer with a frontend specialism — shown through the site itself and through mini projects and components taken from idea to interface.

## Stack

- Next.js 16 (App Router)
- TypeScript (strict)
- Tailwind CSS v4
- Framer Motion
- next-themes (dark/light mode)
- Vercel

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
app/
  page.tsx          Home: intro, globe, places timeline, photos
  work/             Mini projects and components
components/         Shared UI (nav, footer, theme)
  globe/            Dotted canvas globe + generated land dots
scripts/            generate-land-dots.mjs rebuilds globe/land-dots.json
public/images/      Photography
```
