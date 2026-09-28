"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { PortfolioProject } from "@/content/project-types";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, ArrowUpRight, GithubIcon } from "./ui/icons";
import { buttonClass, TechList } from "./ui/primitives";
import { Reveal } from "./ui/reveal";

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="grid gap-5 border-t border-line py-10 md:grid-cols-12 md:gap-10 md:py-12">
      <h2 className="t-label text-muted md:col-span-3">{label}</h2>

      <div className="md:col-span-9">{children}</div>
    </section>
  );
}

export function CaseStudy({
  project,
  nextProject,
}: {
  project: PortfolioProject;
  nextProject?: PortfolioProject;
}) {
  const { locale, t } = useI18n();

  const copy = locale === "ar" ? project.ar : project.en;

  const nextCopy = nextProject
    ? locale === "ar"
      ? nextProject.ar
      : nextProject.en
    : null;

  return (
    <article>
      <header className="container-editorial pt-10 pb-12 md:pt-14 md:pb-16">
        <Link
          href="/#projects"
          className="group inline-flex items-center gap-2 text-muted transition-colors duration-200 hover:text-accent"
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-180 rtl:rotate-0" />

          <span className="t-label">{t.caseStudy.back}</span>
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="t-label text-accent">{copy.category}</p>

            <h1 className="t-display-l mt-5 text-balance">{copy.title}</h1>

            <p className="t-body-l mt-7 max-w-[54ch] text-ink-2">
              {copy.summary}
            </p>

            {(project.liveUrl || project.githubUrl) && (
              <div className="mt-8 flex flex-wrap gap-2.5">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass("primary", "md")}
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
                    className={buttonClass("secondary", "md")}
                  >
                    <GithubIcon className="h-4 w-4" />

                    {t.work.github}
                  </a>
                ) : null}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 lg:pt-2">
            <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-3 lg:grid-cols-1">
              <div className="bg-bg p-5">
                <dt className="t-label text-muted">{t.caseStudy.year}</dt>

                <dd className="t-body-s mt-2 tabular-nums keep-latin">
                  {project.year}
                </dd>
              </div>

              <div className="bg-bg p-5">
                <dt className="t-label text-muted">{t.caseStudy.category}</dt>

                <dd className="t-body-s mt-2">{copy.category}</dd>
              </div>

              <div className="bg-bg p-5">
                <dt className="t-label text-muted">{t.caseStudy.status}</dt>

                <dd className="t-body-s mt-2 text-accent">{copy.status}</dd>
              </div>
            </dl>
          </div>
        </div>
      </header>

      <div className="border-y border-line bg-bg-alt py-14 md:py-20">
        <div className="container-editorial">
          <Reveal className="mx-auto max-w-5xl">
            {/* Desktop preview */}
            {/* Project previews */}
            <div className="relative">
              {/* Desktop preview */}
              <div className="relative aspect-video overflow-hidden rounded-sm border border-line bg-bg">
                <Image
                  src={project.imageUrl}
                  alt={copy.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>

              {/* Mobile preview */}
              {project.mobileImageUrl ? (
                <>
                  <div className="absolute top-[70%] end-5 z-10 w-[24%] max-w-[180px] min-w-[90px] -translate-y-[30%] sm:end-8">
                    <div className="relative aspect-[9/19.5] overflow-hidden rounded-3xl border-4 border-bg bg-bg shadow-2xl ring-1 ring-black/10">
                      <Image
                        src={project.mobileImageUrl}
                        alt={`${copy.title} — Mobile`}
                        fill
                        sizes="180px"
                        className="object-cover"
                        loading="lazy"
                        unoptimized
                      />
                    </div>
                  </div>

                  <div
                    className="h-[clamp(10rem,22vw,14rem)]"
                    aria-hidden="true"
                  />
                </>
              ) : null}
            </div>
          </Reveal>

          <p className="t-caption mt-12 text-center text-muted sm:mt-14">
            {t.work.previewCaption}
          </p>
        </div>
      </div>

      <div className="container-editorial pb-8">
        <Block label={t.caseStudy.overview}>
          <p className="t-body-l max-w-[68ch] text-ink-2">{copy.overview}</p>
        </Block>

        <Block label={t.caseStudy.challenge}>
          <p className="t-body-m max-w-[68ch] text-muted">{copy.challenge}</p>
        </Block>

        <Block label={t.caseStudy.approach}>
          <p className="t-body-m max-w-[68ch] text-muted">{copy.approach}</p>
        </Block>

        <Block label={t.caseStudy.architecture}>
          <dl className="divide-y divide-line border-y border-line">
            {copy.architecture.map((row) => (
              <div
                key={row.label}
                className="grid gap-2 py-5 sm:grid-cols-4 sm:gap-6"
              >
                <dt className="t-heading-m text-ink">{row.label}</dt>

                <dd className="t-body-s text-muted sm:col-span-3">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block label={t.caseStudy.features}>
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
            {copy.features.map((feature) => (
              <li key={feature.title} className="bg-bg p-5">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-1 w-1 rounded-full bg-accent"
                  />

                  <h3 className="t-heading-m">{feature.title}</h3>
                </div>

                <p className="t-caption mt-2 text-muted">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>
        </Block>

        <Block label={t.caseStudy.technology}>
          <TechList items={project.tech} />
        </Block>

        <Block label={t.caseStudy.outcome}>
          <p className="t-body-m max-w-[68ch] text-muted">{copy.outcome}</p>
        </Block>
      </div>

      <div className="border-t border-line bg-bg-alt">
        <div className="container-editorial grid gap-10 py-14 md:grid-cols-2 md:py-16">
          <div>
            {nextProject && nextCopy && (
              <>
                <p className="t-label text-muted">{t.caseStudy.next}</p>

                <Link
                  href={`/projects/${nextProject.slug}`}
                  className="group mt-4 inline-flex items-baseline gap-3"
                >
                  <span className="t-heading-xl font-display transition-colors duration-200 group-hover:text-accent">
                    {nextCopy.title}
                  </span>

                  <ArrowRight className="arrow-shift h-5 w-5 text-accent rtl:-scale-x-100" />
                </Link>
              </>
            )}
          </div>

          <div className="md:justify-self-end md:text-end">
            <p className="t-body-m max-w-[34ch] text-muted md:ms-auto">
              {t.caseStudy.contactLine}
            </p>

            <Link
              href="/#contact"
              className={buttonClass("primary", "md", "mt-6")}
            >
              {t.caseStudy.contactCta}

              <ArrowRight className="arrow-shift h-4 w-4 rtl:-scale-x-100" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
