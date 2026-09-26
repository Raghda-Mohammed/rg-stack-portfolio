import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import {
  clientIdentifierFromRequest,
  hashClientIdentifier,
  rateLimitContact,
} from "@/lib/security/rate-limit";
import { MAX_BODY_BYTES, contactPayloadSchema, getContactFieldErrors } from "@/lib/validation/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  const name = typeof body.name === "string" ? body.name : "";
  const email = typeof body.email === "string" ? body.email : "";
  const message = typeof body.message === "string" ? body.message : "";
  const locale = contactPayloadSchema.shape.locale.parse(body.locale);

  const fieldErrors = getContactFieldErrors({ name, email, message });

  if (Object.keys(fieldErrors).length > 0) {
    return Response.json(
      { ok: false, error: "validation_failed", fieldErrors },
      { status: 422 },
    );
  }

  const clientIdentifier = clientIdentifierFromRequest(request);
  const rateLimit = await rateLimitContact(clientIdentifier);

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
      .values({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        locale,
        source: "portfolio",
      })
      .returning({ id: contactMessages.id });

    return Response.json({ ok: true, id: row?.id ?? null }, { status: 201 });
  } catch (error) {
    console.error("[contact] Failed to store contact message", {
      error,
      client: hashClientIdentifier(clientIdentifier),
    });

    return Response.json(
      { ok: false, error: "storage_failed" },
      { status: 500 },
    );
  }
}
