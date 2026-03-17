import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  searchParams: {
    q?: string;
    location?: string;
    type?: string;
    workplace?: string;
    page?: string;
  };
};

export default function Pagination({
  page,
  totalPages,
  searchParams,
}: PaginationProps) {
  const createPageLink = (newPage: number) => {
    const params = new URLSearchParams();

    if (searchParams.q) params.set("q", searchParams.q);
    if (searchParams.location) params.set("location", searchParams.location);
    if (searchParams.type) params.set("type", searchParams.type);
    if (searchParams.workplace) params.set("workplace", searchParams.workplace);

    params.set("page", String(newPage));

    return `/jobs?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4">
      {page > 1 ? (
        <Link
          href={createPageLink(page - 1)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-400">
          Previous
        </span>
      )}

      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          href={createPageLink(page + 1)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-400">
          Next
        </span>
      )}
    </div>
  );
}
