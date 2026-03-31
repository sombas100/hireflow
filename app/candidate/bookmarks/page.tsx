import { redirect } from "next/navigation";
import BookmarkList from "@/components/candidate/BookmarkList";
import Pagination from "@/components/shared/Pagination";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Job } from "@/interfaces/job";
import Navbar from "@/app/Navbar";
import MainFooter from "@/components/ui/MainFooter";

type Bookmark = {
  id: string;
  jobId: string;
  userId: string;
  createdAt: string;
  job: Job;
};

type CandidateBookmarksPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

async function getBookmarks(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [bookmarks, total] = await Promise.all([
    prisma.bookmark.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            location: true,
            jobType: true,
            workplaceType: true,
            isRemote: true,
            salaryMin: true,
            salaryMax: true,
            salaryPeriod: true,
            currency: true,
            company: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
                location: true,
              },
            },
            tags: {
              include: {
                tag: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.bookmark.count({
      where: {
        userId,
      },
    }),
  ]);

  const formattedBookmarks = bookmarks.map((bookmark) => ({
    ...bookmark,
    createdAt: bookmark.createdAt.toISOString(),
    job: {
      ...bookmark.job,
      tags: bookmark.job.tags.map((item) => item.tag),
    },
  })) as Bookmark[];

  return {
    bookmarks: formattedBookmarks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export default async function CandidateBookmarksPage({
  searchParams,
}: CandidateBookmarksPageProps) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  const role = (session?.user as any)?.role as string | undefined;

  if (!userId) {
    redirect("/login");
  }

  if (role !== "CANDIDATE" && role !== "ADMIN") {
    redirect("/");
  }

  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page || "1");
  const limit = 5;

  const { bookmarks, pagination } = await getBookmarks(userId, page, limit);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
            <p className="mt-2 text-gray-600">
              Keep track of jobs you want to come back to.
            </p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {pagination.total} saved job
              {pagination.total === 1 ? "" : "s"}
            </p>
          </div>

          <BookmarkList bookmarks={bookmarks} />

          <div className="mt-8">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              searchParams={resolvedSearchParams}
              basePath="/candidate/bookmarks"
            />
          </div>
        </div>
      </main>

      <MainFooter />
    </>
  );
}
