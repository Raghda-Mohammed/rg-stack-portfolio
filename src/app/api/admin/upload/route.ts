import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminCookieName, verifyAdminSession } from "@/lib/admin-auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(adminCookieName())?.value;
    const session = await verifyAdminSession(token);

    if (!session) {
      return NextResponse.json(
        { error: "غير مصرح لك بتنفيذ هذا الإجراء" },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "لم يتم اختيار صورة" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error: "نوع الصورة غير مدعوم. استخدم JPG أو PNG أو WebP أو AVIF.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "حجم الصورة يجب ألا يتجاوز 5 ميجابايت" },
        { status: 400 },
      );
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "webp";

    const safeExtension = extension === "jpeg" ? "jpg" : extension;

    const pathname = `portfolio-projects/${crypto.randomUUID()}.${safeExtension}`;

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error("Admin project image upload failed:", error);

    return NextResponse.json({ error: "تعذر رفع الصورة" }, { status: 500 });
  }
}
