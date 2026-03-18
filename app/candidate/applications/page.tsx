import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ApplicationList from "@/components/candidate/ApplicationList";
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

async function getApplications(userId: string): Promise<Application[]> {
  const applications = await prisma.application.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
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
  });

  return applications.map((application) => ({
    ...application,
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
    job: {
      ...application.job,
      tags: application.job.tags.map((item) => item.tag),
    },
  })) as Application[];
}

export default async function CandidateApplicationsPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  const role = (session?.user as any)?.role as string | undefined;

  if (!userId) {
    redirect("/login");
  }

  if (role !== "CANDIDATE" && role !== "ADMIN") {
    redirect("/");
  }

  const applications = await getApplications(userId);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="mt-2 text-gray-600">
            Track the jobs you’ve applied for and manage your applications.
          </p>
        </div>

        <ApplicationList applications={applications} />
      </div>
    </main>
  );
}
