"use client";

import { SITE } from "@/content/site";
import { useI18n } from "@/lib/i18n";
import { ContactForm } from "./contact-form";
import { ArrowUpRight, GithubIcon, LinkedinIcon, MailIcon, PinIcon } from "./ui/icons";
import { Eyebrow, Section } from "./ui/primitives";
import { Reveal } from "./ui/reveal";

export function Contact() {
  const { t } = useI18n();

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
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow index="04">{t.contact.label}</Eyebrow>
            <h2 className="t-display-l mt-7 text-balance">
              {t.contact.headingLine1}
              <span className="mt-1 block italic text-muted">{t.contact.headingLine2}</span>
            </h2>
            <p className="t-body-m mt-7 max-w-[46ch] text-muted">{t.contact.intro}</p>
          </Reveal>

          <Reveal delay={0.06} className="mt-10">
            <p className="t-label text-muted">{t.contact.detailsLabel}</p>
            <ul className="mt-4 border-t border-line">
              {details.map((detail) => (
                <li key={detail.key} className="border-b border-line">
                  <a
                    href={detail.href}
                    target={detail.external ? "_blank" : undefined}
                    rel={detail.external ? "noreferrer noopener" : undefined}
                    className="group flex items-center gap-4 py-4 text-ink transition-colors duration-200 hover:text-accent"
                  >
                    <span className="text-muted transition-colors duration-200 group-hover:text-accent">{detail.icon}</span>
                    <span className="t-caption w-24 shrink-0 text-muted sm:w-28">{detail.label}</span>
                    <span className="t-body-s min-w-0 flex-1 truncate keep-latin">{detail.value}</span>
                    <ArrowUpRight className="arrow-shift h-4 w-4 shrink-0 text-muted transition-colors duration-200 group-hover:text-accent rtl:-scale-x-100" />
                  </a>
                </li>
              ))}
              <li className="border-b border-line">
                <div className="flex items-center gap-4 py-4">
                  <span className="text-muted">
                    <PinIcon className="h-4 w-4" />
                  </span>
                  <span className="t-caption w-24 shrink-0 text-muted sm:w-28">{t.contact.locationLabel}</span>
                  <span className="t-body-s min-w-0 flex-1">{t.contact.locationValue}</span>
                </div>
              </li>
            </ul>
            <p className="t-caption mt-5 text-muted">{t.contact.responseNote}</p>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={0.08}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
