"use client";

import Image from "next/image";
import Link from "next/link";
import type { PortfolioProject } from "@/content/project-types";
import { TECH_LABEL } from "@/content/site";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, ArrowUpRight, GithubIcon } from "./ui/icons";

export function ProjectCard({ project }: { project: PortfolioProject }) {
  const { locale, t } = useI18n();
  const copy = locale === "ar" ? project.ar : project.en;

  return (
    <article className="group">
      <Link
        href={`/projects/${project.slug}`}
        className="block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <div className="relative">
          <div className="relative aspect-video overflow-hidden rounded-sm border border-line bg-bg-alt">
            <Image
              src={project.imageUrl}
              alt={copy.title}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              unoptimized
            />
          </div>

          {project.mobileImageUrl ? (
            <div className="absolute -bottom-[30%] end-4 z-10 w-[24%] max-w-[120px] min-w-[72px]">
              {" "}
              <div className="relative aspect-[9/19.5] overflow-hidden rounded-2xl border-4 border-bg bg-bg shadow-2xl ring-1 ring-black/10">
                <Image
                  src={project.mobileImageUrl}
                  alt={`${copy.title} — Mobile`}
                  fill
                  sizes="120px"
                  className="object-cover"
                  loading="lazy"
                  unoptimized
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-28 flex items-baseline gap-3">
          <span className="t-label text-muted">{project.index}</span>

          <span className="t-caption text-muted">{copy.category}</span>

          <span aria-hidden className="h-px flex-1 bg-line" />

          <span className="t-caption text-muted tabular-nums keep-latin">
            {project.year}
          </span>
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

      {(project.liveUrl || project.githubUrl) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-line-strong px-3.5 py-2 text-sm font-medium text-ink transition-colors duration-200 hover:border-ink hover:bg-surface hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span>{t.work.liveDemo}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : null}

          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-line px-3.5 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:border-line-strong hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <GithubIcon className="h-3.5 w-3.5" />

              <span>{t.work.github}</span>
            </a>
          ) : null}
        </div>
      )}
    </article>
  );
}
