"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Job } from "@/interfaces/job";
import { toast } from "react-toastify";

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

type ApplicationCardProps = {
  application: Application;
};

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

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

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const router = useRouter();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    const confirm = window.confirm(
      "Are you sure you want to withdraw this application?",
    );

    if (!confirm) return;
    try {
      setIsWithdrawing(true);

      const res = await fetch(`/api/applications/${application.id}/withdraw`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error("Failed to withdraw application");
      }

      toast.success("Your application has been withdrawn");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const isWithdrawn = application.status === "WITHDRAWN";
  const isRejected = application.status === "REJECTED";
  const isHired = application.status === "HIRED";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href={`/jobs/${application.job.company.slug}/${application.job.slug}`}
              className="text-xl font-semibold text-gray-900 hover:underline"
            >
              {application.job.title}
            </Link>

            <p className="mt-1 text-sm text-gray-600">
              {application.job.company.name}
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
              application.status,
            )}`}
          >
            {formatStatus(application.status)}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          {application.job.location && (
            <span className="rounded-full bg-gray-100 px-3 py-1">
              {application.job.location}
            </span>
          )}

          <span className="rounded-full bg-gray-100 px-3 py-1">
            {application.job.jobType.replaceAll("_", " ")}
          </span>

          <span className="rounded-full bg-gray-100 px-3 py-1">
            {application.job.workplaceType}
          </span>

          {application.job.isRemote && (
            <span className="rounded-full bg-gray-100 px-3 py-1">Remote</span>
          )}
        </div>

        {(application.job.salaryMin || application.job.salaryMax) && (
          <p className="text-sm font-medium text-gray-800">
            {application.job.currency || "GBP"} £
            {application.job.salaryMin ?? 0} - £{application.job.salaryMax ?? 0}
            {application.job.salaryPeriod
              ? ` / ${application.job.salaryPeriod.toLowerCase()}`
              : ""}
          </p>
        )}

        <p className="text-sm text-gray-500">
          Applied on {new Date(application.createdAt).toLocaleDateString()}
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/jobs/${application.job.company.slug}/${application.job.slug}`}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            View Job
          </Link>

          {!isWithdrawn && !isRejected && !isHired && (
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {isWithdrawing ? "Withdrawing..." : "Withdraw"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
