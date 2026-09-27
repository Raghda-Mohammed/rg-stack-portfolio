import { beforeEach, describe, expect, it } from "vitest";
import { createAdminSession, verifyAdminPassword, verifyAdminSession } from "@/lib/admin-auth";

beforeEach(() => {
  process.env.ADMIN_SESSION_SECRET = "a".repeat(48);
});

describe("admin authentication", () => {
  it("creates and verifies a signed session", async () => {
    const token = await createAdminSession("admin@example.com");
    const session = await verifyAdminSession(token);
    expect(session?.email).toBe("admin@example.com");
  });

  it("rejects a tampered session", async () => {
    const token = await createAdminSession("admin@example.com");
    const tampered = `${token.slice(0, -1)}x`;
    expect(await verifyAdminSession(tampered)).toBeNull();
  });

  it("verifies an scrypt password hash", async () => {
    process.env.ADMIN_PASSWORD_HASH = "scrypt$AA$" + "00".repeat(64);
    expect(await verifyAdminPassword("wrong-password")).toBe(false);
  });
});
