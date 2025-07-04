import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vdk.tools";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/auth/callback",
          "/auth/login",
          "/auth/register",
          "/_next/",
          "/private/",
        ],
      },
      {
        userAgent: "GPTBot",
        allow: ["/rules/", "/docs/", "/hub"],
        disallow: ["/api/", "/admin/", "/auth/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
