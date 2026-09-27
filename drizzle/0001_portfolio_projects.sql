CREATE TABLE IF NOT EXISTS "portfolio_projects" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" varchar(160) NOT NULL UNIQUE,
  "project_index" varchar(10) NOT NULL,
  "year" varchar(4) NOT NULL,
  "featured" boolean DEFAULT false NOT NULL,
  "published" boolean DEFAULT true NOT NULL,
  "tech" text[] DEFAULT '{}' NOT NULL,
  "sketch" varchar(30) DEFAULT 'template' NOT NULL,
  "image_url" text NOT NULL,
  "live_url" text,
  "github_url" text,
  "en_copy" jsonb NOT NULL,
  "ar_copy" jsonb NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "portfolio_projects_published_idx" ON "portfolio_projects" ("published");
CREATE INDEX IF NOT EXISTS "portfolio_projects_order_idx" ON "portfolio_projects" ("project_index");
