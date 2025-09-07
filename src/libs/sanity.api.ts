// /lib/sanity.api.ts
import { client } from './client'
import type { SanityEvent, SanityPost, SanityAnnouncement } from '@/types/sanity'

export const EVENTS_PER_PAGE = 6;
export const PUBLICATIONS_PER_PAGE = 10;
export const ANNOUNCEMENTS_PER_PAGE = 12;

// --- Combined Event Fetching Function ---
interface GetEventsParams {
  page: number;
  searchTerm?: string;
  year?: number | 'all';
}

export async function getFilteredEvents({ page, searchTerm, year }: GetEventsParams): Promise<SanityEvent[]> {
  const start = (page - 1) * EVENTS_PER_PAGE;
  const end = start + EVENTS_PER_PAGE;

  let query = `*[_type == "event"`;
  const params: Record<string, string | number> = {};

  // Build the query conditions
  const conditions = [];
  if (searchTerm) {
    conditions.push(`title match $searchTerm`);
    params.searchTerm = `${searchTerm}*`;
  }
  if (year && year !== 'all') {
    conditions.push(`eventDate >= $startDate && eventDate <= $endDate`);
    params.startDate = `${year}-01-01`;
    params.endDate = `${year}-12-31`;
  }

  if (conditions.length > 0) {
    query += ` && (${conditions.join(' && ')})`;
  }

  query += `] | order(eventDate desc) [${start}...${end}]`;
  
  return client.fetch(query, params);
}


// --- Combined Publication Fetching Function ---
interface GetPublicationsParams {
  page: number;
  searchTerm?: string;
}
export async function getFilteredPublications({ page, searchTerm }: GetPublicationsParams): Promise<SanityPost[]> {
  const start = (page - 1) * PUBLICATIONS_PER_PAGE;
  const end = start + PUBLICATIONS_PER_PAGE;

  let query = `*[_type == "post"`;
  const params: Record<string, string> = {};

  if (searchTerm) {
    query += ` && title match $searchTerm`;
    params.searchTerm = `${searchTerm}*`;
  }

  query += `] | order(publishedAt desc) [${start}...${end}]`;

  return client.fetch(query, params);
}

// --- Announcement Functions ---
export async function getActiveAnnouncements(): Promise<SanityAnnouncement[]> {
  const query = `*[_type == "announcement" && isActive == true && (!defined(expiryDate) || expiryDate >= now())] | order(priority desc, publishedAt desc) [0...${ANNOUNCEMENTS_PER_PAGE}]`;
  return client.fetch(query);
}

// --- Individual Item Functions ---
export async function getEventById(id: string): Promise<SanityEvent | null> {
  const query = `*[_type == "event" && _id == $id][0]`;
  return client.fetch(query, { id });
}

export async function getPublicationBySlug(slug: string): Promise<SanityPost | null> {
  const query = `*[_type == "post" && slug.current == $slug][0]`;
  return client.fetch(query, { slug });
}