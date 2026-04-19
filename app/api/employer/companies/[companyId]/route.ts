import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redis } from "@/lib/redis";

type RouteContext = {
  params: Promise<{
    companyId: string;
  }>;
};

const UpdateCompanySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
});

export async function PATCH(request: NextRequest, context: RouteContext) {
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

    const { companyId } = await context.params;

    if (!companyId) {
      return NextResponse.json(
        { error: "Company id is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = UpdateCompanySchema.safeParse(body);

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

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        slug: true,
        owners: {
          select: {
            id: true,
          },
        },
        jobs: {
          where: {
            isPublished: true,
          },
          select: {
            slug: true,
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

    if (role !== "ADMIN") {
      const ownsCompany = company.owners.some((owner) => owner.id === userId);

      if (!ownsCompany) {
        return NextResponse.json(
          { error: "You do not have permission to update this company" },
          { status: 403 }
        );
      }
    }

    const oldCompanySlug = company.slug;
    const oldPublishedJobSlugs = company.jobs.map((job) => job.slug);

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        websiteUrl: data.websiteUrl === "" ? null : data.websiteUrl,
        location: data.location,
      },
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
        jobs: {
          where: {
            isPublished: true,
          },
          select: {
            slug: true,
          },
        },
      },
    });

    const newCompanySlug = updatedCompany.slug;
    const newPublishedJobSlugs = updatedCompany.jobs.map((job) => job.slug);

    const cacheKeysToDelete = new Set<string>();

    cacheKeysToDelete.add(`company:${oldCompanySlug}`);
    cacheKeysToDelete.add(`company:${newCompanySlug}`);

    for (const jobSlug of oldPublishedJobSlugs) {
      cacheKeysToDelete.add(`job:${oldCompanySlug}:${jobSlug}`);
    }

    for (const jobSlug of newPublishedJobSlugs) {
      cacheKeysToDelete.add(`job:${newCompanySlug}:${jobSlug}`);
    }

    await Promise.all(
      Array.from(cacheKeysToDelete).map((key) => redis.del(key))
    );

    return NextResponse.json({ data: updatedCompany }, { status: 200 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "A company with that slug already exists" },
        { status: 409 }
      );
    }

    console.error("Update company error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
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

    const { companyId } = await context.params;

    if (!companyId) {
      return NextResponse.json(
        { error: "Company id is required" },
        { status: 400 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        slug: true,
        owners: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            jobs: true,
          },
        },
        jobs: {
          where: {
            isPublished: true,
          },
          select: {
            slug: true,
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

    if (role !== "ADMIN") {
      const ownsCompany = company.owners.some((owner) => owner.id === userId);

      if (!ownsCompany) {
        return NextResponse.json(
          { error: "You do not have permission to delete this company" },
          { status: 403 }
        );
      }
    }

    if (company._count.jobs > 0) {
      return NextResponse.json(
        {
          error:
            "You cannot delete a company that still has jobs. Delete the jobs first.",
        },
        { status: 400 }
      );
    }

    const oldCompanySlug = company.slug;
    const oldPublishedJobSlugs = company.jobs.map((job) => job.slug);

    await prisma.company.delete({
      where: { id: companyId },
    });

    const cacheKeysToDelete = new Set<string>();

    cacheKeysToDelete.add(`company:${oldCompanySlug}`);

    for (const jobSlug of oldPublishedJobSlugs) {
      cacheKeysToDelete.add(`job:${oldCompanySlug}:${jobSlug}`);
    }

    await Promise.all(
      Array.from(cacheKeysToDelete).map((key) => redis.del(key))
    );

    return NextResponse.json(
      { message: "Company deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete company error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}