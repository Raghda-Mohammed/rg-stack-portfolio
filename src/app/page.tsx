import { headers } from "next/headers";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { SITE } from "@/content/site";

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${SITE.name} — Full-Stack Developer`,
  url: SITE.url,
  inLanguage: ["en", "ar"],
  author: { "@type": "Person", name: SITE.name, url: SITE.url },
};

export default async function HomePage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
      />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </>
  );
}
