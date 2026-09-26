import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/case-study";
import { en } from "@/content/en";
import { PROJECTS, SITE, TECH_LABEL, getProject } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const copy = en.projects[slug];
  if (!copy) return { title: "Project not found" };

  const title = `${copy.title} — ${copy.category} | ${SITE.name}`;
  const url = `${SITE.url}/projects/${slug}`;

  return {
    title: `${copy.title} — Case Study`,
    description: copy.summary,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: copy.summary,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: copy.summary,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const meta = getProject(slug);
  const copy = en.projects[slug];

  if (!meta || !copy) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: copy.title,
    headline: `${copy.title} — ${copy.category}`,
    description: copy.summary,
    url: `${SITE.url}/projects/${slug}`,
    dateCreated: meta.year,
    inLanguage: ["en", "ar"],
    keywords: meta.tech.map((tech) => TECH_LABEL[tech]).join(", "),
    author: { "@type": "Person", name: SITE.name, url: SITE.url },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CaseStudy slug={slug} />
    </>
  );
}
