"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Company } from "@/interfaces/company";
import type { Tag } from "@/interfaces/job";

type CreateJobFormProps = {
  companies: Company[];
  tags: Tag[];
  defaultCompanyId?: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CreateJobForm({
  companies,
  tags,
  defaultCompanyId = "",
}: CreateJobFormProps) {
  const router = useRouter();

  const [companyId, setCompanyId] = useState(defaultCompanyId);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [jobType, setJobType] = useState("FULL_TIME");
  const [workplaceType, setWorkplaceType] = useState("ONSITE");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCompany = useMemo(
    () => companies.find((company) => company.id === companyId),
    [companies, companyId],
  );

  const handleTitleChange = (value: string) => {
    setTitle(value);

    if (!slug.trim()) {
      setSlug(slugify(value));
    }
  };

  const handleToggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setMessage("");

      const res = await fetch("/api/employer/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId,
          title,
          slug,
          description,
          jobType,
          workplaceType,
          location,
          isRemote,
          isPublished,
          tagIds: selectedTagIds,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.issues) {
          const formattedErrors: Record<string, string> = {};

          data.issues.forEach((issue: { path: string[]; message: string }) => {
            const field = issue.path?.[0];
            if (field) {
              formattedErrors[field] = issue.message;
            }
          });

          setErrors(formattedErrors);
          return;
        }

        throw new Error(data?.error || "Failed to create job");
      }

      setMessage("Job created successfully.");

      router.push("/employer/jobs");
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while creating the job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!companies.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          No companies available
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Create a company first before posting a job.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-6">
        <div>
          <label
            htmlFor="companyId"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Company
          </label>
          <select
            id="companyId"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            required
          >
            <option value="">Select a company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>

          {selectedCompany?.location && (
            <p className="mt-2 text-xs text-gray-500">
              Company location: {selectedCompany.location}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Job Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Frontend Developer"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Slug
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="frontend-developer"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            required
          />
          <p className="mt-2 text-xs text-gray-500">
            This will be used in the job URL.
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the role, responsibilities, and who you're looking for..."
            rows={8}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            required
          />
        </div>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="jobType"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Job Type
            </label>
            <select
              id="jobType"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            >
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
              htmlFor="workplaceType"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Workplace Type
            </label>
            <select
              id="workplaceType"
              value={workplaceType}
              onChange={(e) => setWorkplaceType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            >
              <option value="ONSITE">Onsite</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="location"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="London"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isRemote}
              onChange={(e) => setIsRemote(e.target.checked)}
              className="h-4 w-4"
            />
            Remote Role
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4"
            />
            Publish Immediately
          </label>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-gray-700">Tags</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);

              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleToggleTag(tag.id)}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                    isSelected
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Job"}
          </button>

          {message && <p className="text-sm text-gray-600">{message}</p>}
        </div>
      </div>
    </form>
  );
}
