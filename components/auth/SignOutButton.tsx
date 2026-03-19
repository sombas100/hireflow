"use client";

import { signOut } from "next-auth/react";

const SignOutButton = () => {
  return (
    <button
      onClick={() => signOut({ redirectTo: "/login" })}
      className="py-2 px-3 rounded-lg font-semibold text-red-600 hover:bg-gray-100 transition-colors cursor-pointer"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
