import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ApplicantList from "@/components/employer/ApplicantList";
import Pagination from "@/components/shared/Pagination";

type Applicant = {
  id: string;
  jobId: string;
  userId: string;
  status: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    candidateProfile?: {
      headline?: string | null;
      location?: string | null;
      resumeUrl?: string | null;
      githubUrl?: string | null;
      linkedinUrl?: string | null;
    } | null;
  };
  job: {
    id: string;
    title: string;
    slug: string;
    company: {
      id: string;
      name: string;
      slug: string;
    };
  };
};

type PageProps = {
  params: Promise<{
    jobId: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
};

async function getApplicants(
  jobId: string,
  userId: string,
  role: string,
  page: number,
  limit: number,
) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      title: true,
      createdById: true,
      company: {
        select: {
          owners: {
            select: { id: true },
          },
        },
      },
    },
  });

  if (!job) return null;

  if (role !== "ADMIN") {
    const ownsJobDirectly = job.createdById === userId;
    const ownsCompany = job.company.owners.some((owner) => owner.id === userId);

    if (!ownsJobDirectly && !ownsCompany) {
      return "forbidden" as const;
    }
  }

  const skip = (page - 1) * limit;

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where: { jobId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            candidateProfile: {
              select: {
                headline: true,
                location: true,
                resumeUrl: true,
                githubUrl: true,
                linkedinUrl: true,
              },
            },
          },
        },
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
    }),
    prisma.application.count({
      where: { jobId },
    }),
  ]);

  return {
    jobTitle: job.title,
    applications: applications.map((application) => ({
      ...application,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    })) as Applicant[],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export default async function EmployerApplicantsPage({
  params,
  searchParams,
}: PageProps) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  const role = (session?.user as any)?.role as string | undefined;

  if (!userId) {
    redirect("/login");
  }

  if (role !== "EMPLOYER" && role !== "ADMIN") {
    redirect("/");
  }

  const { jobId } = await params;
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page || "1");
  const limit = 5;

  const result = await getApplicants(jobId, userId, role, page, limit);

  if (result === "forbidden" || !result) {
    redirect("/employer/jobs");
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
          <p className="mt-2 text-gray-600">
            Review candidates for{" "}
            <span className="font-medium">{result.jobTitle}</span>.
          </p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {result.pagination.total} applicant
            {result.pagination.total === 1 ? "" : "s"}
          </p>
        </div>

        <ApplicantList applications={result.applications} />

        <div className="mt-8">
          <Pagination
            page={result.pagination.page}
            totalPages={result.pagination.totalPages}
            searchParams={resolvedSearchParams}
            basePath={`/employer/jobs/${jobId}/applications`}
          />
        </div>
      </div>
    </main>
  );
}
