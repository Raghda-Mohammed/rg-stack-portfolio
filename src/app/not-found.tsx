import Link from "next/link";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="container-editorial flex min-h-[60vh] flex-col justify-center py-24">
      <p className="t-label text-accent">404</p>
      <h1 className="t-display-l mt-6 max-w-[16ch] text-balance">This page doesn&apos;t exist.</h1>
      <p className="t-body-m mt-6 max-w-[46ch] text-muted">
        The link may be out of date. The work, the case studies and the contact form all live on the home page.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-contrast transition-colors duration-200 hover:bg-accent-strong"
        >
          Back to home
        </Link>
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2.5 rounded-md border border-line-strong px-5 py-3 text-sm font-medium text-ink transition-colors duration-200 hover:border-ink"
        >
          View projects
        </Link>
      </div>
    </div>
  );
}
