export interface HeroSlide {
  id: number;
  backgroundImage: string;
  title: string;
  content?: string;
}


export interface EventAgendaItem {
  time: string;
  topic: string;
  speaker?: string;
}

export interface EventCardProp {
  image: string;
  date: string;
  time?: string;
  title: string;
  summary: string;
  doctor?: string;
  location?: string;
  capacity?: string;
  registrationDeadline?: string;
  agenda?: EventAgendaItem[];
  totalRegistrations?: number;
  onReadMore?: () => void;
}

export interface EventApiType {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string | null;
  time?: string;
  location?: string;
  posterUrl?: string | null;
  agenda?: { time: string; topic: string; speaker?: string; description?: string }[];
  externalRegistrationUrl?: string | null;
  criteria?: unknown;
  isRegistrationOpen: boolean;
  maxCapacity?: number;
  registrationDeadline?: string;
  createdBy?: string;
  createdAt?: string;
  creator?: { id: string; fullName: string };
  _count?: { registrations: number };
}

export type Resource = {
  id: string;
  name: string;
  category: string;
  type: string;
  link: string;
};

export interface SectionHeaderProps {
  text: string;
  color?: string; // hex or tailwind color class
  className?: string;
}

export interface CustomImageProps {
  imageUrl: string; // Optional image URL for the hero section
  imageClassname?: string; 
}


export type BookEventData = {
  id: string;
  date: string;
  month: string;
  title: string;
  by: string;
  cta: string;
  description: string;
  dateBg: string;
};

export interface CommonBannerProps {
  imageUrl: string;
  text: string;
}

export interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onClick?: () => void;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  nic?: string;
  specialization?: string;
  hospital?: string;
  location?: string;
  cv?: string;
  birthDate?: string;
  documents?: string[];
  // Add other user properties as needed
}

// New API response types for upcoming events
export interface UpcomingEvent {
  id: string;
  image: string;
  title: string;
  shortDesc: string;
  date: string;
  speaker: string;
}

export interface UpcomingEventsResponse {
  events: UpcomingEvent[];
  count: number;
}

// Banner API response types
export interface BannerImageVariant {
  url: string;
  size: number;
}

export interface BannerImageVariants {
  thumbnail: BannerImageVariant;
  medium: BannerImageVariant;
  large: BannerImageVariant;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
  linkUrl: string;
  displayOrder: number;
  imageVariants: BannerImageVariants;
  createdAt: string;
  updatedAt: string;
}

export interface BannersResponse {
  banners: Banner[];
}
