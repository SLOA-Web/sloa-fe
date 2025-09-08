import { 
  getFilteredEvents, 
  getFilteredPublications,
  getActiveAnnouncements,
  EVENTS_PER_PAGE, 
  PUBLICATIONS_PER_PAGE 
} from '@/libs/sanity.api'
import NewsMediaClient from '@/components/news-media/NewsMediaClient'
import CommonHero from '@/components/CommonHero'

export default async function NewsAndMediaPage() {
  const [initialEvents, initialPublications, initialAnnouncements] = await Promise.all([
    getFilteredEvents({ page: 1 }),
    getFilteredPublications({ page: 1 }),
    getActiveAnnouncements(),
  ])

  const hasMoreEvents = initialEvents.length === EVENTS_PER_PAGE
  const hasMorePublications = initialPublications.length === PUBLICATIONS_PER_PAGE

  return (
    <>
      <div className="container mx-auto px-4 py-20 md:pt-32">
        <CommonHero
          title="News & Media"
          description="Insights, updates, and highlights from the Sri Lankan Organization of America. Explore our past events, read publications, and view the latest announcements."
          imageUrl="/assets/images/homepage_hero.svg"
          imageClassname="bg-primary-200/30"
        />
      </div>
      <NewsMediaClient 
        initialEvents={initialEvents} 
        initialPublications={initialPublications}
        initialAnnouncements={initialAnnouncements}
        initialHasMoreEvents={hasMoreEvents}
        initialHasMorePublications={hasMorePublications}
      />
    </>
  )
}

export const revalidate = 60

export const metadata = {
  title: 'News & Media | SLOA',
  description: 'Stay updated with our latest events, publications, and announcements from the Sri Lankan Organization of America.',
}
