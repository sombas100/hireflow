import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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