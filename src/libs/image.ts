import createImageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'default-project-id'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Only validate in production/development, allow build to pass in CI without these vars
if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.warn('NEXT_PUBLIC_SANITY_PROJECT_ID not set - using default values for build')
}

if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.warn('NEXT_PUBLIC_SANITY_DATASET not set - using default values for build')
}

const builder = createImageUrlBuilder({ projectId, dataset })

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}