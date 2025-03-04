CREATE TABLE IF NOT EXISTS "dermappointment_verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "dermappointment_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
