import React from "react";
import { getJobs } from "@/lib/actions/getJobs";
import JobList from "@/components/jobs/JobList";
import Pagination from "@/components/shared/Pagination";

type JobsPageProps = {
  searchParams: Promise<{
    q?: string;
    location?: string;
    type?: string;
    workplace?: string;
    page?: string;
  }>;
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const resolvedSearchParams = await searchParams;
  const jobResponse = await getJobs(resolvedSearchParams);

  const jobs = jobResponse.data;
  const meta = jobResponse.meta;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
          <p className="mt-2 text-gray-600">
            Discover opportunities from companies hiring now.
          </p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {jobs.length} job{jobs.length !== 1 ? "s" : ""}
          </p>
        </div>

        <JobList jobs={jobs} />

        <div className="mt-8">
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            searchParams={resolvedSearchParams}
          />
        </div>
      </div>
    </main>
  );
}
