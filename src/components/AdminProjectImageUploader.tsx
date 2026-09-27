"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export function AdminProjectImageUploader({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "تعذر رفع الصورة");
      }

      if (!data?.url) {
        throw new Error("لم يتم الحصول على رابط الصورة");
      }

      onChange(data.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "تعذر رفع الصورة",
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function removeImage() {
    onChange("");
    setError("");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="t-label text-muted">صورة العمل</span>

        <span className="text-xs text-muted">
          JPG / PNG / WebP / AVIF — حتى 5MB
        </span>
      </div>

      {value ? (
        <div className="relative overflow-hidden rounded-md border border-line bg-bg-alt">
          <div className="relative aspect-video">
            <Image
              src={value}
              alt="معاينة صورة العمل"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-line bg-surface p-3">
            <p
              className="min-w-0 truncate text-xs text-muted"
              dir="ltr"
              title={value}
            >
              {value}
            </p>

            <button
              type="button"
              onClick={removeImage}
              className="shrink-0 rounded border border-accent/30 px-3 py-2 text-xs font-semibold text-accent"
            >
              إزالة الصورة
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center rounded-md border border-dashed border-line bg-bg-alt px-5 py-10 text-center transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-sm font-semibold text-ink">
            {uploading ? "جارٍ رفع الصورة…" : "اختر صورة من جهازك"}
          </span>

          <span className="mt-2 text-xs text-muted">
            اضغط هنا لاختيار صورة المشروع
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileChange}
        className="hidden"
      />

      {uploading && (
        <div className="rounded border border-line bg-bg-alt px-3 py-2 text-sm text-muted">
          يتم رفع الصورة إلى التخزين…
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
