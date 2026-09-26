"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import {
  getContactFieldErrors,
  type ContactFieldErrorCode,
} from "@/lib/validation/contact";
import { AlertIcon, ArrowRight, CheckIcon } from "./ui/icons";
import { buttonClass } from "./ui/primitives";

type Errors = Partial<Record<"name" | "email" | "message" | "form", string>>;

/**
 * Maps a Zod error code (from the shared `getContactFieldErrors`) to the
 * localized copy string for that field. Falls back to the field's generic
 * "required" message for codes that don't have a dedicated translation
 * (e.g. "too_long", which in practice a user is unlikely to hit while
 * typing since they'd see the character count grow long before submitting).
 */
function localizeFieldError(
  field: "name" | "email" | "message",
  code: ContactFieldErrorCode,
  copy: ReturnType<typeof useI18n>["t"]["contact"]["form"]["errors"],
): string {
  if (field === "email") {
    return code === "invalid_format" || code === "too_long"
      ? copy.emailFormat
      : copy.email;
  }
  if (field === "message") {
    return code === "too_short" || code === "too_long"
      ? copy.messageShort
      : copy.message;
  }
  return copy.name;
}

export function ContactForm() {
  const { t, locale } = useI18n();
  const copy = t.contact.form;
  const baseId = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const [values, setValues] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [validateLive, setValidateLive] = useState(false);

  const validate = (next = values): Errors => {
    const fieldErrors = getContactFieldErrors(next);
    const found: Errors = {};
    for (const field of ["name", "email", "message"] as const) {
      const code = fieldErrors[field];
      if (code) found[field] = localizeFieldError(field, code, copy.errors);
    }
    return found;
  };

  const update = (field: keyof typeof values, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (validateLive) setErrors(validate(next));
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setValidateLive(true);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      const firstField = (["name", "email", "message"] as const).find(
        (field) => found[field],
      );
      if (firstField)
        formRef.current
          ?.querySelector<HTMLElement>(
            `#${CSS.escape(`${baseId}-${firstField}`)}`,
          )
          ?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          locale,
          company: values.company,
        }),
      });

      if (!response.ok) throw new Error("request failed");

      setStatus("success");
      setValues({ name: "", email: "", message: "", company: "" });
      setValidateLive(false);
    } catch {
      setStatus("idle");
      setErrors({ form: copy.errors.generic });
    }
  }

  const fieldClass = (invalid: boolean) =>
    [
      "mt-2.5 w-full rounded-sm border bg-bg px-3.5 py-3 text-ink transition-colors duration-200",
      "placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
      invalid ? "border-accent" : "border-line hover:border-line-strong",
    ].join(" ");

  if (status === "success") {
    return (
      <div className="rounded-md border border-line bg-surface p-8 md:p-10">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
          <CheckIcon className="h-5 w-5" />
        </span>
        <h3 className="t-heading-l mt-6 font-display">{copy.successTitle}</h3>
        <p className="t-body-m mt-3 max-w-[42ch] text-muted">
          {copy.successBody}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className={buttonClass("secondary", "md", "mt-8")}
        >
          {copy.sendAnother}
          <ArrowRight className="arrow-shift h-4 w-4 rtl:-scale-x-100" />
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-describedby={`${baseId}-status`}
      className="rounded-md border border-line bg-surface p-6 shadow-soft md:p-9"
    >
      <h3 className="t-heading-l font-display">{copy.title}</h3>

      <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${baseId}-name`}
            className="t-label flex items-center gap-2 text-muted"
          >
            {copy.name}
            <span className="text-accent" aria-hidden>
              *
            </span>
          </label>
          <input
            id={`${baseId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            onBlur={() => validateLive && setErrors(validate())}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${baseId}-name-error` : undefined}
            placeholder={copy.namePlaceholder}
            className={fieldClass(Boolean(errors.name))}
          />
          {errors.name ? (
            <p
              id={`${baseId}-name-error`}
              role="alert"
              className="t-caption mt-2 flex items-center gap-1.5 text-accent"
            >
              <AlertIcon className="h-3.5 w-3.5" />
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor={`${baseId}-email`}
            className="t-label flex items-center gap-2 text-muted"
          >
            {copy.email}
            <span className="text-accent" aria-hidden>
              *
            </span>
          </label>
          <input
            id={`${baseId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            dir="ltr"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            onBlur={() => validateLive && setErrors(validate())}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? `${baseId}-email-error` : undefined
            }
            placeholder={copy.emailPlaceholder}
            className={`${fieldClass(Boolean(errors.email))} text-start`}
          />
          {errors.email ? (
            <p
              id={`${baseId}-email-error`}
              role="alert"
              className="t-caption mt-2 flex items-center gap-1.5 text-accent"
            >
              <AlertIcon className="h-3.5 w-3.5" />
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor={`${baseId}-message`}
          className="t-label flex items-center gap-2 text-muted"
        >
          {copy.message}
          <span className="text-accent" aria-hidden>
            *
          </span>
        </label>
        <textarea
          id={`${baseId}-message`}
          name="message"
          rows={6}
          required
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          onBlur={() => validateLive && setErrors(validate())}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? `${baseId}-message-error` : undefined
          }
          placeholder={copy.messagePlaceholder}
          className={`${fieldClass(Boolean(errors.message))} resize-y`}
        />
        {errors.message ? (
          <p
            id={`${baseId}-message-error`}
            role="alert"
            className="t-caption mt-2 flex items-center gap-1.5 text-accent"
          >
            <AlertIcon className="h-3.5 w-3.5" />
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot — hidden from people and assistive technology */}
      <div aria-hidden className="hidden">
        <label htmlFor={`${baseId}-company`}>Company</label>
        <input
          id={`${baseId}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(event) => update("company", event.target.value)}
        />
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "submitting"}
          className={buttonClass("primary", "md", "disabled:opacity-70")}
        >
          {status === "submitting" ? copy.sending : copy.submit}
          <ArrowRight className="arrow-shift h-4 w-4 rtl:-scale-x-100" />
        </button>
        <p className="t-caption text-muted">{copy.privacy}</p>
      </div>

      <p id={`${baseId}-status`} aria-live="polite" className="sr-only">
        {status === "submitting" ? copy.sending : ""}
      </p>

      {errors.form ? (
        <p
          role="alert"
          className="t-body-s mt-5 flex items-center gap-2 rounded-sm border border-accent bg-accent-soft px-4 py-3 text-accent"
        >
          <AlertIcon className="h-4 w-4 shrink-0" />
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
