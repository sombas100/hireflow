import { prisma } from "../prisma";
import { ApplicationStatus } from "@/app/generated/prisma/enums";

export async function getApplicationStatus(
  userId?: string,
  role?: string,
  jobId?: string,
) {
  if (!userId || !jobId || (role !== "CANDIDATE" && role !== "ADMIN")) {
    return false;
  }

  const application = await prisma.application.findFirst({
    where: {
      userId,
      jobId,
      status: {
        not: ApplicationStatus.WITHDRAWN
      }
    },
    select: {
      id: true,
    },
  });

  return Boolean(application);
}