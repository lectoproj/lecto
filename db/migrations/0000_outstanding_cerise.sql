CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categoria_lectura" (
	"id_categoria" integer PRIMARY KEY NOT NULL,
	"nombre_categoria" varchar(80) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "evaluacion" (
	"id_evaluacion" integer PRIMARY KEY NOT NULL,
	"fecha_evaluacion" date,
	"puntaje" numeric(4, 2),
	"retroalimentacion" varchar(200),
	"id_usuario" text,
	"id_lectura" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lectura" (
	"id_lectura" integer PRIMARY KEY NOT NULL,
	"nombre_lectura" varchar(80) NOT NULL,
	"lecturas3" varchar(80) NOT NULL,
	"id_usuario" text,
	"id_categoria" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "preposttest" (
	"id_test_p" integer PRIMARY KEY NOT NULL,
	"pre_post" boolean NOT NULL,
	"id_evaluacion" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "racha" (
	"id_racha" integer PRIMARY KEY NOT NULL,
	"fecha_rach" date NOT NULL,
	"id_usuario" text NOT NULL,
	"id_evaluacion" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "testinferencia" (
	"id_test_inter" integer PRIMARY KEY NOT NULL,
	"pregunta" varchar(80) NOT NULL,
	"feedback" varchar(500),
	"respuesta" varchar(200),
	"id_evaluacion" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "testobtencioninfo" (
	"id_test_oi" integer PRIMARY KEY NOT NULL,
	"pregunta" varchar(80) NOT NULL,
	"res_selec" varchar(80),
	"res_correc" varchar(80) NOT NULL,
	"op_1" varchar(30) NOT NULL,
	"op_2" varchar(30) NOT NULL,
	"op_3" varchar(30) NOT NULL,
	"op_4" varchar(30) NOT NULL,
	"feedback" varchar(500),
	"acierto" boolean,
	"id_evaluacion" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "testreflexion" (
	"id_test_refle" integer PRIMARY KEY NOT NULL,
	"pregunta" varchar(80) NOT NULL,
	"feedback" varchar(500),
	"respuesta" varchar(300),
	"id_evaluacion" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"fecha_nacimiento" date,
	"email_tutor" varchar(80),
	"nombre_tutor" varchar(80)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "evaluacion" ADD CONSTRAINT "evaluacion_id_usuario_user_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "evaluacion" ADD CONSTRAINT "evaluacion_id_lectura_lectura_id_lectura_fk" FOREIGN KEY ("id_lectura") REFERENCES "public"."lectura"("id_lectura") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lectura" ADD CONSTRAINT "lectura_id_usuario_user_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lectura" ADD CONSTRAINT "lectura_id_categoria_categoria_lectura_id_categoria_fk" FOREIGN KEY ("id_categoria") REFERENCES "public"."categoria_lectura"("id_categoria") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "preposttest" ADD CONSTRAINT "preposttest_id_evaluacion_evaluacion_id_evaluacion_fk" FOREIGN KEY ("id_evaluacion") REFERENCES "public"."evaluacion"("id_evaluacion") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "racha" ADD CONSTRAINT "racha_id_usuario_user_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "racha" ADD CONSTRAINT "racha_id_evaluacion_evaluacion_id_evaluacion_fk" FOREIGN KEY ("id_evaluacion") REFERENCES "public"."evaluacion"("id_evaluacion") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "testinferencia" ADD CONSTRAINT "testinferencia_id_evaluacion_evaluacion_id_evaluacion_fk" FOREIGN KEY ("id_evaluacion") REFERENCES "public"."evaluacion"("id_evaluacion") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "testobtencioninfo" ADD CONSTRAINT "testobtencioninfo_id_evaluacion_evaluacion_id_evaluacion_fk" FOREIGN KEY ("id_evaluacion") REFERENCES "public"."evaluacion"("id_evaluacion") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "testreflexion" ADD CONSTRAINT "testreflexion_id_evaluacion_evaluacion_id_evaluacion_fk" FOREIGN KEY ("id_evaluacion") REFERENCES "public"."evaluacion"("id_evaluacion") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
