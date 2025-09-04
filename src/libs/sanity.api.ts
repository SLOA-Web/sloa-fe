// /lib/sanity.api.ts
import { client } from './client'
import type { SanityEvent, SanityPost } from '@/types/sanity'

export const EVENTS_PER_PAGE = 6;
export const PUBLICATIONS_PER_PAGE = 10;

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
  const params: Record<string, any> = {};

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
  const params: Record<string, any> = {};

  if (searchTerm) {
    query += ` && title match $searchTerm`;
    params.searchTerm = `${searchTerm}*`;
  }

  query += `] | order(publishedAt desc) [${start}...${end}]`;

  return client.fetch(query, params);
}