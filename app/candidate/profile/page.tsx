import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import CandidateProfileForm from "./CandidateProfileForm";
import Navbar from "@/app/Navbar";
import MainFooter from "@/components/ui/MainFooter";

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
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
};

async function getCandidateProfile(
  userId: string,
): Promise<CandidateProfile | null> {
  const profile = await prisma.candidateProfile.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      },
    },
  });

  if (!profile) return null;

  return {
    ...profile,
  };
}

export default async function CandidateProfilePage() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  const role = (session?.user as any)?.role as string | undefined;

  if (!userId) {
    redirect("/login");
  }

  if (role !== "CANDIDATE" && role !== "ADMIN") {
    redirect("/");
  }

  const profile = await getCandidateProfile(userId);

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full mx-auto bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-4xl w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-gray-600">
              Update your profile so employers can learn more about you.
            </p>
          </div>

          <CandidateProfileForm profile={profile} />
        </div>
      </main>
      <MainFooter />
    </>
  );
}
