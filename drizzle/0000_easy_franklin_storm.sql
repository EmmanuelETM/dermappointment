CREATE TYPE IF NOT EXISTS "user_role" AS ENUM ('ADMIN', 'PATIENT', 'DOCTOR');

CREATE TABLE IF NOT EXISTS "dermappointment_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "dermappointment_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dermappointment_users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'PATIENT',
	"address" text,
	"gender" varchar(128) NOT NULL,
	"email_verified" timestamp with time zone,
	"image" varchar(255)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dermappointment_account" ADD CONSTRAINT "dermappointment_account_user_id_dermappointment_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dermappointment_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "dermappointment_account" USING btree ("user_id");