import {createClient} from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'mg8jdbar',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})
