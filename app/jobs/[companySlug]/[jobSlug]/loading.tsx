import Skeleton from "@/components/ui/Skeleton";

export default function JobDetailsLoading() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Skeleton className="mb-6 h-4 w-28" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 border-b border-gray-200 pb-6">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="mt-4 h-4 w-48" />
            <Skeleton className="mt-2 h-4 w-40" />
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <div>
                <Skeleton className="mb-3 h-6 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-11/12" />
              </div>

              <div>
                <Skeleton className="mb-3 h-6 w-36" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-10/12" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <Skeleton className="mb-4 h-6 w-40" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-2 h-4 w-24" />
                <Skeleton className="mt-4 h-4 w-32" />
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <Skeleton className="mb-4 h-6 w-28" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="mt-3 h-24 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
