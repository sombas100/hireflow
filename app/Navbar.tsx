import { Heading } from "@radix-ui/themes";
import Link from "next/link";
import { navLinks } from "@/constants";
import { auth } from "@/auth";
import UserMenu from "@/components/ui/UserMenu";
import MobileNavbarMenu from "@/components/ui/MobileNavbarMenu";

const Navbar = async () => {
  const session = await auth();
  const authenticatedUser = session?.user;

  return (
    <nav className="w-full bg-gray-900 px-4 py-4 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/jobs" className="shrink-0">
          <Heading mb="1" as="h1" size="6" className="tracking-widest">
            Hire<span className="text-primary">Flow</span>
          </Heading>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              className="border-b border-transparent pb-1 font-medium transition-colors hover:border-primary hover:text-gray-200"
              key={link.name}
              href={link.to}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop auth area */}
        <div className="hidden md:flex md:items-center">
          {authenticatedUser ? (
            <UserMenu user={authenticatedUser} />
          ) : (
            <Link href="/login">
              <button className="cursor-pointer rounded-lg border px-3 py-2 font-semibold transition-all ease-in hover:border-primary hover:text-primary">
                Sign In
              </button>
            </Link>
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <MobileNavbarMenu user={authenticatedUser} navLinks={navLinks} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
