import EmployerCompanyCard from "./EmployerCompanyCard";
import type { Company } from "@/interfaces/company";

type EmployerCompanyListProps = {
  companies: Company[];
};

export default function EmployerCompanyList({
  companies,
}: EmployerCompanyListProps) {
  if (!companies || companies.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          No companies yet
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Create your first company to start posting jobs.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {companies.map((company) => (
        <EmployerCompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
}
