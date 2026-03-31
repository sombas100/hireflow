"use client";

import React, { useState } from "react";
import { Flex, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState<"CANDIDATE" | "EMPLOYER">(
    "CANDIDATE",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setErrors({});

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: selectedRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.issues) {
          const fieldErrors: Record<string, string> = {};

          data.issues.forEach((issue: { path: string[]; message: string }) => {
            const field = issue.path?.[0];
            if (field) fieldErrors[field] = issue.message;
          });

          setErrors(fieldErrors);
          toast.error("Please fix the highlighted fields.");
          return;
        }

        throw new Error(data?.error || "Failed to register");
      }

      toast.success("Account created successfully.");

      const result = await signIn("credentials", {
        email,
        password,
        role: selectedRole,
        redirect: false,
      });

      if (result?.error) {
        window.location.href = "/login";
        return;
      }

      window.location.href = "/auth/redirect";
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong while registering.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-950 p-4 text-white">
      <div className="pointer-events-none absolute top-20 left-0 h-125 w-125 rounded-full bg-primary opacity-20 blur-[200px]" />
      <div className="pointer-events-none absolute right-0 bottom-20 h-125 w-125 rounded-full bg-primary opacity-20 blur-[200px]" />

      <Flex
        direction="column"
        justify="center"
        align="center"
        className="min-h-screen"
        maxWidth="950px"
        m="auto"
      >
        <form
          onSubmit={handleRegister}
          className="flex w-full max-w-md flex-col items-center justify-center rounded-lg p-8 shadow-md shadow-zinc-600"
        >
          <Heading mb="1" as="h1" size="9" className="tracking-wide">
            Hire<span className="text-primary">Flow</span>
          </Heading>

          <Text size="3" as="p" className="text-zinc-300">
            Create your account
          </Text>

          <div className="mt-6 w-full">
            <p className="mb-3 text-sm font-medium text-zinc-300">
              Register as
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("CANDIDATE")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  selectedRole === "CANDIDATE"
                    ? "bg-primary text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
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
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                Employer
              </button>
            </div>
          </div>

          <Flex gap="1" mb="5" direction="column" width="100%" mt="6">
            <label>Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-lg border p-2 focus:border-primary focus:outline-none"
              placeholder="Your name"
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}

            <label className="mt-3">Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-2 w-full rounded-lg border p-2 focus:border-primary focus:outline-none"
              placeholder="example@email.com"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}

            <label className="mt-3">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-2 w-full rounded-lg border p-2 focus:border-primary focus:outline-none"
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </Flex>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg cursor-pointer bg-white py-2 font-semibold text-gray-900 transition hover:bg-zinc-200 disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>

          <p className="mt-6 text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </Flex>
    </div>
  );
};

export default RegisterPage;
