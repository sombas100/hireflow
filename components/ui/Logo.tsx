import Link from "next/link";
import { Heading } from "@radix-ui/themes";

const Logo = () => {
  return (
    <Link href="/" className="shrink-0 flex flex-col text-white mb-2">
      <Heading as="h1" size="6" className="tracking-widest">
        Hire<span className="text-primary">Flow</span>
      </Heading>
      <span className="text-gray-500 text-xs">Find Junior tech roles</span>
    </Link>
  );
};

export default Logo;
