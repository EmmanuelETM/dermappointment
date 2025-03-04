ALTER TABLE "dermappointment_verificationToken" ADD PRIMARY KEY ("identifier");--> statement-breakpoint
ALTER TABLE "dermappointment_verificationToken" ADD COLUMN "email" varchar(255) NOT NULL;