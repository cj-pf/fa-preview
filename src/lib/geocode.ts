// Build-time geocoder for member firm addresses.
//
// - Every cached address in src/data/geocode-cache.json is served instantly.
// - Cache misses fall back to Nominatim (OpenStreetMap, no key required) with
//   progressively broader queries so at least a city-level result is returned.
// - Nominatim's fair-use policy asks for a 1 req/sec ceiling; we sleep 1.1s
//   between fallback attempts.
//
// Add a new firm in Sanity and the next build will geocode its address once,
// use the result, and log it. Cache misses do NOT persist to disk on Vercel
// (that would require a commit) — they simply re-geocode next build.

import cacheJson from '../data/geocode-cache.json'

type Firm = {
  streetAddress?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
}

const cache: Record<string, [number, number]> = cacheJson as any

function cacheKey(f: Firm): string {
  return [f.streetAddress, f.city, f.state, f.zipCode]
    .map((x) => (x || '').trim())
    .join('|')
}

function stripSuite(s: string): string {
  return s
    .replace(/,?\s*\b(Suite|Ste\.?|Unit|Apt\.?|Bldg\.?|Building|Floor|Fl\.?|#)\b.*$/i, '')
    .trim()
}

async function nominatim(q: string): Promise<[number, number] | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&q=${encodeURIComponent(q)}`
  try {
    const res = await fetch(url, {
      headers: {'User-Agent': 'fa-preview-build/1.0 (https://fa-preview.vercel.app)'},
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return null
    const lat = parseFloat(data[0].lat)
    const lon = parseFloat(data[0].lon)
    if (Number.isNaN(lat) || Number.isNaN(lon)) return null
    return [lat, lon]
  } catch {
    return null
  }
}

export async function geocodeFirm(firm: Firm): Promise<[number, number] | null> {
  if (!firm.city || !firm.state) return null

  const key = cacheKey(firm)
  if (cache[key]) return cache[key]

  const street = stripSuite(firm.streetAddress || '')
  const zip = (firm.zipCode || '').trim()
  const attempts = [
    street ? `${street}, ${firm.city}, ${firm.state}${zip ? ' ' + zip : ''}, USA` : null,
    street ? `${street}, ${firm.city}, ${firm.state}, USA` : null,
    firm.streetAddress ? `${firm.streetAddress}, ${firm.city}, ${firm.state}, USA` : null,
    `${firm.city}, ${firm.state}${zip ? ' ' + zip : ''}, USA`,
    `${firm.city}, ${firm.state}, USA`,
  ].filter(Boolean) as string[]

  for (const q of attempts) {
    const result = await nominatim(q)
    // Respect Nominatim's rate limit even between our own attempts.
    await new Promise((r) => setTimeout(r, 1100))
    if (result) {
      cache[key] = result
      console.log(`[geocode] cache miss resolved: "${q}" -> ${result[0]}, ${result[1]}`)
      return result
    }
  }
  console.warn(`[geocode] no result for: ${JSON.stringify(firm)}`)
  return null
}
