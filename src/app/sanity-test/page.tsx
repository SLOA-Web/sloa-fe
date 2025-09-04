// /app/news-and-media/page.tsx

import { getFilteredEvents, getFilteredPublications, EVENTS_PER_PAGE, PUBLICATIONS_PER_PAGE } from '@/libs/sanity.api'
import NewsAndMediaClient from '@/components/NewsAndMediaClient'

export default async function NewsAndMediaPage() {
  const [initialEvents, initialPublications] = await Promise.all([
    getFilteredEvents({ page: 1 }),
    getFilteredPublications({ page: 1 }),
  ]);

  const hasMoreEvents = initialEvents.length === EVENTS_PER_PAGE;
  const hasMorePublications = initialPublications.length === PUBLICATIONS_PER_PAGE;

  return (
    <NewsAndMediaClient 
      initialEvents={initialEvents} 
      initialPublications={initialPublications} 
      initialHasMoreEvents={hasMoreEvents}
      initialHasMorePublications={hasMorePublications}
    />
  );
}

export const revalidate = 60;