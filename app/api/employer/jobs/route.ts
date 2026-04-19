import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { CreateJobSchema } from "@/zod/zod";
import { redis } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user.id as string | undefined;
    const role = session?.user.role as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (role !== "ADMIN" && role !== "EMPLOYER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validation = CreateJobSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Bad request", issues: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    if (role !== "ADMIN") {
      const company = await prisma.company.findFirst({
        where: {
          id: data.companyId,
          owners: {
            some: {
              id: userId,
            },
          },
        },
        select: { id: true },
      });

      if (!company) {
        return NextResponse.json(
          { error: "You do not own this company" },
          { status: 403 }
        );
      }
    }

    const job = await prisma.job.create({
      data: {
        companyId: data.companyId,
        createdById: userId,
        title: data.title,
        slug: data.slug,
        description: data.description,
        requirements: data.requirements,
        benefits: data.benefits,
        jobType: data.jobType,
        workplaceType: data.workplaceType,
        experienceLevel: data.experienceLevel,
        location: data.location,
        isRemote: data.isRemote ?? false,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        salaryPeriod: data.salaryPeriod,
        currency: data.currency,
        applyUrl: data.applyUrl,
        applyEmail: data.applyEmail,
        isPublished: data.isPublished ?? false,
        publishedAt: data.isPublished ? new Date() : null,
        tags:
          data.tagIds && data.tagIds.length > 0
            ? {
                create: data.tagIds.map((tagId) => ({
                  tag: {
                    connect: { id: tagId },
                  },
                })),
              }
            : undefined,
      },
      include: {
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

    await redis.del(`company:${job.company.slug}`);

    if (job.isPublished) {
      await redis.del(`job:${job.company.slug}:${job.slug}`);
    }

    return NextResponse.json(
      {
        data: {
          ...job,
          tags: job.tags.map((t) => t.tag),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "That slug is already used for this company" },
        { status: 409 }
      );
    }

    console.error("Create job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}