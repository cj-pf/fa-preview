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
