"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type CompanyFiltersProps = {
  currentFilters: {
    q?: string;
  };
};

export default function CompanyFilters({
  currentFilters,
}: CompanyFiltersProps) {
  const router = useRouter();
  const [q, setQ] = useState(currentFilters.q || "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (q.trim()) {
      params.set("q", q.trim());
    }

    router.push(`/companies?${params.toString()}`);
  };

  const handleReset = () => {
    setQ("");
    router.push("/companies");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
        <div>
          <label
            htmlFor="q"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Search companies
          </label>
          <input
            id="q"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. Acme or London"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <button
          type="submit"
          className="self-end rounded-lg cursor-pointer bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Search
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="self-end rounded-lg cursor-pointer border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
