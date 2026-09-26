"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { PROJECTS, getProject } from "@/content/site";
import { useI18n } from "@/lib/i18n";
import { ArrowRight } from "./ui/icons";
import { buttonClass, TechList } from "./ui/primitives";
import { Reveal } from "./ui/reveal";
import { ProductPreview } from "./visuals/product-preview";
import { ProjectSketch } from "./visuals/project-sketch";

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="grid gap-5 border-t border-line py-10 md:grid-cols-12 md:gap-10 md:py-12">
      <h2 className="t-label text-muted md:col-span-3">{label}</h2>
      <div className="md:col-span-9">{children}</div>
    </section>
  );
}

export function CaseStudy({ slug }: { slug: string }) {
  const { t } = useI18n();
  const meta = getProject(slug);
  const copy = t.projects[slug];

  if (!meta || !copy) return null;

  const currentIndex = PROJECTS.findIndex((project) => project.slug === slug);
  const next = PROJECTS[(currentIndex + 1) % PROJECTS.length];
  const nextCopy = t.projects[next.slug];

  return (
    <article>
      {/* Header */}
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
            <p className="t-body-l mt-7 max-w-[54ch] text-ink-2">{copy.summary}</p>
          </div>

          <div className="lg:col-span-5 lg:pt-2">
            <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-3 lg:grid-cols-1">
              <div className="bg-bg p-5">
                <dt className="t-label text-muted">{t.caseStudy.year}</dt>
                <dd className="t-body-s mt-2 tabular-nums keep-latin">{meta.year}</dd>
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

      {/* Visual */}
      <div className="border-y border-line bg-bg-alt py-14 md:py-20">
        <div className="container-editorial">
          <Reveal className={meta.featured ? "mx-auto max-w-4xl sm:ps-12" : "mx-auto max-w-3xl"}>
            {meta.featured ? <ProductPreview /> : <ProjectSketch variant={meta.sketch} />}
          </Reveal>
          <p className="t-caption mt-12 text-center text-muted sm:mt-14">{t.work.previewCaption}</p>
        </div>
      </div>

      {/* Body */}
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
              <div key={row.label} className="grid gap-2 py-5 sm:grid-cols-4 sm:gap-6">
                <dt className="t-heading-m text-ink">{row.label}</dt>
                <dd className="t-body-s text-muted sm:col-span-3">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block label={t.caseStudy.features}>
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
            {copy.features.map((feature) => (
              <li key={feature.title} className="bg-bg p-5">
                <div className="flex items-center gap-2">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />
                  <h3 className="t-heading-m">{feature.title}</h3>
                </div>
                <p className="t-caption mt-2 text-muted">{feature.description}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block label={t.caseStudy.technology}>
          <TechList items={meta.tech} />
        </Block>

        <Block label={t.caseStudy.outcome}>
          <p className="t-body-m max-w-[68ch] text-muted">{copy.outcome}</p>
        </Block>
      </div>

      {/* Next + CTA */}
      <div className="border-t border-line bg-bg-alt">
        <div className="container-editorial grid gap-10 py-14 md:grid-cols-2 md:py-16">
          <div>
            <p className="t-label text-muted">{t.caseStudy.next}</p>
            <Link href={`/projects/${next.slug}`} className="group mt-4 inline-flex items-baseline gap-3">
              <span className="t-heading-xl font-display transition-colors duration-200 group-hover:text-accent">
                {nextCopy.title}
              </span>
              <ArrowRight className="arrow-shift h-5 w-5 text-accent rtl:-scale-x-100" />
            </Link>
          </div>
          <div className="md:justify-self-end md:text-end">
            <p className="t-body-m max-w-[34ch] text-muted md:ms-auto">{t.caseStudy.contactLine}</p>
            <Link href="/#contact" className={buttonClass("primary", "md", "mt-6")}>
              {t.caseStudy.contactCta}
              <ArrowRight className="arrow-shift h-4 w-4 rtl:-scale-x-100" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
