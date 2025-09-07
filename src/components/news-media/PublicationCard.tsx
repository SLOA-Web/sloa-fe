'use client'

import { Calendar, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/libs/image'
import type { SanityPost } from '@/types/sanity'

interface PublicationCardProps {
  publication: SanityPost
}

export default function PublicationCard({ publication }: PublicationCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Link 
      href={`/news-media/publications/${publication.slug.current}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-200"
    >
      <div className="flex">
        {/* Image */}
        {publication.image && (
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={urlFor(publication.image).width(200).height(200).url()}
              alt={publication.title}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {publication.title}
          </h3>
          
          <div className="space-y-1 mb-2">
            <div className="flex items-center text-gray-600 text-sm">
              <User size={14} className="mr-2" />
              {publication.author}
            </div>
            
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar size={14} className="mr-2" />
              {formatDate(publication.publishedAt)}
            </div>
          </div>

          {publication.excerpt && (
            <p className="text-gray-700 text-sm line-clamp-2">
              {publication.excerpt}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
