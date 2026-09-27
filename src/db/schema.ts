import { index, jsonb, pgTable, serial, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

/**
 * Messages submitted through the contact form.
 * Stored server-side so enquiries are never lost if email delivery fails.
 */
export const contactMessages = pgTable(
  "contact_messages",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 200 }).notNull(),
    message: text("message").notNull(),
    locale: varchar("locale", { length: 5 }).notNull().default("en"),
    source: varchar("source", { length: 60 }).notNull().default("website"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("contact_messages_created_at_idx").on(table.createdAt)],
);

export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;


/** Portfolio projects managed from the private admin dashboard. */
export const projects = pgTable(
  "portfolio_projects",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    index: varchar("project_index", { length: 10 }).notNull(),
    year: varchar("year", { length: 4 }).notNull(),
    featured: boolean("featured").notNull().default(false),
    published: boolean("published").notNull().default(true),
    tech: text("tech").array().notNull().default([]),
    sketch: varchar("sketch", { length: 30 }).notNull().default("template"),
    imageUrl: text("image_url").notNull(),
    liveUrl: text("live_url"),
    githubUrl: text("github_url"),
    enCopy: jsonb("en_copy").notNull(),
    arCopy: jsonb("ar_copy").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("portfolio_projects_published_idx").on(table.published),
    index("portfolio_projects_order_idx").on(table.index),
  ],
);

export type PortfolioProjectRow = typeof projects.$inferSelect;
export type NewPortfolioProject = typeof projects.$inferInsert;
