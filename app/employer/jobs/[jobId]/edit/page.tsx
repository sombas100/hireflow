import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import EditJobForm from "@/components/employer/EditJobForm";
import type { Company } from "@/interfaces/company";
import type { Job, Tag } from "@/interfaces/job";

type PageProps = {
  params: Promise<{
    jobId: string;
  }>;
};

async function getEmployerCompanies(
  userId: string,
  role: string,
): Promise<Company[]> {
  const companies = await prisma.company.findMany({
    where:
      role === "ADMIN" || "EMPLOYER"
        ? {}
        : {
            owners: {
              some: {
                id: userId,
              },
            },
          },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      location: true,
      description: true,
      websiteUrl: true,
      logoUrl: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          jobs: true,
        },
      },
    },
  });

  return companies.map((company) => ({
    ...company,
    createdAt: company.createdAt.toISOString(),
    updatedAt: company.updatedAt.toISOString(),
  })) as Company[];
}

async function getTags(): Promise<Tag[]> {
  return prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
}

async function getEditableJob(
  jobId: string,
  userId: string,
  role: string,
): Promise<Job | "forbidden" | null> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          location: true,
          owners: {
            select: {
              id: true,
            },
          },
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
      _count: {
        select: {
          applications: true,
          bookmarks: true,
        },
      },
    },
  });

  if (!job) return null;

  if (role !== "ADMIN") {
    const ownsJobDirectly = job.createdById === userId;
    const ownsCompany = job.company.owners.some((owner) => owner.id === userId);

    if (!ownsJobDirectly && !ownsCompany) {
      return "forbidden";
    }
  }

  return {
    ...job,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    publishedAt: job.publishedAt ? job.publishedAt.toISOString() : null,
    expiresAt: job.expiresAt ? job.expiresAt.toISOString() : null,
    company: {
      id: job.company.id,
      name: job.company.name,
      slug: job.company.slug,
      logoUrl: job.company.logoUrl,
      location: job.company.location,
    },
    tags: job.tags.map((item) => item.tag),
  } as Job;
}

export default async function EditJobPage({ params }: PageProps) {
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

  const [job, companies, tags] = await Promise.all([
    getEditableJob(jobId, userId, role),
    getEmployerCompanies(userId, role),
    getTags(),
  ]);

  if (job === "forbidden" || !job) {
    redirect("/employer/jobs");
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
          <p className="mt-2 text-gray-600">
            Update this job posting and keep the details up to date.
          </p>
        </div>

        <EditJobForm job={job} companies={companies} tags={tags} />
      </div>
    </main>
  );
}
