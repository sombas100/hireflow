import Navbar from "@/app/Navbar";
import MainFooter from "@/components/ui/MainFooter";
import Skeleton from "@/components/ui/Skeleton";

export default function CandidateBookmarksLoading() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-10">
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

                <div className="mt-4 flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>

                <Skeleton className="mt-4 h-4 w-40" />

                <div className="mt-4 flex flex-wrap gap-2">
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-7 w-24" />
                  <Skeleton className="h-7 w-16" />
                </div>

                <div className="mt-4 flex gap-3">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <MainFooter />
    </>
  );
}
