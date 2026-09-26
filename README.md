# RG Stack Portfolio

## Required environment variables

Copy `.env.example` to `.env.local` and provide the values for your environment.

Production requires both:

- `DATABASE_URL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

The contact endpoint fails closed with HTTP 503 if Redis is unavailable in production. Local development falls back to an in-memory limiter so the app remains easy to run without Redis.

## Database migrations

Database schema changes are tracked in `drizzle/`.

Typical workflow:

```bash
npm install
npx drizzle-kit migrate
```

For future schema changes:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Never put real database credentials in `drizzle.config.json` or source control.

## Verification

Run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
