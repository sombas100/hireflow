import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import EmployerJobList from "@/components/employer/EmployerJobList";
import Pagination from "@/components/shared/Pagination";
import type { Job } from "@/interfaces/job";

type EmployerJobsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

async function getEmployerJobs(
  userId: string,
  role: string,
  page: number,
  limit: number,
) {
  const skip = (page - 1) * limit;

  const where =
    role === "ADMIN"
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
        };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
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
    }),
    prisma.job.count({ where }),
  ]);

  const formattedJobs = jobs.map((job) => ({
    ...job,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    publishedAt: job.publishedAt ? job.publishedAt.toISOString() : null,
    expiresAt: job.expiresAt ? job.expiresAt.toISOString() : null,
    tags: job.tags.map((item) => item.tag),
  })) as Job[];

  return {
    jobs: formattedJobs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export default async function EmployerJobsPage({
  searchParams,
}: EmployerJobsPageProps) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  const role = (session?.user as any)?.role as string | undefined;

  if (!userId) {
    redirect("/login");
  }

  if (role !== "EMPLOYER" && role !== "ADMIN") {
    redirect("/");
  }

  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page || "1");
  const limit = 5;

  const { jobs, pagination } = await getEmployerJobs(userId, role, page, limit);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
            <p className="mt-2 text-gray-600">
              Manage your job posts and track applications.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {pagination.total} job{pagination.total === 1 ? "" : "s"}
          </p>
        </div>

        <EmployerJobList jobs={jobs} />

        <div className="mt-8">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            searchParams={resolvedSearchParams}
            basePath="/employer/jobs"
          />
        </div>
      </div>
    </main>
  );
}
