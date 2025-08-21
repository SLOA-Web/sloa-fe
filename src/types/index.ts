export interface HeroSlide {
  id: number;
  backgroundImage: string;
  title: string;
  content?: string;
}

export interface EventCardProp {
  image: string;
  date: string;
  title: string;
  summary: string;
  doctor?:string;
  onReadMore?: () => void;
}

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