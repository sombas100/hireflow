import { Flex, Text, Heading } from "@radix-ui/themes";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Footer from "./Footer";
import LandingNavbar from "@/components/ui/LandingNavbar";
import Link from "next/link";

const features = [
  {
    title: "Junior roles only",
    description:
      "HireFlow is focused on entry-level and junior developer opportunities only.",
  },
  {
    title: "No fake entry-level jobs",
    description:
      "We aim to filter out misleading listings that ask juniors for senior-level experience.",
  },
  {
    title: "Built for first dev jobs",
    description:
      "Whether you're self-taught, a bootcamp graduate, or a CS student, this board is made for you.",
  },
];

const steps = [
  {
    title: "Browse junior jobs",
    description:
      "Search through junior-friendly software roles without wasting time on senior listings.",
  },
  {
    title: "Apply with confidence",
    description:
      "Upload your resume, save jobs, and apply directly through a cleaner workflow.",
  },
  {
    title: "Help employers reach juniors",
    description:
      "Employers can post junior roles and connect with candidates looking for their first opportunities.",
  },
];

export default function Home() {
  return (
    <>
      <LandingNavbar />

      <div className="relative  bg-gray-950 text-white">
        <div className="absolute pointer-events-none top-20 left-0 h-125 w-125 rounded-full bg-primary opacity-20 blur-[200px]" />
        <div className="absolute pointer-events-none bottom-20 right-0 h-125 w-125 rounded-full bg-primary opacity-20 blur-[200px]" />

        <section className="min-h-screen px-4 pt-12 pb-20">
          <Flex
            direction="column"
            justify="center"
            align="center"
            className="mx-auto min-h-[85vh] text-center"
            maxWidth="1200px"
          >
            <div className="mb-4 rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-sm text-zinc-300">
              Built for entry-level and junior developers
            </div>

            <Heading
              mb="4"
              as="h1"
              size="9"
              className="max-w-4xl tracking-wide leading-tight"
            >
              The job board for{" "}
              <span className="text-primary">Junior Developers</span> only
            </Heading>

            <Text size="4" as="p" className="max-w-2xl text-zinc-300 leading-7">
              Junior developer jobs with real chances not fake entry-level roles
              asking for 5 years of experience. HireFlow is built to help new
              developers find opportunities faster.
            </Text>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                className="rounded-lg border border-zinc-700 bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-red-500 transition-colors"
                href={"/jobs"}
              >
                Browse Jobs
              </Link>

              <Link
                href="/login"
                className="rounded-lg border border-zinc-700 px-4 py-3 text-sm font-medium text-white transition hover:border-primary hover:text-primary"
              >
                Post a Job
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-400">
              <span className="rounded-full border border-zinc-800 px-3 py-1">
                Junior only
              </span>
              <span className="rounded-full border border-zinc-800 px-3 py-1">
                Candidate bookmarks
              </span>
              <span className="rounded-full border border-zinc-800 px-3 py-1">
                Resume uploads
              </span>
              <span className="rounded-full border border-zinc-800 px-3 py-1">
                Employer dashboard
              </span>
            </div>
          </Flex>
        </section>

        <section className="px-4 pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <Heading as="h2" size="7" className="tracking-wide">
                Why <span className="text-primary">HireFlow</span>?
              </Heading>
              <Text as="p" size="3" className="mt-3 text-zinc-400">
                A simpler, more focused way for junior developers to find real
                opportunities.
              </Text>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-md"
                >
                  <Heading as="h3" size="5" className="mb-3 text-white">
                    {feature.title}
                  </Heading>
                  <Text as="p" size="3" className="text-zinc-400 leading-6">
                    {feature.description}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <Heading as="h2" size="7" className="tracking-wide">
                How it works
              </Heading>
              <Text as="p" size="3" className="mt-3 text-zinc-400">
                A simple flow for candidates and employers.
              </Text>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-white">
                    {index + 1}
                  </div>
                  <Heading as="h3" size="5" className="mb-3 text-white">
                    {step.title}
                  </Heading>
                  <Text as="p" size="3" className="text-zinc-400 leading-6">
                    {step.description}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24">
          <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 text-center shadow-lg md:p-12">
            <Heading as="h2" size="8" className="tracking-wide">
              Start your junior developer journey
            </Heading>
            <Text as="p" size="3" className="mt-4 text-zinc-400 leading-7">
              Find your first role, save jobs, upload your resume, and apply
              through a cleaner platform built specifically for junior
              developers.
            </Text>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                className="rounded-lg border border-zinc-700 bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-red-500 transition-colors"
                href={"/jobs"}
              >
                Explore Jobs
              </Link>

              <Link
                href="/login"
                className="rounded-lg border border-zinc-700 px-4 py-3 text-sm font-medium text-white transition hover:border-primary hover:text-primary"
              >
                Join HireFlow
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
