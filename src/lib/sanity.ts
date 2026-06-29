import {createClient} from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'mg8jdbar',
  dataset: 'production',
  apiVersion: '2024-01-01',
  // Fetch fresh (uncached) data at build time so a publish-triggered rebuild
  // always reflects the just-published content. The CDN can lag a publish by
  // seconds, which would otherwise bake stale values into the static build.
  useCdn: false,
})

export type SiteSettings = {
  calendlyUrl: string
  phone: string
  email: string
  address: string
}

const SITE_SETTINGS_FALLBACK: SiteSettings = {
  calendlyUrl: 'https://calendly.com/boughner',
  phone: '864·385·7999',
  email: 'admin-fa@fiduciaryalliance.org',
  address: '135 S Main Street, Suite 600 · Greenville, SC 29601',
}

let _settingsCache: SiteSettings | null = null

// Returns the global Site Settings document, falling back to baked-in defaults
// if the Sanity document is missing or a field is empty. Cached for the
// duration of a build so we only round-trip once.
export async function getSiteSettings(): Promise<SiteSettings> {
  if (_settingsCache) return _settingsCache
  const s = await sanityClient.fetch<Partial<SiteSettings> | null>(
    `*[_type == "siteSettings"][0]{calendlyUrl, phone, email, address}`,
  )
  _settingsCache = {
    calendlyUrl: s?.calendlyUrl || SITE_SETTINGS_FALLBACK.calendlyUrl,
    phone: s?.phone || SITE_SETTINGS_FALLBACK.phone,
    email: s?.email || SITE_SETTINGS_FALLBACK.email,
    address: s?.address || SITE_SETTINGS_FALLBACK.address,
  }
  return _settingsCache
}

// Strip non-digit characters for use in a tel: link.
export function phoneToTel(phone: string): string {
  return phone.replace(/\D/g, '')
}
