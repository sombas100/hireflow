import CompanyFilters from "@/components/companies/CompanyFilters";
import CompanyList from "@/components/companies/CompanyList";
import Pagination from "@/components/shared/Pagination";
import Navbar from "../Navbar";
import MainFooter from "@/components/ui/MainFooter";

type CompaniesPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

async function getCompanies(searchParams: { q?: string; page?: string }) {
  const params = new URLSearchParams();

  if (searchParams.q) params.set("q", searchParams.q);
  if (searchParams.page) params.set("page", searchParams.page);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/companies?${params.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch companies");
  }

  return res.json();
}

export default async function CompaniesPage({
  searchParams,
}: CompaniesPageProps) {
  const resolvedSearchParams = await searchParams;
  const companiesResponse = await getCompanies(resolvedSearchParams);

  const companies = companiesResponse.data;
  const pagination = companiesResponse.pagination;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Browse Companies
            </h1>
            <p className="mt-2 text-gray-600">
              Discover companies and explore their open roles.
            </p>
          </div>

          <CompanyFilters
            currentFilters={{
              q: resolvedSearchParams.q,
            }}
          />

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {pagination.total} compan
              {pagination.total === 1 ? "y" : "ies"}
            </p>
          </div>

          <CompanyList companies={companies} />

          <div className="mt-8">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              searchParams={resolvedSearchParams}
              basePath="/companies"
            />
          </div>
        </div>
      </main>
      <MainFooter />
    </>
  );
}
