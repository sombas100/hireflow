import ApplicantCard from "./ApplicantCard";

type Applicant = {
  id: string;
  jobId: string;
  userId: string;
  status: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    candidateProfile?: {
      headline?: string | null;
      location?: string | null;
      resumeUrl?: string | null;
      githubUrl?: string | null;
      linkedinUrl?: string | null;
    } | null;
  };
};

type ApplicantListProps = {
  applications: Applicant[];
};

export default function ApplicantList({ applications }: ApplicantListProps) {
  if (!applications || applications.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          No applicants yet
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Applications for this job will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {applications.map((application) => (
        <ApplicantCard key={application.id} application={application} />
      ))}
    </div>
  );
}
