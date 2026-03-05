import { z } from 'zod';

export const userScehma = z.object({
    name: z.string().min(1).optional(),
    email: z.string().min(1, "Email field is required").max(75, "Maximum characters is 75"),
    password: z.string().min(6, "Password must contain at at least 6 characters")
})

export const createJobSchema = z.object({
    title: z.string().min(1).max(255),
    slug: z.string().min(1).max(50),
    description: z.string().min(1).max(255),
    requirements: z.string().min(1).max(255),
    benefits: z.string().min(1).max(255),
    jobType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN", "TEMP", "FREELANCE"] ),
    WorkplaceType: z.enum(["ONSITE", "REMOTE", "HYBRID"]),
    ExperienceLevel: z.enum(["INTERN", "JUNIOR", "MID", "SENIOR", "LEAD"]),
    location: z.string().min(1).max(100),
    isRemote: z.boolean().optional(),
    salaryMin: z.number(),
    salaryMax: z.number(),
    salaryPeriod: z.enum(["YEAR", "MONTH",  "HOUR"]),
    currency: z.string().min(3),
    applyUrl: z.string(),
    applyEmail: z.string()
})