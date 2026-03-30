"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Company } from "@/interfaces/company";
import { toast } from "react-toastify";

type EmployerCompanyCardProps = {
  company: Company;
};

export default function EmployerCompanyCard({
  company,
}: EmployerCompanyCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this company?",
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setMessage("");

      const res = await fetch(`/api/employer/companies/${company.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete company");
      }

      toast.success("Company has successfully been deleted");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {company.name}
          </h2>

          {company.location && (
            <p className="mt-1 text-sm text-gray-600">{company.location}</p>
          )}
        </div>

        {company.description && (
          <p className="line-clamp-3 text-sm leading-6 text-gray-700">
            {company.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <span className="rounded-full bg-gray-100 px-3 py-1">
            {company._count?.jobs ?? 0} job
            {(company._count?.jobs ?? 0) === 1 ? "" : "s"}
          </span>

          {company.websiteUrl && (
            <span className="rounded-full bg-gray-100 px-3 py-1">
              Website added
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/companies/${company.slug}`}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            View Public Page
          </Link>

          <Link
            href={`/employer/companies/${company.id}/edit`}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit Company
          </Link>

          <Link
            href={`/employer/jobs/create?companyId=${company.id}`}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Post Job
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Company"}
          </button>
        </div>

        {message && <p className="text-sm text-red-600">{message}</p>}
      </div>
    </div>
  );
}
