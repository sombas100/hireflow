import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { CreateBookmarkSchema } from "@/zod/zod";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const validation = CreateBookmarkSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid body",
          issues: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { jobId } = validation.data;

    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found or unavailable" },
        { status: 404 }
      );
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        jobId,
        userId,
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
            company: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ data: bookmark }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "You have already bookmarked this job" },
        { status: 409 }
      );
    }

    console.error("Create bookmark error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}