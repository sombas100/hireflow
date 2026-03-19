import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import EmployerCompanyList from "@/components/employer/EmployerCompanyList";
import CreateCompanyForm from "@/components/employer/CreateCompanyForm";
import type { Company } from "@/interfaces/company";

async function getEmployerCompanies(userId: string): Promise<Company[]> {
  const companies = await prisma.company.findMany({
    where: {
      owners: {
        some: {
          id: userId,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
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

export default async function EmployerCompaniesPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  const role = (session?.user as any)?.role as string | undefined;

  if (!userId) {
    redirect("/login");
  }

  if (role !== "EMPLOYER" && role !== "ADMIN") {
    redirect("/");
  }

  const companies = await getEmployerCompanies(userId);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Companies</h1>
            <p className="mt-2 text-gray-600">
              Manage your companies and prepare them for job postings.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <CreateCompanyForm />
        </div>

        <EmployerCompanyList companies={companies} />
      </div>
    </main>
  );
}
