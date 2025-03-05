CREATE TABLE IF NOT EXISTS "dermappointment_passwordResetToken" (
	"identifier" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "dermappointment_passwordResetToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
