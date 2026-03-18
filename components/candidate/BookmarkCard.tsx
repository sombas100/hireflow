"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Job } from "@/interfaces/job";

type Bookmark = {
  id: string;
  jobId: string;
  userId: string;
  createdAt: string;
  job: Job;
};

type BookmarkCardProps = {
  bookmark: Bookmark;
};

export default function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    try {
      setIsRemoving(true);

      const res = await fetch(`/api/bookmarks/${bookmark.job.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to remove bookmark");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4">
        <div>
          <Link
            href={`/jobs/${bookmark.job.company.slug}/${bookmark.job.slug}`}
            className="text-xl font-semibold text-gray-900 hover:underline"
          >
            {bookmark.job.title}
          </Link>

          <p className="mt-1 text-sm text-gray-600">
            {bookmark.job.company.name}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          {bookmark.job.location && (
            <span className="rounded-full bg-gray-100 px-3 py-1">
              {bookmark.job.location}
            </span>
          )}

          <span className="rounded-full bg-gray-100 px-3 py-1">
            {bookmark.job.jobType.replaceAll("_", " ")}
          </span>

          <span className="rounded-full bg-gray-100 px-3 py-1">
            {bookmark.job.workplaceType}
          </span>

          {bookmark.job.isRemote && (
            <span className="rounded-full bg-gray-100 px-3 py-1">Remote</span>
          )}
        </div>

        {(bookmark.job.salaryMin || bookmark.job.salaryMax) && (
          <p className="text-sm font-medium text-gray-800">
            {bookmark.job.currency || "GBP"} {bookmark.job.salaryMin ?? 0} -{" "}
            {bookmark.job.salaryMax ?? 0}
            {bookmark.job.salaryPeriod
              ? ` / ${bookmark.job.salaryPeriod.toLowerCase()}`
              : ""}
          </p>
        )}

        {bookmark.job.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {bookmark.job.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <Link
            href={`/jobs/${bookmark.job.company.slug}/${bookmark.job.slug}`}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            View Job
          </Link>

          <button
            type="button"
            onClick={handleRemove}
            disabled={isRemoving}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {isRemoving ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}
