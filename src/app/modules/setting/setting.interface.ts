export interface Settings {
  id?: string;

  // Site identity
  siteTitle?: string;
  tagline?: string;
  logoUrl?: string;
  faviconUrl?: string;

  // Social Links
  linkedinUrl?: string;
  githubUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;

  // Contact info
  resumeLink?: string;
  contactEmail?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  address?: string;

  // Availability & meta
  availability?: string;
  experience?: string;

  // SEO
  metaDescription?: string;
  metaKeywords?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
