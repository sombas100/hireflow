import Link from "next/link";

type Company = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  websiteUrl?: string | null;
  logoUrl?: string | null;
  location?: string | null;
  _count: {
    jobs: number;
  };
};

type CompanyCardProps = {
  company: Company;
};

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary hover:shadow-md"
    >
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

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span className="rounded-full bg-gray-100 px-3 py-1">
            {company._count.jobs} open job
            {company._count.jobs === 1 ? "" : "s"}
          </span>

          {company.websiteUrl && (
            <span className="rounded-full bg-gray-100 px-3 py-1">
              Website available
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
