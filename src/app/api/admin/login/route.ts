import { NextResponse } from "next/server";
import { z } from "zod";
import {
  adminCookieName,
  createAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-auth";

const schema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (
      !adminEmail ||
      body.email.toLowerCase() !== adminEmail ||
      !(await verifyAdminPassword(body.password))
    ) {
      return NextResponse.json(
        { error: "بيانات الدخول غير صحيحة" },
        { status: 401 },
      );
    }

    const token = await createAdminSession(adminEmail);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(adminCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "تعذر تسجيل الدخول" }, { status: 400 });
  }
}
