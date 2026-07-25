CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`order_number` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_phone` text NOT NULL,
	`delivery_address` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`total` integer NOT NULL,
	`items_json` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name_fr` text NOT NULL,
	`name_en` text NOT NULL,
	`category` text NOT NULL,
	`condition` text NOT NULL,
	`price` integer,
	`old_price` integer,
	`thumbnail` text,
	`featured` integer DEFAULT false,
	`rating` real,
	`description_fr` text,
	`description_en` text,
	`stock_quantity` integer DEFAULT 0
);
