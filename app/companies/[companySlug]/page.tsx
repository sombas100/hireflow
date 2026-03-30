import Link from "next/link";
import { notFound } from "next/navigation";
import { Job } from "@/interfaces/job";
import { Tag } from "@/interfaces/job";
import MainFooter from "@/components/ui/MainFooter";

type CompanyDetailsPageProps = {
  params: Promise<{
    companySlug: string;
  }>;
};

async function getCompany(companySlug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/companies/${companySlug}`,
    {
      cache: "no-store",
    },
  );

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch company");
  }

  return res.json();
}

export default async function CompanyDetailsPage({
  params,
}: CompanyDetailsPageProps) {
  const { companySlug } = await params;
  const response = await getCompany(companySlug);

  if (!response || !response.data) {
    notFound();
  }

  const company = response.data;

  return (
    <>
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <Link
              href="/companies"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              ← Back to companies
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-8 border-b border-gray-200 pb-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {company.name}
                  </h1>

                  {company.location && (
                    <p className="mt-2 text-sm text-gray-600">
                      {company.location}
                    </p>
                  )}
                </div>

                {company.websiteUrl && (
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Visit Website
                  </a>
                )}
              </div>

              {company.description && (
                <p className="mt-6 max-w-3xl whitespace-pre-line text-sm leading-7 text-gray-700">
                  {company.description}
                </p>
              )}
            </div>

            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Open Jobs
                </h2>
                <p className="text-sm text-gray-600">
                  {company.jobs.length} job
                  {company.jobs.length === 1 ? "" : "s"}
                </p>
              </div>

              {company.jobs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    No open jobs right now
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Check back later for new opportunities.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {company.jobs.map((job: Job) => (
                    <Link
                      key={job.id}
                      href={`/jobs/${company.slug}/${job.slug}`}
                      className="block rounded-xl border border-gray-200 bg-gray-50 p-5 transition hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {job.title}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
                            {job.location && (
                              <span className="rounded-full bg-white px-3 py-1">
                                {job.location}
                              </span>
                            )}

                            <span className="rounded-full bg-white px-3 py-1">
                              {job.jobType.replaceAll("_", " ")}
                            </span>

                            <span className="rounded-full bg-white px-3 py-1">
                              {job.workplaceType}
                            </span>

                            {job.isRemote && (
                              <span className="rounded-full bg-white px-3 py-1">
                                Remote
                              </span>
                            )}
                          </div>
                        </div>

                        {(job.salaryMin || job.salaryMax) && (
                          <p className="text-sm font-medium text-gray-800">
                            {job.currency || "GBP"} £{job.salaryMin ?? 0} - £
                            {job.salaryMax ?? 0}
                            {job.salaryPeriod
                              ? ` / ${job.salaryPeriod.toLowerCase()}`
                              : ""}
                          </p>
                        )}

                        {job.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {job.tags.map((tag: Tag) => (
                              <span
                                key={tag.id}
                                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="text-sm text-gray-500">
                          {job._count?.applications ?? 0} application
                          {(job._count?.applications ?? 0) === 1 ? "" : "s"}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <MainFooter />
    </>
  );
}
