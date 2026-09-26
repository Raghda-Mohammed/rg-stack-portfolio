"use client";

import { HERO_STACK, TECH_LABEL } from "@/content/site";
import { useI18n } from "@/lib/i18n";
import { ArrowDown } from "./ui/icons";
import { TechIcon } from "./ui/tech-icon";

export function TechStack() {
  const { t } = useI18n();

  return (
    <div className="border-t border-line">
      <div className="container-editorial">
        <div className="flex flex-col gap-5 py-7 md:flex-row md:items-center md:gap-10 md:py-8">
          <p className="t-label shrink-0 text-muted">{t.hero.stackLabel}</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3.5 md:gap-x-9">
            {HERO_STACK.map((tech) => (
              <li key={tech} className="group flex items-center gap-2 text-ink-2 transition-colors duration-200 hover:text-ink">
                <TechIcon tech={tech} className="h-[1.05rem] w-[1.05rem] text-accent opacity-85 transition-opacity duration-200 group-hover:opacity-100" />
                <span className="t-mono keep-latin">{TECH_LABEL[tech]}</span>
              </li>
            ))}
          </ul>

          <a
            href="#about"
            className="group ms-auto hidden shrink-0 items-center gap-2 text-muted transition-colors duration-200 hover:text-accent lg:inline-flex"
          >
            <span className="t-label">{t.hero.scroll}</span>
            <ArrowDown className="arrow-down-shift h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
