import ApplicationCard from "./ApplicationCard";
import { Job } from "@/interfaces/job";

type Application = {
  id: string;
  jobId: string;
  userId: string;
  status: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  job: Job;
};

type ApplicationListProps = {
  applications: Application[];
};

export default function ApplicationList({
  applications,
}: ApplicationListProps) {
  if (!applications || applications.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          No applications yet
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Once you apply for jobs, they’ll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  );
}
