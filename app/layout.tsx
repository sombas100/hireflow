import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hireflowjobs.io"),
  title: {
    default: "HireFlow | Junior Developer Jobs",
    template: "%s | HireFlow",
  },
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
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Theme>{children}</Theme>
        <ToastContainer theme="dark" />
      </body>
    </html>
  );
}
