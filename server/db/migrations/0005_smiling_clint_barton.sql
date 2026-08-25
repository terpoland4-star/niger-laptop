CREATE TABLE `nita_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text,
	`request_id` text NOT NULL,
	`code_achat` text,
	`montant` integer NOT NULL,
	`status` text DEFAULT '0' NOT NULL,
	`phone_client` text NOT NULL,
	`adresse_ip` text,
	`description_achat` text,
	`raw_response` text,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `nita_transactions_request_id_unique` ON `nita_transactions` (`request_id`);