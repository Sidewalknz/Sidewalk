import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_addresses_type" AS ENUM('shipping', 'billing', 'both');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'user');
  CREATE TYPE "public"."enum_users_status" AS ENUM('active', 'suspended');
  CREATE TYPE "public"."enum_outgoings_frequency" AS ENUM('weekly', 'monthly', 'yearly');
  CREATE TYPE "public"."enum_outgoings_status" AS ENUM('active', 'paused', 'ended');
  CREATE TYPE "public"."enum_portfolio_items_card_text_tone" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum_portfolio_items_client_status" AS ENUM('lead', 'active', 'paused', 'complete', 'archived');
  CREATE TYPE "public"."enum_portfolio_items_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"type" "enum_users_addresses_type" DEFAULT 'shipping' NOT NULL,
  	"line1" varchar NOT NULL,
  	"line2" varchar,
  	"city" varchar NOT NULL,
  	"state" varchar,
  	"postal_code" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"is_default" boolean DEFAULT false
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'user' NOT NULL,
  	"status" "enum_users_status" DEFAULT 'active' NOT NULL,
  	"phone" varchar,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "outgoings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"amount" numeric NOT NULL,
  	"frequency" "enum_outgoings_frequency" DEFAULT 'monthly' NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"category" varchar,
  	"admin_notes" varchar,
  	"status" "enum_outgoings_status" DEFAULT 'active' NOT NULL,
  	"end_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "portfolio_items_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "portfolio_items_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service" varchar
  );
  
  CREATE TABLE "portfolio_items_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar
  );
  
  CREATE TABLE "portfolio_items_constraints" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"constraint" varchar
  );
  
  CREATE TABLE "portfolio_items_jobs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category" varchar,
  	"job_name" varchar,
  	"description" varchar,
  	"price" numeric,
  	"monthly_fee" numeric,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone
  );
  
  CREATE TABLE "portfolio_items_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"email" varchar
  );
  
  CREATE TABLE "portfolio_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"short_description" varchar,
  	"overview" varchar,
  	"project_details" varchar,
  	"challenge" varchar,
  	"solution" varchar,
  	"outcome" varchar,
  	"logo_id" integer,
  	"logo_url" varchar,
  	"background_media_id" integer,
  	"background_media_alt" varchar,
  	"card_text_tone" "enum_portfolio_items_card_text_tone" DEFAULT 'light',
  	"foreground_media_id" integer,
  	"foreground_media_alt" varchar,
  	"featured_image_id" integer,
  	"featured_image_alt" varchar,
  	"client_company" varchar,
  	"website_url" varchar,
  	"owner_name" varchar,
  	"owner_email" varchar,
  	"contact_name" varchar,
  	"contact_email" varchar,
  	"industry" varchar,
  	"location" varchar,
  	"project_type" varchar,
  	"completion_date" timestamp(3) with time zone,
  	"testimonial_name" varchar,
  	"testimonial_message" varchar,
  	"testimonial_rating" numeric DEFAULT 5,
  	"testimonial_image_id" integer,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_meta_image_id" integer,
  	"slug" varchar NOT NULL,
  	"client_status" "enum_portfolio_items_client_status" DEFAULT 'active',
  	"status" "enum_portfolio_items_status" DEFAULT 'draft',
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"is_featured_on_homepage" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"outgoings_id" integer,
  	"portfolio_items_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_addresses" ADD CONSTRAINT "users_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_items_gallery" ADD CONSTRAINT "portfolio_items_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_items_gallery" ADD CONSTRAINT "portfolio_items_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_items_services" ADD CONSTRAINT "portfolio_items_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_items_features" ADD CONSTRAINT "portfolio_items_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_items_constraints" ADD CONSTRAINT "portfolio_items_constraints_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_items_jobs" ADD CONSTRAINT "portfolio_items_jobs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_items_team_members" ADD CONSTRAINT "portfolio_items_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_background_media_id_media_id_fk" FOREIGN KEY ("background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_foreground_media_id_media_id_fk" FOREIGN KEY ("foreground_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_testimonial_image_id_media_id_fk" FOREIGN KEY ("testimonial_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_seo_meta_image_id_media_id_fk" FOREIGN KEY ("seo_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_outgoings_fk" FOREIGN KEY ("outgoings_id") REFERENCES "public"."outgoings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_items_fk" FOREIGN KEY ("portfolio_items_id") REFERENCES "public"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_addresses_order_idx" ON "users_addresses" USING btree ("_order");
  CREATE INDEX "users_addresses_parent_id_idx" ON "users_addresses" USING btree ("_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "outgoings_updated_at_idx" ON "outgoings" USING btree ("updated_at");
  CREATE INDEX "outgoings_created_at_idx" ON "outgoings" USING btree ("created_at");
  CREATE INDEX "portfolio_items_gallery_order_idx" ON "portfolio_items_gallery" USING btree ("_order");
  CREATE INDEX "portfolio_items_gallery_parent_id_idx" ON "portfolio_items_gallery" USING btree ("_parent_id");
  CREATE INDEX "portfolio_items_gallery_image_idx" ON "portfolio_items_gallery" USING btree ("image_id");
  CREATE INDEX "portfolio_items_services_order_idx" ON "portfolio_items_services" USING btree ("_order");
  CREATE INDEX "portfolio_items_services_parent_id_idx" ON "portfolio_items_services" USING btree ("_parent_id");
  CREATE INDEX "portfolio_items_features_order_idx" ON "portfolio_items_features" USING btree ("_order");
  CREATE INDEX "portfolio_items_features_parent_id_idx" ON "portfolio_items_features" USING btree ("_parent_id");
  CREATE INDEX "portfolio_items_constraints_order_idx" ON "portfolio_items_constraints" USING btree ("_order");
  CREATE INDEX "portfolio_items_constraints_parent_id_idx" ON "portfolio_items_constraints" USING btree ("_parent_id");
  CREATE INDEX "portfolio_items_jobs_order_idx" ON "portfolio_items_jobs" USING btree ("_order");
  CREATE INDEX "portfolio_items_jobs_parent_id_idx" ON "portfolio_items_jobs" USING btree ("_parent_id");
  CREATE INDEX "portfolio_items_team_members_order_idx" ON "portfolio_items_team_members" USING btree ("_order");
  CREATE INDEX "portfolio_items_team_members_parent_id_idx" ON "portfolio_items_team_members" USING btree ("_parent_id");
  CREATE INDEX "portfolio_items_logo_idx" ON "portfolio_items" USING btree ("logo_id");
  CREATE INDEX "portfolio_items_background_media_idx" ON "portfolio_items" USING btree ("background_media_id");
  CREATE INDEX "portfolio_items_foreground_media_idx" ON "portfolio_items" USING btree ("foreground_media_id");
  CREATE INDEX "portfolio_items_featured_image_idx" ON "portfolio_items" USING btree ("featured_image_id");
  CREATE INDEX "portfolio_items_testimonial_testimonial_image_idx" ON "portfolio_items" USING btree ("testimonial_image_id");
  CREATE INDEX "portfolio_items_seo_seo_meta_image_idx" ON "portfolio_items" USING btree ("seo_meta_image_id");
  CREATE UNIQUE INDEX "portfolio_items_slug_idx" ON "portfolio_items" USING btree ("slug");
  CREATE INDEX "portfolio_items_updated_at_idx" ON "portfolio_items" USING btree ("updated_at");
  CREATE INDEX "portfolio_items_created_at_idx" ON "portfolio_items" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_outgoings_id_idx" ON "payload_locked_documents_rels" USING btree ("outgoings_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_items_id_idx" ON "payload_locked_documents_rels" USING btree ("portfolio_items_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_addresses" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "outgoings" CASCADE;
  DROP TABLE "portfolio_items_gallery" CASCADE;
  DROP TABLE "portfolio_items_services" CASCADE;
  DROP TABLE "portfolio_items_features" CASCADE;
  DROP TABLE "portfolio_items_constraints" CASCADE;
  DROP TABLE "portfolio_items_jobs" CASCADE;
  DROP TABLE "portfolio_items_team_members" CASCADE;
  DROP TABLE "portfolio_items" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_addresses_type";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_users_status";
  DROP TYPE "public"."enum_outgoings_frequency";
  DROP TYPE "public"."enum_outgoings_status";
  DROP TYPE "public"."enum_portfolio_items_card_text_tone";
  DROP TYPE "public"."enum_portfolio_items_client_status";
  DROP TYPE "public"."enum_portfolio_items_status";`)
}
