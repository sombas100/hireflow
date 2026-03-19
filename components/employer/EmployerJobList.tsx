import EmployerJobCard from "./EmployerJobCard";
import type { Job } from "@/interfaces/job";

type EmployerJobListProps = {
  jobs: Job[];
};

export default function EmployerJobList({ jobs }: EmployerJobListProps) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-gray-800">No jobs yet</h2>
        <p className="mt-2 text-sm text-gray-600">
          Create your first company and post your first job to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <EmployerJobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
