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

  const wordCount = (publication.excerpt || '').split(/\s+/).filter(Boolean).length
  const readTime = Math.max(1, Math.round(wordCount / 200))

  const authorName = publication.author || 'Unknown'
  const initials = authorName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('')

  return (
    <Link 
      href={`/news-media/publications/${publication.slug.current}`}
      className="group block bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/60"
    >
      {/* Top image */}
      <div className="relative h-44 md:h-56 bg-muted">
        {publication.image ? (
          <Image
            src={urlFor(publication.image).width(800).height(450).url()}
            alt={publication.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : null}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-[18px] md:text-[20px] font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {publication.title}
        </h3>

        {publication.excerpt && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
            {publication.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
              {initials || <User size={12} />}
            </div>
            <span className="truncate max-w-[140px]">{authorName}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{formatDate(publication.publishedAt)}</span>
          </div>
          <span>•</span>
          <span>{readTime} min read</span>
        </div>
      </div>
    </Link>
  )
}
