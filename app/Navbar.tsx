import { Heading } from "@radix-ui/themes";
import Link from "next/link";
import { navLinks } from "@/constants";
import { auth } from "@/auth";
import UserAvatar from "@/components/ui/UserAvatar";
import SignOutButton from "@/components/auth/SignOutButton";
import UserMenu from "@/components/ui/UserMenu";

const Navbar = async () => {
  const session = await auth();
  const authenticatedUser = session?.user;
  return (
    <nav className="flex items-center justify-between text-white bg-gray-900 p-4 max-w-full w-full">
      <div>
        <Heading mb="1" as="h1" size="6" className="tracking-widest">
          Hire<span className="text-primary">Flow</span>
        </Heading>
      </div>
      <div className="flex gap-6">
        {navLinks.map((link) => (
          <Link
            className="font-medium pb-1 hover:p-0 hover:text-gray-200 border-b border-primary border-hidden hover:border-solid hover:border-primary transition-colors"
            key={link.name}
            href={link.to}
          >
            {link.name}
          </Link>
        ))}
      </div>
      {authenticatedUser ? (
        <div className="flex items-center gap-5">
          <UserMenu user={authenticatedUser} />
        </div>
      ) : (
        <div>
          <Link href="/login">
            <button className="border font-semibold py-2 px-3 rounded-lg hover:border-primary hover:text-primary transition-all ease-in cursor-pointer">
              Sign In
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
