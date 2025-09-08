interface SanityAsset {
  _ref: string;
  _type: 'reference';
}

// Sanity Portable Text types
interface SanityBlock {
  _type: 'block';
  _key: string;
  children: SanitySpan[];
  markDefs?: SanityMarkDef[];
  style?: string;
  level?: number;
  listItem?: string;
}

interface SanitySpan {
  _type: 'span';
  _key: string;
  text: string;
  marks?: string[];
}

interface SanityMarkDef {
  _type: 'link';
  _key: string;
  href: string;
}

export interface SanityImageBlock {
  _type: 'image';
  _key: string;
  asset: SanityAsset;
  alt?: string;
}

type SanityPortableText = (SanityBlock | SanityImageBlock)[];

export interface SanityPost {
  _id: string;
  title: string;
  author: string;
  slug: { current: string };
  publishedAt: string;
  image?: { asset: SanityAsset };
  excerpt?: string;
  category?: string;
  body: SanityPortableText;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface SanityEvent {
  _id: string;
  title: string;
  eventDate: string; 
  location?: string;
  shortDescription?: string;
  imageGallery?: { asset: SanityAsset }[];
  viewMoreLink?: string;
}

export interface SanityPage {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  heroImage?: { asset: SanityAsset };
  content: SanityPortableText;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface SanityAnnouncement {
  _id: string;
  title: string;
  content: string;
  publishedAt: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  expiryDate?: string;
}