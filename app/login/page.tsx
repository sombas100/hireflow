import React from "react";
import { Flex, Heading, Text } from "@radix-ui/themes";
import GoogleOauthButton from "./GoogleOauthButton";

const LoginPage = () => {
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
        <form className="flex flex-col shadow-zinc-600 shadow-md max-w-md w-full items-center justify-center p-8 rounded-lg">
          <Heading mb="1" as="h1" size="9" className="tracking-wide">
            Hire<span className="text-primary">Flow</span>
          </Heading>
          <Text size="3" as="p" className="text-zinc-300">
            Sign in and get started
          </Text>
          <Flex gap="1" mb="5" direction="column" width="100%" mt="6">
            <label>Email Address</label>
            <input
              className="border w-full mt-2 rounded-lg p-2 focus:outline-none focus:border-primary"
              placeholder="example@email.com"
            />
            <label className="mt-3">Password</label>
            <input className="border w-full mt-2 rounded-lg p-2 focus:outline-none focus:border-primary" />
          </Flex>
          <GoogleOauthButton />
        </form>
      </Flex>
    </div>
  );
};

export default LoginPage;
