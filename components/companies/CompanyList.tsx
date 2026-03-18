import CompanyCard from "./CompanyCard";

type Company = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  websiteUrl?: string | null;
  logoUrl?: string | null;
  location?: string | null;
  _count: {
    jobs: number;
  };
};

type CompanyListProps = {
  companies: Company[];
};

export default function CompanyList({ companies }: CompanyListProps) {
  if (!companies || companies.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          No companies found
        </h2>
        <p className="mt-2 text-sm text-gray-600">Try changing your search.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
}
