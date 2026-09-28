import type { ProjectCopy } from "./types";
import type { SketchVariant, TechKey } from "./site";

export type PortfolioProject = {
  id: number;
  slug: string;
  index: string;
  year: string;
  featured: boolean;
  published: boolean;
  tech: TechKey[];
  sketch: SketchVariant;
  imageUrl: string;
  mobileImageUrl?: string;
  liveUrl: string;
  githubUrl: string;
  en: ProjectCopy;
  ar: ProjectCopy;
};
