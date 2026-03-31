import Skeleton from "@/components/ui/Skeleton";

export default function EmployerJobsLoading() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="mt-3 h-4 w-72" />
        </div>

        <div className="mb-6">
          <Skeleton className="h-4 w-36" />
        </div>

        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <Skeleton className="h-6 w-52" />
                  <Skeleton className="mt-2 h-4 w-32" />
                </div>

                <Skeleton className="h-8 w-24" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>

              <Skeleton className="mt-4 h-4 w-44" />

              <div className="mt-4 flex flex-wrap gap-2">
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-7 w-20" />
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
