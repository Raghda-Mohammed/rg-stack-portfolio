"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { images } from "@/assets/images";
import { Eyebrow, Section } from "./ui/primitives";
import { Reveal } from "./ui/reveal";

export function About() {
  const { t } = useI18n();

  return (
    <Section id="about">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Image column */}
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-28">
            <figure>
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-sm border border-line bg-surface-2">
                <Image
                  src={images.about}
                  alt={t.about.imageAlt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 38vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-6 border-t border-line pt-5">
                <p className="t-label text-muted">{t.about.principlesLabel}</p>
                <ul className="mt-4 space-y-3">
                  {t.about.principles.map((principle, index) => (
                    <li key={principle} className="flex gap-3 text-ink-2">
                      <span aria-hidden className="t-mono mt-0.5 text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="t-body-s">{principle}</span>
                    </li>
                  ))}
                </ul>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* Copy column */}
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow index="01">{t.about.label}</Eyebrow>
            <h2 className="t-display-l mt-7 max-w-[15ch] text-balance">{t.about.heading}</h2>
          </Reveal>

          <Reveal delay={0.06} className="mt-9 max-w-[60ch] space-y-5">
            {t.about.paragraphs.map((paragraph, index) => (
              <p key={paragraph.slice(0, 24)} className={index === 0 ? "t-body-l text-ink-2" : "t-body-m text-muted"}>
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
              {t.about.facts.map((fact) => (
                <div key={fact.label} className="bg-bg p-5">
                  <dt className="t-label text-muted">{fact.label}</dt>
                  <dd className="t-body-s mt-2.5 text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
