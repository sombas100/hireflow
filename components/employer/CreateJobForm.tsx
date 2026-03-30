"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Company } from "@/interfaces/company";
import type { Tag } from "@/interfaces/job";
import { toast } from "react-toastify";

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
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [jobType, setJobType] = useState("FULL_TIME");
  const [workplaceType, setWorkplaceType] = useState("ONSITE");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [salaryPeriod, setSalaryPeriod] = useState("");
  const [currency, setCurrency] = useState("GBP");
  const [applyUrl, setApplyUrl] = useState("");
  const [applyEmail, setApplyEmail] = useState("");
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
      setErrors({});

      const res = await fetch("/api/employer/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId,
          title,
          slug: slugify(slug),
          description,
          requirements: requirements || undefined,
          benefits: benefits || undefined,
          jobType,
          workplaceType,
          experienceLevel: experienceLevel || undefined,
          location: location || undefined,
          isRemote,
          salaryMin: salaryMin ? Number(salaryMin) : undefined,
          salaryMax: salaryMax ? Number(salaryMax) : undefined,
          salaryPeriod: salaryPeriod || undefined,
          currency: currency || undefined,
          applyUrl: applyUrl || undefined,
          applyEmail: applyEmail || undefined,
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

      toast.success("Job created successfully.");
      router.push("/employer/jobs");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while creating the job.");
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
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
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
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
          )}
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
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="requirements"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Requirements
          </label>
          <textarea
            id="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="benefits"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Benefits
          </label>
          <textarea
            id="benefits"
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
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
              required
              onChange={(e) => setWorkplaceType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            >
              <option value="ONSITE">Onsite</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="experienceLevel"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Experience Level
            </label>
            <select
              id="experienceLevel"
              value={experienceLevel}
              required
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            >
              <option value="">Select level</option>
              <option value="INTERN">Entry-Level / Intern</option>
              <option value="JUNIOR">Junior</option>
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

        <div className="grid gap-6 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Salary Min
            </label>
            <input
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Salary Max
            </label>
            <input
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Salary Period
            </label>
            <select
              value={salaryPeriod}
              onChange={(e) => setSalaryPeriod(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            >
              <option value="">Select period</option>
              <option value="YEAR">Year</option>
              <option value="MONTH">Month</option>
              <option value="HOUR">Hour</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Currency
            </label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              placeholder="GBP"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase outline-none focus:border-gray-500"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Apply URL
            </label>
            <input
              type="url"
              value={applyUrl}
              onChange={(e) => setApplyUrl(e.target.value)}
              placeholder="https://company.com/jobs/apply"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Apply Email
            </label>
            <input
              type="email"
              value={applyEmail}
              onChange={(e) => setApplyEmail(e.target.value)}
              placeholder="jobs@company.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>
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
