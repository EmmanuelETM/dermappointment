DO $$ BEGIN
 CREATE TYPE "public"."location" AS ENUM('La Vega', 'Puerto Plata');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."skin_type" AS ENUM('Normal', 'Dry', 'Oily', 'Combiation', 'Sensitive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'PATIENT', 'DOCTOR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."week_days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dermappointment_appointment" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"doctor_id" varchar(255) NOT NULL,
	"procedure_id" varchar(255) NOT NULL,
	"date" timestamp,
	"duration" integer NOT NULL,
	"location" "location" NOT NULL,
	"reason" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dermappointment_clinical_history" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"dermatologic_background" text,
	"skin_type" "skin_type" DEFAULT 'Normal',
	"alergies" text,
	"sun_exposure" boolean DEFAULT false,
	"sunscreen" boolean DEFAULT false,
	"smokes" boolean DEFAULT false,
	"alcohol" boolean DEFAULT false,
	"drugs" boolean DEFAULT false,
	"diet" text,
	"stress" boolean DEFAULT false,
	"medicine" text,
	"chronic_diseases" text,
	"skinInjuries" text,
	"itches" boolean DEFAULT false,
	"skin_peels" boolean DEFAULT false,
	"erythema" boolean DEFAULT false,
	"diagnosis" text,
	"treatment" text,
	"monitoring" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dermappointment_conversation" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"last_sender_id" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dermappointment_doctor_specialties" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"doctor_id" varchar(255) NOT NULL,
	"specialty_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dermappointment_doctors" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dermappointment_messages" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"conversation_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dermappointment_participant" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"conversation_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dermappointment_patients" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dermappointment_procedures" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dermappointment_schedule" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"timezone" text NOT NULL,
	"doctor_id" varchar(255) NOT NULL,
	CONSTRAINT "dermappointment_schedule_doctor_id_unique" UNIQUE("doctor_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dermappointment_schedule_availability" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"schedule_id" varchar(255) NOT NULL,
	"week_day" "week_days" NOT NULL,
	"start" time NOT NULL,
	"end" time NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dermappointment_specialties" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dermappointment_appointment" ADD CONSTRAINT "dermappointment_appointment_patient_id_dermappointment_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."dermappointment_patients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dermappointment_appointment" ADD CONSTRAINT "dermappointment_appointment_doctor_id_dermappointment_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."dermappointment_doctors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dermappointment_appointment" ADD CONSTRAINT "dermappointment_appointment_procedure_id_dermappointment_procedures_id_fk" FOREIGN KEY ("procedure_id") REFERENCES "public"."dermappointment_procedures"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dermappointment_clinical_history" ADD CONSTRAINT "dermappointment_clinical_history_patient_id_dermappointment_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."dermappointment_patients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dermappointment_conversation" ADD CONSTRAINT "dermappointment_conversation_last_sender_id_dermappointment_users_id_fk" FOREIGN KEY ("last_sender_id") REFERENCES "public"."dermappointment_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dermappointment_doctor_specialties" ADD CONSTRAINT "dermappointment_doctor_specialties_doctor_id_dermappointment_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."dermappointment_doctors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dermappointment_doctor_specialties" ADD CONSTRAINT "dermappointment_doctor_specialties_specialty_id_dermappointment_specialties_id_fk" FOREIGN KEY ("specialty_id") REFERENCES "public"."dermappointment_specialties"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dermappointment_doctors" ADD CONSTRAINT "dermappointment_doctors_user_id_dermappointment_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dermappointment_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dermappointment_messages" ADD CONSTRAINT "dermappointment_messages_conversation_id_dermappointment_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."dermappointment_conversation"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dermappointment_messages" ADD CONSTRAINT "dermappointment_messages_user_id_dermappointment_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dermappointment_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dermappointment_patients" ADD CONSTRAINT "dermappointment_patients_user_id_dermappointment_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dermappointment_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dermappointment_schedule" ADD CONSTRAINT "dermappointment_schedule_doctor_id_dermappointment_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."dermappointment_doctors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dermappointment_schedule_availability" ADD CONSTRAINT "dermappointment_schedule_availability_schedule_id_dermappointment_schedule_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."dermappointment_schedule"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "scheduleIdIndex" ON "dermappointment_schedule_availability" USING btree ("schedule_id");