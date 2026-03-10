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

    if (role !== "EMPLOYER" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const jobs = await prisma.job.findMany({
      where: role === "ADMIN"
        ? {}
        : {
            OR: [
              { createdById: userId },
              {
                company: {
                  owners: {
                    some: {
                      id: userId,
                    },
                  },
                },
              },
            ],
          },
      orderBy: {
        createdAt: "desc",
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
        _count: {
          select: {
            applications: true,
            bookmarks: true,
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
    });

    return NextResponse.json(
      {
        data: jobs.map((job) => ({
          ...job,
          tags: job.tags.map((item) => item.tag),
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get employer jobs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}