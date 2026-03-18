"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type JobFiltersProps = {
  currentFilters: {
    q?: string;
    location?: string;
    type?: string;
    workplace?: string;
  };
};

export default function JobFilters({ currentFilters }: JobFiltersProps) {
  const router = useRouter();

  const [q, setQ] = useState(currentFilters.q || "");
  const [location, setLocation] = useState(currentFilters.location || "");
  const [type, setType] = useState(currentFilters.type || "");
  const [workplace, setWorkplace] = useState(currentFilters.workplace || "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (q.trim()) params.set("q", q.trim());
    if (location.trim()) params.set("location", location.trim());
    if (type) params.set("type", type);
    if (workplace) params.set("workplace", workplace);

    router.push(`/jobs?${params.toString()}`);
  };

  const handleReset = () => {
    setQ("");
    setLocation("");
    setType("");
    setWorkplace("");
    router.push("/jobs");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="q"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Search
          </label>
          <input
            id="q"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. Frontend Developer"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. London"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Job Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          >
            <option value="">All</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERN">Intern</option>
            <option value="TEMP">Temp</option>
            <option value="FREELANCE">Freelance</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="workplace"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Workplace
          </label>
          <select
            id="workplace"
            value={workplace}
            onChange={(e) => setWorkplace(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          >
            <option value="">All</option>
            <option value="ONSITE">Onsite</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-lg cursor-pointer bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Apply Filters
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border cursor-pointer border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
