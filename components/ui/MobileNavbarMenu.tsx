"use client";

import Link from "next/link";
import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import UserMenu from "@/components/ui/UserMenu";

type NavLink = {
  name: string;
  to: string;
};

type MobileNavbarMenuProps = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    id?: string;
  } | null;
  navLinks: NavLink[];
};

const MobileNavbarMenu = ({ user, navLinks }: MobileNavbarMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-3">
      {user ? (
        <UserMenu user={user} />
      ) : (
        <Link href="/login">
          <button className="cursor-pointer rounded-lg border px-3 py-2 text-sm font-semibold transition-all ease-in hover:border-primary hover:text-primary">
            Sign In
          </button>
        </Link>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-lg p-2 text-white hover:bg-gray-800"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-3 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.to}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavbarMenu;
