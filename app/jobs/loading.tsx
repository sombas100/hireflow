import Skeleton from "@/components/ui/Skeleton";
import Navbar from "../Navbar";

export default function JobsLoading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <Skeleton className="h-10 w-56" />
            <Skeleton className="mt-3 h-4 w-80" />
          </div>

          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <Skeleton className="h-6 w-52" />
                <Skeleton className="mt-2 h-4 w-32" />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="mt-4 h-4 w-40" />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-7 w-24" />
                  <Skeleton className="h-7 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
