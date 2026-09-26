import { buildCvPdf } from "@/lib/cv-pdf";
import { clientIdentifierFromRequest, rateLimitCv } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const rateLimit = await rateLimitCv(clientIdentifierFromRequest(request));

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
        retryAfter: Math.max(0, Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
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

  const pdf = buildCvPdf();

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="RG-Stack-Full-Stack-Developer-CV.pdf"',
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
