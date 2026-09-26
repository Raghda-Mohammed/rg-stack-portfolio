import type { ReactNode } from "react";
import { TechIcon } from "./tech-icon";
import { TECH_LABEL, type TechKey } from "@/content/site";

/* ----------------------------------------------------------------
   Buttons — three intents, one geometry
----------------------------------------------------------------- */

type Intent = "primary" | "secondary" | "quiet";
type Size = "sm" | "md";

const INTENT: Record<Intent, string> = {
  primary:
    "bg-accent text-accent-contrast border border-transparent hover:bg-accent-strong shadow-soft",
  secondary:
    "bg-transparent text-ink border border-line-strong hover:border-ink hover:bg-surface",
  quiet: "bg-transparent text-ink border border-transparent hover:text-accent",
};

const SIZE: Record<Size, string> = {
  sm: "px-4 py-2 text-[0.8125rem]",
  md: "px-5 py-3 text-sm",
};

export function buttonClass(intent: Intent = "primary", size: Size = "md", extra = "") {
  return [
    "group inline-flex items-center justify-center gap-2.5 rounded-md font-medium",
    "transition-[background-color,border-color,color] duration-200 ease-out",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    INTENT[intent],
    SIZE[size],
    extra,
  ].join(" ");
}

/* ----------------------------------------------------------------
   Section scaffolding
----------------------------------------------------------------- */

export function Eyebrow({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-accent">
      {index ? <span className="t-label text-muted">{index}</span> : null}
      <span aria-hidden className="h-px w-8 bg-current opacity-40" />
      <span className="t-label">{children}</span>
    </p>
  );
}

export function SectionHeader({
  index,
  label,
  title,
  intro,
  aside,
}: {
  index?: string;
  label: string;
  title: ReactNode;
  intro?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-12 md:items-end">
      <div className="md:col-span-7">
        <Eyebrow index={index}>{label}</Eyebrow>
        <h2 className="t-heading-xl mt-6 max-w-[18ch] text-balance">{title}</h2>
      </div>
      {intro || aside ? (
        <div className="md:col-span-5 md:pb-2">
          {intro ? <p className="t-body-m max-w-[46ch] text-muted">{intro}</p> : null}
          {aside}
        </div>
      ) : null}
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
  bordered = true,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 py-20 md:py-28 lg:py-32 ${bordered ? "border-t border-line" : ""} ${className}`}
    >
      <div className="container-editorial">{children}</div>
    </section>
  );
}

/* ----------------------------------------------------------------
   Technology chip
----------------------------------------------------------------- */

export function TechChip({ tech, muted = false }: { tech: TechKey; muted?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-sm border border-line px-2.5 py-1.5 ${
        muted ? "text-muted" : "text-ink-2"
      } transition-colors duration-200 hover:border-line-strong hover:text-ink`}
    >
      <TechIcon tech={tech} className="h-3.5 w-3.5 text-accent" />
      <span className="t-mono keep-latin">{TECH_LABEL[tech]}</span>
    </span>
  );
}

export function TechList({ items, muted = false }: { items: readonly TechKey[]; muted?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((tech) => (
        <li key={tech}>
          <TechChip tech={tech} muted={muted} />
        </li>
      ))}
    </ul>
  );
}
