import { afterEach, describe, expect, it, vi } from "vitest";
import { hashClientIdentifier, rateLimitContact } from "@/lib/security/rate-limit";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("hashClientIdentifier", () => {
  it("returns a stable non-reversible-looking identifier", () => {
    const first = hashClientIdentifier("203.0.113.10");
    const second = hashClientIdentifier("203.0.113.10");

    expect(first).toBe(second);
    expect(first).toHaveLength(64);
    expect(first).not.toContain("203.0.113.10");
  });
});

describe("rateLimitContact", () => {
  it("allows five requests and blocks the sixth in development fallback mode", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");

    const results = await Promise.all(
      Array.from({ length: 6 }, () => rateLimitContact("203.0.113.10")),
    );

    expect(results.slice(0, 5).every((result) => result.allowed)).toBe(true);
    expect(results[5]).toMatchObject({ allowed: false, source: "memory" });
  });

  it("fails closed in production when Redis credentials are missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");

    await expect(rateLimitContact("203.0.113.10")).resolves.toEqual({
      allowed: false,
      unavailable: true,
    });
  });
});
