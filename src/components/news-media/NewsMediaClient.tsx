'use client'

import { useState, useEffect } from 'react'
import { Search, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  getFilteredEvents,
  getFilteredPublications,
  EVENTS_PER_PAGE,
  PUBLICATIONS_PER_PAGE
} from '@/libs/sanity.api'
import type { SanityEvent, SanityPost, SanityAnnouncement } from '@/types/sanity'
import Tabs from '@/components/ui/Tabs'
import SearchFilterBar from '@/components/ui/SearchFilterBar'
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
  // Announcements pagination (client-side)
  const ANNOUNCEMENTS_PER_PAGE = 5
  const [announcementPage, setAnnouncementPage] = useState(1)

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
    <div className="space-y-6 mx-auto">
      {/* Filters */}
      <SearchFilterBar
        search={eventSearchTerm}
        onSearchChange={setEventSearchTerm}
        selectedFilter={selectedYear.toString()}
        onFilterChange={(value) => setSelectedYear(value === 'all' ? 'all' : Number(value))}
        filterOptions={[
          { value: 'all', label: 'All Years' },
          ...years.map(year => ({ value: year.toString(), label: year.toString() }))
        ]}
        totalResults={events.length}
        searchPlaceholder="Search events by title, location..."
        resultsLabel="events found"
        searchLabel="Search Events"
        filterLabel="Filter by Year"
      />

      {/* Loading */}
      {eventsLoading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading events...</p>
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
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">No events found.</p>
            </div>
          )}

          {/* Pagination */}
          {!isEventFiltering && (
            <div className="flex justify-center items-center mt-8">
              <div className="flex items-center gap-3 rounded-full bg-card border shadow-sm px-3 py-2">
                <button
                  onClick={() => setEventPage(p => p - 1)}
                  disabled={eventPage === 1}
                  className="inline-flex items-center gap-1 btn btn-outline btn-sm disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>
                <span className="text-xs md:text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  Page {eventPage}
                </span>
                <button
                  onClick={() => setEventPage(p => p + 1)}
                  disabled={!hasMoreEvents}
                  className="inline-flex items-center gap-1 btn btn-outline btn-sm disabled:opacity-50"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )

  // Publications Tab Content
  const publicationsContent = (
    <div className="space-y-6 mx-auto">
      {/* Search */}
      <SearchFilterBar
        search={publicationSearchTerm}
        onSearchChange={setPublicationSearchTerm}
        selectedFilter=""
        onFilterChange={() => {}}
        filterOptions={[]}
        totalResults={publications.length}
        searchPlaceholder="Search publications by title or author..."
        resultsLabel="publications found"
        searchLabel="Search Publications"
        showFilter={false}
      />

      {/* Loading */}
      {pubsLoading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading publications...</p>
        </div>
      )}

      {/* Publications List */}
      {!pubsLoading && (
        <>
          {publications.length > 0 ? (
            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.map((pub) => (
                <PublicationCard key={pub._id} publication={pub} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">No publications found.</p>
            </div>
          )}

          {/* Pagination */}
          {!isPublicationFiltering && (
            <div className="flex justify-center items-center mt-8">
              <div className="flex items-center gap-3 rounded-full bg-card border shadow-sm px-3 py-2">
                <button
                  onClick={() => setPublicationPage(p => p - 1)}
                  disabled={publicationPage === 1}
                  className="inline-flex items-center gap-1 btn btn-outline btn-sm disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>
                <span className="text-xs md:text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  Page {publicationPage}
                </span>
                <button
                  onClick={() => setPublicationPage(p => p + 1)}
                  disabled={!hasMorePublications}
                  className="inline-flex items-center gap-1 btn btn-outline btn-sm disabled:opacity-50"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )

  // Announcements Tab Content
  const totalAnnouncementPages = Math.max(1, Math.ceil(announcements.length / ANNOUNCEMENTS_PER_PAGE))
  const pagedAnnouncements = announcements.slice(
    (announcementPage - 1) * ANNOUNCEMENTS_PER_PAGE,
    announcementPage * ANNOUNCEMENTS_PER_PAGE
  )

  const announcementsContent = (
    <div className="space-y-6 mx-auto">
      {announcements.length > 0 ? (
        <>
          <div className="space-y-4">
            {pagedAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement._id} announcement={announcement} />
            ))}
          </div>
          {totalAnnouncementPages > 1 && (
            <div className="flex justify-center items-center mt-4">
              <div className="flex items-center gap-3 rounded-full bg-card border shadow-sm px-3 py-2">
                <button
                  onClick={() => setAnnouncementPage((p) => Math.max(1, p - 1))}
                  disabled={announcementPage === 1}
                  className="btn btn-outline btn-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-xs md:text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  Page {announcementPage} of {totalAnnouncementPages}
                </span>
                <button
                  onClick={() => setAnnouncementPage((p) => Math.min(totalAnnouncementPages, p + 1))}
                  disabled={announcementPage === totalAnnouncementPages}
                  className="btn btn-outline btn-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
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
    <div className="container mx-auto px-4 py-10">
      <Tabs tabs={tabs} defaultTab="events" />
    </div>
  )
}
