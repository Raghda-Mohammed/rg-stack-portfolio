"use client";

import type { PortfolioProject } from "@/content/project-types";
import { useI18n } from "@/lib/i18n";
import { FeaturedProject } from "./featured-project";
import { ProjectCard } from "./project-card";
import { Eyebrow, Section, SectionHeader } from "./ui/primitives";
import { Reveal } from "./ui/reveal";

export function Projects({ projects }: { projects: PortfolioProject[] }) {
  const { t } = useI18n();
  const featured = projects.find((project) => project.featured) ?? projects[0];
  const others = projects.filter((project) => project.id !== featured?.id);
  if (!featured) return null;

  return (
    <Section id="projects" className="bg-bg-alt">
      <SectionHeader index="02" label={t.work.label} title={t.work.heading} intro={t.work.intro} />
      <FeaturedProject project={featured} />
      {others.length > 0 && <div className="mt-24 border-t border-line pt-14 md:mt-28">
        <Reveal><Eyebrow>{t.work.otherLabel}</Eyebrow><h3 className="t-heading-xl mt-6 max-w-[18ch]">{t.work.otherHeading}</h3></Reveal>
        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2">{others.map((project, index) => <Reveal key={project.id} delay={index * 0.05} as="div"><ProjectCard project={project} /></Reveal>)}</div>
      </div>}
    </Section>
  );
}
