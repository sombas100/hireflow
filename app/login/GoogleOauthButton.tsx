"use client";

import { signIn } from "next-auth/react";
import { AiFillGoogleCircle } from "react-icons/ai";

const GoogleOauthButton = () => {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { redirectTo: "/" })}
      className="
    flex items-center justify-center w-full rounded-lg py-2 px-1
    bg-linear-to-br from-purple-500 to-primary hover:bg-linear-to-tl transition-all 
    ease-in cursor-pointer"
    >
      Sign in with Google <AiFillGoogleCircle size={20} className="ml-1" />
    </button>
  );
};

export default GoogleOauthButton;
