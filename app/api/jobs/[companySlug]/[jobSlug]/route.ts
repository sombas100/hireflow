import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";
import type { CachedJob } from "@/lib/types";

type RouteContext = {
  params: Promise<{ companySlug: string; jobSlug: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { companySlug, jobSlug } = await context.params;

    if (!companySlug || !jobSlug) {
      return NextResponse.json(
        { error: "Company slug and job slug are required" },
        { status: 400 }
      );
    }

    const cacheKey = `job:${companySlug}:${jobSlug}`;
    const cached = await redis.get<CachedJob>(cacheKey);

    if (cached) {
      console.log("CACHE HIT");
      return NextResponse.json({ data: cached }, { status: 200 });
    }

    console.log("CACHE MISS");

    const job = await prisma.job.findFirst({
      where: {
        slug: jobSlug,
        isPublished: true,
        company: { slug: companySlug },
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            websiteUrl: true,
            logoUrl: true,
            location: true,
          },
        },
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
            bookmarks: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const formattedJob = {
      ...job,
      tags: job.tags.map((item) => item.tag),
    };

    await redis.set(cacheKey, formattedJob, {
      ex: 300,
    });

    return NextResponse.json({ data: formattedJob }, { status: 200 });
  } catch (error) {
    console.error("There was an error retrieving the job details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}