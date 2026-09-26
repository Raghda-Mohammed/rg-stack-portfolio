"use client";

import Link from "next/link";
import { SITE } from "@/content/site";
import { useI18n } from "@/lib/i18n";
import { Monogram, Wordmark } from "./brand/monogram";
import { GithubIcon, LinkedinIcon, MailIcon } from "./ui/icons";

export function Footer() {
  const { t } = useI18n();

  const socials = [
    {
      key: "github",
      label: "GitHub",
      href: SITE.github,
      icon: <GithubIcon className="h-4 w-4" />,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: SITE.linkedin,
      icon: <LinkedinIcon className="h-4 w-4" />,
    },
    {
      key: "email",
      label: t.contact.emailLabel,
      href: `mailto:${SITE.email}`,
      icon: <MailIcon className="h-4 w-4" />,
    },
  ];

  return (
    <footer className="border-t border-line">
      <div className="container-editorial">
        <div className="flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between md:py-8">
          <Link
            href="/"
            className="group flex items-center gap-3 text-ink"
            aria-label={`${SITE.name} — ${t.hero.role}`}
          >
            <Monogram className="h-9 w-9 transition-opacity duration-200 group-hover:opacity-80" />
            <span className="flex flex-col gap-1">
              <Wordmark />
              <span className="t-caption text-muted">{t.footer.tagline}</span>
            </span>
          </Link>

          <p className="t-caption order-last text-muted md:order-0">
            {t.footer.copyright}
          </p>

          <ul className="flex items-center gap-2">
            {socials.map((social) => (
              <li key={social.key}>
                <a
                  href={social.href}
                  target={
                    social.href.startsWith("mailto:") ? undefined : "_blank"
                  }
                  rel={
                    social.href.startsWith("mailto:")
                      ? undefined
                      : "noreferrer noopener"
                  }
                  aria-label={social.label}
                  title={social.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted transition-colors duration-200 hover:border-line-strong hover:text-ink"
                >
                  {social.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-caption text-muted">{t.footer.builtWith}</p>
          <a
            href="#top"
            className="t-label text-muted transition-colors duration-200 hover:text-accent"
          >
            {t.footer.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
