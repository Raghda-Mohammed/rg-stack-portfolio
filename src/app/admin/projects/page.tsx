"use client";

import { useEffect, useMemo, useState } from "react";
import type { PortfolioProject } from "@/content/project-types";
import type { SketchVariant, TechKey } from "@/content/site";
import type { ProjectCopy } from "@/content/types";
import { AdminProjectImageUploader } from "@/components/AdminProjectImageUploader";
import Image from "next/image";
// save()
const TECH_OPTIONS: TechKey[] = [
  "nextjs",
  "react",
  "typescript",
  "tailwind",
  "bootstrap",
  "framer",
  "node",
  "express",
  "nestjs",
  "rest",
  "postgres",
  "drizzle",
  "prisma",
  "git",
  "github",
  "docker",
  "vercel",
  "vscode",
];

const SKETCH_OPTIONS: SketchVariant[] = [
  "directory",
  "template",
  "delivery",
  "dashboard",
  "uikit",
];

type FormState = {
  id?: number;
  slug: string;
  index: string;
  year: string;
  featured: boolean;
  published: boolean;
  tech: TechKey[];
  sketch: SketchVariant;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  en: ProjectCopy;
  ar: ProjectCopy;
};

const emptyCopy = (): ProjectCopy => ({
  title: "",
  category: "",
  summary: "",
  status: "",
  overview: "",
  challenge: "",
  approach: "",
  architecture: [],
  features: [],
  outcome: "",
});

const emptyForm = (): FormState => ({
  slug: "",
  index: "",
  year: String(new Date().getFullYear()),
  featured: false,
  published: true,
  tech: ["nextjs", "typescript"],
  sketch: "template",
  imageUrl: "",
  liveUrl: "",
  githubUrl: "",
  en: emptyCopy(),
  ar: emptyCopy(),
});

function toForm(project: PortfolioProject): FormState {
  return {
    id: project.id,
    slug: project.slug,
    index: project.index,
    year: project.year,
    featured: project.featured,
    published: project.published,
    tech: project.tech,
    sketch: project.sketch,
    imageUrl: project.imageUrl,
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
    en: project.en,
    ar: project.ar,
  };
}

function parsePairs(value: string, separator: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [left, ...rest] = line.split(separator);

      return {
        label: left.trim(),
        value: rest.join(separator).trim(),
      };
    })
    .filter((item) => item.label && item.value);
}

function parseFeatures(value: string, separator: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [left, ...rest] = line.split(separator);

      return {
        title: left.trim(),
        description: rest.join(separator).trim(),
      };
    })
    .filter((item) => item.title && item.description);
}

function copyToText(copy: ProjectCopy) {
  return {
    ...copy,
    architectureText: copy.architecture
      .map((item) => `${item.label} | ${item.value}`)
      .join("\n"),
    featuresText: copy.features
      .map((item) => `${item.title} | ${item.description}`)
      .join("\n"),
  };
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [architectureText, setArchitectureText] = useState({
    en: "",
    ar: "",
  });
  const [featuresText, setFeaturesText] = useState({
    en: "",
    ar: "",
  });

  async function load() {
    try {
      const response = await fetch("/api/admin/projects");

      if (!response.ok) {
        throw new Error("تعذر تحميل الأعمال");
      }

      const data = await response.json();
      setProjects(data.data ?? []);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "تعذر تحميل الأعمال",
      );
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialProjects() {
      try {
        const response = await fetch("/api/admin/projects");

        if (!response.ok) {
          throw new Error("تعذر تحميل الأعمال");
        }

        const data = await response.json();

        if (!cancelled) {
          setProjects(data.data ?? []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "تعذر تحميل الأعمال",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.index.localeCompare(b.index)),
    [projects],
  );

  function edit(project: PortfolioProject) {
    setForm(toForm(project));

    const en = copyToText(project.en);
    const ar = copyToText(project.ar);

    setArchitectureText({
      en: en.architectureText,
      ar: ar.architectureText,
    });

    setFeaturesText({
      en: en.featuresText,
      ar: ar.featuresText,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function reset() {
    setForm(emptyForm());
    setArchitectureText({
      en: "",
      ar: "",
    });
    setFeaturesText({
      en: "",
      ar: "",
    });
    setMessage("");
    setError("");
  }

  function updateCopy(
    locale: "en" | "ar",
    key: keyof ProjectCopy,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        [key]: value,
      },
    }));
  }

  async function save() {
    if (!form.imageUrl.trim()) {
      setError("ÙŠØ±Ø¬Ù‰ Ø±ÙØ¹ ØµÙˆØ±Ø© Ø§Ù„Ø¹Ù…Ù„ Ø£ÙˆÙ„Ù‹Ø§.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        slug: form.slug,
        index: form.index,
        year: form.year,
        featured: form.featured,
        published: form.published,
        tech: form.tech,
        sketch: form.sketch,
        imageUrl: form.imageUrl,
        liveUrl: form.liveUrl,
        githubUrl: form.githubUrl,
        en: {
          ...form.en,
          architecture: parsePairs(architectureText.en, "|"),
          features: parseFeatures(featuresText.en, "|"),
        },
        ar: {
          ...form.ar,
          architecture: parsePairs(architectureText.ar, "|"),
          features: parseFeatures(featuresText.ar, "|"),
        },
      };

      const response = await fetch(
        form.id ? `/api/admin/projects/${form.id}` : "/api/admin/projects",
        {
          method: form.id ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "ØªØ¹Ø°Ø± ØÙØ¸ Ø§Ù„Ø¹Ù…Ù„");
      }

      setMessage(
        form.id
          ? "ØªÙ… ØªØØ¯ÙŠØ« Ø§Ù„Ø¹Ù…Ù„ Ø¨Ù†Ø¬Ø§Ø."
          : "ØªÙ…Øª Ø¥Ø¶Ø§ÙØ© Ø§Ù„Ø¹Ù…Ù„ Ø¨Ù†Ø¬Ø§Ø.",
      );

      reset();
      await load();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "ØªØ¹Ø°Ø± ØÙØ¸ Ø§Ù„Ø¹Ù…Ù„",
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!window.confirm("هل تريد حذف هذا العمل؟")) {
      return;
    }

    const response = await fetch(`/api/admin/projects/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setProjects((current) => current.filter((project) => project.id !== id));

      if (form.id === id) {
        reset();
      }

      setMessage("تم حذف العمل.");
    } else {
      setError("تعذر حذف العمل");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    window.location.href = "/admin/login";
  }

  return (
    <main dir="rtl" className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <p className="t-label text-accent" dir="ltr">
              RG STACK / ADMIN
            </p>

            <h1 className="t-display-l mt-3">إدارة الأعمال</h1>

            <p className="t-body-s mt-2 text-muted">
              أضف أعمالك من المتصفح بدون تعديل ملفات الكود.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-sm border border-line px-4 py-2 text-sm font-semibold text-ink"
          >
            تسجيل الخروج
          </button>
        </header>

        {(message || error) && (
          <div
            role={error ? "alert" : "status"}
            className={`mb-6 rounded-sm border p-4 text-sm ${
              error ? "border-accent/30 text-accent" : "border-line text-ink"
            }`}
          >
            {error || message}
          </div>
        )}

        <section className="rounded-md border border-line bg-surface p-5 shadow-soft md:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="t-label text-accent">
                {form.id ? "تعديل" : "إضافة"}
              </p>

              <h2 className="t-heading-xl mt-2">
                {form.id ? form.en.title || "عمل" : "عمل جديد"}
              </h2>
            </div>

            {form.id && (
              <button
                onClick={reset}
                className="text-sm text-muted hover:text-ink"
              >
                إلغاء التعديل
              </button>
            )}
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            <Field
              label="Slug"
              value={form.slug}
              onChange={(v) =>
                setForm({
                  ...form,
                  slug: v,
                })
              }
              dir="ltr"
            />

            <Field
              label="الترتيب"
              value={form.index}
              onChange={(v) =>
                setForm({
                  ...form,
                  index: v,
                })
              }
              dir="ltr"
            />

            <Field
              label="السنة"
              value={form.year}
              onChange={(v) =>
                setForm({
                  ...form,
                  year: v,
                })
              }
              dir="ltr"
            />
          </div>

          <div className="mt-6">
            <AdminProjectImageUploader
              value={form.imageUrl}
              onChange={(url) =>
                setForm((current) => ({
                  ...current,
                  imageUrl: url,
                }))
              }
            />
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field
              label="رابط الموقع"
              value={form.liveUrl}
              onChange={(v) =>
                setForm({
                  ...form,
                  liveUrl: v,
                })
              }
              dir="ltr"
            />

            <Field
              label="رابط GitHub"
              value={form.githubUrl}
              onChange={(v) =>
                setForm({
                  ...form,
                  githubUrl: v,
                })
              }
              dir="ltr"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-5 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({
                    ...form,
                    published: e.target.checked,
                  })
                }
              />
              منشور على الموقع
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm({
                    ...form,
                    featured: e.target.checked,
                  })
                }
              />
              العمل الرئيسي
            </label>

            <label className="flex items-center gap-2">
              نمط المعاينة
              <select
                value={form.sketch}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sketch: e.target.value as SketchVariant,
                  })
                }
                className="rounded border border-line bg-bg px-3 py-2"
              >
                {SKETCH_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="mt-7">
            <legend className="t-label text-muted">التقنيات</legend>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
              {TECH_OPTIONS.map((tech) => (
                <label
                  key={tech}
                  className="flex items-center gap-2 rounded border border-line px-3 py-2 text-sm"
                  dir="ltr"
                >
                  <input
                    type="checkbox"
                    checked={form.tech.includes(tech)}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tech: e.target.checked
                          ? [...form.tech, tech]
                          : form.tech.filter((item) => item !== tech),
                      })
                    }
                  />

                  {tech}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <CopyEditor
              locale="en"
              copy={form.en}
              updateCopy={updateCopy}
              architectureText={architectureText.en}
              setArchitectureText={(value) =>
                setArchitectureText({
                  ...architectureText,
                  en: value,
                })
              }
              featuresText={featuresText.en}
              setFeaturesText={(value) =>
                setFeaturesText({
                  ...featuresText,
                  en: value,
                })
              }
            />

            <CopyEditor
              locale="ar"
              copy={form.ar}
              updateCopy={updateCopy}
              architectureText={architectureText.ar}
              setArchitectureText={(value) =>
                setArchitectureText({
                  ...architectureText,
                  ar: value,
                })
              }
              featuresText={featuresText.ar}
              setFeaturesText={(value) =>
                setFeaturesText({
                  ...featuresText,
                  ar: value,
                })
              }
            />
          </div>

          <button
            disabled={saving || loading}
            onClick={save}
            className="mt-8 rounded-sm bg-ink px-6 py-3 text-sm font-semibold text-bg disabled:opacity-50"
          >
            {saving ? "جارٍ الحفظ…" : form.id ? "حفظ التعديلات" : "إضافة العمل"}
          </button>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="t-heading-xl">الأعمال الحالية</h2>

            <span className="text-sm text-muted">
              {loading ? "جارٍ التحميل…" : `${sortedProjects.length} أعمال`}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sortedProjects.map((project) => (
              <article
                key={project.id}
                className="overflow-hidden rounded-md border border-line bg-surface"
              >
                <div className="relative aspect-video bg-bg-alt">
                  <Image
                    src={project.imageUrl}
                    alt={project.ar.title || "صورة العمل"}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted">
                      {project.index} · {project.year}
                    </span>

                    <span
                      className={
                        project.published
                          ? "text-xs text-emerald-600"
                          : "text-xs text-accent"
                      }
                    >
                      {project.published ? "منشور" : "مسودة"}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-semibold">
                    {project.ar.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-muted">
                    {project.ar.summary}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => edit(project)}
                      className="rounded border border-line px-3 py-2 text-sm"
                    >
                      تعديل
                    </button>

                    <button
                      onClick={() => remove(project.id)}
                      className="rounded border border-accent/30 px-3 py-2 text-sm text-accent"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  dir,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "ltr" | "rtl";
}) {
  return (
    <label className="block">
      <span className="t-label text-muted">{label}</span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2.5 w-full rounded-sm border border-line bg-bg px-3.5 py-3 text-ink"
        dir={dir}
      />
    </label>
  );
}

function CopyEditor({
  locale,
  copy,
  updateCopy,
  architectureText,
  setArchitectureText,
  featuresText,
  setFeaturesText,
}: {
  locale: "en" | "ar";
  copy: ProjectCopy;
  updateCopy: (
    locale: "en" | "ar",
    key: keyof ProjectCopy,
    value: string,
  ) => void;
  architectureText: string;
  setArchitectureText: (value: string) => void;
  featuresText: string;
  setFeaturesText: (value: string) => void;
}) {
  const arabic = locale === "ar";

  return (
    <div
      className="rounded-md border border-line p-5"
      dir={arabic ? "rtl" : "ltr"}
    >
      <h3 className="t-heading-m">
        {arabic ? "المحتوى العربي" : "English content"}
      </h3>

      <div className="mt-5 space-y-4">
        {(
          [
            "title",
            "category",
            "summary",
            "status",
            "overview",
            "challenge",
            "approach",
            "outcome",
          ] as const
        ).map((key) => (
          <label key={key} className="block">
            <span className="text-xs font-semibold text-muted">{key}</span>

            {key === "summary" ||
            key === "overview" ||
            key === "challenge" ||
            key === "approach" ||
            key === "outcome" ? (
              <textarea
                value={copy[key]}
                onChange={(e) => updateCopy(locale, key, e.target.value)}
                rows={key === "summary" ? 3 : 5}
                className="mt-2 w-full rounded-sm border border-line bg-bg px-3 py-2.5 text-sm"
              />
            ) : (
              <input
                value={copy[key]}
                onChange={(e) => updateCopy(locale, key, e.target.value)}
                className="mt-2 w-full rounded-sm border border-line bg-bg px-3 py-2.5 text-sm"
              />
            )}
          </label>
        ))}

        <label className="block">
          <span className="text-xs font-semibold text-muted">
            architecture — كل سطر: Label | Value
          </span>

          <textarea
            value={architectureText}
            onChange={(e) => setArchitectureText(e.target.value)}
            rows={5}
            className="mt-2 w-full rounded-sm border border-line bg-bg px-3 py-2.5 text-sm"
            dir="auto"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-muted">
            features — كل سطر: Title | Description
          </span>

          <textarea
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            rows={5}
            className="mt-2 w-full rounded-sm border border-line bg-bg px-3 py-2.5 text-sm"
            dir="auto"
          />
        </label>
      </div>
    </div>
  );
}
