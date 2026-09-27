import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { projects } from "@/db/schema";

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

function idFromParams(id: string) {
  const value = Number(id);
  return Number.isSafeInteger(value) && value > 0 ? value : null;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = idFromParams((await params).id);
    if (!id) return NextResponse.json({ error: "معرّف غير صحيح" }, { status: 400 });
    const input = schema.parse(await request.json());
    if (input.featured) {
      await db.update(projects).set({ featured: false, updatedAt: new Date() }).where(eq(projects.featured, true));
    }
    const [updated] = await db.update(projects).set({
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
      updatedAt: new Date(),
    }).where(eq(projects.id, id)).returning();
    if (!updated) return NextResponse.json({ error: "العمل غير موجود" }, { status: 404 });
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[admin/projects] PATCH failed", error);
    return NextResponse.json({ error: "تعذر تحديث العمل" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = idFromParams((await params).id);
    if (!id) return NextResponse.json({ error: "معرّف غير صحيح" }, { status: 400 });
    const [deleted] = await db.delete(projects).where(eq(projects.id, id)).returning({ id: projects.id });
    if (!deleted) return NextResponse.json({ error: "العمل غير موجود" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/projects] DELETE failed", error);
    return NextResponse.json({ error: "تعذر حذف العمل" }, { status: 500 });
  }
}
