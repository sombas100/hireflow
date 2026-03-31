import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://hireflowjobs.io";

  const jobs = await prisma.job.findMany({
    where: { isPublished: true },
    select: {
      slug: true,
      updatedAt: true,
      company: {
        select: {
          slug: true,
        },
      },
    },
  });

  const companies = await prisma.company.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
    },
  ];

  const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${baseUrl}/jobs/${job.company.slug}/${job.slug}`,
    lastModified: job.updatedAt,
  }));

  const companyPages: MetadataRoute.Sitemap = companies.map((company) => ({
    url: `${baseUrl}/companies/${company.slug}`,
    lastModified: company.updatedAt,
  }));

  return [...staticPages, ...jobPages, ...companyPages];
}