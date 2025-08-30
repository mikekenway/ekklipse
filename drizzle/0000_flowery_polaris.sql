CREATE TABLE "snippets" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(21) NOT NULL,
	"name" varchar(255) NOT NULL,
	"language" varchar(50) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
