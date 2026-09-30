"use client";

import { SITE } from "@/content/site";
import { useI18n } from "@/lib/i18n";
import { ContactForm } from "./contact-form";
import {
  ArrowUpRight,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  PinIcon,
} from "./ui/icons";
import { Eyebrow, Section } from "./ui/primitives";
import { Reveal } from "./ui/reveal";

export function Contact() {
  const { t, locale } = useI18n();
  const isArabic = locale === "ar";

  const details = [
    {
      key: "email",
      label: t.contact.emailLabel,
      value: SITE.email,
      href: `mailto:${SITE.email}`,
      icon: <MailIcon className="h-4 w-4" />,
      external: false,
    },
    {
      key: "linkedin",
      label: t.contact.linkedinLabel,
      value: "linkedin.com/in/rgstack",
      href: SITE.linkedin,
      icon: <LinkedinIcon className="h-4 w-4" />,
      external: true,
    },
    {
      key: "github",
      label: t.contact.githubLabel,
      value: "github.com/rgstack",
      href: SITE.github,
      icon: <GithubIcon className="h-4 w-4" />,
      external: true,
    },
  ];

  return (
    <Section id="contact" className="bg-bg-alt">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Contact information */}
        <div className="min-w-0 lg:col-span-5">
          <Reveal>
            <Eyebrow index="04">{t.contact.label}</Eyebrow>

            <h2 className="t-display-l mt-6 text-balance sm:mt-7">
              {t.contact.headingLine1}
              <span className="mt-1 block italic text-muted">
                {t.contact.headingLine2}
              </span>
            </h2>

            <p className="t-body-m mt-6 max-w-[46ch] text-muted sm:mt-7">
              {t.contact.intro}
            </p>
          </Reveal>

          <Reveal delay={0.06} className="mt-8 sm:mt-10">
            <p className="t-label text-muted">{t.contact.detailsLabel}</p>

            <ul className="mt-3 border-t border-line sm:mt-4">
              {details.map((detail) => (
                <li key={detail.key} className="border-b border-line">
                  <a
                    href={detail.href}
                    target={detail.external ? "_blank" : undefined}
                    rel={detail.external ? "noreferrer noopener" : undefined}
                    dir={isArabic ? "rtl" : "ltr"}
                    className={`group grid items-center py-4 text-ink transition-colors duration-200 hover:text-accent ${
                      isArabic
                        ? "grid-cols-[auto_1fr] gap-x-3 gap-y-1"
                        : "grid-cols-[auto_1fr_auto] gap-x-3 gap-y-1 sm:flex sm:gap-4"
                    }`}
                  >
                    {/* Icon */}
                    <span
                      className={`text-muted transition-colors duration-200 group-hover:text-accent ${
                        isArabic ? "row-span-2" : ""
                      }`}
                    >
                      {detail.icon}
                    </span>

                    {/* Label */}
                    <span
                      className={`t-caption min-w-0 text-muted ${
                        isArabic ? "col-start-2 row-start-1" : ""
                      } sm:w-28 sm:shrink-0`}
                    >
                      {detail.label}
                    </span>

                    {/* Value */}
                    <span
                      dir="ltr"
                      className={`t-body-s min-w-0 keep-latin ${
                        isArabic
                          ? "col-start-2 row-start-2 text-start"
                          : "col-span-2 truncate sm:flex-1"
                      }`}
                    >
                      {detail.value}
                    </span>

                    {/* Arrow */}
                    <ArrowUpRight
                      className={`arrow-shift h-4 w-4 shrink-0 text-muted transition-colors duration-200 group-hover:text-accent rtl:-scale-x-100 ${
                        isArabic
                          ? "col-start-1 row-start-1"
                          : "col-start-3 row-start-1 sm:col-auto sm:row-auto"
                      }`}
                    />
                  </a>
                </li>
              ))}

              {/* Location */}
              <li className="border-b border-line">
                <div className="grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1 py-4 sm:flex sm:items-center sm:gap-4">
                  <span className="text-muted">
                    <PinIcon className="h-4 w-4" />
                  </span>

                  <span className="t-caption min-w-0 text-muted sm:w-28 sm:shrink-0">
                    {t.contact.locationLabel}
                  </span>

                  <span className="t-body-s col-start-2 min-w-0 sm:flex-1">
                    {t.contact.locationValue}
                  </span>
                </div>
              </li>
            </ul>

            <p className="t-caption mt-4 text-muted sm:mt-5">
              {t.contact.responseNote}
            </p>
          </Reveal>
        </div>

        {/* Contact form */}
        <div className="min-w-0 lg:col-span-7">
          <Reveal delay={0.08}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
