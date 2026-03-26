"use client";

import React, { useState } from "react";
import { Flex, Heading, Text } from "@radix-ui/themes";
import GoogleOauthButton from "./GoogleOauthButton";

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState<"CANDIDATE" | "EMPLOYER">(
    "CANDIDATE",
  );

  return (
    <div className="relative min-h-screen bg-gray-950 p-4 text-white">
      <div className="pointer-events-none absolute left-0 top-20 h-125 w-125 rounded-full bg-primary opacity-20 blur-[200px]" />
      <div className="pointer-events-none absolute bottom-20 right-0 h-125 w-125 rounded-full bg-primary opacity-20 blur-[200px]" />

      <Flex
        direction="column"
        justify="center"
        align="center"
        className="min-h-screen"
        maxWidth="950px"
        m="auto"
      >
        <form className="flex w-full max-w-md flex-col items-center justify-center rounded-lg p-8 shadow-md shadow-zinc-600">
          <Heading mb="1" as="h1" size="9" className="tracking-wide">
            Hire<span className="text-primary">Flow</span>
          </Heading>

          <Text size="3" as="p" className="text-zinc-300">
            Sign in and get started
          </Text>

          <div className="mt-6 w-full">
            <p className="mb-3 text-sm font-medium text-zinc-300">
              Continue as
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("CANDIDATE")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  selectedRole === "CANDIDATE"
                    ? "bg-primary text-white"
                    : "bg-zinc-800 text-zinc-300 cursor-pointer hover:bg-zinc-700"
                }`}
              >
                Candidate
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("EMPLOYER")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  selectedRole === "EMPLOYER"
                    ? "bg-primary text-white"
                    : "bg-zinc-800 cursor-pointer text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                Employer
              </button>
            </div>
          </div>

          <Flex gap="1" mb="5" direction="column" width="100%" mt="6">
            <label>Email Address</label>
            <input
              className="mt-2 w-full rounded-lg border p-2 focus:border-primary focus:outline-none"
              placeholder="example@email.com"
            />
            <label className="mt-3">Password</label>
            <input className="mt-2 w-full rounded-lg border p-2 focus:border-primary focus:outline-none" />
          </Flex>

          <GoogleOauthButton role={selectedRole} />
        </form>
      </Flex>
    </div>
  );
};

export default LoginPage;
