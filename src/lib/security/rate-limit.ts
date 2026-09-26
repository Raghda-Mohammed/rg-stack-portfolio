import { createHash } from "node:crypto";

const KEY_PREFIX = "rg-stack:ratelimit";

type Action = "contact" | "cv";

type ActionConfig = {
  windowSeconds: number;
  maxPerWindow: number;
  /**
   * When Redis is unconfigured/unreachable in production, should the action
   * fail closed (503, deny everyone) or fall back to a per-instance
   * in-memory limiter?
   *
   * `contact` writes to the database and is the more attractive target for
   * abuse, so it fails closed — a determined attacker who could somehow
   * take Upstash offline should not be rewarded with an open door.
   *
   * `cv` only serves a small generated PDF with no side effects, so the
   * cost of a false negative is low while the cost of blocking a real
   * recruiter's download during a transient Redis blip is comparatively
   * high. It degrades to the in-memory limiter instead of hard-failing.
   */
  failClosedInProduction: boolean;
};

const ACTION_CONFIG: Record<Action, ActionConfig> = {
  contact: {
    windowSeconds: 10 * 60,
    maxPerWindow: 5,
    failClosedInProduction: true,
  },
  cv: {
    windowSeconds: 10 * 60,
    maxPerWindow: 20,
    failClosedInProduction: false,
  },
};

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

function memoryRateLimit(
  key: string,
  now: number,
  config: ActionConfig,
): RateLimitResult {
  sweepMemoryStore(now);
  const existing = memoryStore.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + config.windowSeconds * 1000;
    memoryStore.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      unavailable: false,
      remaining: config.maxPerWindow - 1,
      resetAt,
      source: "memory",
    };
  }

  existing.count += 1;
  const remaining = Math.max(0, config.maxPerWindow - existing.count);

  if (existing.count > config.maxPerWindow) {
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

/**
 * Derives a stable per-client identifier from request headers. Vercel
 * supplies `x-forwarded-for` from the edge/proxy layer; the raw value is
 * hashed by callers (via `hashClientIdentifier`) before it's ever used as a
 * storage key or logged, so plain IP addresses are never persisted.
 */
export function clientIdentifierFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() || realIp?.trim() || "local";
}

async function rateLimit(
  action: Action,
  identifier: string,
): Promise<RateLimitResult> {
  const config = ACTION_CONFIG[action];
  const now = Date.now();
  const redisConfig = getRedisConfig();
  const key = `${KEY_PREFIX}:${action}:v1:${hashClientIdentifier(identifier)}`;

  if (!redisConfig) {
    if (
      process.env.NODE_ENV === "production" &&
      config.failClosedInProduction
    ) {
      return { allowed: false, unavailable: true };
    }

    return memoryRateLimit(key, now, config);
  }

  try {
    // Single round-trip: INCR then EXPIRE NX (only sets TTL if the key has
    // none yet). If the request fails or is interrupted partway, no command
    // in it has been applied, so the key can never end up incremented
    // without a TTL.
    const [incrResult, expireResult] = await redisPipeline(
      redisConfig.url,
      redisConfig.token,
      [
        ["INCR", key],
        ["EXPIRE", key, String(config.windowSeconds), "NX"],
      ],
    );

    if (incrResult.error) throw new Error(incrResult.error);
    if (expireResult.error) throw new Error(expireResult.error);

    const count = incrResult.result as number;
    const resetAt = now + config.windowSeconds * 1000;

    if (count > config.maxPerWindow) {
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
      remaining: config.maxPerWindow - count,
      resetAt,
      source: "redis",
    };
  } catch (error) {
    console.error(
      `[rate-limit] Redis unavailable for action "${action}"`,
      error,
    );

    if (
      process.env.NODE_ENV === "production" &&
      config.failClosedInProduction
    ) {
      return { allowed: false, unavailable: true };
    }

    return memoryRateLimit(key, now, config);
  }
}

export function rateLimitContact(identifier: string): Promise<RateLimitResult> {
  return rateLimit("contact", identifier);
}

export function rateLimitCv(identifier: string): Promise<RateLimitResult> {
  return rateLimit("cv", identifier);
}
