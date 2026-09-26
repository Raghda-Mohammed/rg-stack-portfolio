"use client";

import Link from "next/link";
import { TECH_LABEL, type ProjectMeta } from "@/content/site";
import { useI18n } from "@/lib/i18n";
import { ArrowRight } from "./ui/icons";
import { ProjectSketch } from "./visuals/project-sketch";

export function ProjectCard({ project }: { project: ProjectMeta }) {
  const { t } = useI18n();
  const copy = t.projects[project.slug];

  return (
    <article className="group">
      <Link href={`/projects/${project.slug}`} className="block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
        <div className="transition-opacity duration-300 group-hover:opacity-95">
          <ProjectSketch variant={project.sketch} />
        </div>

        <div className="mt-6 flex items-baseline gap-3">
          <span className="t-label text-muted">{project.index}</span>
          <span className="t-caption text-muted">{copy.category}</span>
          <span aria-hidden className="h-px flex-1 bg-line" />
          <span className="t-caption text-muted tabular-nums keep-latin">{project.year}</span>
        </div>

        <h3 className="t-heading-l mt-3.5 font-display text-ink transition-colors duration-200 group-hover:text-accent">
          {copy.title}
        </h3>

        <p className="t-body-s mt-3 max-w-[46ch] text-muted">{copy.summary}</p>

        <ul className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {project.tech.map((tech) => (
            <li key={tech} className="t-mono keep-latin text-muted">
              {TECH_LABEL[tech]}
            </li>
          ))}
        </ul>

        <span className="mt-6 inline-flex items-center gap-2 text-ink-2 transition-colors duration-200 group-hover:text-accent">
          <span className="t-label">{t.work.viewCaseStudy}</span>
          <ArrowRight className="arrow-shift h-3.5 w-3.5 rtl:-scale-x-100" />
        </span>
      </Link>
    </article>
  );
}
