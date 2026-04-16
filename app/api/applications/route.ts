import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { CreateApplicationSchema } from "@/zod/zod";
import { applyRatelimit } from "@/lib/ratelimit";

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user.id as string | undefined;
    const role = session?.user.role as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (role !== "CANDIDATE" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip = getClientIp(request);
    const identifier = userId ? `user:${userId}` : `ip:${ip}`;

    const { success, limit, remaining, reset } =
      await applyRatelimit.limit(identifier);

    if (!success) {
      return NextResponse.json(
        {
          error: "Too many application attempts. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
          },
        }
      );
    }

    const body = await request.json();
    const validation = CreateApplicationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Bad request",
          issues: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    const job = await prisma.job.findFirst({
      where: { id: data.jobId, isPublished: true },
      select: {
        id: true,
        title: true,
        company: {
          select: { id: true, name: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job was not found" },
        { status: 404 }
      );
    }

    const application = await prisma.application.create({
      data: {
        jobId: data.jobId,
        userId,
        coverLetter: data.coverLetter,
        resumeUrl: data.resumeUrl,
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      { data: application },
      {
        status: 201,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(reset),
        },
      }
    );
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 409 }
      );
    }

    console.error("Create application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}