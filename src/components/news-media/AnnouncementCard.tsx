'use client'

import { Calendar, AlertCircle, Info, Megaphone } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import type { SanityAnnouncement, SanityImageBlock } from '@/types/sanity'
import { cn } from '@/libs/utils'
import Image from 'next/image'
import { urlFor } from '@/libs/image'

interface AnnouncementCardProps {
  announcement: SanityAnnouncement
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={18} />
      case 'medium':
        return <Megaphone size={18} />
      case 'low':
      default:
        return <Info size={18} />
    }
  }

  const getPriorityClasses = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50 text-red-900'
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-900'
      case 'low':
      default:
        return 'border-primary-300 bg-primary-100 text-primary-700'
    }
  }

  // Minimal PortableText components for announcements
  const portableTextComponents = {
    block: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      normal: ({ children }: any) => (
        <p className="mb-2 leading-relaxed">{children}</p>
      ),
    },
    types: {
      image: ({ value }: { value: SanityImageBlock }) => {
        if (!value?.asset?._ref) return null
        return (
          <div className="my-3">
            <Image
              src={urlFor(value).width(800).height(450).url()}
              alt={value.alt || 'Announcement image'}
              width={800}
              height={450}
              className="rounded-md"
            />
          </div>
        )
      },
    },
  }

  return (
    <div className={cn(
      'rounded-lg border p-4 transition-all hover:shadow-md hover:-translate-y-0.5',
      getPriorityClasses(announcement.priority)
    )}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getPriorityIcon(announcement.priority)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-2">
            {announcement.title}
          </h3>
          
          <div className="text-sm mb-3 whitespace-pre-line">
            {typeof announcement.content === 'string' ? (
              <p>{announcement.content}</p>
            ) : (
              <PortableText value={announcement.content} components={portableTextComponents} />
            )}
          </div>
          
          <div className="flex items-center text-xs opacity-75">
            <Calendar size={12} className="mr-1" />
            Posted {formatDate(announcement.publishedAt)}
            {announcement.expiryDate && (
              <span className="ml-3">
                • Expires {formatDate(announcement.expiryDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
