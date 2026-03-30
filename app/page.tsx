import { Flex, Text, Heading, Button } from "@radix-ui/themes";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Footer from "./Footer";
import LandingNavbar from "@/components/ui/LandingNavbar";

export default function Home() {
  return (
    <>
      <LandingNavbar />
      <div className="relative bg-gray-950 min-h-screen p-4 text-white">
        <div className="absolute pointer-events-none top-20 left-0 rounded-full w-125 h-125 opacity-20 blur-[200px] bg-primary" />
        <div className="absolute pointer-events-none bottom-20 right-0 rounded-full w-125 h-125 opacity-20 blur-[200px] bg-primary" />
        <Flex
          direction="column"
          justify="center"
          align="center"
          className="min-h-screen"
          maxWidth="1200px"
          m="auto"
        >
          <Heading mb="4" as="h1" size="9" className="tracking-wide">
            The job board for <span className="text-primary">Junior</span>{" "}
            Developers only
          </Heading>
          <Text size="3" as="p" className="text-zinc-300 max-w-lg w-full">
            Junior developer jobs with real chances (not fake entry-level
            requiring 5 years experience). We filter out fake junior roles.
          </Text>
          <PrimaryButton link="/login">Get Started</PrimaryButton>
        </Flex>
      </div>
      <Footer />
    </>
  );
}
