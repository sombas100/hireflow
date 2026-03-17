import JobCard from "./JobCard";

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

type JobListProps = {
  jobs: Job[];
};

export default function JobList({ jobs }: JobListProps) {
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
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
