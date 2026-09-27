"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
value: string;
onChange: (url: string) => void;
};

const MAX_DIMENSION = 1600;
const TARGET_MAX_SIZE = 1.5 * 1024 * 1024;
const WEBP_QUALITY = 0.82;

async function compressImage(file: File): Promise<File> {
if (!file.type.startsWith("image/")) {
throw new Error("الملف المحدد ليس صورة");
}

const imageUrl = URL.createObjectURL(file);

try {
const image = new window.Image();

await new Promise<void>((resolve, reject) => {
  image.onload = () => resolve();
  image.onerror = () => reject(new Error("تعذر قراءة الصورة"));
  image.src = imageUrl;
});

let { width, height } = image;

if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
  const scale = Math.min(
    MAX_DIMENSION / width,
    MAX_DIMENSION / height,
  );

  width = Math.round(width * scale);
  height = Math.round(height * scale);
}

const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;

const context = canvas.getContext("2d");

if (!context) {
  throw new Error("تعذر تجهيز الصورة للضغط");
}

context.drawImage(image, 0, 0, width, height);

let quality = WEBP_QUALITY;
let blob = await canvasToBlob(canvas, quality);

while (blob.size > TARGET_MAX_SIZE && quality > 0.55) {
  quality -= 0.05;
  blob = await canvasToBlob(canvas, quality);
}

return new File(
  [blob],
  `${file.name.replace(/\.[^/.]+$/, "")}.webp`,
  {
    type: "image/webp",
    lastModified: Date.now(),
  },
);

} finally {
URL.revokeObjectURL(imageUrl);
}
}

function canvasToBlob(
canvas: HTMLCanvasElement,
quality: number,
): Promise<Blob> {
return new Promise((resolve, reject) => {
canvas.toBlob(
(blob) => {
if (!blob) {
reject(new Error("تعذر ضغط الصورة"));
return;
}

    resolve(blob);
  },
  "image/webp",
  quality,
);

});
}

export function AdminProjectImageUploader({ value, onChange }: Props) {
const inputRef = useRef<HTMLInputElement>(null);

const [uploading, setUploading] = useState(false);
const [error, setError] = useState("");

async function handleFileChange(
event: React.ChangeEvent<HTMLInputElement>,
) {
const file = event.target.files?.[0];

if (!file) return;

setError("");
setUploading(true);

try {
  const compressedFile = await compressImage(file);

  const formData = new FormData();
  formData.append("file", compressedFile);

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
    uploadError instanceof Error
      ? uploadError.message
      : "تعذر رفع الصورة",
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

return ( <div className="space-y-3"> <div className="flex items-center justify-between gap-3"> <span className="t-label text-muted">صورة العمل</span>

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
        {uploading ? "جارٍ تجهيز الصورة…" : "اختر صورة من جهازك"}
      </span>

      <span className="mt-2 text-xs text-muted">
        {uploading
          ? "يتم تصغير وضغط الصورة قبل الرفع…"
          : "اضغط هنا لاختيار صورة المشروع"}
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
      يتم تصغير وضغط الصورة ثم رفعها إلى التخزين…
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
