"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
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
    <div className="container-editorial flex min-h-[60vh] flex-col justify-center py-24">
      <p className="t-label text-accent">Error</p>
      <h1 className="t-display-l mt-6 max-w-[16ch] text-balance">Something went wrong.</h1>
      <p className="t-body-m mt-6 max-w-[46ch] text-muted">
        The page hit an unexpected error. It has been logged automatically — you can try again,
        or go back to the home page.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2.5 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-contrast transition-colors duration-200 hover:bg-accent-strong"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 rounded-md border border-line-strong px-5 py-3 text-sm font-medium text-ink transition-colors duration-200 hover:border-ink"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
