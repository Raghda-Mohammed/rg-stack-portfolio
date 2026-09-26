import * as Sentry from "@sentry/nextjs";

// Sentry stays fully inert unless NEXT_PUBLIC_SENTRY_DSN is set, so it is
// safe to leave configured even in environments (local dev, forks) that
// don't have a Sentry project of their own.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    // Keep this modest by default — a portfolio site has low traffic, so a
    // high sample rate doesn't cost much, but there is no need for 100%.
    tracesSampleRate: 0.2,
    // Session replay is off by default to avoid capturing visitor input
    // (including whatever they type into the contact form) without explicit
    // opt-in; raise this deliberately if replay is ever wanted.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    environment: process.env.NODE_ENV,
  });
}
