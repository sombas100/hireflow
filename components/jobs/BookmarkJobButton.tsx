"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type BookmarkJobButtonProps = {
  jobId: string;
  isAuthenticated: boolean;
  userRole?: string;
  isBookmarked: boolean;
};

export default function BookmarkJobButton({
  jobId,
  isAuthenticated,
  userRole,
  isBookmarked,
}: BookmarkJobButtonProps) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const canBookmark =
    isAuthenticated && (userRole === "CANDIDATE" || userRole === "ADMIN");

  const handleBookmarkToggle = async () => {
    try {
      setIsLoading(true);
      setMessage("");

      if (bookmarked) {
        const res = await fetch(`/api/bookmarks/${jobId}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to remove bookmark");
        }

        setBookmarked(false);
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

        setBookmarked(true);
      }

      router.refresh();
    } catch (error: any) {
      console.error(error);
      setMessage(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (!canBookmark) {
    return null;
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleBookmarkToggle}
        disabled={isLoading}
        className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 ${
          bookmarked
            ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            : "bg-gray-900 text-white hover:bg-gray-800"
        }`}
      >
        {isLoading
          ? "Please wait..."
          : bookmarked
            ? "Remove Bookmark"
            : "Save Job"}
      </button>

      {message && <p className="text-sm text-red-600">{message}</p>}
    </div>
  );
}
