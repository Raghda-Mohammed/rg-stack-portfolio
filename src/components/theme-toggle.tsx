"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "rg-theme";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextDark = !root.classList.contains("dark");

    root.classList.toggle("dark", nextDark);
    root.style.colorScheme = nextDark ? "dark" : "light";

    localStorage.setItem(THEME_STORAGE_KEY, nextDark ? "dark" : "light");

    setIsDark(nextDark);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
      title={isDark ? "الوضع الفاتح" : "الوضع الداكن"}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink transition-colors duration-200 hover:bg-surface-2 sm:h-9 sm:w-9"
    >
      {isDark ? (
        <Moon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
      ) : (
        <Sun className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
      )}
    </button>
  );
}
