export async function getJobs(searchParams: {
  q?: string;
  location?: string;
  type?: string;
  workplace?: string;
  page?: string;
}) {
  const params = new URLSearchParams();

  if (searchParams.q) params.set("q", searchParams.q);
  if (searchParams.location) params.set("location", searchParams.location);
  if (searchParams.type) params.set("type", searchParams.type);
  if (searchParams.workplace) params.set("workplace", searchParams.workplace);
  if (searchParams.page) params.set("page", searchParams.page);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs?${params.toString()}`,
    {
      next: {
        revalidate: 300,
        tags: ["jobs"],
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
}