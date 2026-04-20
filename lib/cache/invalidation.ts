import { redis } from "@/lib/redis";

export async function invalidateCompanyCache(companySlug?: string | null) {
  if (!companySlug) return;

  await redis.del(`company:${companySlug}`);
}

export async function invalidateJobCache(
  companySlug?: string | null,
  jobSlug?: string | null,
) {
  if (!companySlug || !jobSlug) return;

  await redis.del(`job:${companySlug}:${jobSlug}`);
}

export async function invalidateMultipleCacheKeys(keys: Array<string | null | undefined>) {
  const uniqueKeys = Array.from(
    new Set(keys.filter((key): key is string => Boolean(key)))
  );

  if (uniqueKeys.length === 0) return;

  await Promise.all(uniqueKeys.map((key) => redis.del(key)));
}

export async function invalidateCompanyAndJobCaches(params: {
  companySlug?: string | null;
  jobSlug?: string | null;
  isPublished?: boolean | null;
}) {
  const keys: string[] = [];

  if (params.companySlug) {
    keys.push(`company:${params.companySlug}`);
  }

  if (params.companySlug && params.jobSlug && params.isPublished) {
    keys.push(`job:${params.companySlug}:${params.jobSlug}`);
  }

  await invalidateMultipleCacheKeys(keys);
}

export async function invalidateCompanyWithPublishedJobs(params: {
  companySlug?: string | null;
  publishedJobSlugs?: string[];
}) {
  const keys: string[] = [];

  if (params.companySlug) {
    keys.push(`company:${params.companySlug}`);
  }

  if (params.companySlug && params.publishedJobSlugs?.length) {
    for (const jobSlug of params.publishedJobSlugs) {
      keys.push(`job:${params.companySlug}:${jobSlug}`);
    }
  }

  await invalidateMultipleCacheKeys(keys);
}