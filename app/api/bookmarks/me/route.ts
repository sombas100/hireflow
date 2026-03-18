import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;
    const role = (session?.user as any)?.role as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (role !== "CANDIDATE" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            location: true,
            jobType: true,
            workplaceType: true,
            isRemote: true,
            salaryMin: true,
            salaryMax: true,
            salaryPeriod: true,
            currency: true,
            isPublished: true,
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
          },
        },
      },
    });

    if (!bookmarks)
      return NextResponse.json({ message: 'Your bookmarks are empty'}, { status: 404 })

    return NextResponse.json(
      {
        data: bookmarks.map((bookmark) => ({
          ...bookmark,
          job: {
            ...bookmark.job,
            tags: bookmark.job.tags.map((item) => item.tag),
          },
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get my bookmarks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}