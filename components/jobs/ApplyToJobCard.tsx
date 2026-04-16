"use client";

import Link from "next/link";
import { useState } from "react";

type ApplyToJobCardProps = {
  jobId: string;
  userRole?: string;
  isAuthenticated: boolean;
  applyUrl?: string | null;
  applyEmail?: string | null;
  savedResumeUrl?: string;
  savedResumeName?: string;
};

export default function ApplyToJobCard({
  jobId,
  userRole,
  isAuthenticated,
  applyUrl,
  applyEmail,
  savedResumeUrl = "",
  savedResumeName = "",
}: ApplyToJobCardProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState(savedResumeUrl);
  const [useSavedResume, setUseSavedResume] = useState(Boolean(savedResumeUrl));
  const [isApplying, setIsApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const canApply =
    isAuthenticated && (userRole === "CANDIDATE" || userRole === "ADMIN");

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsApplying(true);
      setMessage("");
      setMessageType("");

      const finalResumeUrl = useSavedResume ? savedResumeUrl : resumeUrl;

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          coverLetter: coverLetter.trim() || undefined,
          resumeUrl: finalResumeUrl?.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessageType("error");

        if (res.status === 429) {
          setMessage(
            "Too many application attempts. Please wait before trying again.",
          );
          return;
        }

        if (res.status === 409) {
          setMessage("You have already applied to this job.");
          return;
        }

        if (res.status === 400) {
          setMessage(data?.error || "Your application details are invalid.");
          return;
        }

        if (res.status === 401) {
          setMessage("You need to sign in before applying.");
          return;
        }

        if (res.status === 403) {
          setMessage("Your account is not allowed to apply for jobs.");
          return;
        }

        if (res.status === 404) {
          setMessage("This job could not be found.");
          return;
        }

        throw new Error(data?.error || "Failed to apply");
      }

      setMessageType("success");
      setMessage("Application submitted successfully.");
      setCoverLetter("");

      if (!useSavedResume) {
        setResumeUrl("");
      }
    } catch (error: any) {
      console.error(error);
      setMessageType("error");
      setMessage(error.message || "Something went wrong while applying.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Apply for this role
      </h3>

      {!isAuthenticated && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Sign in as a candidate to apply for this job.
          </p>
          <Link
            href="/login"
            className="inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Sign In to Apply
          </Link>
        </div>
      )}

      {isAuthenticated && userRole === "EMPLOYER" && (
        <p className="text-sm text-gray-600">
          Employers cannot apply to jobs from this account.
        </p>
      )}

      {canApply && (
        <form onSubmit={handleApply} className="space-y-4">
          <div>
            <label
              htmlFor="coverLetter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              placeholder="Write a short message to the employer..."
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          {savedResumeUrl && (
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <label className="flex items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={useSavedResume}
                  onChange={(e) => setUseSavedResume(e.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span>
                  Use saved resume
                  {savedResumeName && (
                    <span className="ml-1 text-gray-500">
                      ({savedResumeName})
                    </span>
                  )}
                </span>
              </label>

              <div className="mt-2">
                <a
                  href={savedResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View saved resume
                </a>
              </div>
            </div>
          )}

          {!useSavedResume && (
            <div>
              <label
                htmlFor="resumeUrl"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Resume URL
              </label>
              <input
                id="resumeUrl"
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://example.com/resume.pdf"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isApplying}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isApplying ? "Applying..." : "Submit Application"}
          </button>

          {message && (
            <p
              className={`text-sm ${
                messageType === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      )}

      {!canApply && !isAuthenticated && !applyUrl && !applyEmail && (
        <p className="mt-4 text-sm text-gray-500">
          No direct application method available.
        </p>
      )}

      {!canApply && isAuthenticated && userRole !== "CANDIDATE" && applyUrl && (
        <a
          href={applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          External Apply Link
        </a>
      )}

      {!canApply &&
        isAuthenticated &&
        userRole !== "CANDIDATE" &&
        !applyUrl &&
        applyEmail && (
          <a
            href={`mailto:${applyEmail}`}
            className="mt-4 inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Apply by Email
          </a>
        )}
    </div>
  );
}
