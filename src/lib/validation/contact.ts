import { z } from "zod";

/**
 * Single source of truth for contact-form validation rules.
 *
 * Both `ContactForm` (client, for live/on-submit validation with localized
 * copy) and `POST /api/contact` (server, authoritative) import from this
 * file. Previously the length limits and the email regex were duplicated in
 * both places by hand, which meant the two could silently drift apart.
 *
 * The schema intentionally reports one specific `ContactFieldErrorCode` per
 * field rather than a generic "invalid" flag, so the client can show the
 * right localized message (e.g. "required" vs "too short") without
 * re-implementing the rules itself.
 */

export const CONTACT_RULES = {
  name: { min: 2, max: 120 },
  email: { max: 200 },
  message: { min: 20, max: 4000 },
} as const;

/** Hard cap on the raw request body, enforced before JSON parsing in the route. */
export const MAX_BODY_BYTES = 32 * 1024;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ContactFieldErrorCode =
  | "required"
  | "too_short"
  | "too_long"
  | "invalid_format";

export type ContactFieldName = "name" | "email" | "message";

export type ContactFieldErrors = Partial<
  Record<ContactFieldName, ContactFieldErrorCode>
>;

export type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};

/**
 * Fields are `.trim()`-ed inside the schema so both callers can pass raw
 * input straight through without pre-trimming (Zod trims before checking
 * length, matching the previous manual `.trim()` behaviour on both sides).
 */
export const contactFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "required")
    .min(CONTACT_RULES.name.min, "required")
    .max(CONTACT_RULES.name.max, "too_long"),
  email: z
    .string()
    .trim()
    .min(1, "required")
    .max(CONTACT_RULES.email.max, "too_long")
    .regex(EMAIL_PATTERN, "invalid_format"),
  message: z
    .string()
    .trim()
    .min(1, "required")
    .min(CONTACT_RULES.message.min, "too_short")
    .max(CONTACT_RULES.message.max, "too_long"),
});

/** Full payload shape accepted by the API route, including locale + honeypot. */
export const contactPayloadSchema = contactFieldsSchema.extend({
  locale: z.enum(["en", "ar"]).catch("en"),
  // Honeypot: real users never fill this in. Any non-empty value here means
  // the submission is treated as a bot and short-circuited by the caller
  // before this schema's field errors are even relevant.
  company: z.string().optional().default(""),
});

/**
 * Validates just the three user-facing fields and returns one error code per
 * failing field (the *first* rule each field breaks, in schema-declaration
 * order — e.g. an empty message is reported as "required", not "too_short").
 * Used by the client for live validation and by the server for its
 * `fieldErrors` response.
 */
export function getContactFieldErrors(
  values: ContactFormValues,
): ContactFieldErrors {
  const result = contactFieldsSchema.safeParse(values);
  if (result.success) return {};

  const errors: ContactFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (
      (field === "name" || field === "email" || field === "message") &&
      !errors[field]
    ) {
      errors[field] = issue.message as ContactFieldErrorCode;
    }
  }
  return errors;
}
