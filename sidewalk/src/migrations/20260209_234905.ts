import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_clients_products_category" AS ENUM('website', 'posters', 'logos', 'branding', 'social-media', 'print-design', 'web-development', 'consulting', 'other');
  CREATE TYPE "public"."enum_ongoing_expenses_frequency" AS ENUM('weekly', 'monthly', 'yearly');
  CREATE TABLE "ongoing_expenses" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"amount" numeric NOT NULL,
  	"frequency" "enum_ongoing_expenses_frequency" DEFAULT 'monthly' NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"next_due_date" timestamp(3) with time zone,
  	"category" varchar,
  	"notes" varchar,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "clients" DROP CONSTRAINT "clients_icon_id_media_id_fk";
  
  DROP INDEX "clients_icon_idx";
  ALTER TABLE "clients_products" ADD COLUMN "category" "enum_clients_products_category";
  ALTER TABLE "clients_products" ADD COLUMN "start_date" timestamp(3) with time zone;
  ALTER TABLE "clients_products" ADD COLUMN "end_date" timestamp(3) with time zone;
  ALTER TABLE "clients" ADD COLUMN "icon" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ongoing_expenses_id" varchar;
  CREATE INDEX "ongoing_expenses_updated_at_idx" ON "ongoing_expenses" USING btree ("updated_at");
  CREATE INDEX "ongoing_expenses_created_at_idx" ON "ongoing_expenses" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ongoing_expenses_fk" FOREIGN KEY ("ongoing_expenses_id") REFERENCES "public"."ongoing_expenses"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_ongoing_expenses_id_idx" ON "payload_locked_documents_rels" USING btree ("ongoing_expenses_id");
  ALTER TABLE "clients" DROP COLUMN "icon_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ongoing_expenses" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "ongoing_expenses" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ongoing_expenses_fk";
  
  DROP INDEX "payload_locked_documents_rels_ongoing_expenses_id_idx";
  ALTER TABLE "clients" ADD COLUMN "icon_id" integer;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "clients_icon_idx" ON "clients" USING btree ("icon_id");
  ALTER TABLE "clients_products" DROP COLUMN "category";
  ALTER TABLE "clients_products" DROP COLUMN "start_date";
  ALTER TABLE "clients_products" DROP COLUMN "end_date";
  ALTER TABLE "clients" DROP COLUMN "icon";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ongoing_expenses_id";
  DROP TYPE "public"."enum_clients_products_category";
  DROP TYPE "public"."enum_ongoing_expenses_frequency";`)
}
