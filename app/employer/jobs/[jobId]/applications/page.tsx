import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ApplicantList from "@/components/employer/ApplicantList";

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
};

async function getApplicants(jobId: string, userId: string, role: string) {
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

  const applications = await prisma.application.findMany({
    where: { jobId },
    orderBy: { createdAt: "desc" },
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
  });

  return {
    jobTitle: job.title,
    applications: applications.map((application) => ({
      ...application,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    })) as Applicant[],
  };
}

export default async function EmployerApplicantsPage({ params }: PageProps) {
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
  const result = await getApplicants(jobId, userId, role);

  if (result === "forbidden") {
    redirect("/employer/jobs");
  }

  if (!result) {
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

        <ApplicantList applications={result.applications} />
      </div>
    </main>
  );
}
