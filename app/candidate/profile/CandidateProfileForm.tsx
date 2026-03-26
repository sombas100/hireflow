"use client";

import { useState } from "react";

type CandidateProfile = {
  id?: string;
  userId?: string;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  websiteUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  resumeUrl?: string | null;
  resumeName?: string | null;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
} | null;

type CandidateProfileFormProps = {
  profile: CandidateProfile;
};

export default function CandidateProfileForm({
  profile,
}: CandidateProfileFormProps) {
  const [headline, setHeadline] = useState(profile?.headline || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [websiteUrl, setWebsiteUrl] = useState(profile?.websiteUrl || "");
  const [githubUrl, setGithubUrl] = useState(profile?.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedinUrl || "");
  const [resumeFileName, setResumeFileName] = useState(
    profile?.resumeName || "",
  );
  const [resumeUrl, setResumeUrl] = useState(profile?.resumeUrl || "");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setMessage("");

      const res = await fetch("/api/candidate/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          headline,
          bio,
          location,
          websiteUrl,
          githubUrl,
          linkedinUrl,
          resumeUrl,
          resumeName: resumeFileName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save profile");
      }

      setMessage("Profile saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while saving your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;

    try {
      setIsUploadingResume(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", resumeFile);

      const res = await fetch("/api/upload/resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to upload resume");
      }

      setResumeFileName(data.data.fileName);
      setResumeUrl(data.data.url);
      setMessage("Resume uploaded successfully.");
    } catch (error: any) {
      console.error(error);
      setMessage(error.message || "Failed to upload resume.");
    } finally {
      setIsUploadingResume(false);
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
            htmlFor="headline"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Headline
          </label>
          <input
            id="headline"
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. Frontend Developer"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="bio"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell employers a little about yourself"
            rows={6}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
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
            placeholder="e.g. London"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
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
            placeholder="https://yourwebsite.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="githubUrl"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            GitHub URL
          </label>
          <input
            id="githubUrl"
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/yourname"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="linkedinUrl"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            LinkedIn URL
          </label>
          <input
            id="linkedinUrl"
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/yourname"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="resumeFile"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Resume
          </label>

          <input
            id="resumeFile"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setResumeFile(file);
            }}
            className="w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleResumeUpload}
              disabled={!resumeFile || isUploadingResume}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {isUploadingResume ? "Uploading..." : "Upload Resume"}
            </button>

            {resumeUrl && (
              <div className="flex items-center gap-2 text-sm">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View current resume
                </a>

                {resumeFileName && (
                  <span className="text-gray-500">({resumeFileName})</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </button>

          {message && <p className="text-sm text-gray-600">{message}</p>}
        </div>
      </div>
    </form>
  );
}
