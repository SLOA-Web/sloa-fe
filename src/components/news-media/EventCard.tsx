'use client'

import { Calendar, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/libs/image'
import type { SanityEvent } from '@/types/sanity'

interface EventCardProps {
  event: SanityEvent
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const coverImage = event.imageGallery?.[0]

  return (
    <Link 
      href={`/news-media/events/${event._id}`}
      className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        {coverImage ? (
          <Image
            src={urlFor(coverImage).width(400).height(300).url()}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar size={16} className="mr-2" />
            {formatDate(event.eventDate)}
          </div>
          
          {event.location && (
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin size={16} className="mr-2" />
              {event.location}
            </div>
          )}
        </div>

        {event.shortDescription && (
          <p className="text-gray-700 text-sm line-clamp-3">
            {event.shortDescription}
          </p>
        )}
      </div>
    </Link>
  )
}
