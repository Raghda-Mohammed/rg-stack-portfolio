import "server-only";

import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { ar } from "@/content/ar";
import { en } from "@/content/en";
import { PROJECTS, type SketchVariant, type TechKey } from "@/content/site";
import type { ProjectCopy } from "@/content/types";
import type { PortfolioProject } from "@/content/project-types";

const seedImages = [
  "/projects/project-1.jpg",
  "/projects/project-2.jpg",
  "/projects/project-3.jpg",
  "/projects/project-4.jpg",
  "/projects/project-5.jpg",
  "/projects/project-6.jpg",
];

function copyFor(dict: typeof en, slug: string): ProjectCopy {
  const copy = dict.projects[slug];

  if (!copy) {
    throw new Error(`Missing project copy for ${slug}`);
  }

  return copy;
}

function rowToProject(row: typeof projects.$inferSelect): PortfolioProject {
  return {
    id: row.id,
    slug: row.slug,
    index: row.index,
    year: row.year,
    featured: row.featured,
    published: row.published,
    tech: row.tech as TechKey[],
    sketch: row.sketch as SketchVariant,

    // Desktop preview
    imageUrl: row.imageUrl,

    // Mobile preview
    ...(row.mobileImageUrl ? { mobileImageUrl: row.mobileImageUrl } : {}),

    liveUrl: row.liveUrl ?? "",
    githubUrl: row.githubUrl ?? "",
    en: row.enCopy as ProjectCopy,
    ar: row.arCopy as ProjectCopy,
  };
}

export async function seedProjectsIfNeeded() {
  const existing = await db.select({ id: projects.id }).from(projects).limit(1);

  if (existing.length) return;

  await db.insert(projects).values(
    PROJECTS.map((project, index) => ({
      slug: project.slug,
      index: project.index,
      year: project.year,
      featured: project.featured,
      published: true,
      tech: project.tech,
      sketch: project.sketch,
      imageUrl: seedImages[index] ?? seedImages[0],

      // Existing seeded projects do not have a separate mobile image.
      mobileImageUrl: null,

      liveUrl: project.slug === "tel-el-kebir-guide" ? "" : "",
      githubUrl: "",
      enCopy: copyFor(en, project.slug),
      arCopy: copyFor(ar, project.slug),
    })),
  );
}

export async function getPortfolioProjects(options?: {
  includeUnpublished?: boolean;
}) {
  try {
    await seedProjectsIfNeeded();

    const query = db.select().from(projects);

    const rows = options?.includeUnpublished
      ? await query.orderBy(asc(projects.index))
      : await query
          .where(eq(projects.published, true))
          .orderBy(asc(projects.index));

    return rows.map(rowToProject);
  } catch (error) {
    console.error("[projects] Failed to load projects", error);

    return PROJECTS.map((project, index) => ({
      id: index + 1,
      slug: project.slug,
      index: project.index,
      year: project.year,
      featured: project.featured,
      published: true,
      tech: project.tech,
      sketch: project.sketch,
      imageUrl: seedImages[index] ?? seedImages[0],

      // No mobile preview in the static fallback.
      liveUrl: "",
      githubUrl: "",
      en: copyFor(en, project.slug),
      ar: copyFor(ar, project.slug),
    }));
  }
}

export async function getPortfolioProject(slug: string) {
  const projectsList = await getPortfolioProjects();

  return projectsList.find((project) => project.slug === slug);
}

export async function getAdminProjects() {
  await seedProjectsIfNeeded();

  const rows = await db.select().from(projects).orderBy(asc(projects.index));

  return rows.map(rowToProject);
}

export async function getProjectRecord(id: number) {
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  return rows[0] ? rowToProject(rows[0]) : null;
}
