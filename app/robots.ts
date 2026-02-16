import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/api/", "/settings/"],
        allow: "/"
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
