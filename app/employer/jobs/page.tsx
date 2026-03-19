import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import EmployerJobList from "@/components/employer/EmployerJobList";
import type { Job } from "@/interfaces/job";

async function getEmployerJobs(userId: string, role: string): Promise<Job[]> {
  const jobs = await prisma.job.findMany({
    where:
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

  return jobs.map((job) => ({
    ...job,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    publishedAt: job.publishedAt ? job.publishedAt.toISOString() : null,
    expiresAt: job.expiresAt ? job.expiresAt.toISOString() : null,
    tags: job.tags.map((item) => item.tag),
  })) as Job[];
}

export default async function EmployerJobsPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  const role = (session?.user as any)?.role as string | undefined;

  if (!userId) {
    redirect("/login");
  }

  if (role !== "EMPLOYER" && role !== "ADMIN") {
    redirect("/");
  }

  const jobs = await getEmployerJobs(userId, role);

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

        <EmployerJobList jobs={jobs} />
      </div>
    </main>
  );
}
