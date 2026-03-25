import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import CreateJobForm from "@/components/employer/CreateJobForm";
import type { Company } from "@/interfaces/company";
import type { Tag } from "@/interfaces/job";

async function getEmployerCompanies(
  userId: string,
  role: string,
): Promise<Company[]> {
  const companies = await prisma.company.findMany({
    where:
      role === "ADMIN"
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
  const tags = await prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return tags;
}

type PageProps = {
  searchParams: Promise<{
    companyId?: string;
  }>;
};

export default async function CreateJobPage({ searchParams }: PageProps) {
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
  const [companies, tags] = await Promise.all([
    getEmployerCompanies(userId, role),
    getTags(),
  ]);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Job</h1>
          <p className="mt-2 text-gray-600">
            Fill in the details below to publish a new job opportunity.
          </p>
        </div>

        <CreateJobForm
          companies={companies}
          tags={tags}
          defaultCompanyId={resolvedSearchParams.companyId || ""}
        />
      </div>
    </main>
  );
}
