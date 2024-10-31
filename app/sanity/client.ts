import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: '35eh2jh5',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})
