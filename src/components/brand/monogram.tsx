type MonogramProps = {
  className?: string;
  /** Renders the enclosing frame used in the navbar and footer. */
  framed?: boolean;
  title?: string;
};

/**
 * RG monogram — a geometric R paired with an open G.
 * Works as a standalone mark (favicon, avatar) or framed next to the wordmark.
 */
export function Monogram({ className = "h-9 w-9", framed = true, title }: MonogramProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      {framed ? (
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="11"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeWidth="1.4"
        />
      ) : null}
      <g fill="none" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
        {/* R */}
        <path d="M11 35V13h6.6a5.6 5.6 0 0 1 0 11.2H11" stroke="currentColor" />
        <path d="m17.4 24.2 6 10.8" stroke="currentColor" />
        {/* G — drawn in the accent so the mark carries the brand colour */}
        <path d="M37.5 18.8A8.9 8.9 0 1 0 39 24.6h-4.6" stroke="var(--accent)" />
      </g>
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-latin font-display text-[1.0625rem] leading-none tracking-[-0.01em] ${className}`}>
      RG <span className="text-muted">Stack</span>
    </span>
  );
}
