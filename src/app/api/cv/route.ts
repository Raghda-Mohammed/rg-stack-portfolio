import { buildCvPdf } from "@/lib/cv-pdf";

export const runtime = "nodejs";

export function GET() {
  const pdf = buildCvPdf();

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="RG-Stack-Full-Stack-Developer-CV.pdf"',
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
