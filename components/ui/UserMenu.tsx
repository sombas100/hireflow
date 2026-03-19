"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import UserAvatar from "@/components/ui/UserAvatar";
import SignOutButton from "@/components/auth/SignOutButton";

type UserMenuProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
};

const UserMenu = ({ user }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const profileHref =
    user.role === "EMPLOYER" ? "/employer/companies" : "/candidate/profile";

  return (
    <div className="relative flex items-center" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer rounded-full focus:outline-none"
      >
        <UserAvatar image={user.image} name={user.name} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full min-w-56 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg z-50">
          <div className="border-b border-gray-200 px-3 py-2">
            <p className="text-sm font-semibold text-gray-900">
              {user.name || "User"}
            </p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>

          <div className="py-2">
            <Link
              href={profileHref}
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              My Profile
            </Link>
          </div>

          <div className="border-t border-gray-200 px-3 py-2">
            <SignOutButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
