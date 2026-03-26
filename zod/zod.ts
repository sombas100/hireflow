import { z } from 'zod';

export const userScehma = z.object({
    name: z.string().min(1).optional(),
    email: z.string().min(1, "Email field is required").max(75, "Maximum characters is 75"),
    password: z.string().min(6, "Password must contain at at least 6 characters")
})

export const CreateJobSchema = z.object({
  companyId: z.string().min(1),
  title: z.string().min(3),
  slug: z.string().min(3), 
  description: z.string().min(10),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN", "TEMP", "FREELANCE"]),
  workplaceType: z.enum(["ONSITE", "REMOTE", "HYBRID"]),
  location: z.string().optional(),
  isRemote: z.boolean().optional().default(false),
  tagIds: z.array(z.string().min(1)).optional().default([]),
  isPublished: z.boolean().optional().default(false),
});

export const UpdateJobSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  requirements: z.string().optional(),
  benefits: z.string().optional(),

  jobType: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN", "TEMP", "FREELANCE"])
    .optional(),

  workplaceType: z.enum(["ONSITE", "REMOTE", "HYBRID"]).optional(),

  experienceLevel: z
    .enum(["INTERN", "JUNIOR", "MID", "SENIOR", "LEAD"])
    .optional(),

  location: z.string().optional(),
  isRemote: z.boolean().optional(),

  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
  salaryPeriod: z.enum(["YEAR", "MONTH", "HOUR"]).optional(),
  currency: z.string().length(3).optional(),

  applyUrl: z.string().url().optional(),
  applyEmail: z.string().email().optional(),

  isPublished: z.boolean().optional(),
  expiresAt: z.string().datetime().optional().nullable(),
  tagIds: z.array(z.string().min(1)).optional(),
});

export const JobsQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  location: z.string().trim().min(1).optional(),

  
  type: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN", "TEMP", "FREELANCE"])
    .optional(),

  workplace: z.enum(["ONSITE", "REMOTE", "HYBRID"]).optional(),
  tags: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return [];
      const raw = Array.isArray(val) ? val : [val];
      return raw
        .flatMap((s) => s.split(","))
        .map((s) => s.trim())
        .filter(Boolean);
    }),

  remote: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),

  sort: z.enum(["newest", "salary"]).optional().default("newest"),

  page: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 1))
    .pipe(z.number().int().min(1))
    .default(1),

  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 10))
    .pipe(z.number().int().min(1).max(50))
    .default(10),
});

export const CreateCompanySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  websiteUrl: z.string().url("Website must be a valid URL").optional(),
  location: z.string().optional(),
});

export const CreateApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  coverLetter: z.string().optional(),
  resumeUrl: z.string().url("Resume URL must be a valid URL").optional(),
});

export const UpdateApplicationSchema = z.object({
  status: z.enum([
    "SUBMITTED",
    "IN_REVIEW",
    "SHORTLISTED",
    "REJECTED",
    "WITHDRAWN",
    "HIRED",
  ]),
});

export const CreateBookmarkSchema = z.object({
  jobId: z.string().min(1, "Job id is required"),
});

export const UpdateCandidateProfileSchema = z.object({
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  websiteUrl: z.string().url("Website URL must be valid").optional().or(z.literal("")),
  githubUrl: z.string().url("GitHub URL must be valid").optional().or(z.literal("")),
  linkedinUrl: z.string().url("LinkedIn URL must be valid").optional().or(z.literal("")),
  resumeUrl: z.string().url("Resume URL must be valid").optional().or(z.literal("")),
  resumeName: z.string().optional(),
});

