"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Job } from "@/interfaces/job";

type EmployerJobCardProps = {
  job: Job;
};

export default function EmployerJobCard({ job }: EmployerJobCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      const res = await fetch(`/api/employer/jobs/${job.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete job");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };
  console.log("Delete job ID:", job.id);
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{job.company.name}</p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
              job.isPublished
                ? "bg-green-50 text-green-700"
                : "bg-yellow-50 text-yellow-700"
            }`}
          >
            {job.isPublished ? "Published" : "Draft"}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          {job.location && (
            <span className="rounded-full bg-gray-100 px-3 py-1">
              {job.location}
            </span>
          )}

          <span className="rounded-full bg-gray-100 px-3 py-1">
            {job.jobType.replaceAll("_", " ")}
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

        {job.tags?.length > 0 && (
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

        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          <span className="rounded-full bg-gray-100 px-3 py-1">
            {job._count?.applications ?? 0} application
            {(job._count?.applications ?? 0) === 1 ? "" : "s"}
          </span>

          <span className="rounded-full bg-gray-100 px-3 py-1">
            {job._count?.bookmarks ?? 0} bookmark
            {(job._count?.bookmarks ?? 0) === 1 ? "" : "s"}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/jobs/${job.company.slug}/${job.slug}`}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            View Public Job
          </Link>

          <Link
            href={`/employer/jobs/${job.id}/applications`}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View Applicants
          </Link>

          <Link
            href={`/employer/jobs/${job.id}/edit`}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit Job
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Job"}
          </button>
        </div>
      </div>
    </div>
  );
}
