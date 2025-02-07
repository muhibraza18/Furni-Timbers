import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: '2eotbbs7',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
})
