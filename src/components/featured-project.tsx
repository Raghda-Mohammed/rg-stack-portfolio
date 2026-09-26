"use client";

import Link from "next/link";
import { FEATURED_PROJECT } from "@/content/site";
import { useI18n } from "@/lib/i18n";
import { ArrowRight } from "./ui/icons";
import { buttonClass, Eyebrow, TechList } from "./ui/primitives";
import { Reveal } from "./ui/reveal";
import { ProductPreview } from "./visuals/product-preview";

export function FeaturedProject() {
  const { t } = useI18n();
  const project = t.projects[FEATURED_PROJECT.slug];
  const href = `/projects/${FEATURED_PROJECT.slug}`;

  return (
    <article className="mt-16 md:mt-20">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Copy */}
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow index={FEATURED_PROJECT.index}>{t.work.featuredLabel}</Eyebrow>

            <h3 className="mt-7">
              <Link href={href} className="t-display-l link-underline text-balance">
                {project.title}
              </Link>
            </h3>

            <dl className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted">
              <div className="flex items-center gap-2">
                <dt className="sr-only">{t.caseStudy.category}</dt>
                <dd className="t-caption">{project.category}</dd>
              </div>
              <span aria-hidden className="h-3 w-px bg-line-strong" />
              <div className="flex items-center gap-2">
                <dt className="sr-only">{t.caseStudy.year}</dt>
                <dd className="t-caption tabular-nums keep-latin">{FEATURED_PROJECT.year}</dd>
              </div>
              <span aria-hidden className="h-3 w-px bg-line-strong" />
              <div className="flex items-center gap-2">
                <dt className="sr-only">{t.caseStudy.status}</dt>
                <dd className="t-caption text-accent">{project.status}</dd>
              </div>
            </dl>

            <p className="t-body-l mt-7 max-w-[52ch] text-ink-2">{project.summary}</p>

            <div className="mt-8">
              <p className="t-label text-muted">{t.work.stack}</p>
              <div className="mt-4">
                <TechList items={FEATURED_PROJECT.tech} />
              </div>
            </div>

            <div className="mt-9">
              <Link href={href} className={buttonClass("primary", "md")}>
                {t.work.viewCaseStudy}
                <ArrowRight className="arrow-shift h-4 w-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Interface preview */}
        <div className="lg:col-span-7">
          <Reveal delay={0.08} className="sm:ps-12 lg:ps-14">
            <ProductPreview />
            <p className="t-caption mt-12 text-muted sm:mt-14">{t.work.previewCaption}</p>
          </Reveal>
        </div>
      </div>

      {/* Functionality table */}
      <Reveal delay={0.05} className="mt-16">
        <p className="t-label text-muted">{t.work.keyFeatures}</p>
        <ul className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {project.features.map((feature) => (
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
