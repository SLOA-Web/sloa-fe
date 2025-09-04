'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  getFilteredEvents, 
  getFilteredPublications, 
  EVENTS_PER_PAGE, 
  PUBLICATIONS_PER_PAGE 
} from '@/libs/sanity.api'
import { urlFor } from '@/libs/image'
import Image from 'next/image'
import type { SanityEvent, SanityPost } from '@/types/sanity'

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' },
  mainTitle: { fontSize: '2.5rem', borderBottom: '2px solid #eee', paddingBottom: '1rem', marginBottom: '2rem' },
  sectionTitle: { fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' },
  filters: { display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center', flexWrap: 'wrap' as const },
  input: { padding: '0.5rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' },
  card: { border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  cardTitle: { fontSize: '1.5rem', margin: '0 0 0.5rem 0' },
  list: { display: 'flex', flexDirection: 'column' as const, gap: '1rem' },
  listItem: { border: '1px solid #eee', padding: '1rem', borderRadius: '8px' },
  loadingText: { fontStyle: 'italic', color: '#888' },
  noResults: { color: '#555' },
  pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' },
  button: { padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff' },
  buttonDisabled: { cursor: 'not-allowed', backgroundColor: '#f0f0f0', color: '#aaa' },
  gallery: { display: 'flex', flexWrap: 'wrap' as const, gap: '0.5rem', marginTop: '1rem' },
  galleryImage: { borderRadius: '4px', objectFit: 'cover' as const },
};

// A small debounce hook to prevent API calls on every keystroke
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface NewsAndMediaClientProps {
  initialEvents: SanityEvent[];
  initialPublications: SanityPost[];
  initialHasMoreEvents: boolean;
  initialHasMorePublications: boolean;
}

export default function NewsAndMediaClient({ 
  initialEvents, 
  initialPublications, 
  initialHasMoreEvents,
  initialHasMorePublications 
}: NewsAndMediaClientProps) {
  // Data State
  const [events, setEvents] = useState<SanityEvent[]>(initialEvents);
  const [publications, setPublications] = useState<SanityPost[]>(initialPublications);

  // Filter & Search State
  const [eventSearchTerm, setEventSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<'all' | number>('all');
  const [publicationSearchTerm, setPublicationSearchTerm] = useState('');

  // Debounced values for API calls
  const debouncedEventSearch = useDebounce(eventSearchTerm, 300);
  const debouncedPublicationSearch = useDebounce(publicationSearchTerm, 300);

  // Pagination State
  const [eventPage, setEventPage] = useState(1);
  const [publicationPage, setPublicationPage] = useState(1);
  const [hasMoreEvents, setHasMoreEvents] = useState(initialHasMoreEvents);
  const [hasMorePublications, setHasMorePublications] = useState(initialHasMorePublications);

  // Loading State
  const [eventsLoading, setEventsLoading] = useState(false);
  const [pubsLoading, setPubsLoading] = useState(false);

  // When filters change, reset to page 1
  useEffect(() => {
    setEventPage(1);
  }, [debouncedEventSearch, selectedYear]);
  
  useEffect(() => {
    setPublicationPage(1);
  }, [debouncedPublicationSearch]);


  // Main data fetching effect for events
  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true);
      const newEvents = await getFilteredEvents({ 
        page: eventPage, 
        searchTerm: debouncedEventSearch, 
        year: selectedYear 
      });
      setEvents(newEvents);
      setHasMoreEvents(newEvents.length === EVENTS_PER_PAGE);
      setEventsLoading(false);
    };
    fetchEvents();
  }, [eventPage, debouncedEventSearch, selectedYear]);

  // Main data fetching effect for publications
  useEffect(() => {
    const fetchPubs = async () => {
      setPubsLoading(true);
      const newPubs = await getFilteredPublications({ 
        page: publicationPage, 
        searchTerm: debouncedPublicationSearch 
      });
      setPublications(newPubs);
      setHasMorePublications(newPubs.length === PUBLICATIONS_PER_PAGE);
      setPubsLoading(false);
    };
    fetchPubs();
  }, [publicationPage, debouncedPublicationSearch]);


  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - i);
  }, []);

  const isEventFiltering = debouncedEventSearch !== '' || selectedYear !== 'all';
  const isPublicationFiltering = debouncedPublicationSearch !== '';

  return (
    <main style={styles.container}>
      <h1 style={styles.mainTitle}>News & Media</h1>

      <section>
        <h2 style={styles.sectionTitle}>Past Events</h2>
        <div style={styles.filters}>
          <input type="text" placeholder="Search events..." value={eventSearchTerm} onChange={(e) => setEventSearchTerm(e.target.value)} style={styles.input} />
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))} style={styles.input}>
            <option value="all">All Years</option>
            {years.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>

        {eventsLoading ? <p style={styles.loadingText}>Loading...</p> : events.length > 0 ? (
          <div style={styles.grid}>
            {events.map((event) => (
              <article key={event._id} style={styles.card}>
                <h3 style={styles.cardTitle}>{event.title}</h3>
                <p><strong>Date:</strong> {event.eventDate}</p>
                {event.location && <p><strong>Location:</strong> {event.location}</p>}
                <p>{event.shortDescription}</p>
                <div style={styles.gallery}>
                  {event.imageGallery?.map((image, index) => (
                    <Image key={index} src={urlFor(image).width(300).height(200).url()} alt={event.title} width={300} height={200} style={styles.galleryImage}/>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : <p style={styles.noResults}>No events found.</p>}
        
        {!isEventFiltering && <div style={styles.pagination}>
          <button onClick={() => setEventPage(p => p - 1)} disabled={eventPage === 1} style={eventPage === 1 ? styles.buttonDisabled : styles.button}>Previous</button>
          <span>Page {eventPage}</span>
          <button onClick={() => setEventPage(p => p + 1)} disabled={!hasMoreEvents} style={!hasMoreEvents ? styles.buttonDisabled : styles.button}>Next</button>
        </div>}
      </section>

      <section>
        <h2 style={styles.sectionTitle}>Publications</h2>
        <div style={styles.filters}>
          <input type="text" placeholder="Search publications..." value={publicationSearchTerm} onChange={(e) => setPublicationSearchTerm(e.target.value)} style={styles.input} />
        </div>
        
        {pubsLoading ? <p style={styles.loadingText}>Loading...</p> : publications.length > 0 ? (
          <div style={styles.list}>
            {publications.map((pub) => (
              <article key={pub._id} style={styles.listItem}>
                <h3 style={styles.cardTitle}>{pub.title}</h3>
                <p><strong>By:</strong> {pub.author}</p>
                <p><strong>Published on:</strong> {new Date(pub.publishedAt).toLocaleDateString()}</p>
              </article>
            ))}
          </div>
        ) : <p style={styles.noResults}>No publications found.</p>}
        
        {!isPublicationFiltering && <div style={styles.pagination}>
            <button onClick={() => setPublicationPage(p => p - 1)} disabled={publicationPage === 1} style={publicationPage === 1 ? styles.buttonDisabled : styles.button}>Previous</button>
            <span>Page {publicationPage}</span>
            <button onClick={() => setPublicationPage(p => p + 1)} disabled={!hasMorePublications} style={!hasMorePublications ? styles.buttonDisabled : styles.button}>Next</button>
        </div>}
      </section>
    </main>
  );
}