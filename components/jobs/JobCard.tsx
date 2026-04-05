import Link from "next/link";
import type { Job } from "@/interfaces/job";
import JobBookmarkButton from "./JobBookmarkButton";

type JobCardProps = {
  job: Job;
  isAuthenticated: boolean;
  userRole?: string;
  isBookmarked: boolean;
};

export default function JobCard({
  job,
  isAuthenticated,
  userRole,
  isBookmarked,
}: JobCardProps) {
  const canBookmark =
    isAuthenticated && (userRole === "CANDIDATE" || userRole === "ADMIN");

  return (
    <div className="rounded-xl border border-gray-200 hover:border-primary bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href={`/jobs/${job.company.slug}/${job.slug}`}
              className="text-xl font-semibold text-gray-900 hover:underline"
            >
              {job.title}
            </Link>
            <p className="mt-1 text-sm text-gray-600">{job.company.name}</p>
          </div>

          {canBookmark && (
            <JobBookmarkButton
              jobId={job.id}
              initialBookmarked={isBookmarked}
            />
          )}
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
            {job.currency || "GBP"} {job.salaryMin ?? 0} - {job.salaryMax ?? 0}
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
    </div>
  );
}
