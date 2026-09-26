import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import {
  hashClientIdentifier,
  rateLimitContact,
} from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_BODY_BYTES = 32 * 1024;

function clientIdentifier(request: Request): string {
  // Vercel supplies x-forwarded-for from the edge/proxy layer. Hash the value
  // before using it as a Redis key so raw IP addresses are never persisted there.
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() || realIp?.trim() || "local";
}

export async function POST(request: Request) {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return Response.json(
      { ok: false, error: "payload_too_large" },
      { status: 413 },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return Response.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 },
    );
  }

  const body = payload as Record<string, unknown>;

  // Honeypot: silently accept so bots do not learn anything.
  if (typeof body.company === "string" && body.company.trim().length > 0) {
    return Response.json({ ok: true }, { status: 202 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const locale = body.locale === "ar" ? "ar" : "en";

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2 || name.length > 120) fieldErrors.name = "invalid_name";
  if (!EMAIL_PATTERN.test(email) || email.length > 200)
    fieldErrors.email = "invalid_email";
  if (message.length < 20 || message.length > 4000)
    fieldErrors.message = "invalid_message";

  if (Object.keys(fieldErrors).length > 0) {
    return Response.json(
      { ok: false, error: "validation_failed", fieldErrors },
      { status: 422 },
    );
  }

  const rateLimit = await rateLimitContact(clientIdentifier(request));

  if (rateLimit.unavailable) {
    return Response.json(
      { ok: false, error: "rate_limit_unavailable" },
      { status: 503 },
    );
  }

  if (!rateLimit.allowed) {
    return Response.json(
      {
        ok: false,
        error: "rate_limited",
        retryAfter: Math.max(
          0,
          Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        ),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          ),
        },
      },
    );
  }

  try {
    const [row] = await db
      .insert(contactMessages)
      .values({ name, email, message, locale, source: "portfolio" })
      .returning({ id: contactMessages.id });

    return Response.json({ ok: true, id: row?.id ?? null }, { status: 201 });
  } catch (error) {
    console.error("[contact] Failed to store contact message", {
      error,
      client: hashClientIdentifier(clientIdentifier(request)),
    });

    return Response.json(
      { ok: false, error: "storage_failed" },
      { status: 500 },
    );
  }
}
