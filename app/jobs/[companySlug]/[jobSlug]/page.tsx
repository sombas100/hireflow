import { Tag } from "@/interfaces/job";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import ApplyToJobCard from "@/components/jobs/ApplyToJobCard";
import { prisma } from "@/lib/prisma";
import BookmarkJobButton from "@/components/jobs/BookmarkJobButton";

type JobDetailsPageProps = {
  params: Promise<{
    companySlug: string;
    jobSlug: string;
  }>;
};

async function getJob(companySlug: string, jobSlug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/${companySlug}/${jobSlug}`,
    {
      cache: "no-store",
    },
  );

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch job");
  }

  return res.json();
}

async function getBookmarkStatus(
  userId?: string,
  role?: string,
  jobId?: string,
) {
  if (!userId || !jobId || (role !== "CANDIDATE" && role !== "ADMIN")) {
    return false;
  }

  const bookmark = await prisma.bookmark.findFirst({
    where: {
      userId,
      jobId,
    },
    select: {
      id: true,
    },
  });

  return Boolean(bookmark);
}

async function getCandidateResume(userId?: string, role?: string) {
  if (!userId || (role !== "CANDIDATE" && role !== "ADMIN")) {
    return null;
  }

  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
    select: {
      resumeUrl: true,
      resumeName: true,
    },
  });

  return profile;
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const session = await auth();
  const authenticatedUser = session?.user;
  const userRole = (authenticatedUser as any)?.role as string | undefined;
  const isAuthenticated = Boolean(authenticatedUser);
  const userId = (authenticatedUser as any)?.id as string | undefined;
  const candidateResume = await getCandidateResume(userId, userRole);
  const { companySlug, jobSlug } = await params;

  const response = await getJob(companySlug, jobSlug);

  if (!response || !response.data) {
    notFound();
  }

  const job = response.data;
  const isBookmarked = await getBookmarkStatus(userId, userRole, job.id);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link
            href="/jobs"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back to jobs
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 border-b border-gray-200 pb-6">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>

              {job.isRemote && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Remote
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-800">Company:</span>{" "}
                <Link
                  href={`/companies/${job.company.slug}`}
                  className="hover:text-gray-900 hover:underline"
                >
                  {job.company.name}
                </Link>
              </p>

              {job.location && (
                <p>
                  <span className="font-medium text-gray-800">Location:</span>{" "}
                  {job.location}
                </p>
              )}

              <p>
                <span className="font-medium text-gray-800">Job Type:</span>{" "}
                {job.jobType.replaceAll("_", " ")}
              </p>

              <p>
                <span className="font-medium text-gray-800">Workplace:</span>{" "}
                {job.workplaceType}
              </p>

              {job.experienceLevel && (
                <p>
                  <span className="font-medium text-gray-800">Experience:</span>{" "}
                  {job.experienceLevel}
                </p>
              )}

              {(job.salaryMin || job.salaryMax) && (
                <p>
                  <span className="font-medium text-gray-800">Salary:</span>{" "}
                  {job.currency || "GBP"} £{job.salaryMin ?? 0} - £
                  {job.salaryMax ?? 0}
                  {job.salaryPeriod
                    ? ` / ${job.salaryPeriod.toLowerCase()}`
                    : ""}
                </p>
              )}
            </div>

            {job.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {job.tags.map((tag: Tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {job.applyUrl && (
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Apply Now
                </a>
              )}

              {!job.applyUrl && job.applyEmail && (
                <a
                  href={`mailto:${job.applyEmail}`}
                  className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Apply by Email
                </a>
              )}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="mb-3 text-xl font-semibold text-gray-900">
                  Job Description
                </h2>
                <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
                  {job.description}
                </p>
              </section>

              {job.requirements && (
                <section>
                  <h2 className="mb-3 text-xl font-semibold text-gray-900">
                    Requirements
                  </h2>
                  <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
                    {job.requirements}
                  </p>
                </section>
              )}

              {job.benefits && (
                <section>
                  <h2 className="mb-3 text-xl font-semibold text-gray-900">
                    Benefits
                  </h2>
                  <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
                    {job.benefits}
                  </p>
                </section>
              )}
            </div>

            <aside className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  About the Company
                </h3>

                <div className="space-y-3 text-sm text-gray-700">
                  <p className="font-medium text-gray-900">
                    {job.company.name}
                  </p>

                  {job.company.location && (
                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {job.company.location}
                    </p>
                  )}

                  {job.company.websiteUrl && (
                    <a
                      href={job.company.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline"
                    >
                      Visit company website
                    </a>
                  )}

                  {job.company.description && (
                    <p className="whitespace-pre-line leading-6 text-gray-600">
                      {job.company.description}
                    </p>
                  )}
                </div>
              </div>

              <BookmarkJobButton
                jobId={job.id}
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                isBookmarked={isBookmarked}
              />

              <ApplyToJobCard
                jobId={job.id}
                userRole={userRole}
                isAuthenticated={isAuthenticated}
                applyUrl={job.applyUrl}
                applyEmail={job.applyEmail}
                savedResumeUrl={candidateResume?.resumeUrl || ""}
                savedResumeName={candidateResume?.resumeName || ""}
              />
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
