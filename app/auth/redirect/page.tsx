import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AuthRedirectPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  if (user.role === "EMPLOYER" || user.role === "ADMIN") {
    redirect("/employer/companies");
  }

  redirect("/jobs");
}
