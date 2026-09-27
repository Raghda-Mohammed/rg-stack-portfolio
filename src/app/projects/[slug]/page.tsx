import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/case-study";
import { PROJECTS, SITE, TECH_LABEL } from "@/content/site";
import { getPortfolioProject, getPortfolioProjects } from "@/lib/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPortfolioProject(slug);
  if (!project) return { title: "Project not found" };
  const title = `${project.en.title} — ${project.en.category} | ${SITE.name}`;
  const url = `${SITE.url}/projects/${slug}`;
  return { title: `${project.en.title} — Case Study`, description: project.en.summary, alternates: { canonical: url }, openGraph: { title, description: project.en.summary, url, type: "article" }, twitter: { card: "summary_large_image", title, description: project.en.summary } };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getPortfolioProject(slug), getPortfolioProjects()]);
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  if (!project) notFound();
  const index = projects.findIndex((item) => item.id === project.id);
  const nextProject = projects[(index + 1) % projects.length];
  const jsonLd = { "@context": "https://schema.org", "@type": "CreativeWork", name: project.en.title, headline: `${project.en.title} — ${project.en.category}`, description: project.en.summary, url: `${SITE.url}/projects/${slug}`, dateCreated: project.year, inLanguage: ["en", "ar"], keywords: project.tech.map((tech) => TECH_LABEL[tech]).join(", "), image: project.imageUrl, author: { "@type": "Person", name: SITE.name, url: SITE.url } };
  return <><script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><CaseStudy project={project} nextProject={nextProject?.id === project.id ? undefined : nextProject} /></>;
}
