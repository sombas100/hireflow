import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ApplicationList from "@/components/candidate/ApplicationList";
import Pagination from "@/components/shared/Pagination";
import Navbar from "@/app/Navbar";
import MainFooter from "@/components/ui/MainFooter";
import { Job } from "@/interfaces/job";

type Application = {
  id: string;
  jobId: string;
  userId: string;
  status: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  job: Job;
};

type CandidateApplicationsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

async function getApplications(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
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
            isPublished: true,
            salaryMin: true,
            salaryMax: true,
            salaryPeriod: true,
            currency: true,
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
    }),
    prisma.application.count({
      where: {
        userId,
      },
    }),
  ]);

  const formattedApplications = applications.map((application) => ({
    ...application,
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
    job: {
      ...application.job,
      tags: application.job.tags.map((item) => item.tag),
    },
  })) as Application[];

  return {
    applications: formattedApplications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export default async function CandidateApplicationsPage({
  searchParams,
}: CandidateApplicationsPageProps) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  const role = (session?.user as any)?.role as string | undefined;

  if (!userId) {
    redirect("/login");
  }

  if (role !== "CANDIDATE" && role !== "ADMIN") {
    redirect("/");
  }

  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page || "1");
  const limit = 5;

  const { applications, pagination } = await getApplications(
    userId,
    page,
    limit,
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              My Applications
            </h1>
            <p className="mt-2 text-gray-600">
              Track the jobs you’ve applied for and manage your applications.
            </p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {pagination.total} application
              {pagination.total === 1 ? "" : "s"}
            </p>
          </div>

          <ApplicationList applications={applications} />

          <div className="mt-8">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              searchParams={resolvedSearchParams}
              basePath="/candidate/applications"
            />
          </div>
        </div>
      </main>

      <MainFooter />
    </>
  );
}
