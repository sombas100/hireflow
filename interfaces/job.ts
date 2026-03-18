export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface CompanySummary {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  location?: string | null;
  description?: string | null;
  websiteUrl?: string | null;
}

export interface JobCount {
  applications?: number;
  bookmarks?: number;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  requirements?: string | null;
  benefits?: string | null;
  location?: string | null;
  isRemote: boolean;
  jobType: string;
  workplaceType: string;
  experienceLevel?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryPeriod?: string | null;
  currency?: string | null;
  applyUrl?: string | null;
  applyEmail?: string | null;
  isPublished?: boolean;
  publishedAt?: string | null;
  expiresAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  company: CompanySummary;
  tags: Tag[];
  _count?: JobCount;
}