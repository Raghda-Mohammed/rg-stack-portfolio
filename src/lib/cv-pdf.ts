/**
 * Lightweight dependency-free PDF writer for the downloadable CV.
 * Two-page layout with balanced spacing and Helvetica fonts.
 */

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 54;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLORS = {
  ink: "0.08 0.08 0.08",
  text: "0.22 0.22 0.22",
  muted: "0.48 0.48 0.48",
  accent: "0.976 0.451 0.086",
  line: "0.82 0.82 0.82",
};

type TextOptions = {
  size?: number;
  bold?: boolean;
  color?: string;
  x?: number;
};

function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^\x20-\x7E]/g, "");
}

class PdfPage {
  private ops: string[] = [];

  cursor = 70;

  text(
    value: string,
    {
      size = 9.2,
      bold = false,
      color = COLORS.text,
      x = MARGIN,
    }: TextOptions = {},
  ) {
    this.ops.push(
      `BT /${bold ? "F2" : "F1"} ${size} Tf ${color} rg 1 0 0 1 ${x.toFixed(
        2,
      )} ${(PAGE_HEIGHT - this.cursor).toFixed(2)} Tm (${escapeText(
        value,
      )}) Tj ET`,
    );
  }

  line(value: string, options: TextOptions = {}, advance = 13) {
    this.text(value, options);
    this.cursor += advance;
  }

  paragraph(lines: string[], options: TextOptions = {}, advance = 13) {
    lines.forEach((line) => {
      this.line(line, options, advance);
    });
  }

  bullet(value: string, options: TextOptions = {}) {
    this.text("-", {
      ...options,
      x: MARGIN,
      color: COLORS.accent,
    });

    this.text(value, {
      ...options,
      x: MARGIN + 13,
    });

    this.cursor += 12.5;
  }

  heading(value: string) {
    this.cursor += 9;

    this.line(
      value,
      {
        size: 8.7,
        bold: true,
        color: COLORS.ink,
      },
      7,
    );

    this.rule();

    this.cursor += 11;
  }

  rule() {
    this.ops.push(
      `${COLORS.line} RG 0.6 w ${MARGIN} ${(PAGE_HEIGHT - this.cursor).toFixed(
        2,
      )} m ${(MARGIN + CONTENT_WIDTH).toFixed(
        2,
      )} ${(PAGE_HEIGHT - this.cursor).toFixed(2)} l S`,
    );
  }

  space(amount: number) {
    this.cursor += amount;
  }

  build(): string {
    return this.ops.join("\n");
  }
}

function assemble(pages: string[]): string {
  const pageObjects: number[] = [];
  const contentObjects: number[] = [];

  let nextObject = 3;

  pages.forEach(() => {
    pageObjects.push(nextObject++);
  });

  pages.forEach(() => {
    contentObjects.push(nextObject++);
  });

  const fontRegular = nextObject++;
  const fontBold = nextObject++;
  const infoObject = nextObject++;

  const objects: string[] = [];

  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";

  objects[2] = `<< /Type /Pages /Kids [${pageObjects
    .map((id) => `${id} 0 R`)
    .join(" ")}] /Count ${pages.length} >>`;

  pages.forEach((_, index) => {
    const pageObject = pageObjects[index];
    const contentObject = contentObjects[index];

    objects[pageObject] =
      `<< /Type /Page /Parent 2 0 R ` +
      `/MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      `/Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> ` +
      `/Contents ${contentObject} 0 R >>`;
  });

  pages.forEach((content, index) => {
    const contentObject = contentObjects[index];

    objects[contentObject] =
      `<< /Length ${content.length} >>\n` + `stream\n${content}\nendstream`;
  });

  objects[fontRegular] =
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";

  objects[fontBold] =
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";

  objects[infoObject] =
    "<< /Title (Raghda Mohammed - Full-Stack Software Engineer CV) " +
    "/Author (Raghda Mohammed) " +
    "/Creator (RG Stack Portfolio) >>";

  let pdf = "%PDF-1.4\n";

  const offsets: number[] = [];

  for (let index = 1; index < objects.length; index++) {
    const body = objects[index];

    if (!body) {
      continue;
    }

    offsets[index] = pdf.length;

    pdf += `${index} 0 obj\n${body}\nendobj\n`;
  }

  const xrefOffset = pdf.length;

  pdf += `xref\n0 ${objects.length}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < objects.length; index++) {
    pdf += `${String(offsets[index] ?? 0).padStart(10, "0")} 00000 n \n`;
  }

  pdf +=
    `trailer\n` +
    `<< /Size ${objects.length} /Root 1 0 R /Info ${infoObject} 0 R >>\n` +
    `startxref\n${xrefOffset}\n%%EOF\n`;

  return pdf;
}

function addProject(
  page: PdfPage,
  title: string,
  description: string,
  url: string,
  bullets: string[],
) {
  page.line(
    title,
    {
      size: 9.7,
      bold: true,
      color: COLORS.ink,
    },
    12,
  );

  page.line(
    url,
    {
      size: 7.8,
      color: COLORS.accent,
    },
    12,
  );

  page.line(
    description,
    {
      size: 8.6,
      color: COLORS.muted,
    },
    12,
  );

  bullets.forEach((bullet) => {
    page.bullet(bullet, {
      size: 8.25,
      color: COLORS.text,
    });
  });

  page.space(8);
}

export function buildCvPdf(): string {
  // ==================================================
  // PAGE 1
  // ==================================================

  const page1 = new PdfPage();

  // Header
  page1.line(
    "RAGHDA MOHAMMED",
    {
      size: 23,
      bold: true,
      color: COLORS.ink,
    },
    21,
  );

  page1.line(
    "Full-Stack Software Engineer",
    {
      size: 11.5,
      color: COLORS.accent,
    },
    17,
  );

  page1.line(
    "Email: raghda191987@gmail.com | Location: Egypt",
    {
      size: 8.2,
      color: COLORS.muted,
    },
    12,
  );

  page1.line(
    "LinkedIn: linkedin.com/in/raghda-mohammed",
    {
      size: 8.2,
      color: COLORS.muted,
    },
    12,
  );

  page1.line(
    "GitHub: github.com/Raghda-Mohammed | Portfolio: rg-stack-portfolio.vercel.app",
    {
      size: 8.2,
      color: COLORS.muted,
    },
    12,
  );

  page1.space(5);

  page1.rule();

  page1.space(2);

  // Summary
  page1.heading("PROFESSIONAL SUMMARY");

  page1.paragraph(
    [
      "Results-driven Full-Stack Software Engineer specializing in building modern, high-performance",
      "and scalable web applications. Expertise in crafting pixel-perfect front-end interfaces using",
      "React, Next.js (App Router), TypeScript, and Tailwind CSS, coupled with robust back-end",
      "integrations using Node.js, Supabase, Drizzle ORM, and PostgreSQL.",
      "Proven track record in developing full-scale agency platforms, localized service directories,",
      "and commercial React templates with a strong focus on UX/UI, clean architecture,",
      "and Git Flow methodologies.",
    ],
    {
      size: 8.65,
      color: COLORS.muted,
    },
    12.5,
  );

  // Skills
  page1.heading("TECHNICAL SKILLS");

  page1.paragraph(
    [
      "Frontend: React.js, Next.js (App Router), TypeScript, JavaScript (ES6+), Tailwind CSS,",
      "Framer Motion, HTML5/CSS3, i18n",
      "Backend & DB: Node.js, Next.js API Routes, Server Actions, PostgreSQL, Supabase,",
      "Drizzle ORM, RESTful APIs",
      "Tools & Hosting: Vite, Git, GitHub, Vercel, Carbon, Figma, Canva",
      "Architecture: Agile/Scrum, Git Flow, Clean Code, Responsive Web Design,",
      "Component-Driven Architecture",
    ],
    {
      size: 8.4,
      color: COLORS.text,
    },
    12.5,
  );

  // Projects
  page1.heading("KEY PROJECTS & LIVE WORK");

  addProject(
    page1,
    "Asateer Green Platform",
    "Full-stack corporate web platform and administration dashboard for agency operations.",
    "https://asateer-khadraa.vercel.app",
    [
      "Integrated Supabase and Drizzle ORM with PostgreSQL for database management and efficient queries.",
      "Implemented internationalization (i18n) and dynamic dark mode user preferences.",
    ],
  );

  addProject(
    page1,
    "Tell El Kebir Service Directory",
    "Comprehensive local service directory featuring dynamic search, reviews and service provider profiles.",
    "https://tel-el-kebir-guide.vercel.app",
    [
      "Built with Next.js App Router and Server Components for strong performance and SEO.",
      "Implemented business listings, offers, reviews and administration workflows.",
    ],
  );

  addProject(
    page1,
    "RD Stack Developer Portfolio",
    "Interactive developer portfolio showcasing modern stack expertise and full-stack projects.",
    "https://rg-stack-portfolio.vercel.app",
    [
      "Developed interactive UI components with responsive layouts and Framer Motion animations.",
      "Implemented optimized assets, metadata and mobile-first responsive behavior.",
    ],
  );

  addProject(
    page1,
    "Frost Air Interactive Web Showcase",
    "Modern interactive web template focused on conversion, visual design and smooth interactions.",
    "https://frost-air-portfolio.vercel.app",
    [
      "Implemented dark mode UI, smooth scrolling and modern responsive design.",
      "Deployed on Vercel with Vite optimized builds for fast asset bundling and performance.",
    ],
  );

  // ==================================================
  // PAGE 2
  // ==================================================

  const page2 = new PdfPage();

  page2.line(
    "RAGHDA MOHAMMED",
    {
      size: 10,
      bold: true,
      color: COLORS.muted,
    },
    15,
  );

  page2.rule();

  page2.space(17);

  // Remaining project
  addProject(
    page2,
    "Medical Website",
    "Modern medical website project focused on responsive presentation and professional UX.",
    "https://medical-website-seven-psi.vercel.app",
    [
      "Designed a clean responsive interface suitable for medical and healthcare services.",
      "Focused on accessible layouts, clear content hierarchy and mobile-first presentation.",
    ],
  );

  // Experience
  page2.heading("PROFESSIONAL EXPERIENCE");

  page2.line(
    "Front-End Engineer (Simulation Training) | AfaaqWare",
    {
      size: 9.6,
      bold: true,
      color: COLORS.ink,
    },
    13,
  );

  page2.bullet(
    "Collaborated within a cross-functional Agile team to deliver enterprise web features using React, Next.js and TypeScript.",
    {
      size: 8.4,
      color: COLORS.text,
    },
  );

  page2.bullet(
    "Managed codebase using strict Git Flow standards, including feature branching, PR reviews and merge conflict resolution.",
    {
      size: 8.4,
      color: COLORS.text,
    },
  );

  page2.bullet(
    "Transformed Figma designs into responsive and accessible React components with Tailwind CSS.",
    {
      size: 8.4,
      color: COLORS.text,
    },
  );

  page2.space(11);

  page2.line(
    "Full-Stack Web Developer & Digital Creator | Freelance",
    {
      size: 9.6,
      bold: true,
      color: COLORS.ink,
    },
    13,
  );

  page2.bullet(
    "Engineered and commercialized custom React templates and SaaS UI kits sold through platforms such as Gumroad.",
    {
      size: 8.4,
      color: COLORS.text,
    },
  );

  page2.bullet(
    "Built custom full-stack solutions for clients using Next.js, Supabase and PostgreSQL.",
    {
      size: 8.4,
      color: COLORS.text,
    },
  );

  // Education
  page2.heading("EDUCATION & TRAINING");

  page2.line(
    "Front-End Engineering Simulation Program | AfaaqWare Round 7",
    {
      size: 9.3,
      bold: true,
      color: COLORS.ink,
    },
    13,
  );

  page2.space(3);

  page2.line(
    "B.Commerce (Accounting)",
    {
      size: 9.3,
      bold: true,
      color: COLORS.ink,
    },
    13,
  );

  // Languages
  page2.heading("LANGUAGES");

  page2.line(
    "Arabic - Native | English - Professional Working Proficiency",
    {
      size: 9,
      color: COLORS.text,
    },
    13,
  );

  page2.space(17);

  page2.rule();

  page2.space(9);

  page2.line("Portfolio: https://rg-stack-portfolio.vercel.app", {
    size: 7.8,
    color: COLORS.accent,
  });

  return assemble([page1.build(), page2.build()]);
}
