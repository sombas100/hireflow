"use client";
import Image from "next/image";

type UserAvatarProps = {
  image?: string | null;
  name?: string | null;
};

const UserAvatar = ({ image, name }: UserAvatarProps) => {
  if (image) {
    return (
      <Image
        width={45}
        height={45}
        src={image}
        alt={name || "User avatar"}
        className="h-10 w-10 hover:opacity-30 transition-all rounded-full object-cover border border-gray-300"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold border border-gray-300">
      {name?.charAt(0).toUpperCase() || "U"}
    </div>
  );
};

export default UserAvatar;
