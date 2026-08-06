ALTER TABLE `orders` ADD `is_paid` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `orders` ADD `paid_at` text;
