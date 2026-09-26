import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __rgStackPostgresPool?: Pool;
};

export const pool =
  globalForDb.__rgStackPostgresPool ??
  new Pool({
    connectionString: databaseUrl,
    max: Number(process.env.DB_POOL_MAX ?? 5),
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS ?? 10_000),
    connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT_MS ?? 5_000),
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__rgStackPostgresPool = pool;
}

export const db = drizzle(pool);
