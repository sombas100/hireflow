import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { UpdateJobSchema } from "@/zod/zod";

type RouteContext = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
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

    const { jobId } = await context.params;

    if (!jobId) {
      return NextResponse.json({ error: "Job id is required" }, { status: 400 });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        title: true,
        createdById: true,
        company: {
          select: {
            id: true,
            owners: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (role !== "ADMIN") {
      const ownsJobDirectly = job.createdById === userId;
      const ownsCompany = job.company.owners.some((owner) => owner.id === userId);

      if (!ownsJobDirectly && !ownsCompany) {
        return NextResponse.json(
          { error: "You do not have permission to delete this job" },
          { status: 403 }
        );
      }
    }

    await prisma.job.delete({
      where: { id: jobId },
    });

    return NextResponse.json(
      { message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
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

    const { jobId } = await context.params;

    if (!jobId) {
      return NextResponse.json({ error: "Job id is required" }, { status: 400 });
    }

    const body = await req.json();
    const validation = UpdateJobSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid body",
          issues: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 }
      );
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        createdById: true,
        company: {
          select: {
            owners: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (role !== "ADMIN") {
      const ownsJobDirectly = job.createdById === userId;
      const ownsCompany = job.company.owners.some((owner) => owner.id === userId);

      if (!ownsJobDirectly && !ownsCompany) {
        return NextResponse.json(
          { error: "You do not have permission to update this job" },
          { status: 403 }
        );
      }
    }

    const { tagIds, ...rest } = data;

    const updateData = {
      ...rest,
      expiresAt:
        rest.expiresAt === undefined
          ? undefined
          : rest.expiresAt === null
          ? null
          : new Date(rest.expiresAt),
      publishedAt:
        rest.isPublished === true ? new Date() : undefined,
    };

    const updatedJob = await prisma.$transaction(async (tx) => {
      await tx.job.update({
        where: { id: jobId },
        data: updateData,
      });

      if (tagIds !== undefined) {
        await tx.jobTag.deleteMany({
          where: { jobId },
        });

        if (tagIds.length > 0) {
          await tx.jobTag.createMany({
            data: tagIds.map((tagId) => ({
              jobId,
              tagId,
            })),
            skipDuplicates: true,
          });
        }
      }

      return tx.job.findUnique({
        where: { id: jobId },
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
    });

    return NextResponse.json(
      {
        data: {
          ...updatedJob,
          tags: updatedJob?.tags.map((item) => item.tag) ?? [],
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "That slug is already used for this company" },
        { status: 409 }
      );
    }

    console.error("Update job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}