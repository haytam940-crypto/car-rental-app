import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/reservation/"],
      },
    ],
    sitemap: "https://www.eson-maroc.com/sitemap.xml",
    host: "https://www.eson-maroc.com",
  };
}
