"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { images } from "@/assets/images";
import { ArrowDown, ArrowRight } from "./ui/icons";
import { buttonClass } from "./ui/primitives";
import { TechStack } from "./tech-stack";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.62, delay, ease: EASE },
        };

  return (
    <section id="top" aria-labelledby="hero-heading" className="relative">
      <div className="container-editorial">
        <div className="grid grid-cols-1 items-center gap-12 pt-14 pb-16 md:pt-20 md:pb-20 lg:grid-cols-12 lg:gap-16 lg:pt-24 lg:pb-24">
          {/* Copy */}
          <div className="lg:col-span-7 lg:pe-6">
            <motion.p {...rise(0)} className="flex items-center gap-3">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="t-label text-muted">{t.hero.available}</span>
            </motion.p>

            <motion.p {...rise(0.06)} className="mt-8 t-body-l text-muted">
              {t.hero.eyebrow}
            </motion.p>

            <motion.h1 {...rise(0.1)} id="hero-heading" className="t-display-xl brand-latin mt-2 text-ink">
              {t.hero.name}
            </motion.h1>

            <motion.div {...rise(0.16)} className="mt-6 flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-accent" />
              <p className="t-heading-l font-display italic text-ink-2">{t.hero.role}</p>
            </motion.div>

            <motion.p {...rise(0.22)} className="t-body-l mt-7 max-w-[54ch] text-muted">
              {t.hero.description}
            </motion.p>

            <motion.div {...rise(0.28)} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link href="/#projects" className={buttonClass("primary", "md")}>
                {t.hero.primaryCta}
                <ArrowRight className="arrow-shift h-4 w-4 rtl:-scale-x-100" />
              </Link>
              <a href="/api/cv" download className={buttonClass("secondary", "md")}>
                {t.hero.secondaryCta}
                <ArrowDown className="arrow-down-shift h-4 w-4" />
              </a>
            </motion.div>
          </div>

          {/* Portrait of the workspace */}
          <motion.div
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 24 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.8, delay: 0.18, ease: EASE },
                })}
            className="lg:col-span-5"
          >
            <figure className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-x-3 -inset-y-3 hidden rounded-sm border border-line lg:block"
              />
              <div className="group relative aspect-4/3 w-full overflow-hidden rounded-sm border border-line bg-surface-2 sm:aspect-16/10 lg:aspect-4/5">
                <Image
                  src={images.hero}
                  alt={t.hero.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-900 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <span aria-hidden className="absolute inset-0 bg-accent/5 mix-blend-multiply dark:bg-transparent" />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-3">
                <span className="t-label text-muted">{t.hero.imageCaption}</span>
                <span className="t-caption text-muted">
                  <span className="sr-only">{t.hero.locationLabel}: </span>
                  {t.hero.locationValue}
                </span>
              </figcaption>
            </figure>
          </motion.div>
        </div>
      </div>

      <TechStack />
    </section>
  );
}
