"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { ar } from "@/content/ar";
import { en } from "@/content/en";
import type { Dictionary, Locale } from "@/content/types";

const DICTIONARIES: Record<Locale, Dictionary> = { en, ar };
export const LOCALE_STORAGE_KEY = "rg-locale";
const LOCALE_CHANGE_EVENT = "rg-locale-change";

type I18nValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nValue | null>(null);

function getStoredLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored === "ar" || stored === "en" ? stored : "en";
  } catch {
    return "en";
  }
}

function subscribeToLocale(callback: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === LOCALE_STORAGE_KEY) callback();
  };
  const onLocaleChange = () => callback();
  window.addEventListener("storage", onStorage);
  window.addEventListener(LOCALE_CHANGE_EVENT, onLocaleChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LOCALE_CHANGE_EVENT, onLocaleChange);
  };
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore<Locale>(subscribeToLocale, getStoredLocale, () => "en");

  const setLocale = useCallback((next: Locale) => {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* storage unavailable — the current tab still receives the event */
    }
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  }, []);

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      dir: locale === "ar" ? "rtl" : "ltr",
      t: DICTIONARIES[locale],
      setLocale,
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside <I18nProvider>");
  }
  return context;
}
