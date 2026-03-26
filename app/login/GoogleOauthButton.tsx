"use client";

import { signIn } from "next-auth/react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { useState } from "react";

type GoogleOauthButtonProps = {
  role: "CANDIDATE" | "EMPLOYER";
};

const GoogleOauthButton = ({ role }: GoogleOauthButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      const res = await fetch("/api/auth/select-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to select role");
      }

      await signIn("google", { redirectTo: "/auth/redirect" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-primary px-1 py-2 transition-all ease-in hover:bg-linear-to-tl disabled:opacity-50"
    >
      {isLoading
        ? "Please wait..."
        : `Sign in as ${role === "EMPLOYER" ? "Employer" : "Candidate"} with Google`}
      <AiFillGoogleCircle size={20} className="ml-1" />
    </button>
  );
};

export default GoogleOauthButton;
