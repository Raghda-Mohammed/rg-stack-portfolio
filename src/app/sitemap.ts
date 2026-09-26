import type { MetadataRoute } from "next";
import { PROJECTS, SITE } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...PROJECTS.map((project) => ({
      url: `${SITE.url}/projects/${project.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: project.featured ? 0.9 : 0.7,
    })),
  ];
}
