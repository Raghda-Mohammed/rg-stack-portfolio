import { createHash } from "node:crypto";

const WINDOW_SECONDS = 10 * 60;
const MAX_PER_WINDOW = 5;
const KEY_PREFIX = "rg-stack:ratelimit:contact:v1";

type RateLimitResult =
  | {
      allowed: true;
      unavailable: false;
      remaining: number;
      resetAt: number;
      source: "redis" | "memory";
    }
  | {
      allowed: false;
      unavailable: false;
      remaining: 0;
      resetAt: number;
      source: "redis" | "memory";
    }
  | { allowed: false; unavailable: true };

type MemoryEntry = { count: number; resetAt: number };

const memoryStore = new Map<string, MemoryEntry>();

// Sweep expired memory-store entries occasionally so a long-running process
// without Redis configured (e.g. a staging box) doesn't grow this Map forever.
let lastSweep = 0;
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;

function sweepMemoryStore(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, entry] of memoryStore) {
    if (entry.resetAt <= now) memoryStore.delete(key);
  }
}

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

// Runs INCR + EXPIRE as a single Upstash pipeline request instead of two
// separate round-trips, so a network failure between the two calls can never
// leave the key incremented but without a TTL (which would otherwise lock a
// client out permanently until someone notices and deletes the key).
async function redisPipeline(
  url: string,
  token: string,
  commands: string[][],
): Promise<Array<{ result?: unknown; error?: string }>> {
  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Redis pipeline failed with status ${response.status}`);
  }

  return (await response.json()) as Array<{ result?: unknown; error?: string }>;
}

function memoryRateLimit(key: string, now: number): RateLimitResult {
  sweepMemoryStore(now);
  const existing = memoryStore.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + WINDOW_SECONDS * 1000;
    memoryStore.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      unavailable: false,
      remaining: MAX_PER_WINDOW - 1,
      resetAt,
      source: "memory",
    };
  }

  existing.count += 1;
  const remaining = Math.max(0, MAX_PER_WINDOW - existing.count);

  if (existing.count > MAX_PER_WINDOW) {
    return {
      allowed: false,
      unavailable: false,
      remaining: 0,
      resetAt: existing.resetAt,
      source: "memory",
    };
  }

  return {
    allowed: true,
    unavailable: false,
    remaining,
    resetAt: existing.resetAt,
    source: "memory",
  };
}

export function hashClientIdentifier(identifier: string): string {
  return createHash("sha256").update(identifier).digest("hex");
}

export async function rateLimitContact(
  identifier: string,
): Promise<RateLimitResult> {
  const now = Date.now();
  const config = getRedisConfig();
  const key = `${KEY_PREFIX}:${hashClientIdentifier(identifier)}`;

  if (!config) {
    if (process.env.NODE_ENV === "production") {
      return { allowed: false, unavailable: true };
    }

    return memoryRateLimit(key, now);
  }

  try {
    // Single round-trip: INCR then EXPIRE NX (only sets TTL if the key has
    // none yet). If the request fails or is interrupted partway, no command
    // in it has been applied, so the key can never end up incremented
    // without a TTL.
    const [incrResult, expireResult] = await redisPipeline(
      config.url,
      config.token,
      [
        ["INCR", key],
        ["EXPIRE", key, String(WINDOW_SECONDS), "NX"],
      ],
    );

    if (incrResult.error) throw new Error(incrResult.error);
    if (expireResult.error) throw new Error(expireResult.error);

    const count = incrResult.result as number;
    const resetAt = now + WINDOW_SECONDS * 1000;

    if (count > MAX_PER_WINDOW) {
      return {
        allowed: false,
        unavailable: false,
        remaining: 0,
        resetAt,
        source: "redis",
      };
    }

    return {
      allowed: true,
      unavailable: false,
      remaining: MAX_PER_WINDOW - count,
      resetAt,
      source: "redis",
    };
  } catch (error) {
    console.error("[rate-limit] Redis unavailable", error);

    if (process.env.NODE_ENV === "production") {
      return { allowed: false, unavailable: true };
    }

    return memoryRateLimit(key, now);
  }
}
