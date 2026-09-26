import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

// Static security headers. Content-Security-Policy is intentionally NOT
// listed here: it needs a fresh nonce per request (so inline scripts can be
// allow-listed without falling back to 'unsafe-inline'), which only
// middleware.ts can provide. See middleware.ts for the CSP itself.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

// withSentryConfig no-ops safely when SENTRY_DSN / NEXT_PUBLIC_SENTRY_DSN
// aren't set (see sentry.*.config.ts), so this wrapper is always safe to
// keep in place, including in forks/local dev without a Sentry project.
export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Only upload source maps to Sentry when an auth token is present (e.g.
  // in CI/production builds) — local builds skip this step entirely.
  authToken: process.env.SENTRY_AUTH_TOKEN,
sourcemaps: {
  disable: !process.env.SENTRY_AUTH_TOKEN,
},
widenClientFileUpload: true,
});
