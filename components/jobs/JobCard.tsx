import Link from "next/link";

type Job = {
  id: string;
  title: string;
  slug: string;
  location?: string | null;
  isRemote: boolean;
  jobType: string;
  workplaceType: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryPeriod?: string | null;
  currency?: string | null;
  company: {
    name: string;
    slug: string;
    logoUrl?: string | null;
    location?: string | null;
  };
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
};

type JobCardProps = {
  job: Job;
};

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link
      href={`/jobs/${job.company.slug}/${job.slug}`}
      className="block rounded-xl border border-gray-200 bg-white hover:border-primary p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
          <p className="mt-1 text-sm text-gray-600">{job.company.name}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          {job.location && (
            <span className="rounded-full bg-gray-100 px-3 py-1">
              {job.location}
            </span>
          )}
          <span className="rounded-full bg-gray-100 px-3 py-1">
            {job.jobType.replace("_", " ")}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1">
            {job.workplaceType}
          </span>
          {job.isRemote && (
            <span className="rounded-full bg-gray-100 px-3 py-1">Remote</span>
          )}
        </div>

        {(job.salaryMin || job.salaryMax) && (
          <p className="text-sm font-medium text-gray-800">
            {job.currency || "GBP"} £{job.salaryMin ?? 0} - £
            {job.salaryMax ?? 0}
            {job.salaryPeriod ? ` / ${job.salaryPeriod.toLowerCase()}` : ""}
          </p>
        )}

        {job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
