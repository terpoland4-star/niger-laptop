CREATE TABLE `agent_locations` (
	`agent_id` text PRIMARY KEY NOT NULL,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `deliveries` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`agent_id` text NOT NULL,
	`status` text DEFAULT 'assigned' NOT NULL,
	`started_at` text,
	`delivered_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `delivery_agents` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`active` integer DEFAULT true,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `delivery_agents_email_unique` ON `delivery_agents` (`email`);--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text DEFAULT 'charge' NOT NULL,
	`category` text NOT NULL,
	`label` text NOT NULL,
	`amount` integer NOT NULL,
	`date` text NOT NULL,
	`note` text,
	`created_by` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`supplier_id` text,
	`quantity` integer NOT NULL,
	`unit_cost` integer NOT NULL,
	`total_cost` integer NOT NULL,
	`date` text NOT NULL,
	`note` text,
	`created_by` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text,
	`note` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `orders` ADD `channel` text DEFAULT 'site' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `cost_price` integer;