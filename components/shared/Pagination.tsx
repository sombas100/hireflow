import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
  basePath?: string;
};

export default function Pagination({
  page,
  totalPages,
  searchParams,
  basePath = "/jobs",
}: PaginationProps) {
  const createPageLink = (newPage: number) => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, value);
      }
    });

    params.set("page", String(newPage));

    return `${basePath}?${params.toString()}`;
  };

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
