import { Heading } from "@radix-ui/themes";
import Link from "next/link";
import { navLinks } from "@/constants";

const Navbar = () => {
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
            className="font-semibold pb-1 hover:text-gray-200 hover:border-b hover:border-primary transition-colors"
            key={link.name}
            href={link.to}
          >
            {link.name}
          </Link>
        ))}
      </div>
      <div>
        <Link href="/login">
          <button className="border font-semibold py-2 px-3 rounded-lg hover:border-primary hover:text-primary transition-all ease-in cursor-pointer">
            Sign In
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
