"use client";

import { useI18n } from "@/lib/i18n";

const LISTINGS = [
  {
    en: { name: "El Nour Pharmacy", meta: "Pharmacy · Open until 23:00", tag: "Open" },
    ar: { name: "صيدلية النور", meta: "صيدلية · حتى ١١ مساءً", tag: "مفتوح" },
    rating: "4.8",
  },
  {
    en: { name: "Dr. Ahmed Salem", meta: "Dentist · Appointments", tag: "Verified" },
    ar: { name: "د. أحمد سالم", meta: "أسنان · بالحجز", tag: "موثّق" },
    rating: "4.6",
  },
  {
    en: { name: "Al Sharq Restaurant", meta: "Restaurant · Delivery", tag: "Open" },
    ar: { name: "مطعم الشرق", meta: "مطعم · توصيل", tag: "مفتوح" },
    rating: "4.5",
  },
];

const CATEGORIES = {
  en: ["All", "Restaurants", "Pharmacies", "Doctors", "Shops"],
  ar: ["الكل", "مطاعم", "صيدليات", "أطباء", "محال"],
};

const UI = {
  en: { brand: "Tel El-Kebir Guide", search: "Search for a shop, doctor or service…", results: "128 places", mobile: "Nearby" },
  ar: { brand: "دليل التل الكبير", search: "ابحث عن محل أو طبيب أو خدمة…", results: "١٢٨ مكانًا", mobile: "بالقرب منك" },
};

function Stars({ rating }: { rating: string }) {
  return (
    <span className="flex items-center gap-1">
      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 text-accent" fill="currentColor" aria-hidden>
        <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />
      </svg>
      <span className="text-[0.5625rem] font-medium text-ink-2 tabular-nums">{rating}</span>
    </span>
  );
}

/**
 * A hand-built representation of the Tel El-Kebir Guide interface.
 * It mirrors the real layout (search, categories, listing cards, mobile view)
 * rather than presenting a screenshot of functionality that does not exist.
 */
export function ProductPreview() {
  const { locale } = useI18n();
  const ui = UI[locale];
  const categories = CATEGORIES[locale];

  return (
    <div className="relative">
      {/* Desktop frame */}
      <div className="overflow-hidden rounded-md border border-line bg-surface shadow-card">
        <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2 w-2 rounded-full border border-line-strong" />
            <span className="h-2 w-2 rounded-full border border-line-strong" />
            <span className="h-2 w-2 rounded-full border border-line-strong" />
          </span>
          <span className="mx-auto rounded-full border border-line bg-bg px-3 py-1 text-[0.5625rem] tracking-wide text-muted keep-latin">
            telelkebirguide.com
          </span>
        </div>

        <div className="p-4 sm:p-5">
          {/* Product header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-[3px] bg-accent text-[0.5rem] font-bold text-accent-contrast keep-latin">
                TK
              </span>
              <span className="text-[0.6875rem] font-semibold text-ink">{ui.brand}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-[3px] border border-line px-1.5 py-0.5 text-[0.5rem] text-muted keep-latin">AR / EN</span>
              <span className="h-4 w-4 rounded-full border border-line bg-surface-2" aria-hidden />
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 flex items-center gap-2 rounded-sm border border-line bg-bg px-3 py-2">
            <svg viewBox="0 0 24 24" className="h-3 w-3 text-muted" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            <span className="text-[0.5625rem] text-muted">{ui.search}</span>
          </div>

          {/* Categories */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {categories.map((category, index) => (
              <span
                key={category}
                className={`rounded-full px-2 py-1 text-[0.5625rem] ${
                  index === 0
                    ? "bg-accent-soft text-accent"
                    : "border border-line text-muted"
                }`}
              >
                {category}
              </span>
            ))}
            <span className="ms-auto self-center text-[0.5625rem] text-muted">{ui.results}</span>
          </div>

          {/* Listing cards */}
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {LISTINGS.map((listing) => {
              const copy = listing[locale];
              return (
                <li key={copy.name} className="rounded-sm border border-line bg-bg p-2.5">
                  <div className="flex h-10 items-end rounded-[3px] bg-surface-2 p-1.5">
                    <span className="h-1 w-8 rounded-full bg-line-strong" aria-hidden />
                  </div>
                  <p className="mt-2 truncate text-[0.625rem] font-semibold text-ink">{copy.name}</p>
                  <p className="mt-1 truncate text-[0.5625rem] text-muted">{copy.meta}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <Stars rating={listing.rating} />
                    <span className="rounded-[3px] border border-line px-1.5 py-0.5 text-[0.5rem] text-muted">{copy.tag}</span>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Admin strip */}
          <div className="mt-3 flex items-center gap-2 rounded-sm border border-dashed border-line px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            <span className="text-[0.5625rem] text-muted">
              {locale === "ar" ? "٣ أنشطة بانتظار مراجعة الإدارة" : "3 listings awaiting admin review"}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile frame */}
      <div className="absolute -bottom-10 -start-10 hidden w-30 rounded-[1.25rem] border border-line-strong bg-surface p-1.5 shadow-float sm:block lg:-start-12 lg:w-33">
        <div className="overflow-hidden rounded-[0.9rem] border border-line bg-bg">
          <div className="flex items-center justify-between px-2.5 py-1.5">
            <span className="text-[0.4375rem] text-muted tabular-nums keep-latin">9:41</span>
            <span className="h-1 w-6 rounded-full bg-line-strong" aria-hidden />
            <span className="h-1.5 w-3 rounded-[2px] border border-line-strong" aria-hidden />
          </div>
          <div className="px-2.5 pb-3">
            <p className="text-[0.5625rem] font-semibold text-ink">{ui.mobile}</p>
            <div className="mt-1.5 flex items-center gap-1.5 rounded-[4px] border border-line bg-surface-2 px-2 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full border border-muted" aria-hidden />
              <span className="h-1 w-12 rounded-full bg-line-strong" aria-hidden />
            </div>
            <ul className="mt-2 space-y-1.5">
              {LISTINGS.map((listing) => (
                <li key={listing.rating} className="flex items-center gap-2 rounded-[4px] border border-line p-1.5">
                  <span className="h-6 w-6 shrink-0 rounded-[3px] bg-surface-2" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.5rem] font-medium text-ink">{listing[locale].name}</span>
                    <span className="mt-1 block h-1 w-10 rounded-full bg-line" aria-hidden />
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-center justify-center gap-3 border-t border-line pt-2" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
              <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
