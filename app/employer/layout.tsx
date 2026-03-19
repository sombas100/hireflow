import { redirect } from "next/navigation";
import { auth } from "@/auth";
import EmployerSidebar from "@/components/employer/EmployerSidebar";

type EmployerLayoutProps = {
  children: React.ReactNode;
};

export default async function EmployerLayout({
  children,
}: EmployerLayoutProps) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  const role = (session?.user as any)?.role as string | undefined;
  const userName = session?.user?.name || "Employer";

  if (!userId) {
    redirect("/login");
  }

  if (role !== "EMPLOYER" && role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        <EmployerSidebar userName={userName} />

        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
