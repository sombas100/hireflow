import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type RouteContext = {
  params: Promise<{
    applicationId: string;
  }>;
};

export async function PATCH(_request: NextRequest, context: RouteContext) {
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

    const { applicationId } = await context.params;

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application id is required" },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
      select: {
        id: true,
        userId: true,
        status: true,
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            company: {
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

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (role !== "ADMIN" && application.userId !== userId) {
      return NextResponse.json(
        { error: "You do not have permission to withdraw this application" },
        { status: 403 }
      );
    }

    if (application.status === "WITHDRAWN") {
      return NextResponse.json(
        { error: "Application is already withdrawn" },
        { status: 400 }
      );
    }

    const updatedApplication = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        status: "WITHDRAWN",
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            company: {
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

    return NextResponse.json({ data: updatedApplication }, { status: 200 });
  } catch (error) {
    console.error("Withdraw application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}