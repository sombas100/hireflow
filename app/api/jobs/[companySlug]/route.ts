import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    companySlug: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { companySlug } = await context.params;

    if (!companySlug) {
      return NextResponse.json(
        { error: "Company slug is required" },
        { status: 400 }
      );
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
                bookmarks: true,
              },
            },
          },
        },
        _count: {
          select: {
            jobs: true,
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

    return NextResponse.json(
      {
        data: {
          ...company,
          jobs: company.jobs.map((job) => ({
            ...job,
            tags: job.tags.map((item) => item.tag),
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get public company details error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}