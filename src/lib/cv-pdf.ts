/**
 * A tiny, dependency-free PDF writer for the downloadable CV.
 * Only Latin-1 text and Helvetica are used, so the output stays a few kilobytes
 * and no font or rendering library has to ship to production.
 */

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

type TextOptions = { size?: number; bold?: boolean; gray?: number; x?: number };

function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    // The writer is Latin-1 only; normalise typographic characters.
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^\x20-\x7E]/g, "");
}

class PdfPage {
  private ops: string[] = [];
  cursor = 76;

  text(value: string, { size = 9.5, bold = false, gray = 0.12, x = MARGIN }: TextOptions = {}) {
    this.ops.push(
      `BT /${bold ? "F2" : "F1"} ${size} Tf ${gray} g 1 0 0 1 ${x.toFixed(2)} ${(PAGE_HEIGHT - this.cursor).toFixed(2)} Tm (${escapeText(value)}) Tj ET`,
    );
  }

  line(value: string, options: TextOptions = {}, advance = 14) {
    this.text(value, options);
    this.cursor += advance;
  }

  paragraph(lines: string[], options: TextOptions = {}, advance = 13.5) {
    lines.forEach((line) => this.line(line, options, advance));
  }

  bullet(value: string, options: TextOptions = {}) {
    this.text("-", { ...options, x: MARGIN, gray: 0.45 });
    this.text(value, { ...options, x: MARGIN + 12 });
    this.cursor += 13.5;
  }

  heading(value: string) {
    this.cursor += 10;
    this.line(value, { size: 8.5, bold: true, gray: 0.35 }, 6);
    this.rule();
    this.cursor += 12;
  }

  rule() {
    this.ops.push(
      `0.75 G 0.6 w ${MARGIN} ${(PAGE_HEIGHT - this.cursor).toFixed(2)} m ${(MARGIN + CONTENT_WIDTH).toFixed(2)} ${(PAGE_HEIGHT - this.cursor).toFixed(2)} l S`,
    );
  }

  space(amount: number) {
    this.cursor += amount;
  }

  build(): string {
    return this.ops.join("\n");
  }
}

function assemble(content: string): string {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>`,
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    "<< /Title (RG Stack - Full-Stack Developer CV) /Author (RG Stack) /Creator (rgstack.dev) >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info ${objects.length} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return pdf;
}

export function buildCvPdf(): string {
  const page = new PdfPage();

  page.line("RG STACK", { size: 23, bold: true, gray: 0.08 }, 20);
  page.line("Full-Stack Developer", { size: 11.5, gray: 0.35 }, 16);
  page.line("hello@rgstack.dev   github.com/rgstack   linkedin.com/in/rgstack   Egypt (remote, UTC+2)", {
    size: 8.5,
    gray: 0.45,
  });
  page.space(2);
  page.rule();

  page.heading("PROFILE");
  page.paragraph([
    "Full-stack developer working across interface, API and database. I build web applications from",
    "concept to deployment with Next.js, TypeScript, Node.js and PostgreSQL, with a focus on typed",
    "boundaries, server-side validation, accessibility and bilingual (Arabic/English) interfaces.",
  ]);

  page.heading("CORE STACK");
  page.paragraph([
    "Frontend    Next.js, React, TypeScript, Tailwind CSS, Bootstrap, Framer Motion",
    "Backend     Node.js, Express, NestJS, REST APIs, server-side validation, session auth",
    "Database    PostgreSQL, Drizzle ORM, Prisma, schema design, versioned migrations",
    "Tools       Git, GitHub, Docker, Vercel, VS Code",
  ]);

  page.heading("SELECTED WORK");
  page.line("Tel El-Kebir Guide - Full-stack local directory platform (Next.js, TypeScript, PostgreSQL)", {
    size: 9.5,
    bold: true,
    gray: 0.1,
  });
  page.paragraph(
    [
      "Directory of local businesses, doctors, pharmacies and services with Arabic/English interfaces.",
    ],
    { size: 9.5, gray: 0.35 },
  );
  page.bullet("Session authentication with hashed credentials and role-based access (visitor, owner, admin).");
  page.bullet("Owner dashboard for listings, hours, photos and offers; admin moderation queue for published content.");
  page.bullet("Reviews, scheduled advertisements, per-listing analytics and in-app notifications.");
  page.bullet("PostgreSQL schema in Drizzle ORM with versioned migrations and types shared with the API layer.");
  page.space(6);

  page.line("Arabic UI Kit - RTL-first React component system", { size: 9.5, bold: true, gray: 0.1 });
  page.bullet("Logical CSS properties instead of mirrored stylesheets; bidi-safe handling of mixed Arabic/Latin text.");
  page.bullet("Direction-aware type scale with separate Arabic line-height and tracking values.");
  page.space(6);

  page.line("Portfolio Template - Content-driven Next.js portfolio starter", { size: 9.5, bold: true, gray: 0.1 });
  page.bullet("Typed content module drives every section; light and dark themes from one token set.");
  page.bullet("Built-in metadata, Open Graph images, sitemap and robots configuration.");

  page.heading("EDUCATION");
  page.line("B.Commerce (Accounting)", { size: 9.5, bold: true, gray: 0.1 });
  page.line("Foundation in systems, rules and edge-case thinking, applied to software since.", { size: 9.5, gray: 0.35 });

  page.heading("LANGUAGES");
  page.line("Arabic - native.   English - professional working proficiency.", { size: 9.5, gray: 0.2 });

  return assemble(page.build());
}
