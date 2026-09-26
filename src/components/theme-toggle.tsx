"use client";

import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { MoonIcon, SunIcon } from "./ui/icons";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useTheme();
  const { t } = useI18n();

  const label = mounted ? (theme === "dark" ? t.theme.switchToLight : t.theme.switchToDark) : t.theme.label;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink-2 transition-colors duration-200 hover:border-line-strong hover:text-ink ${className}`}
    >
      {/* Rendered with CSS variants so the icon is correct before hydration */}
      <SunIcon className="hidden h-[1.05rem] w-[1.05rem] dark:block" />
      <MoonIcon className="block h-[1.05rem] w-[1.05rem] dark:hidden" />
    </button>
  );
}
