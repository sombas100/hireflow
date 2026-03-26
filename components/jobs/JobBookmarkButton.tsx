"use client";

import { Spinner } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaBookmark } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";

type JobBookmarkButtonProps = {
  jobId: string;
  initialBookmarked: boolean;
};

export default function JobBookmarkButton({
  jobId,
  initialBookmarked,
}: JobBookmarkButtonProps) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleBookmark = async () => {
    try {
      setIsLoading(true);

      if (isBookmarked) {
        const res = await fetch(`/api/bookmarks/${jobId}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to remove bookmark");
        }

        setIsBookmarked(false);
      } else {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobId }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to save bookmark");
        }

        setIsBookmarked(true);
      }

      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={`rounded-lg px-3 cursor-pointer py-2 text-sm font-medium transition disabled:opacity-50 ${
        isBookmarked
          ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          : "bg-gray-900 text-white hover:bg-gray-800"
      }`}
    >
      {isLoading ? (
        <Spinner />
      ) : isBookmarked ? (
        <FaBookmark />
      ) : (
        <FaRegBookmark />
      )}
    </button>
  );
}
