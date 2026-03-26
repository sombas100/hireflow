import JobCard from "./JobCard";
import type { Job } from "@/interfaces/job";

type JobListProps = {
  jobs: Job[];
  isAuthenticated: boolean;
  userRole?: string;
  bookmarkedJobIds: string[];
};

export default function JobList({
  jobs,
  isAuthenticated,
  userRole,
  bookmarkedJobIds,
}: JobListProps) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-gray-800">No jobs found</h2>
        <p className="mt-2 text-sm text-gray-600">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          isAuthenticated={isAuthenticated}
          userRole={userRole}
          isBookmarked={bookmarkedJobIds.includes(job.id)}
        />
      ))}
    </div>
  );
}
