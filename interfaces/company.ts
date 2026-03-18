import type { Job } from "./job";

export interface CompanyCount {
  jobs: number;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  websiteUrl?: string | null;
  logoUrl?: string | null;
  location?: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: CompanyCount;
  jobs?: Job[];
}