import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/employer/", "/api/", "/candidate/"],
    },
    sitemap: "https://your-domain.com/sitemap.xml",
  };
}