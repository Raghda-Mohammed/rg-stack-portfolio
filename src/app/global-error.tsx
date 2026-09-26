"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// This only renders if the root layout itself throws, so it can't rely on
// providers, fonts, or globals.css from layout.tsx — it renders its own
// minimal, dependency-free <html>/<body> with inline styles.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#f6f2ec",
          color: "#141210",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Something went wrong.</h1>
        <p style={{ maxWidth: "42ch", color: "#6b6459" }}>
          The site hit an unexpected error and couldn&apos;t recover on its own. It has been
          logged automatically.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            padding: "0.75rem 1.25rem",
            borderRadius: "0.5rem",
            border: "none",
            background: "#141210",
            color: "#f6f2ec",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
