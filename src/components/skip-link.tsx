"use client";

import { useI18n } from "@/lib/i18n";

export function SkipLink() {
  const { t } = useI18n();

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-60 focus:rounded-md focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-2.5 focus:text-sm focus:text-ink"
    >
      {t.nav.skipToContent}
    </a>
  );
}
