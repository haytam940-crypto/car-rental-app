import { MetadataRoute } from "next";
import { CARS } from "@/lib/data";

const BASE = "https://www.eson-maroc.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/fleet`,               lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/excursions`,          lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/contact`,             lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/about`,               lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/partenaires`,         lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const carPages: MetadataRoute.Sitemap = CARS.map(car => ({
    url: `${BASE}/cars/${car.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...carPages];
}
