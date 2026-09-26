"use client";

import { SKILL_CATEGORIES, TECH_LABEL } from "@/content/site";
import { useI18n } from "@/lib/i18n";
import { Section, SectionHeader } from "./ui/primitives";
import { Reveal } from "./ui/reveal";
import { TechIcon } from "./ui/tech-icon";

export function Skills() {
  const { t } = useI18n();

  return (
    <Section id="skills">
      <SectionHeader index="03" label={t.skills.label} title={t.skills.heading} intro={t.skills.intro} />

      <div className="mt-14 grid grid-cols-1 overflow-hidden rounded-sm border border-line bg-bg md:grid-cols-2">
        {SKILL_CATEGORIES.map((category, index) => {
          const copy = t.skills.categories[category.id];
          const borderClasses = [
            index > 0 ? "border-t border-line" : "",
            index === 1 ? "md:border-t-0" : "",
            index % 2 === 1 ? "md:border-s md:border-line" : "",
          ].join(" ");

          return (
            <Reveal key={category.id} delay={index * 0.05} className={`p-7 md:p-9 ${borderClasses}`}>
              <div className="flex items-baseline gap-3">
                <span className="t-label text-accent">{category.index}</span>
                <h3 className="t-heading-l font-display">{copy.title}</h3>
              </div>
              <p className="t-body-s mt-3 max-w-[38ch] text-muted">{copy.note}</p>

              <ul className="mt-7 flex flex-wrap gap-x-2 gap-y-2">
                {category.items.map((tech) => (
                  <li key={tech}>
                    <span className="inline-flex items-center gap-2 rounded-sm border border-line bg-surface px-3 py-2 text-ink-2 transition-colors duration-200 hover:border-line-strong hover:text-ink">
                      <TechIcon tech={tech} className="h-4 w-4 text-accent" />
                      <span className="t-mono keep-latin">{TECH_LABEL[tech]}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          );
        })}
      </div>

      <p className="t-caption mt-8 max-w-[62ch] text-muted">{t.skills.footnote}</p>
    </Section>
  );
}
