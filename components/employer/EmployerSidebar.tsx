"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/auth/SignOutButton";

type EmployerSidebarProps = {
  userName: string;
};

const employerLinks = [
  {
    name: "Companies",
    href: "/employer/companies",
  },
  {
    name: "Jobs",
    href: "/employer/jobs",
  },
  {
    name: "Create Job",
    href: "/employer/jobs/create",
  },
];

export default function EmployerSidebar({ userName }: EmployerSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-gray-200 bg-white md:flex md:flex-col">
      <div className="border-b border-gray-200 px-6 py-6">
        <Link href="/" className="block">
          <h2 className="text-2xl font-bold tracking-wide text-gray-900">
            Hire<span className="text-primary">Flow</span>
          </h2>
        </Link>
        <p className="mt-2 text-sm text-gray-500">Employer Dashboard</p>
      </div>

      <div className="border-b border-gray-200 px-6 py-4">
        <p className="text-sm text-gray-500">Signed in as</p>
        <p className="mt-1 font-medium text-gray-900">{userName}</p>
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {employerLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-gray-200 px-4 py-4">
        <div className="mb-3">
          <Link
            href="/jobs"
            className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Back to Site
          </Link>
        </div>

        <div className="rounded-lg hover:bg-gray-100">
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}
