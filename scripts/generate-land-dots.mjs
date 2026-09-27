// Generates components/globe/land-dots.json: evenly spaced points on the sphere
// that fall on land, used to draw the dotted globe on the home page.
// Run with: node scripts/generate-land-dots.mjs

import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { geoContains } from 'd3-geo'
import { feature } from 'topojson-client'

const require = createRequire(import.meta.url)
const topology = JSON.parse(readFileSync(require.resolve('world-atlas/land-110m.json'), 'utf8'))
const land = feature(topology, topology.objects.land)

// Fibonacci sphere gives near-uniform spacing without clumping at the poles
const SAMPLES = 16000
const golden = Math.PI * (3 - Math.sqrt(5))
const dots = []

for (let i = 0; i < SAMPLES; i++) {
  const y = 1 - (i / (SAMPLES - 1)) * 2
  const lat = (Math.asin(y) * 180) / Math.PI
  if (lat < -60) continue // skip Antarctica, it only adds noise at the bottom
  const lon = ((((i * golden * 180) / Math.PI) % 360) + 540) % 360 - 180
  if (geoContains(land, [lon, lat])) dots.push(+lat.toFixed(1), +lon.toFixed(1))
}

const out = new URL('../components/globe/land-dots.json', import.meta.url)
writeFileSync(out, JSON.stringify(dots))
console.log(`${dots.length / 2} land dots written`)
