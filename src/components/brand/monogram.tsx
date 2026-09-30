type MonogramProps = {
  className?: string;
  framed?: boolean;
  title?: string;
};

/**
 * RD monogram — uses the same Latin display face as the Hero wordmark.
 */
export function Monogram({
  className = "h-9 w-9",
  framed = true,
  title,
}: MonogramProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}

      {framed ? (
        <rect
          x="1.5"
          y="1.5"
          width="45"
          height="45"
          rx="12"
          fill="currentColor"
          fillOpacity="0.025"
          stroke="currentColor"
          strokeOpacity="0.16"
          strokeWidth="1.2"
        />
      ) : null}

      <text
        x="18"
        y="34"
        fill="currentColor"
        fontFamily="Newsreader, Georgia, serif"
        fontSize="25"
        fontWeight="400"
        textAnchor="middle"
      >
        R
      </text>

      <text
        x="27"
        y="34"
        fill="var(--accent)"
        fontFamily="Newsreader, Georgia, serif"
        fontSize="25"
        fontWeight="400"
        textAnchor="middle"
      >
        D
      </text>
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`brand-latin font-display text-[1.0625rem] leading-none tracking-[-0.01em] ${className}`}
    >
      <span className="text-ink">R</span>
      <span className="text-accent">D</span>
      <span className="text-ink"> Stack</span>
    </span>
  );
}
