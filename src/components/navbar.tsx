"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Monogram, Wordmark } from "./brand/monogram";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { ArrowRight, CloseIcon, MenuIcon } from "./ui/icons";
import { buttonClass } from "./ui/primitives";
import { useI18n } from "@/lib/i18n";

const NAV_ITEMS = [
  { key: "home", id: "top", href: "/" },
  { key: "about", id: "about", href: "/#about" },
  { key: "projects", id: "projects", href: "/#projects" },
  { key: "skills", id: "skills", href: "/#skills" },
  { key: "contact", id: "contact", href: "/#contact" },
] as const;

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    if (!enabled) return;
    const targets = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (node): node is HTMLElement => Boolean(node),
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : "";
}

export function Navbar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = useActiveSection(isHome);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open
          ? "border-line bg-bg/90 backdrop-blur-md supports-[backdrop-filter]:bg-bg/75"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container-editorial">
        <div className="flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
          <Link
            href="/"
            onClick={close}
            className="group flex items-center gap-3 text-ink"
            aria-label={`RG Stack — ${t.hero.role}`}
          >
            <Monogram className="h-9 w-9 transition-opacity duration-200 group-hover:opacity-80" />
            <span className="hidden sm:block">
              <Wordmark />
            </span>
          </Link>

          <nav aria-label={t.nav.primaryLabel} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative inline-flex items-center px-3.5 py-2 text-[0.8125rem] transition-colors duration-200 ${
                        isActive ? "text-ink" : "text-muted hover:text-ink"
                      }`}
                    >
                      {t.nav[item.key]}
                      <span
                        aria-hidden
                        className={`absolute inset-x-3.5 -bottom-0.5 h-px origin-center bg-accent transition-transform duration-200 ${
                          isActive ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <ThemeToggle />
            <Link href="/#contact" className={buttonClass("primary", "sm", "hidden md:inline-flex")}>
              {t.nav.cta}
              <ArrowRight className="arrow-shift h-3.5 w-3.5 rtl:-scale-x-100" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink transition-colors duration-200 hover:border-line-strong lg:hidden"
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-line bg-bg lg:hidden"
          >
            <nav aria-label={t.nav.menuLabel} className="container-editorial py-6">
              <ul className="flex flex-col">
                {NAV_ITEMS.map((item, index) => (
                  <li key={item.key} className={index === 0 ? "" : "border-t border-line"}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active === item.id ? "true" : undefined}
                      className="flex items-center justify-between py-4 text-ink"
                    >
                      <span className="t-heading-l font-display">{t.nav[item.key]}</span>
                      <span className="t-label text-muted">{String(index + 1).padStart(2, "0")}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between gap-3">
                <LanguageSwitcher className="sm:hidden" />
                <Link href="/#contact" onClick={close} className={buttonClass("primary", "md", "flex-1 sm:flex-none")}>
                  {t.nav.cta}
                  <ArrowRight className="arrow-shift h-3.5 w-3.5 rtl:-scale-x-100" />
                </Link>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
