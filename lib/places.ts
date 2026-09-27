export type Place = {
  id: string
  label: string
  lat: number
  lon: number
  /** Which side of the marker the globe draws the label */
  side?: 'left' | 'right'
}

// Where I've lived, in order: the globe draws flights between them
export const CITIES: Place[] = [
  { id: 'cpt', label: 'Cape Town', lat: -33.92, lon: 18.42, side: 'left' },
  { id: 'jhb', label: 'Johannesburg', lat: -26.2, lon: 28.05 },
  { id: 'tlv', label: 'Tel Aviv', lat: 32.08, lon: 34.78 },
]

export const CURRENT_CITY = 'tlv'

export const REGIONS = ['Africa', 'Asia', 'Europe', 'North America', 'Oceania'] as const

export type Country = Place & { region: (typeof REGIONS)[number] }

// Where I've been. Each marker sits on the capital so one point stands for the country.
export const COUNTRIES: Country[] = [
  { id: 'mu', label: 'Mauritius', region: 'Africa', lat: -20.16, lon: 57.5 },
  { id: 'za', label: 'South Africa', region: 'Africa', lat: -25.75, lon: 28.19 },

  { id: 'hk', label: 'Hong Kong', region: 'Asia', lat: 22.32, lon: 114.17 },
  { id: 'in', label: 'India', region: 'Asia', lat: 28.61, lon: 77.21 },
  { id: 'id', label: 'Indonesia', region: 'Asia', lat: -6.21, lon: 106.85 },
  { id: 'il', label: 'Israel', region: 'Asia', lat: 31.77, lon: 35.21 },
  { id: 'jp', label: 'Japan', region: 'Asia', lat: 35.68, lon: 139.69 },
  { id: 'sg', label: 'Singapore', region: 'Asia', lat: 1.35, lon: 103.82 },
  { id: 'kr', label: 'South Korea', region: 'Asia', lat: 37.57, lon: 126.98 },
  { id: 'th', label: 'Thailand', region: 'Asia', lat: 13.76, lon: 100.5 },
  { id: 'ae', label: 'United Arab Emirates', region: 'Asia', lat: 24.45, lon: 54.38 },
  { id: 'vn', label: 'Vietnam', region: 'Asia', lat: 21.03, lon: 105.85 },

  { id: 'at', label: 'Austria', region: 'Europe', lat: 48.21, lon: 16.37 },
  { id: 'hr', label: 'Croatia', region: 'Europe', lat: 45.81, lon: 15.98 },
  { id: 'cz', label: 'Czechia', region: 'Europe', lat: 50.08, lon: 14.44 },
  { id: 'dk', label: 'Denmark', region: 'Europe', lat: 55.68, lon: 12.57 },
  { id: 'fr', label: 'France', region: 'Europe', lat: 48.86, lon: 2.35 },
  { id: 'de', label: 'Germany', region: 'Europe', lat: 52.52, lon: 13.4 },
  { id: 'gr', label: 'Greece', region: 'Europe', lat: 37.98, lon: 23.73 },
  { id: 'hu', label: 'Hungary', region: 'Europe', lat: 47.5, lon: 19.04 },
  { id: 'it', label: 'Italy', region: 'Europe', lat: 41.9, lon: 12.5 },
  { id: 'nl', label: 'Netherlands', region: 'Europe', lat: 52.37, lon: 4.9 },
  { id: 'no', label: 'Norway', region: 'Europe', lat: 59.91, lon: 10.75 },
  { id: 'pl', label: 'Poland', region: 'Europe', lat: 52.23, lon: 21.01 },
  { id: 'pt', label: 'Portugal', region: 'Europe', lat: 38.72, lon: -9.14 },
  { id: 'ch', label: 'Switzerland', region: 'Europe', lat: 46.95, lon: 7.45 },
  { id: 'ua', label: 'Ukraine', region: 'Europe', lat: 50.45, lon: 30.52 },
  { id: 'gb', label: 'United Kingdom', region: 'Europe', lat: 51.51, lon: -0.13 },
  { id: 'va', label: 'Vatican City', region: 'Europe', lat: 41.9, lon: 12.45 },

  { id: 'us', label: 'United States', region: 'North America', lat: 38.91, lon: -77.04 },

  { id: 'au', label: 'Australia', region: 'Oceania', lat: -35.28, lon: 149.13 },
]
