ALTER TABLE "transactions" RENAME COLUMN "accounts_id" TO "account_id";--> statement-breakpoint
ALTER TABLE "transactions" RENAME COLUMN "categories_id" TO "category_id";--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_accounts_id_accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_categories_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "updated_at" timestamp DEFAULT current_timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
