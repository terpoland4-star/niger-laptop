CREATE TABLE `admins` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'editor' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_email_unique` ON `admins` (`email`);--> statement-breakpoint
CREATE TABLE `order_status_history` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`status` text NOT NULL,
	`note` text,
	`changed_by` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product_history` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`action` text NOT NULL,
	`changes_json` text,
	`admin_id` text NOT NULL,
	`created_at` text NOT NULL
);
