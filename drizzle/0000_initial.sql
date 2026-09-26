CREATE TABLE IF NOT EXISTS "contact_messages" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(120) NOT NULL,
  "email" varchar(200) NOT NULL,
  "message" text NOT NULL,
  "locale" varchar(5) DEFAULT 'en' NOT NULL,
  "source" varchar(60) DEFAULT 'website' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "contact_messages_created_at_idx"
  ON "contact_messages" USING btree ("created_at");
