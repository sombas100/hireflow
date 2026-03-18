import BookmarkCard from "./BookmarkCard";
import { Job } from "@/interfaces/job";

type Bookmark = {
  id: string;
  jobId: string;
  userId: string;
  createdAt: string;
  job: Job;
};

type BookmarkListProps = {
  bookmarks: Bookmark[];
};

export default function BookmarkList({ bookmarks }: BookmarkListProps) {
  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          No saved jobs yet
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Save jobs you’re interested in and they’ll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
}
