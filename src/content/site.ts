export const SITE = {
  name: "RG Stack",
  shortName: "RG",
  role: "Full-Stack Developer",
  url: "https://rgstack.dev",
  email: "hello@rgstack.dev",
  github: "https://github.com/rgstack",
  linkedin: "https://www.linkedin.com/in/rgstack",
  x: "https://x.com/rgstack",
  locationEn: "Egypt",
  locationAr: "مصر",
} as const;

export type TechKey =
  | "nextjs"
  | "react"
  | "typescript"
  | "tailwind"
  | "bootstrap"
  | "framer"
  | "node"
  | "express"
  | "nestjs"
  | "rest"
  | "postgres"
  | "drizzle"
  | "prisma"
  | "git"
  | "github"
  | "docker"
  | "vercel"
  | "vscode";

export const TECH_LABEL: Record<TechKey, string> = {
  nextjs: "Next.js",
  react: "React",
  typescript: "TypeScript",
  tailwind: "Tailwind CSS",
  bootstrap: "Bootstrap",
  framer: "Framer Motion",
  node: "Node.js",
  express: "Express",
  nestjs: "NestJS",
  rest: "REST APIs",
  postgres: "PostgreSQL",
  drizzle: "Drizzle ORM",
  prisma: "Prisma",
  git: "Git",
  github: "GitHub",
  docker: "Docker",
  vercel: "Vercel",
  vscode: "VS Code",
};

export const HERO_STACK: TechKey[] = [
  "nextjs",
  "react",
  "typescript",
  "node",
  "postgres",
  "drizzle",
  "tailwind",
];

export const SKILL_CATEGORIES: { id: string; index: string; items: TechKey[] }[] = [
  { id: "frontend", index: "01", items: ["nextjs", "react", "typescript", "tailwind", "bootstrap", "framer"] },
  { id: "backend", index: "02", items: ["node", "express", "nestjs", "rest"] },
  { id: "database", index: "03", items: ["postgres", "drizzle", "prisma"] },
  { id: "tools", index: "04", items: ["git", "github", "docker", "vercel", "vscode"] },
];

export type SketchVariant = "directory" | "template" | "delivery" | "dashboard" | "uikit";

export type ProjectMeta = {
  slug: string;
  index: string;
  year: string;
  featured: boolean;
  tech: TechKey[];
  sketch: SketchVariant;
};

export const PROJECTS: ProjectMeta[] = [
  {
    slug: "tel-el-kebir-guide",
    index: "01",
    year: "2025",
    featured: true,
    tech: ["nextjs", "typescript", "react", "postgres", "drizzle", "tailwind"],
    sketch: "directory",
  },
  {
    slug: "portfolio-template",
    index: "02",
    year: "2025",
    featured: false,
    tech: ["nextjs", "typescript", "tailwind", "framer"],
    sketch: "template",
  },
  {
    slug: "daboor-delivery",
    index: "03",
    year: "2024",
    featured: false,
    tech: ["react", "typescript", "node", "postgres"],
    sketch: "delivery",
  },
  {
    slug: "ai-saas-dashboard",
    index: "04",
    year: "2024",
    featured: false,
    tech: ["nextjs", "typescript", "tailwind", "node"],
    sketch: "dashboard",
  },
  {
    slug: "arabic-ui-kit",
    index: "05",
    year: "2024",
    featured: false,
    tech: ["react", "typescript", "tailwind"],
    sketch: "uikit",
  },
];

export const FEATURED_PROJECT = PROJECTS[0];
export const OTHER_PROJECTS = PROJECTS.filter((project) => !project.featured);

export function getProject(slug: string): ProjectMeta | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
