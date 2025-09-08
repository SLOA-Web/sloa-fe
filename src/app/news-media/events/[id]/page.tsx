export const runtime = 'edge';
import { notFound } from 'next/navigation'
import { Calendar, MapPin, ExternalLink, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getEventById } from '@/libs/sanity.api'
import ImageGallery from '@/components/ui/ImageGallery'
import type { Metadata } from 'next'

interface EventPageProps {
  params: Promise<{ id: string }>
}

export default async function EventPage(props: EventPageProps) {
  const params = await props.params;
  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="container mx-auto px-4 py-20 md:py-32">
      {/* Back Navigation */}
      <Link 
        href="/news-media"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to News & Media
      </Link>

      {/* Event Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600">
          <div className="flex items-center">
            <Calendar size={20} className="mr-2" />
            <span className="font-medium">{formatDate(event.eventDate)}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center">
              <MapPin size={20} className="mr-2" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Event Description */}
      {event.shortDescription && (
        <div className="mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              {event.shortDescription}
            </p>
          </div>
        </div>
      )}

      {/* Image Gallery */}
      {event.imageGallery && event.imageGallery.length > 0 && (
        <div className="m-4 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Event Gallery</h2>
          <ImageGallery 
            images={event.imageGallery} 
            title={event.title}
            className="mb-6"
          />
        </div>
      )}

      {/* View More Link */}
      {event.viewMoreLink && (
        <div className="text-center">
          <a
            href={event.viewMoreLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center btn btn-primary btn-lg"
          >
            View Full Album
            <ExternalLink size={20} className="ml-2" />
          </a>
        </div>
      )}
    </div>
  )
}

export async function generateMetadata(props: EventPageProps): Promise<Metadata> {
  const params = await props.params;
  const event = await getEventById(params.id)

  if (!event) {
    return {
      title: 'Event Not Found | SLOA',
      description: 'The requested event could not be found.',
    }
  }

  return {
    title: `${event.title} | SLOA Events`,
    description: event.shortDescription || `Details about the ${event.title} event hosted by SLOA.`,
    openGraph: {
      title: event.title,
      description: event.shortDescription,
      type: 'article',
      publishedTime: event.eventDate,
    },
  }
}
