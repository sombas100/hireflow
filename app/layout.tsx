import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hireflowjobs.io"),
  title: {
    default: "HireFlow | Junior Developer Jobs",
    template: "%s | HireFlow",
  },
  // icons: {
  //   icon: "hireflowlogo.png",
  // },
  description:
    "HireFlow is a junior developer job board focused on entry-level and junior software roles only.",
  keywords: [
    "junior developer jobs",
    "entry level developer jobs",
    "frontend developer jobs",
    "junior software engineer jobs",
    "graduate developer jobs",
    "react jobs junior",
    "hireflow",
  ],
  openGraph: {
    title: "HireFlow | Junior Developer Jobs",
    description:
      "A job board focused only on entry-level and junior developer roles.",
    url: "https://www.hireflowjobs.io",
    siteName: "HireFlow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireFlow | Junior Developer Jobs",
    description:
      "A job board focused only on entry-level and junior developer roles.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Theme>{children}</Theme>
        <ToastContainer />
      </body>
    </html>
  );
}
