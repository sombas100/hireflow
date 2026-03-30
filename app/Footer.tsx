import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-950 px-4 py-6">
      <div className="mx-auto max-w-7xl text-white flex flex-col items-center border-b border-gray-500 pb-14">
        <h1 className=" text-3xl font-semibold tracking-wide">
          Find your first developer role
        </h1>
        <span className="text-md tracking-tighter text-gray-500 mb-2">
          Sign In to create an account and find your dream role
        </span>
        <Link
          className="py-2 px-3 bg-primary border-white border rounded-lg"
          href={"/login"}
        >
          Get Started
        </Link>
      </div>
      <div className="mx-auto pt-4 flex max-w-7xl flex-row items-center justify-center text-center md:flex-col md:text-left">
        <Link href="/" className="text-xl text-white font-bold tracking-wide ">
          Hire<span className="text-primary">Flow</span>
        </Link>
        <span className="text-gray-500 text-xs mb-4">
          Find Junior positions
        </span>
        <p className="text-sm text-gray-500">
          © 2026 Hireflow | Built & Designed in London UK by Corey Clarke.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
