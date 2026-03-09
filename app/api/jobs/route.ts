import { NextRequest, NextResponse } from "next/server";
import { JobsQuerySchema } from "@/zod/zod";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    const rawQuery: Record<string, string | string[]> = {};
    for (const [key, value] of url.searchParams.entries()) {
      if (rawQuery[key]) {
        const prev = rawQuery[key];
        rawQuery[key] = Array.isArray(prev) ? [...prev, value] : [prev, value];
      } else {
        rawQuery[key] = value;
      }
    }

    const validation = JobsQuerySchema.safeParse(rawQuery);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          issues: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { q, location, type, workplace, tags, remote, sort, page, limit } =
      validation.data;

    const skip = (page - 1) * limit;

    
    const where: any = {
      isPublished: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { company: { name: { contains: q, mode: "insensitive" } } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (type) where.jobType = type;
    if (workplace) where.workplaceType = workplace;

    if (remote !== undefined) {
      where.isRemote = remote;
    }

    if (tags.length > 0) {
      where.tags = {
        some: {
          tag: {
            OR: [
              { slug: { in: tags } },
              { name: { in: tags } },
            ],
          },
        },
      };
    }

    const orderBy =
      sort === "salary"
        ? [
            { salaryMax: "desc" as const },
            { salaryMin: "desc" as const },
            { publishedAt: "desc" as const },
          ]
        : [{ publishedAt: "desc" as const }, { createdAt: "desc" as const }];

    
    const [total, jobs] = await prisma.$transaction([
      prisma.job.count({ where }),
      prisma.job.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          location: true,
          isRemote: true,
          jobType: true,
          workplaceType: true,
          experienceLevel: true,
          salaryMin: true,
          salaryMax: true,
          salaryPeriod: true,
          currency: true,
          publishedAt: true,
          createdAt: true,
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
              location: true,
            },
          },
          tags: {
            select: {
              tag: { select: { id: true, name: true, slug: true } },
            },
          },
          _count: {
            select: { applications: true },
          },
        },
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      data: jobs.map((j) => ({
        ...j,
        tags: j.tags.map((t) => t.tag),
      })),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}