import {
  getFilteredEvents,
  getFilteredPublications,
  getActiveAnnouncements,
  EVENTS_PER_PAGE,
  PUBLICATIONS_PER_PAGE,
} from "@/libs/sanity.api";
import NewsMediaClient from "@/components/news-media/NewsMediaClient";
import CommonBanner from "@/components/CommonBanner";

export default async function NewsAndMediaPage() {
  const [initialEvents, initialPublications, initialAnnouncements] =
    await Promise.all([
      getFilteredEvents({ page: 1 }),
      getFilteredPublications({ page: 1 }),
      getActiveAnnouncements(),
    ]);

  const hasMoreEvents = initialEvents.length === EVENTS_PER_PAGE;
  const hasMorePublications =
    initialPublications.length === PUBLICATIONS_PER_PAGE;

  return (
    <>
      <div className="py-8 md:py-16">
        <CommonBanner
          text="News & Media"
          imageUrl="/assets/images/homepage_hero.svg"
        />
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <NewsMediaClient
          initialEvents={initialEvents}
          initialPublications={initialPublications}
          initialAnnouncements={initialAnnouncements}
          initialHasMoreEvents={hasMoreEvents}
          initialHasMorePublications={hasMorePublications}
        />
      </div>
    </>
  );
}

export const revalidate = 60;

export const metadata = {
  title: "News & Media - Sri Lanka Orthopaedic Association",
  description:
    "Stay updated with our latest events, publications, and announcements from the Sri Lanka Orthopaedic Association.",
};
