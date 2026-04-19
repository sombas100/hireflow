import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import type { CachedCompanyDetailsResponse } from "@/lib/cache-types";

type RouteContext = {
  params: Promise<{
    companySlug: string;
  }>;
};

function buildCompanyDetailsCacheKey(companySlug: string) {
  return `company:${companySlug}`;
}

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { companySlug } = await context.params;

    if (!companySlug) {
      return NextResponse.json(
        { error: "Company slug is required" },
        { status: 400 }
      );
    }

    const cacheKey = buildCompanyDetailsCacheKey(companySlug);

    const cached = await redis.get<CachedCompanyDetailsResponse>(cacheKey);

    if (cached) {
      return NextResponse.json(cached, { status: 200 });
    }

    const company = await prisma.company.findUnique({
      where: {
        slug: companySlug,
      },
      include: {
        jobs: {
          where: {
            isPublished: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            tags: {
              include: {
                tag: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
            _count: {
              select: {
                applications: true,
              },
            },
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    const formattedJobs = company.jobs.map((job) => ({
      ...job,
      tags: job.tags.map((item) => item.tag),
    }));

    const response: CachedCompanyDetailsResponse = {
      data: {
        ...company,
        jobs: formattedJobs,
      },
    };

    await redis.set(cacheKey, response, {
      ex: 300,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get company details error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}