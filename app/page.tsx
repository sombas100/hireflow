import { Flex, Text, Heading, Button } from "@radix-ui/themes";
import Image from "next/image";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function Home() {
  return (
    <div className="relative bg-gray-950 min-h-screen p-4 text-white">
      <div className="absolute pointer-events-none top-20 left-0 rounded-full w-125 h-125 opacity-20 blur-[200px] bg-primary" />
      <div className="absolute pointer-events-none bottom-20 right-0 rounded-full w-125 h-125 opacity-20 blur-[200px] bg-primary" />
      <Flex
        direction="column"
        justify="center"
        align="center"
        className="min-h-screen"
        maxWidth="950px"
        m="auto"
      >
        <Heading mb="4" as="h1" size="9" className="tracking-wide">
          Welcome to Hire<span className="text-primary">Flow</span>
        </Heading>
        <Text size="3" as="p" className="text-zinc-300">
          The next revolutionary job searching application, Hireflow is a
          powerful job searching application that allows job seekers to easily
          apply to vacant positions and employers to find suitable candidates
          for their open positions. Click the button below to get started.
        </Text>
        <PrimaryButton link="/login">Get Started</PrimaryButton>
      </Flex>
    </div>
  );
}
