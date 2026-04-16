export type CachedJob = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  requirements: string | null;
  benefits: string | null;
  location: string | null;
  isRemote: boolean;
  jobType: string;
  workplaceType: string;
  experienceLevel: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryPeriod: string | null;
  currency: string | null;
  applyUrl: string | null;
  applyEmail: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  company: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    websiteUrl: string | null;
    logoUrl: string | null;
    location: string | null;
  };

  tags: {
    id: string;
    name: string;
    slug: string;
  }[];

  _count: {
    applications: number;
    bookmarks: number;
  };
};

export type CachedJobsResponse = {
  data: Array<{
    id: string;
    title: string;
    slug: string;
    location: string | null;
    isRemote: boolean;
    jobType: string;
    workplaceType: string;
    experienceLevel: string | null;
    salaryMin: number | null;
    salaryMax: number | null;
    salaryPeriod: string | null;
    currency: string | null;
    publishedAt: Date | null;
    createdAt: Date;
    company: {
      id: string;
      name: string;
      slug: string;
      logoUrl: string | null;
      location: string | null;
    };
    tags: {
      id: string;
      name: string;
      slug: string;
    }[];
    _count: {
      applications: number;
    };
  }>;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};