import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The real "@/db" module throws at import time if DATABASE_URL is unset, and
// we don't want these tests to touch a real database. Mock it before the
// route module (which imports it) is loaded.
const insertMock = vi.fn();
vi.mock("@/db", () => ({
  db: {
    insert: () => ({
      values: () => ({
        returning: insertMock,
      }),
    }),
  },
}));
vi.mock("@/db/schema", () => ({ contactMessages: {} }));

import { POST } from "@/app/api/contact/route";

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

const validPayload = {
  name: "Sara Ahmed",
  email: "sara@example.com",
  message: "Hello, I'd like to talk about a full-stack project.",
  locale: "en",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    insertMock.mockReset();
    insertMock.mockResolvedValue([{ id: 1 }]);
    // Force the in-memory rate limiter path (no Upstash creds) and dev mode
    // so rate limiting doesn't fail-closed for unrelated tests.
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects a payload larger than the declared limit via Content-Length", async () => {
    const response = await POST(makeRequest(validPayload, { "content-length": String(64 * 1024) }));
    expect(response.status).toBe(413);
  });

  it("rejects invalid JSON", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{not json",
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("silently accepts a honeypot-triggered submission without inserting a row", async () => {
    const response = await POST(makeRequest({ ...validPayload, company: "I am a bot" }, { "x-forwarded-for": "203.0.113.1" }));
    expect(response.status).toBe(202);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("returns field-level validation errors for a short message", async () => {
    const response = await POST(
      makeRequest({ ...validPayload, message: "too short" }, { "x-forwarded-for": "203.0.113.2" }),
    );
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.fieldErrors).toHaveProperty("message");
  });

  it("returns field-level validation errors for an invalid email", async () => {
    const response = await POST(
      makeRequest({ ...validPayload, email: "not-an-email" }, { "x-forwarded-for": "203.0.113.3" }),
    );
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.fieldErrors).toHaveProperty("email");
  });

  it("stores a valid message and returns its id", async () => {
    const response = await POST(makeRequest(validPayload, { "x-forwarded-for": "203.0.113.4" }));
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json).toEqual({ ok: true, id: 1 });
    expect(insertMock).toHaveBeenCalledTimes(1);
  });

  it("returns 500 without leaking internals when the database insert fails", async () => {
    insertMock.mockRejectedValueOnce(new Error("connection refused"));
    const response = await POST(makeRequest(validPayload, { "x-forwarded-for": "203.0.113.5" }));
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ ok: false, error: "storage_failed" });
  });

  it("rate-limits a client after 5 requests from the same identifier", async () => {
    const ip = "203.0.113.6";
    const responses = [];
    for (let i = 0; i < 6; i += 1) {
      responses.push(await POST(makeRequest(validPayload, { "x-forwarded-for": ip })));
    }

    const statuses = responses.map((response) => response.status);
    expect(statuses.slice(0, 5)).toEqual([201, 201, 201, 201, 201]);
    expect(statuses[5]).toBe(429);
    expect(responses[5].headers.get("Retry-After")).not.toBeNull();
  });

  it("fails closed with 503 in production when Redis is not configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const response = await POST(makeRequest(validPayload, { "x-forwarded-for": "203.0.113.7" }));

    expect(response.status).toBe(503);
    expect(insertMock).not.toHaveBeenCalled();
  });
});
