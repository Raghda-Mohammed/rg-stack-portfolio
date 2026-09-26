import type { TechKey } from "@/content/site";

type Props = { tech: TechKey; className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const MARKS: Record<TechKey, React.ReactNode> = {
  nextjs: (
    <>
      <circle cx="12" cy="12" r="8.6" {...stroke} />
      <path d="M9.2 15.6V8.4l5.6 7.2V8.4" {...stroke} />
    </>
  ),
  react: (
    <>
      <circle cx="12" cy="12" r="1.9" {...stroke} />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" {...stroke} />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" {...stroke} />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" {...stroke} />
    </>
  ),
  typescript: (
    <>
      <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="3" {...stroke} />
      <path d="M7 10h5M9.5 10v5.6" {...stroke} />
      <path d="M17.2 10.3c-1.6-.7-3 .1-3 1.2 0 1.8 3 1.2 3 3 0 1.1-1.5 1.8-3 1.1" {...stroke} />
    </>
  ),
  tailwind: (
    <>
      <path d="M4 11c1.3-3.4 3.4-4.2 6.4-2.4 1.9 1.1 3 .9 3.9-.4" {...stroke} />
      <path d="M9.7 15.4c1.3-3.4 3.4-4.2 6.4-2.4 1.9 1.1 3 .9 3.9-.4" {...stroke} />
    </>
  ),
  bootstrap: (
    <>
      <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="4" {...stroke} />
      <path d="M9 8h3.6a2.2 2.2 0 0 1 0 4.4H9V8Zm0 4.4h4a2.3 2.3 0 0 1 0 4.6H9v-4.6Z" {...stroke} />
    </>
  ),
  framer: (
    <path d="M6.4 3.4h11.2v5.6h-5.6l5.6 5.6H6.4V9h5.6L6.4 3.4Zm0 11.2h5.6v5.6L6.4 14.6Z" fill="currentColor" />
  ),
  node: (
    <>
      <path d="M12 3.2 19.6 7.6v8.8L12 20.8 4.4 16.4V7.6L12 3.2Z" {...stroke} />
      <path d="M14.4 9.6v4.2c0 .9-.8 1.4-1.8 1.4s-1.8-.5-1.8-1.3" {...stroke} />
    </>
  ),
  express: (
    <>
      <path d="M4.5 8.4h15" {...stroke} />
      <path d="M7.5 12.3h9" {...stroke} />
      <path d="M4.5 16.2h15" {...stroke} />
      <circle cx="16.5" cy="8.4" r="1.4" {...stroke} />
      <circle cx="7.5" cy="16.2" r="1.4" {...stroke} />
    </>
  ),
  nestjs: (
    <>
      <path d="M12 3.4 19.4 7.7v8.6L12 20.6 4.6 16.3V7.7L12 3.4Z" {...stroke} />
      <path d="M9 15.4V9.2l6 6V9.2" {...stroke} />
    </>
  ),
  rest: (
    <>
      <path d="M9.2 4.4C7 4.4 8 9.6 5.4 12c2.6 2.4 1.6 7.6 3.8 7.6" {...stroke} />
      <path d="M14.8 4.4c2.2 0 1.2 5.2 3.8 7.6-2.6 2.4-1.6 7.6-3.8 7.6" {...stroke} />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" />
    </>
  ),
  postgres: (
    <>
      <ellipse cx="12" cy="6.4" rx="7" ry="2.8" {...stroke} />
      <path d="M5 6.4v11.2c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8V6.4" {...stroke} />
      <path d="M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" {...stroke} />
    </>
  ),
  drizzle: (
    <>
      <path d="M5.6 15.6 8.2 8.4" {...stroke} />
      <path d="M10.7 17.4 13.3 10.2" {...stroke} />
      <path d="M15.8 15.6 18.4 8.4" {...stroke} />
    </>
  ),
  prisma: (
    <>
      <path d="M13.2 3.4 20 16.6 8.4 20.6 13.2 3.4Z" {...stroke} />
      <path d="M13.2 3.4 11 20.1" {...stroke} />
    </>
  ),
  git: (
    <>
      <circle cx="7" cy="7" r="2.2" {...stroke} />
      <circle cx="7" cy="17" r="2.2" {...stroke} />
      <circle cx="17" cy="12" r="2.2" {...stroke} />
      <path d="M7 9.2v5.6M9.2 7h3.3a2.3 2.3 0 0 1 2.3 2.3v.6" {...stroke} />
    </>
  ),
  github: (
    <>
      <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="4" {...stroke} />
      <circle cx="9.3" cy="9" r="1.6" {...stroke} />
      <circle cx="14.7" cy="9" r="1.6" {...stroke} />
      <path d="M9.3 10.6v1.6a2.7 2.7 0 0 0 2.7 2.7 2.7 2.7 0 0 0 2.7-2.7v-1.6M12 14.9v2.6" {...stroke} />
    </>
  ),
  docker: (
    <>
      <path d="M4 13h15.4c0 3-2.2 5.2-5.6 5.2H8.6C6 18.2 4 16.2 4 13Z" {...stroke} />
      <path d="M7.2 12.8v-2.4h2.4v2.4M11 12.8v-2.4h2.4v2.4M11 9.8V7.4h2.4v2.4M14.8 12.8v-2.4h2.4v2.4" {...stroke} />
    </>
  ),
  vercel: <path d="M12 4.6 20.8 19.4H3.2L12 4.6Z" fill="currentColor" />,
  vscode: (
    <>
      <path d="M8.6 8.4 5 12l3.6 3.6" {...stroke} />
      <path d="M15.4 8.4 19 12l-3.6 3.6" {...stroke} />
      <path d="m13.2 6.6-2.4 10.8" {...stroke} />
    </>
  ),
};

export function TechIcon({ tech, className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      {MARKS[tech]}
    </svg>
  );
}
