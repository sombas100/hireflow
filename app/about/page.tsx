import LandingNavbar from "@/components/ui/LandingNavbar";

import Footer from "../Footer";

const AboutPage = () => {
  return (
    <>
      <LandingNavbar />

      <div className="min-h-[70vh] bg-gray-950 text-white">
        <div className="max-w-2xl mx-auto flex items-center justify-center">
          <div className="mt-16">
            <h1 className="text-5xl">About</h1>
            <p className="mt-12">
              As a junior developer, I experienced firsthand how frustrating it
              can be to land your first role in the industry. Job boards are
              often filled with positions that demand senior-level experience,
              leaving little to no opportunity for those just starting out.
            </p>

            <p className="mt-4">
              I found myself constantly filtering through irrelevant listings,
              trying to find roles that were actually designed for junior
              developers roles that give you a real chance to grow, learn, and
              break into the industry.
            </p>

            <p className="mt-4">
              That’s why I created Hireflow a job board built specifically for
              junior developers. A platform focused on real entry-level
              opportunities, where beginners aren’t overlooked, and where your
              journey into tech actually begins.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
