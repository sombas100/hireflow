import Link from "next/link";
import type { Company } from "@/interfaces/company";

type EmployerCompanyCardProps = {
  company: Company;
};

export default function EmployerCompanyCard({
  company,
}: EmployerCompanyCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {company.name}
          </h2>

          {company.location && (
            <p className="mt-1 text-sm text-gray-600">{company.location}</p>
          )}
        </div>

        {company.description && (
          <p className="line-clamp-3 text-sm leading-6 text-gray-700">
            {company.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <span className="rounded-full bg-gray-100 px-3 py-1">
            {company._count?.jobs ?? 0} job
            {(company._count?.jobs ?? 0) === 1 ? "" : "s"}
          </span>

          {company.websiteUrl && (
            <span className="rounded-full bg-gray-100 px-3 py-1">
              Website added
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/companies/${company.slug}`}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            View Public Page
          </Link>

          <Link
            href={`/employer/jobs/create?companyId=${company.id}`}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Post Job
          </Link>
        </div>
      </div>
    </div>
  );
}
