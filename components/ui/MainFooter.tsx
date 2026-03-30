import Link from "next/link";

const MainFooter = () => {
  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center md:flex-col md:text-left">
        <Link
          href="/"
          className="text-xl font-bold tracking-wide text-gray-900"
        >
          Hire<span className="text-primary">Flow</span>
        </Link>

        <p className="text-sm text-gray-500 border-t pt-3">
          © 2026 Hireflow | Built & Designed in London UK by Corey Clarke.
        </p>
      </div>
    </footer>
  );
};

export default MainFooter;
