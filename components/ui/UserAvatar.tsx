import React from "react";
import { auth } from "@/auth";
import Image from "next/image";

const UserAvatar = async () => {
  const session = await auth();
  const authenticatedUser = session?.user;
  return (
    <Image
      className="rounded-full hover:opacity-40 transition-all ease-in-out"
      width={45}
      height={45}
      src={authenticatedUser.image}
      alt="User Google Image"
    />
  );
};

export default UserAvatar;
