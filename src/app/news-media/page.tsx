import { 
  getFilteredEvents, 
  getFilteredPublications,
  getActiveAnnouncements,
  EVENTS_PER_PAGE, 
  PUBLICATIONS_PER_PAGE 
} from '@/libs/sanity.api'
import NewsMediaClient from '@/components/news-media/NewsMediaClient'

export default async function NewsAndMediaPage() {
  const [initialEvents, initialPublications, initialAnnouncements] = await Promise.all([
    getFilteredEvents({ page: 1 }),
    getFilteredPublications({ page: 1 }),
    getActiveAnnouncements(),
  ])

  const hasMoreEvents = initialEvents.length === EVENTS_PER_PAGE
  const hasMorePublications = initialPublications.length === PUBLICATIONS_PER_PAGE

  return (
    <NewsMediaClient 
      initialEvents={initialEvents} 
      initialPublications={initialPublications}
      initialAnnouncements={initialAnnouncements}
      initialHasMoreEvents={hasMoreEvents}
      initialHasMorePublications={hasMorePublications}
    />
  )
}

export const revalidate = 60

export const metadata = {
  title: 'News & Media | SLOA',
  description: 'Stay updated with our latest events, publications, and announcements from the Sri Lankan Organization of America.',
}
