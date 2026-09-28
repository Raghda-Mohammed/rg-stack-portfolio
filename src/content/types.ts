export type Locale = "en" | "ar";

export type Fact = { label: string; value: string };

export type Feature = { title: string; description: string };

export type ArchitectureRow = { label: string; value: string };

export type ProjectCopy = {
  title: string;
  category: string;
  summary: string;
  status: string;
  overview: string;
  challenge: string;
  approach: string;
  architecture: ArchitectureRow[];
  features: Feature[];
  outcome: string;
};

export type Dictionary = {
  nav: {
    home: string;
    about: string;
    projects: string;
    skills: string;
    contact: string;
    cta: string;
    openMenu: string;
    closeMenu: string;
    menuLabel: string;
    primaryLabel: string;
    skipToContent: string;
  };
  theme: {
    label: string;
    light: string;
    dark: string;
    switchToDark: string;
    switchToLight: string;
  };
  language: { label: string; en: string; ar: string };
  hero: {
    eyebrow: string;
    name: string;
    role: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    stackLabel: string;
    available: string;
    locationLabel: string;
    locationValue: string;
    imageAlt: string;
    imageCaption: string;
    scroll: string;
  };
  about: {
    label: string;
    heading: string;
    paragraphs: string[];
    facts: Fact[];
    imageAlt: string;
    principlesLabel: string;
    principles: string[];
  };
  skills: {
    label: string;
    heading: string;
    intro: string;
    categories: Record<string, { title: string; note: string }>;
    footnote: string;
  };
  work: {
    label: string;
    heading: string;
    intro: string;
    featuredLabel: string;
    viewCaseStudy: string;
    liveDemo: string;
    github: string;
    otherLabel: string;
    otherHeading: string;
    previewCaption: string;
    keyFeatures: string;
    stack: string;
  };
  caseStudy: {
    back: string;
    overview: string;
    challenge: string;
    approach: string;
    architecture: string;
    features: string;
    technology: string;
    outcome: string;
    next: string;
    year: string;
    category: string;
    status: string;
    contactCta: string;
    contactLine: string;
  };
  projects: Record<string, ProjectCopy>;
  contact: {
    label: string;
    headingLine1: string;
    headingLine2: string;
    intro: string;
    detailsLabel: string;
    emailLabel: string;
    linkedinLabel: string;
    githubLabel: string;
    locationLabel: string;
    locationValue: string;
    responseNote: string;
    form: {
      title: string;
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      sending: string;
      required: string;
      successTitle: string;
      successBody: string;
      sendAnother: string;
      errors: {
        name: string;
        email: string;
        emailFormat: string;
        message: string;
        messageShort: string;
        generic: string;
      };
      privacy: string;
    };
  };
  footer: {
    tagline: string;
    copyright: string;
    social: string;
    builtWith: string;
    backToTop: string;
  };
};
