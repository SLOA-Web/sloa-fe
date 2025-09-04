interface SanityAsset {
  _ref: string;
  _type: 'reference';
}

export interface SanityPost {
  _id: string;
  title: string;
  author: string;
  slug: { current: string };
  publishedAt: string;
  image?: { asset: SanityAsset };
  excerpt?: string;
  category?: string;
  body: any[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
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
  content: any[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

