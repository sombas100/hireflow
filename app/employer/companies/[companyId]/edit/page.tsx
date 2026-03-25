import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import EditCompanyForm from "@/components/employer/EditCompanyForm";
import type { Company } from "@/interfaces/company";

type PageProps = {
  params: Promise<{
    companyId: string;
  }>;
};

async function getEditableCompany(
  companyId: string,
  userId: string,
  role: string,
): Promise<Company | "forbidden" | null> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
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
    },
  });

  if (!company) return null;

  if (role !== "ADMIN") {
    const ownsCompany = company.owners.some((owner) => owner.id === userId);

    if (!ownsCompany) {
      return "forbidden";
    }
  }

  return {
    ...company,
    createdAt: company.createdAt.toISOString(),
    updatedAt: company.updatedAt.toISOString(),
  } as Company;
}

export default async function EditCompanyPage({ params }: PageProps) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  const role = (session?.user as any)?.role as string | undefined;

  if (!userId) {
    redirect("/login");
  }

  if (role !== "EMPLOYER" && role !== "ADMIN") {
    redirect("/");
  }

  const { companyId } = await params;
  const company = await getEditableCompany(companyId, userId, role);

  if (!company || company === "forbidden") {
    redirect("/employer/companies");
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Company</h1>
          <p className="mt-2 text-gray-600">
            Update your company details and public profile.
          </p>
        </div>

        <EditCompanyForm company={company} />
      </div>
    </main>
  );
}
