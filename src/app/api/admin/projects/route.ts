import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { getAdminProjects } from "@/lib/projects";

const copySchema = z.object({
  title: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(160),
  summary: z.string().trim().min(1).max(800),
  status: z.string().trim().min(1).max(160),
  overview: z.string().trim().min(1).max(4000),
  challenge: z.string().trim().min(1).max(4000),
  approach: z.string().trim().min(1).max(4000),
  architecture: z.array(z.object({ label: z.string().trim().min(1), value: z.string().trim().min(1) })).max(20),
  features: z.array(z.object({ title: z.string().trim().min(1), description: z.string().trim().min(1) })).max(30),
  outcome: z.string().trim().min(1).max(4000),
});

const schema = z.object({
  slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  index: z.string().trim().min(1).max(10),
  year: z.string().regex(/^\d{4}$/),
  featured: z.boolean(),
  published: z.boolean(),
  tech: z.array(z.string().trim().min(1)).min(1).max(20),
  sketch: z.enum(["directory", "template", "delivery", "dashboard", "uikit"]),
  imageUrl: z.string().trim().min(1).max(1000),
  liveUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  githubUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  en: copySchema,
  ar: copySchema,
});

export async function GET() {
  try {
    return NextResponse.json({ data: await getAdminProjects() });
  } catch (error) {
    console.error("[admin/projects] GET failed", error);
    return NextResponse.json({ error: "تعذر تحميل الأعمال" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    if (input.featured) {
      await db.update(projects).set({ featured: false, updatedAt: new Date() }).where(eq(projects.featured, true));
    }
    const [created] = await db.insert(projects).values({
      slug: input.slug,
      index: input.index,
      year: input.year,
      featured: input.featured,
      published: input.published,
      tech: input.tech,
      sketch: input.sketch,
      imageUrl: input.imageUrl,
      liveUrl: input.liveUrl || null,
      githubUrl: input.githubUrl || null,
      enCopy: input.en,
      arCopy: input.ar,
    }).returning();
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("[admin/projects] POST failed", error);
    return NextResponse.json({ error: "بيانات العمل غير صحيحة أو الـSlug مستخدم بالفعل" }, { status: 400 });
  }
}
