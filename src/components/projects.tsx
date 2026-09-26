"use client";

import { OTHER_PROJECTS } from "@/content/site";
import { useI18n } from "@/lib/i18n";
import { FeaturedProject } from "./featured-project";
import { ProjectCard } from "./project-card";
import { Eyebrow, Section, SectionHeader } from "./ui/primitives";
import { Reveal } from "./ui/reveal";

export function Projects() {
  const { t } = useI18n();

  return (
    <Section id="projects" className="bg-bg-alt">
      <SectionHeader index="02" label={t.work.label} title={t.work.heading} intro={t.work.intro} />

      <FeaturedProject />

      <div className="mt-24 border-t border-line pt-14 md:mt-28">
        <Reveal>
          <Eyebrow>{t.work.otherLabel}</Eyebrow>
          <h3 className="t-heading-xl mt-6 max-w-[18ch]">{t.work.otherHeading}</h3>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2">
          {OTHER_PROJECTS.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.05} as="div">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
