import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function ArrowRight({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M4.5 12h14" />
      <path d="m13 6.5 5.5 5.5L13 17.5" />
    </svg>
  );
}

export function ArrowDown({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M12 4.5v14" />
      <path d="m6.5 13 5.5 5.5L17.5 13" />
    </svg>
  );
}

export function ArrowUpRight({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </svg>
  );
}

export function SunIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </svg>
  );
}

export function MoonIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.2 8.2 0 1 0 10.2 10.2Z" />
    </svg>
  );
}

export function MenuIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M4 8h16M4 16h10" />
    </svg>
  );
}

export function CloseIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function MailIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.8 7 7.3 5.4a1.5 1.5 0 0 0 1.8 0L20.2 7" />
    </svg>
  );
}

export function PinIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function GithubIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" className={className} {...props}>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export function LinkedinIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" className={className} {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.5h4v11H3v-11Zm6.5 0h3.8v1.5h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76v5.69h-4v-5.05c0-1.2-.02-2.75-1.75-2.75-1.75 0-2.02 1.31-2.02 2.66v5.14h-4v-11Z" />
    </svg>
  );
}

export function XIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" className={className} {...props}>
      <path d="M17.2 3h3.3l-7.2 8.24L21.8 21h-6.6l-4.3-5.6L5.9 21H2.6l7.7-8.8L2.4 3H9l3.9 5.15L17.2 3Zm-1.16 16h1.83L8.04 4.9H6.08L16.04 19Z" />
    </svg>
  );
}

export function CheckIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function AlertIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.2v.3" />
    </svg>
  );
}
