import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import JobFilters from "@/components/jobs/JobFilters";
import JobList from "@/components/jobs/JobList";
import Pagination from "@/components/shared/Pagination";
import Navbar from "../Navbar";
import MainFooter from "@/components/ui/MainFooter";

type JobsPageProps = {
  searchParams: Promise<{
    q?: string;
    location?: string;
    type?: string;
    workplace?: string;
    page?: string;
  }>;
};

async function getJobs(searchParams: {
  q?: string;
  location?: string;
  type?: string;
  workplace?: string;
  page?: string;
}) {
  const params = new URLSearchParams();

  if (searchParams.q) params.set("q", searchParams.q);
  if (searchParams.location) params.set("location", searchParams.location);
  if (searchParams.type) params.set("type", searchParams.type);
  if (searchParams.workplace) params.set("workplace", searchParams.workplace);
  if (searchParams.page) params.set("page", searchParams.page);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs?${params.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
}

async function getBookmarkedJobIds(userId?: string, role?: string) {
  if (!userId || (role !== "CANDIDATE" && role !== "ADMIN")) {
    return [];
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId,
    },
    select: {
      jobId: true,
    },
  });

  return bookmarks.map((bookmark) => bookmark.jobId);
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const resolvedSearchParams = await searchParams;

  const session = await auth();
  const authenticatedUser = session?.user;
  const userId = authenticatedUser?.id as string | undefined;
  const userRole = authenticatedUser?.role as string | undefined;

  const [jobsResponse, bookmarkedJobIds] = await Promise.all([
    getJobs(resolvedSearchParams),
    getBookmarkedJobIds(userId, userRole),
  ]);

  const jobs = jobsResponse.data;
  const meta = jobsResponse.meta;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
            <p className="mt-2 text-gray-600">
              Discover opportunities from companies hiring now.
            </p>
          </div>

          <JobFilters
            currentFilters={{
              q: resolvedSearchParams.q,
              location: resolvedSearchParams.location,
              type: resolvedSearchParams.type,
              workplace: resolvedSearchParams.workplace,
            }}
          />

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {meta.total} job{meta.total !== 1 ? "s" : ""}
            </p>
          </div>

          <JobList
            jobs={jobs}
            isAuthenticated={Boolean(authenticatedUser)}
            userRole={userRole}
            bookmarkedJobIds={bookmarkedJobIds}
          />

          <div className="mt-8">
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              searchParams={resolvedSearchParams}
            />
          </div>
        </div>
      </main>
      <MainFooter />
    </>
  );
}
