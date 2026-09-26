"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "rg-theme";
const THEME_CHANGE_EVENT = "rg-theme-change";

type ThemeValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeValue | null>(null);

function getTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribeToTheme(callback: () => void): () => void {
  const onThemeChange = () => callback();
  window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
}

function subscribeToMount(callback: () => void): () => void {
  queueMicrotask(callback);
  return () => undefined;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore<Theme>(subscribeToTheme, getTheme, () => "light");
  const mounted = useSyncExternalStore(subscribeToMount, () => true, () => false);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo<ThemeValue>(
    () => ({ theme, toggleTheme, setTheme, mounted }),
    [theme, toggleTheme, setTheme, mounted],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return context;
}
