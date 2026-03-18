"use client";

import { signOut } from "next-auth/react";

const SignOutButton = () => {
  return (
    <button
      onClick={() => signOut({ redirectTo: "/login" })}
      className="border py-2 px-3 rounded-lg font-semibold bg-red-600 hover:bg-gray-900 transition-colors cursor-pointer"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
