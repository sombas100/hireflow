export async function getCompany(companySlug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/companies/${companySlug}`,
    {
      next: {
        revalidate: 300,
        tags: [`companies-${companySlug}`],
      },
    },
  );

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch company");
  }

  return res.json();
}