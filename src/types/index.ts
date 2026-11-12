export type PageType = 'home' | 'about' | 'services' | 'gallery' | 'contact';

export type GalleryCategory =
  | 'ALL'
  | 'PHOTO SHOOTS'
  | 'PRE-WEDDING'
  | 'PRE-BIRTHDAY'
  | 'EVENTS'
  | 'ALBUM DESIGNS'
  | 'VIDEO PROJECTS'
  | 'PHOTO FRAMES'
  | 'PHOTO CUPS'
  | 'MAGIC CUPS'
  | 'MAGIC PILLOWS';

export interface ServiceItem {
  id: string;
  serviceKey: string;
  title: string;
  tagline: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  iconName: string;
  features: string[];
  startingPrice?: string;
  deliveryTime?: string;
  isPopular?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  thumbnailUrl?: string;
  isVideo?: boolean;
  videoUrl?: string;
  duration?: string;
  description: string;
  location?: string;
  featured?: boolean;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  serviceUsed: string;
  eventLocation: string;
  rating: number;
  comment: string;
  date: string;
  avatarUrl: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  service: string;
  eventDate?: string;
  message: string;
}
