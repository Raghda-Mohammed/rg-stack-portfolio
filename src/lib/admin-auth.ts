import "server-only";

import { createHash, randomBytes, scrypt as nodeScrypt } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(nodeScrypt);
const COOKIE_NAME = "rg_admin_session";
const SESSION_DAYS = 7;

type SessionPayload = { email: string; exp: number };

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters");
  }
  return secret;
}

function base64Url(input: Uint8Array | string) {
  const value = typeof input === "string" ? Buffer.from(input) : Buffer.from(input);
  return value.toString("base64url");
}

function fromBase64Url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

async function hmac(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return base64Url(new Uint8Array(signature));
}

export async function createAdminSession(email: string) {
  const payload: SessionPayload = {
    email,
    exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  };
  const encoded = base64Url(JSON.stringify(payload));
  const signature = await hmac(encoded);
  return `${encoded}.${signature}`;
}

export async function verifyAdminSession(token: string | undefined) {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = await hmac(encoded);
  if (signature.length !== expected.length) return null;

  const valid = createHash("sha256").update(signature).digest("hex") === createHash("sha256").update(expected).digest("hex");
  if (!valid) return null;

  try {
    const payload = JSON.parse(fromBase64Url(encoded)) as SessionPayload;
    if (!payload.email || !Number.isFinite(payload.exp) || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function adminCookieName() {
  return COOKIE_NAME;
}

export async function verifyAdminPassword(password: string) {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored) throw new Error("ADMIN_PASSWORD_HASH is not configured");
  const [algorithm, salt, expectedHex] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;

  const derived = (await scrypt(password, Buffer.from(salt, "base64url"), 64)) as Buffer;
  const actualHex = derived.toString("hex");
  return actualHex === expectedHex;
}

export function createPasswordHash(password: string) {
  const salt = randomBytes(16);
  return new Promise<string>((resolve, reject) => {
    nodeScrypt(password, salt, 64, (error, derived) => {
      if (error) return reject(error);
      resolve(`scrypt$${salt.toString("base64url")}$${derived.toString("hex")}`);
    });
  });
}
