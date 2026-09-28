import type { Dictionary } from "./types";

export const en: Dictionary = {
  nav: {
    home: "Home",
    about: "About",
    projects: "Projects",
    skills: "Skills",
    contact: "Contact",
    cta: "Let's Talk",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuLabel: "Menu",
    primaryLabel: "Primary",
    skipToContent: "Skip to content",
  },
  theme: {
    label: "Theme",
    light: "Light",
    dark: "Dark",
    switchToDark: "Switch to dark theme",
    switchToLight: "Switch to light theme",
  },
  language: { label: "Language", en: "EN", ar: "AR" },
  hero: {
    eyebrow: "Hi, I'm",
    name: "RG Stack",
    role: "Full-Stack Developer",
    description:
      "I build modern, scalable web applications from concept to deployment — combining thoughtful design with clean, maintainable code.",
    primaryCta: "View My Projects",
    secondaryCta: "Download CV",
    stackLabel: "Working stack",
    available: "Available for new work",
    locationLabel: "Based in",
    locationValue: "Egypt · Working remotely",
    imageAlt:
      "A quiet daylight workspace: an open laptop, a cappuccino, a spiral notebook with two pens and a small cactus on a wooden desk.",
    imageCaption: "Where the work happens",
    scroll: "Scroll",
  },
  about: {
    label: "About me",
    heading: "Turning ideas into real web applications.",
    paragraphs: [
      "I'm a full-stack developer based in Egypt. I work across the entire stack — shaping the interface, modelling the data, writing the API and shipping the result — because the problems worth solving usually sit in the space between those layers.",
      "My degree is a B.Commerce in Accounting, which is where I learned to think in systems, rules and edge cases before writing anything down. I moved into software to build the tools instead of filling them in, and I've been engineering web products since.",
      "In practice that means Next.js and TypeScript on the front end, Node.js services and REST APIs on the back end, and PostgreSQL with Drizzle ORM for data. I care about typed boundaries, validation that lives on the server, accessible interfaces, and migrations that are safe to run twice.",
      "I prefer a small stack I understand deeply over a large fashionable one, and I read source code when documentation runs out.",
    ],
    facts: [
      { label: "Based in", value: "Egypt · Remote" },
      { label: "Education", value: "B.Commerce (Accounting)" },
      { label: "Focus", value: "Full-stack web development" },
      { label: "Languages", value: "Arabic (native) · English (professional)" },
      { label: "Currently", value: "Building Tel El-Kebir Guide" },
      { label: "Open to", value: "Freelance & full-time roles" },
    ],
    imageAlt:
      "A bright minimal desk by a window with a laptop, two cups and small plants, photographed in natural light.",
    principlesLabel: "How I work",
    principles: [
      "Model the data before designing the screens.",
      "Validate on the server; mirror the rules on the client for feedback.",
      "Accessibility and RTL support are part of the first pass, not a retrofit.",
      "Ship small, reviewable changes behind clear boundaries.",
    ],
  },
  skills: {
    label: "Skills",
    heading: "The tools I reach for, and why.",
    intro:
      "A deliberately short toolchain. Each of these earns its place because I use it in real projects, not because it trends well.",
    categories: {
      frontend: {
        title: "Frontend",
        note: "Interfaces that stay fast and readable as they grow.",
      },
      backend: {
        title: "Backend",
        note: "APIs built around clear contracts and predictable errors.",
      },
      database: {
        title: "Database",
        note: "Schema first, versioned migrations, fully typed queries.",
      },
      tools: {
        title: "Tools",
        note: "The workflow that gets code from my editor to production.",
      },
    },
    footnote:
      "No skill percentages here — levels of mastery are better judged from the code and the case studies below.",
  },
  work: {
    label: "Selected work",
    heading: "Projects built end to end.",
    intro:
      "A directory platform in production use, plus a set of smaller products and systems where I explored specific engineering problems.",
    featuredLabel: "Featured project",
    viewCaseStudy: "View Case Study",
    liveDemo: "Live Demo",
    github: "GitHub",
    otherLabel: "More projects",
    otherHeading: "Other things I've built.",
    previewCaption: "Interface preview — desktop and mobile layouts",
    keyFeatures: "Key functionality",
    stack: "Technology",
  },
  caseStudy: {
    back: "All projects",
    overview: "Overview",
    challenge: "The Challenge",
    approach: "The Approach",
    architecture: "Architecture",
    features: "Key Features",
    technology: "Technology",
    outcome: "Outcome",
    next: "Next project",
    year: "Year",
    category: "Category",
    status: "Status",
    contactCta: "Start a conversation",
    contactLine: "Have something similar in mind? Tell me about it.",
  },
  projects: {
    "tel-el-kebir-guide": {
      title: "Tel El-Kebir Guide",
      category: "Full-Stack Web Application",
      summary:
        "A full-stack local directory platform connecting people with businesses, services, shops, doctors, pharmacies and useful local information.",
      status: "In production · actively maintained",
      overview:
        "Tel El-Kebir Guide brings a whole city's practical information into one searchable place: shops, restaurants, doctors, pharmacies, service providers, emergency numbers and local announcements. Residents search and filter; business owners manage their own listing; an admin team reviews everything before it goes public. The interface is fully bilingual, Arabic and English.",
      challenge:
        "Local information lived in social media groups, forwarded screenshots and memory. Phone numbers went stale, the same business appeared three times with different details, and nothing was searchable. The product needed to be trustworthy enough that people rely on it, fast on mid-range Android phones over mobile data, Arabic-first without treating English as an afterthought, and cheap enough to run indefinitely.",
      approach:
        "I started with the data model instead of the screens. One businesses table acts as the spine, with categories, opening hours, contacts, reviews, advertisements and analytics events hanging off it — so adding a new content type later is a migration and a page, not a rewrite. On the front end, the Next.js App Router renders directory and listing pages as server components, and client JavaScript is reserved for the parts that genuinely need it: search, filters, forms and the dashboard. Arabic and RTL were designed in the first pass, using logical CSS properties and a shared token set so both directions use the same components.",
      architecture: [
        {
          label: "Frontend",
          value:
            "Next.js App Router with TypeScript. Server components for read-heavy directory pages, client components only for search, filters, forms and the dashboard. Tailwind CSS with shared design tokens and logical properties for LTR/RTL.",
        },
        {
          label: "Backend",
          value:
            "Route handlers and server actions in the same Next.js runtime. Every mutation is validated server-side against a schema; the client re-uses the same rules for instant feedback.",
        },
        {
          label: "Database",
          value:
            "PostgreSQL with Drizzle ORM. The schema is TypeScript, migrations are versioned, and generated types flow straight into the API layer. Indexed search handles Arabic and English business names.",
        },
        {
          label: "Authentication",
          value:
            "Session-based authentication with hashed passwords and HTTP-only cookies. Roles — visitor, business owner, admin — are enforced on the server for every protected route and mutation, never in the UI alone.",
        },
        {
          label: "API",
          value:
            "REST-style endpoints with consistent response envelopes, cursor pagination and typed error codes, plus rate limiting on write routes and review submission.",
        },
      ],
      features: [
        {
          title: "Authentication",
          description: "Sessions, hashed credentials and protected routes.",
        },
        {
          title: "Role-based access",
          description:
            "Visitor, owner and admin permissions enforced server-side.",
        },
        {
          title: "Admin dashboard",
          description: "Review queue for listings, reports and user content.",
        },
        {
          title: "Business management",
          description: "Owners maintain hours, contacts, photos and offers.",
        },
        {
          title: "Reviews",
          description: "One moderated, editable rating per user per business.",
        },
        {
          title: "Advertisements",
          description:
            "Scheduled placements with impression and click counters.",
        },
        {
          title: "Analytics",
          description: "Per-listing views and interactions aggregated in SQL.",
        },
        {
          title: "Notifications",
          description:
            "In-app alerts for approvals, replies and review activity.",
        },
        {
          title: "Multi-language",
          description:
            "Complete Arabic/English interface with true RTL layout.",
        },
        {
          title: "Responsive design",
          description:
            "One layout system from 320px handsets to wide desktops.",
        },
      ],
      outcome:
        "The platform runs as a single deployable Next.js application against a managed PostgreSQL database. Listings are created and maintained by the businesses themselves and reviewed before publication, which keeps the data current without a full-time editor. Because the schema and the API share one set of types, most new features are a migration plus a page. It is the project I point to when I want to show how I structure full-stack work: typed end to end, validated on the server, and designed for the device most people actually use.",
    },
    "portfolio-template": {
      title: "Portfolio Template",
      category: "Open Template",
      summary:
        "A modern, customisable developer portfolio template driven entirely by a typed content file.",
      status: "Template · open source",
      overview:
        "A portfolio starter for developers who want an editorial layout without rebuilding one. Content lives in a single typed configuration file, so a new portfolio is a content change rather than a component rewrite.",
      challenge:
        "Most portfolio templates hard-code copy into JSX. Changing a section means touching the markup, and the design drifts the moment somebody adds a longer sentence.",
      approach:
        "I separated content, tokens and components. A typed content module describes every section; components render from that contract and nothing else. Colour, spacing, radius and type scale come from CSS variables, so a theme change is a few tokens rather than a search-and-replace.",
      architecture: [
        {
          label: "Frontend",
          value:
            "Next.js App Router, TypeScript, Tailwind CSS with CSS-variable tokens.",
        },
        {
          label: "Content",
          value: "A single typed content module validated at build time.",
        },
        {
          label: "Motion",
          value:
            "Framer Motion for reveals and hover states, disabled under prefers-reduced-motion.",
        },
      ],
      features: [
        {
          title: "Typed content",
          description: "One file defines every section of the site.",
        },
        {
          title: "Token theming",
          description: "Light and dark themes from the same variable set.",
        },
        {
          title: "Section presets",
          description:
            "Hero, work, skills and contact blocks ready to compose.",
        },
        {
          title: "SEO defaults",
          description:
            "Metadata, Open Graph images, sitemap and robots included.",
        },
      ],
      outcome:
        "It is the base I reuse for landing pages and personal sites, including this one. Setting up a new site takes a content file and a token pass instead of a rebuild.",
    },
    "daboor-delivery": {
      title: "Daboor Delivery",
      category: "Product Concept",
      summary:
        "A delivery application concept focused on a calm ordering flow and honest order status.",
      status: "Concept · design and prototype",
      overview:
        "A concept for a local delivery app aimed at small cities, where drivers are few, orders are phone-first and customers mostly want to know one thing: where is my order right now.",
      challenge:
        "Delivery interfaces tend to over-promise precision — animated maps and minute-perfect estimates that the operation cannot deliver. The concept explores what an honest, low-noise status flow looks like instead.",
      approach:
        "I designed the order lifecycle as a small state machine — placed, accepted, preparing, on the way, delivered — and built the interface around those states rather than around a map. Each state has one clear sentence, one action, and a realistic time range instead of a fake countdown.",
      architecture: [
        {
          label: "Frontend",
          value:
            "React with TypeScript, component-driven order states and optimistic updates.",
        },
        {
          label: "Backend",
          value:
            "Node.js service exposing the order lifecycle as explicit transitions.",
        },
        {
          label: "Database",
          value:
            "PostgreSQL schema for orders, items, addresses and status history.",
        },
      ],
      features: [
        {
          title: "Order state machine",
          description: "Explicit transitions with a full status history.",
        },
        {
          title: "Reorder in one tap",
          description: "Recent orders repeat without re-entering an address.",
        },
        {
          title: "Honest estimates",
          description: "Time ranges instead of precise fake countdowns.",
        },
        {
          title: "Arabic-first UI",
          description: "RTL layout, Arabic numerals and local address formats.",
        },
      ],
      outcome:
        "The prototype settled the interaction model for the order flow and produced a reusable status component set that I have since adapted for other projects.",
    },
    "ai-saas-dashboard": {
      title: "AI SaaS Dashboard",
      category: "Interface Concept",
      summary:
        "A dashboard concept for AI-powered products: usage, cost and model behaviour in one view.",
      status: "Concept · interface system",
      overview:
        "An interface study for teams shipping AI features, where the important numbers are usage, latency, spend and failure rate — and where those numbers change by the minute.",
      challenge:
        "AI dashboards often show a chat window and a chart. The harder problem is making token spend, request volume and model errors legible at a glance without turning the page into a wall of widgets.",
      approach:
        "I designed a fixed information hierarchy: one primary metric, three supporting metrics, then a breakdown table. Streaming updates animate values in place rather than re-rendering whole panels, and every chart has a plain-language summary above it so the page is usable without reading the axes.",
      architecture: [
        {
          label: "Frontend",
          value:
            "Next.js App Router with server components for the shell and client islands for live panels.",
        },
        {
          label: "Data",
          value:
            "Streamed updates over server-sent events with a stable, typed payload contract.",
        },
        {
          label: "Backend",
          value:
            "Node.js aggregation layer that pre-computes rollups instead of querying raw events.",
        },
      ],
      features: [
        {
          title: "Usage and spend",
          description: "Token, request and cost rollups by model and by key.",
        },
        {
          title: "Live panels",
          description:
            "Streamed values that update in place without layout shift.",
        },
        {
          title: "Failure visibility",
          description:
            "Error rate and latency surfaced next to volume, not hidden.",
        },
        {
          title: "Keyboard first",
          description:
            "Full navigation, filtering and range selection from the keyboard.",
        },
      ],
      outcome:
        "The concept produced a chart and metric component set with consistent empty, loading and error states — the parts that usually get added last and look it.",
    },
    "arabic-ui-kit": {
      title: "Arabic UI Kit",
      category: "Component System",
      summary:
        "A reusable RTL interface component system for Arabic-first products.",
      status: "In progress · internal library",
      overview:
        "A component library built for Arabic interfaces, where RTL support is the default rather than a flag — covering typography, forms, navigation, tables and the bidirectional edge cases that break most kits.",
      challenge:
        "Most component libraries treat RTL as a mirrored stylesheet. That breaks the moment Arabic text contains Latin product names, numbers, phone numbers or code — and it ignores the fact that Arabic needs more line height and no letter-spacing.",
      approach:
        "Every component uses logical CSS properties, so direction is a document attribute rather than a second stylesheet. Mixed-direction content is isolated with bidi-safe wrappers, icons that carry direction are flipped explicitly while brand marks are not, and the type scale ships with separate Arabic line-height and tracking values.",
      architecture: [
        {
          label: "Frontend",
          value:
            "React and TypeScript components styled with Tailwind logical utilities.",
        },
        {
          label: "Tokens",
          value:
            "Shared CSS variables with direction-aware typography metrics.",
        },
        {
          label: "Testing",
          value:
            "Every component rendered in both directions in the same review pass.",
        },
      ],
      features: [
        {
          title: "Logical properties",
          description: "No mirrored stylesheet — direction is an attribute.",
        },
        {
          title: "Bidi-safe text",
          description:
            "Latin names and numbers isolated inside Arabic sentences.",
        },
        {
          title: "Arabic type scale",
          description: "Separate line-height and tracking for Arabic.",
        },
        {
          title: "Accessible by default",
          description:
            "Labels, focus states and roles built into each component.",
        },
      ],
      outcome:
        "The kit powers the Arabic side of my other projects, including the bilingual interface of this portfolio and Tel El-Kebir Guide.",
    },
  },
  contact: {
    label: "Get in touch",
    headingLine1: "Have a project in mind?",
    headingLine2: "Let's build it together.",
    intro:
      "Tell me what you're building, what stage it's at, and where it's stuck. I read every message and normally reply within two working days.",
    detailsLabel: "Direct",
    emailLabel: "Email",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
    locationLabel: "Location",
    locationValue: "Egypt · Remote (UTC+2)",
    responseNote: "Freelance projects, contract work and full-time roles.",
    form: {
      title: "Send a message",
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@company.com",
      message: "Message",
      messagePlaceholder:
        "What are you building, and what do you need help with?",
      submit: "Send message",
      sending: "Sending…",
      required: "Required",
      successTitle: "Message sent.",
      successBody:
        "Thanks for reaching out — I'll get back to you at the address you provided.",
      sendAnother: "Send another message",
      errors: {
        name: "Please enter your name.",
        email: "Please enter your email address.",
        emailFormat: "That email address doesn't look right.",
        message: "Please write a short message.",
        messageShort: "A little more detail helps — at least 20 characters.",
        generic:
          "Something went wrong while sending. Please try again, or email me directly.",
      },
      privacy: "Your details are stored only to answer your message.",
    },
  },
  footer: {
    tagline: "Full-Stack Developer building modern web applications.",
    copyright: "© 2026 RG Stack. All rights reserved.",
    social: "Elsewhere",
    builtWith: "Built with Next.js, TypeScript, PostgreSQL and Drizzle ORM.",
    backToTop: "Back to top",
  },
};
