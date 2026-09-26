import { index, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

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
