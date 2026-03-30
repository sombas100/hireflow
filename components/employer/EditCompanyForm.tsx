"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Company } from "@/interfaces/company";
import { toast } from "react-toastify";

type EditCompanyFormProps = {
  company: Company;
};

export default function EditCompanyForm({ company }: EditCompanyFormProps) {
  const router = useRouter();

  const [name, setName] = useState(company.name || "");
  const [slug, setSlug] = useState(company.slug || "");
  const [description, setDescription] = useState(company.description || "");
  const [websiteUrl, setWebsiteUrl] = useState(company.websiteUrl || "");
  const [location, setLocation] = useState(company.location || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setMessage("");
      setErrors({});

      const res = await fetch(`/api/employer/companies/${company.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          websiteUrl,
          location,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.issues) {
          const fieldErrors: Record<string, string> = {};

          data.issues.forEach((issue: { path: string[]; message: string }) => {
            const field = issue.path?.[0];
            if (field) fieldErrors[field] = issue.message;
          });

          setErrors(fieldErrors);
          return;
        }

        throw new Error(data?.error || "Failed to update company");
      }

      toast.success("Company updated successfully.");
      router.push("/employer/companies");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating the company.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-6">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Company Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
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
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
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
            rows={5}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="websiteUrl"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Website URL
          </label>
          <input
            id="websiteUrl"
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
          {errors.websiteUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.websiteUrl}</p>
          )}
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>

          {message && <p className="text-sm text-gray-600">{message}</p>}
        </div>
      </div>
    </form>
  );
}
