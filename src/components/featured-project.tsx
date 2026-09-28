"use client";

import Image from "next/image";
import Link from "next/link";
import type { PortfolioProject } from "@/content/project-types";
import { TECH_LABEL } from "@/content/site";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, ArrowUpRight, GithubIcon } from "./ui/icons";
import { buttonClass, Eyebrow, TechList } from "./ui/primitives";
import { Reveal } from "./ui/reveal";

export function FeaturedProject({ project }: { project: PortfolioProject }) {
  const { locale, t } = useI18n();
  const copy = locale === "ar" ? project.ar : project.en;

  return (
    <article className="mt-16 md:mt-20">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow index={project.index}>{t.work.featuredLabel}</Eyebrow>

            <h3 className="mt-7">
              <Link
                href={`/projects/${project.slug}`}
                className="t-display-l link-underline text-balance"
              >
                {copy.title}
              </Link>
            </h3>

            <dl className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted">
              <div>
                <dt className="sr-only">{t.caseStudy.category}</dt>
                <dd className="t-caption">{copy.category}</dd>
              </div>

              <span aria-hidden className="h-3 w-px bg-line-strong" />

              <div>
                <dt className="sr-only">{t.caseStudy.year}</dt>
                <dd className="t-caption tabular-nums keep-latin">
                  {project.year}
                </dd>
              </div>

              <span aria-hidden className="h-3 w-px bg-line-strong" />

              <div>
                <dt className="sr-only">{t.caseStudy.status}</dt>
                <dd className="t-caption text-accent">{copy.status}</dd>
              </div>
            </dl>

            <p className="t-body-l mt-7 max-w-[52ch] text-ink-2">
              {copy.summary}
            </p>

            <div className="mt-8">
              <p className="t-label text-muted">{t.work.stack}</p>

              <div className="mt-4">
                <TechList items={project.tech} />
              </div>
            </div>

            <div className="mt-9 flex flex-wrap gap-2.5">
              <Link
                href={`/projects/${project.slug}`}
                className={buttonClass("primary", "md")}
              >
                {t.work.viewCaseStudy}

                <ArrowRight className="arrow-shift h-4 w-4 rtl:-scale-x-100" />
              </Link>

              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass("secondary", "md")}
                >
                  {t.work.liveDemo}

                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}

              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass("quiet", "md")}
                >
                  <GithubIcon className="h-4 w-4" />

                  {t.work.github}
                </a>
              ) : null}
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={0.08} className="sm:ps-12 lg:ps-14">
            <div className="relative aspect-video rounded-sm bg-bg-alt">
              <div className="absolute inset-0 overflow-hidden rounded-2xl border-4 border-bg bg-bg shadow-2xl ring-1 ring-black/10">
                <Image
                  src={project.imageUrl}
                  alt={copy.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority={project.featured}
                  unoptimized
                />
              </div>

              {project.mobileImageUrl ? (
                <div className="absolute -bottom-[30%] end-4 z-10 w-[24%] max-w-[150px] min-w-[90px]">
                  <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.25rem] border-4 border-bg bg-bg shadow-2xl ring-1 ring-black/10">
                    <Image
                      src={project.mobileImageUrl}
                      alt={`${copy.title} — Mobile`}
                      fill
                      sizes="150px"
                      className="object-cover"
                      loading="lazy"
                      unoptimized
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <p className="t-caption mt-[28%] text-muted sm:mt-[24%]">
              {t.work.previewCaption}
            </p>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.05} className="mt-16">
        <p className="t-label text-muted">{t.work.keyFeatures}</p>

        <ul className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {copy.features.map((feature) => (
            <li key={feature.title} className="bg-bg p-5">
              <div className="flex items-center gap-2">
                <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />

                <h4 className="t-heading-m text-ink">{feature.title}</h4>
              </div>

              <p className="t-caption mt-2 text-muted">{feature.description}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </article>
  );
}
