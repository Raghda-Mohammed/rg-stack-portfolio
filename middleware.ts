import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Generates a fresh nonce per request and swaps `script-src`'s
 * `'unsafe-inline'` for `'nonce-<value>'`. The theme-bootstrap and JSON-LD
 * `<script>` tags in layout.tsx / page.tsx read the nonce back out of
 * `x-nonce` (via `next/headers`) and attach it to themselves, so only those
 * server-authored scripts can execute — any injected `<script>` without the
 * correct nonce is blocked by the browser even if some other code path is
 * ever compromised.
 */
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  // Skip static assets and image optimization requests — they never render
  // inline scripts, so there's no benefit to generating a nonce for them,
  // and it avoids invalidating their CDN caching on every request.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
