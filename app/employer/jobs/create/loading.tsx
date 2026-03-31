import Skeleton from "@/components/ui/Skeleton";

export default function CreateJobLoading() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="mt-3 h-4 w-80" />
        </div>

        {/* Form container */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6">
            {/* Company select */}
            <div>
              <Skeleton className="mb-2 h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Title */}
            <div>
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Slug */}
            <div>
              <Skeleton className="mb-2 h-4 w-20" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="mt-2 h-3 w-48" />
            </div>

            {/* Description */}
            <div>
              <Skeleton className="mb-2 h-4 w-28" />
              <Skeleton className="h-32 w-full" />
            </div>

            {/* Requirements */}
            <div>
              <Skeleton className="mb-2 h-4 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>

            {/* Benefits */}
            <div>
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-24 w-full" />
            </div>

            {/* Select row */}
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <Skeleton className="mb-2 h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="mb-2 h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Location */}
            <div>
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Salary */}
            <div className="grid gap-6 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="mb-2 h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>

            {/* Apply fields */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-40" />
            </div>

            {/* Tags */}
            <div>
              <Skeleton className="mb-3 h-4 w-16" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-full" />
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
