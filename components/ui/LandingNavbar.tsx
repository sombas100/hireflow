import { Heading } from "@radix-ui/themes";
import Link from "next/link";
import { landingNavLinks } from "@/constants";

const LandingNavbar = async () => {
  return (
    <nav className="w-full bg-gray-950 px-4 py-4 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="shrink-0 flex flex-col">
          <Heading as="h1" size="6" className="tracking-widest">
            Hire<span className="text-primary">Flow</span>
          </Heading>
          <span className="text-gray-500 text-xs">Find Junior positions</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-6 md:flex">
          {landingNavLinks.map((link) => (
            <Link
              className="border-b border-transparent pb-1 font-medium transition-colors hover:border-primary hover:text-gray-200"
              key={link.name}
              href={link.to}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/login">
            <button className="cursor-pointer rounded-lg  px-3 py-2 font-medium transition-all ease-in hover:border-primary hover:text-primary">
              Sign In
            </button>
          </Link>
        </div>

        {/* Desktop auth area */}
      </div>
    </nav>
  );
};

export default LandingNavbar;
