import Navbar from "../Navbar";
import MainFooter from "@/components/ui/MainFooter";
import Skeleton from "@/components/ui/Skeleton";

export default function CompaniesLoading() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="mt-3 h-4 w-80" />
          </div>

          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          <div className="mb-6">
            <Skeleton className="h-4 w-40" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <Skeleton className="h-6 w-40" />
                <Skeleton className="mt-2 h-4 w-28" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-11/12" />
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-28" />
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
