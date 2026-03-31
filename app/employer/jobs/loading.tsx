import Skeleton from "@/components/ui/Skeleton";

export default function EmployerJobsLoading() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Skeleton className="h-10 w-44" />
          <Skeleton className="mt-3 h-4 w-72" />
        </div>

        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <Skeleton className="h-6 w-52" />
              <Skeleton className="mt-2 h-4 w-32" />
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
