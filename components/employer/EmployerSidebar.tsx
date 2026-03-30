"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white md:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <Link href="/" className="block">
              <h2 className="text-xl font-bold tracking-wide text-gray-900">
                Hire<span className="text-primary">Flow</span>
              </h2>
            </Link>
            <p className="mt-1 text-xs text-gray-500">Employer Dashboard</p>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            aria-label="Toggle employer menu"
          >
            {isMobileOpen ? (
              <HiOutlineX size={24} />
            ) : (
              <HiOutlineMenu size={24} />
            )}
          </button>
        </div>

        {isMobileOpen && (
          <div className="border-t border-gray-200 px-4 py-4">
            <div className="mb-4 rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="mt-1 font-medium text-gray-900">{userName}</p>
            </div>

            <nav className="space-y-2">
              {employerLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
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
            </nav>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="mb-2">
                <Link
                  href="/jobs"
                  onClick={() => setIsMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Back to Site
                </Link>
              </div>

              <div className="cursor-pointer rounded-lg hover:bg-gray-100">
                <SignOutButton />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
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

          <div className="cursor-pointer rounded-lg hover:bg-gray-100">
            <SignOutButton />
          </div>
        </div>
      </aside>
    </>
  );
}
