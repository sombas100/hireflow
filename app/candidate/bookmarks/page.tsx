import { redirect } from "next/navigation";
import BookmarkList from "@/components/candidate/BookmarkList";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Job } from "@/interfaces/job";
import Navbar from "@/app/Navbar";

type Bookmark = {
  id: string;
  jobId: string;
  userId: string;
  createdAt: string;
  job: Job;
};

async function getBookmarks(userId: string): Promise<Bookmark[]> {
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
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
  });

  return bookmarks.map((bookmark) => ({
    ...bookmark,
    createdAt: bookmark.createdAt.toISOString(),
    job: {
      ...bookmark.job,
      tags: bookmark.job.tags.map((item) => item.tag),
    },
  })) as Bookmark[];
}

export default async function CandidateBookmarksPage() {
  const session = await auth();
  console.log("SESSION:", session);
  const userId = (session?.user as any)?.id as string | undefined;
  const role = (session?.user as any)?.role as string | undefined;

  if (!userId) {
    redirect("/login");
  }

  if (role !== "CANDIDATE" && role !== "ADMIN") {
    redirect("/");
  }

  const bookmarks = await getBookmarks(userId);

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

          <BookmarkList bookmarks={bookmarks} />
        </div>
      </main>
    </>
  );
}
