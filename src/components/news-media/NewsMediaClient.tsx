'use client'

import { useState, useEffect } from 'react'
import { Search, Calendar } from 'lucide-react'
import {
  getFilteredEvents,
  getFilteredPublications,
  EVENTS_PER_PAGE,
  PUBLICATIONS_PER_PAGE
} from '@/libs/sanity.api'
import type { SanityEvent, SanityPost, SanityAnnouncement } from '@/types/sanity'
import Tabs from '@/components/ui/Tabs'
import EventCard from './EventCard'
import PublicationCard from './PublicationCard'
import AnnouncementCard from './AnnouncementCard'

// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

interface NewsMediaClientProps {
  initialEvents: SanityEvent[]
  initialPublications: SanityPost[]
  initialAnnouncements: SanityAnnouncement[]
  initialHasMoreEvents: boolean
  initialHasMorePublications: boolean
}

export default function NewsMediaClient({ 
  initialEvents, 
  initialPublications, 
  initialAnnouncements,
  initialHasMoreEvents,
  initialHasMorePublications 
}: NewsMediaClientProps) {
  // Data State
  const [events, setEvents] = useState<SanityEvent[]>(initialEvents)
  const [publications, setPublications] = useState<SanityPost[]>(initialPublications)
  const [announcements] = useState<SanityAnnouncement[]>(initialAnnouncements)

  // Filter & Search State
  const [eventSearchTerm, setEventSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState<'all' | number>('all')
  const [publicationSearchTerm, setPublicationSearchTerm] = useState('')

  // Debounced values
  const debouncedEventSearch = useDebounce(eventSearchTerm, 300)
  const debouncedPublicationSearch = useDebounce(publicationSearchTerm, 300)

  // Pagination State
  const [eventPage, setEventPage] = useState(1)
  const [publicationPage, setPublicationPage] = useState(1)
  const [hasMoreEvents, setHasMoreEvents] = useState(initialHasMoreEvents)
  const [hasMorePublications, setHasMorePublications] = useState(initialHasMorePublications)

  // Loading State
  const [eventsLoading, setEventsLoading] = useState(false)
  const [pubsLoading, setPubsLoading] = useState(false)

  // Reset to page 1 when filters change
  useEffect(() => {
    setEventPage(1)
  }, [debouncedEventSearch, selectedYear])
  
  useEffect(() => {
    setPublicationPage(1)
  }, [debouncedPublicationSearch])

  // Fetch events when filters or page change
  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true)
      const newEvents = await getFilteredEvents({ 
        page: eventPage, 
        searchTerm: debouncedEventSearch, 
        year: selectedYear 
      })
      setEvents(newEvents)
      setHasMoreEvents(newEvents.length === EVENTS_PER_PAGE)
      setEventsLoading(false)
    }
    fetchEvents()
  }, [eventPage, debouncedEventSearch, selectedYear])

  // Fetch publications when filters or page change
  useEffect(() => {
    const fetchPubs = async () => {
      setPubsLoading(true)
      const newPubs = await getFilteredPublications({ 
        page: publicationPage, 
        searchTerm: debouncedPublicationSearch 
      })
      setPublications(newPubs)
      setHasMorePublications(newPubs.length === PUBLICATIONS_PER_PAGE)
      setPubsLoading(false)
    }
    fetchPubs()
  }, [publicationPage, debouncedPublicationSearch])

  // Generate years for filter
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)

  const isEventFiltering = debouncedEventSearch !== '' || selectedYear !== 'all'
  const isPublicationFiltering = debouncedPublicationSearch !== ''

  // Events Tab Content
  const eventsContent = (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={eventSearchTerm}
            onChange={(e) => setEventSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
        
        <div className="relative">
          <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="input pl-10 pr-10"
          >
            <option value="all">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading */}
      {eventsLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading events...</p>
        </div>
      )}

      {/* Events Grid */}
      {!eventsLoading && (
        <>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No events found.</p>
            </div>
          )}

          {/* Pagination */}
          {!isEventFiltering && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setEventPage(p => p - 1)}
                disabled={eventPage === 1}
                className="btn btn-outline btn-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {eventPage}</span>
              <button
                onClick={() => setEventPage(p => p + 1)}
                disabled={!hasMoreEvents}
                className="btn btn-outline btn-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )

  // Publications Tab Content
  const publicationsContent = (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search publications..."
          value={publicationSearchTerm}
          onChange={(e) => setPublicationSearchTerm(e.target.value)}
          className="input pl-10 w-full"
        />
      </div>

      {/* Loading */}
      {pubsLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading publications...</p>
        </div>
      )}

      {/* Publications List */}
      {!pubsLoading && (
        <>
          {publications.length > 0 ? (
            <div className="space-y-4">
              {publications.map((pub) => (
                <PublicationCard key={pub._id} publication={pub} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No publications found.</p>
            </div>
          )}

          {/* Pagination */}
          {!isPublicationFiltering && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setPublicationPage(p => p - 1)}
                disabled={publicationPage === 1}
                className="btn btn-outline btn-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {publicationPage}</span>
              <button
                onClick={() => setPublicationPage(p => p + 1)}
                disabled={!hasMorePublications}
                className="btn btn-outline btn-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )

  // Announcements Tab Content
  const announcementsContent = (
    <div className="space-y-4">
      {announcements.length > 0 ? (
        announcements.map((announcement) => (
          <AnnouncementCard key={announcement._id} announcement={announcement} />
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No active announcements.</p>
        </div>
      )}
    </div>
  )

  const tabs = [
    {
      id: 'events',
      label: 'Past Events',
      content: eventsContent,
      count: events.length
    },
    {
      id: 'publications',
      label: 'Publications',
      content: publicationsContent,
      count: publications.length
    },
    {
      id: 'announcements',
      label: 'Announcements',
      content: announcementsContent,
      count: announcements.length
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">News & Media</h1>
        <p className="text-lg text-gray-600">
          Stay updated with our latest events, publications, and announcements.
        </p>
      </div>

      <Tabs tabs={tabs} defaultTab="events" />
    </div>
  )
}
