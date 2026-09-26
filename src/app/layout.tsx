import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import {
  Amiri,
  IBM_Plex_Sans_Arabic,
  Inter,
  JetBrains_Mono,
  Newsreader,
} from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { SkipLink } from "@/components/skip-link";
import { SITE } from "@/content/site";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-code",
  display: "swap",
  weight: ["400", "500"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const amiri = Amiri({
  subsets: ["arabic"],
  variable: "--font-arabic-display",
  display: "swap",
  weight: ["400", "700"],
});

const DESCRIPTION =
  "RG Stack — Full-Stack Developer building modern, scalable web applications with Next.js, React, TypeScript, Node.js and PostgreSQL.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "RG Stack — Full-Stack Developer",
    template: "%s — RG Stack",
  },
  description: DESCRIPTION,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  keywords: [
    "Full-Stack Developer",
    "Next.js developer",
    "React developer",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Drizzle ORM",
    "Egypt",
    "RG Stack",
  ],
  alternates: {
    canonical: "/",
    languages: { "en-US": "/", "ar-EG": "/" },
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: "RG Stack — Full-Stack Developer",
    description: DESCRIPTION,
    locale: "en_US",
    alternateLocale: ["ar_EG"],
  },
  twitter: {
    card: "summary_large_image",
    title: "RG Stack — Full-Stack Developer",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f2ec" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
  colorScheme: "light dark",
};

const BOOTSTRAP = `(function(){try{var d=document.documentElement;var t=localStorage.getItem('rg-theme');var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&prefersDark)){d.classList.add('dark');d.style.colorScheme='dark';}var l=localStorage.getItem('rg-locale');if(l==='ar'){d.lang='ar';d.dir='rtl';}}catch(e){}})();`;

const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  alternateName: "RG",
  url: SITE.url,
  email: `mailto:${SITE.email}`,
  jobTitle: "Full-Stack Developer",
  description: DESCRIPTION,
  address: { "@type": "PostalAddress", addressCountry: "EG" },
  knowsLanguage: ["ar", "en"],
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Drizzle ORM",
    "Tailwind CSS",
  ],
  sameAs: [SITE.github, SITE.linkedin],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable} ${jetbrains.variable} ${plexArabic.variable} ${amiri.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
        {/* Reveal animations start hidden; without JavaScript everything stays visible. */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="grain min-h-screen bg-bg text-ink antialiased">
        <ThemeProvider>
          <I18nProvider>
            <SkipLink />
            <div className="relative z-10 flex min-h-screen flex-col">
              <Navbar />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
