-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `user_tags` (
	`id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`name` text NOT NULL,
	CONSTRAINT `user_tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_time_log` (
	`id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`start_time` datetime,
	`end_time` datetime,
	`duration_minutes` int NOT NULL,
	`description` text NOT NULL,
	CONSTRAINT `user_time_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_time_log_has_tag` (
	`id` char(36) NOT NULL,
	`user_time_log_id` char(36) NOT NULL,
	`tag_id` char(36) NOT NULL,
	CONSTRAINT `user_time_log_has_tag_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` char(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` text NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `email` UNIQUE(`email`)
);

*/