"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

type ApplicantCardProps = {
  application: Applicant;
};

function getStatusClasses(status: string) {
  switch (status) {
    case "SUBMITTED":
      return "bg-blue-50 text-blue-700";
    case "IN_REVIEW":
      return "bg-yellow-50 text-yellow-700";
    case "SHORTLISTED":
      return "bg-purple-50 text-purple-700";
    case "REJECTED":
      return "bg-red-50 text-red-700";
    case "HIRED":
      return "bg-green-50 text-green-700";
    case "WITHDRAWN":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function ApplicantCard({ application }: ApplicantCardProps) {
  const router = useRouter();
  const [status, setStatus] = useState(application.status);
  const [isSaving, setIsSaving] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setStatus(newStatus);
      setIsSaving(true);

      const res = await fetch(`/api/employer/applications/${application.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update application status");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      setStatus(application.status);
    } finally {
      setIsSaving(false);
    }
  };

  const profile = application.user.candidateProfile;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {application.user.name || "Unnamed Candidate"}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {application.user.email}
            </p>

            {profile?.headline && (
              <p className="mt-2 text-sm font-medium text-gray-700">
                {profile.headline}
              </p>
            )}
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
              status,
            )}`}
          >
            {status.replaceAll("_", " ")}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          {profile?.location && (
            <span className="rounded-full bg-gray-100 px-3 py-1">
              {profile.location}
            </span>
          )}

          <span className="rounded-full bg-gray-100 px-3 py-1">
            Applied on {new Date(application.createdAt).toLocaleDateString()}
          </span>
        </div>

        {application.coverLetter && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900">
              Cover Letter
            </h3>
            <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
              {application.coverLetter}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {application.resumeUrl && (
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              View Resume
            </a>
          )}

          {!application.resumeUrl && profile?.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              View Resume
            </a>
          )}

          {profile?.githubUrl && (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              GitHub
            </a>
          )}

          {profile?.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              LinkedIn
            </a>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Update Status
          </label>

          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isSaving}
            className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 disabled:opacity-50"
          >
            <option value="SUBMITTED">Submitted</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="REJECTED">Rejected</option>
            <option value="HIRED">Hired</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </div>
      </div>
    </div>
  );
}
