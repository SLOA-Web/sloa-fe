import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '764fdutk'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = '2024-03-14'

// Only validate in production/development, allow build to pass in CI without these vars
if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.warn('NEXT_PUBLIC_SANITY_PROJECT_ID not set - using default values for build')
}

if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.warn('NEXT_PUBLIC_SANITY_DATASET not set - using default values for build')
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})