"use client";

import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/content/types";

const OPTIONS: {
  value: Locale;
  short: string;
  mobile: string;
  full: string;
}[] = [
  {
    value: "en",
    short: "EN",
    mobile: "EN",
    full: "English",
  },
  {
    value: "ar",
    short: "AR",
    mobile: "ع",
    full: "العربية",
  },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  const currentOption =
    OPTIONS.find((option) => option.value === locale) ?? OPTIONS[0];

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className={`inline-flex items-center rounded-md border border-line p-0.5 ${className}`}
    >
      {/* Desktop */}
      <div className="hidden items-center sm:flex">
        {OPTIONS.map((option) => {
          const active = option.value === locale;

          return (
            <button
              key={option.value}
              type="button"
              lang={option.value}
              onClick={() => setLocale(option.value)}
              aria-pressed={active}
              title={option.full}
              className={`rounded-[3px] px-2.5 py-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] transition-colors duration-200 ${
                active
                  ? "bg-accent-soft text-accent"
                  : "text-muted hover:text-ink"
              }`}
            >
              {option.short}

              <span className="sr-only"> — {option.full}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile */}
      <button
        type="button"
        lang={locale}
        onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
        aria-label={t.language.label}
        title={currentOption.full}
        className="inline-flex h-7 min-w-7 items-center justify-center rounded-[3px] px-1.5 text-[0.6875rem] font-semibold tracking-[0.08em] text-accent transition-colors duration-200 hover:bg-accent-soft sm:hidden"
      >
        {currentOption.mobile}
      </button>
    </div>
  );
}
