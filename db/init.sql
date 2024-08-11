# This file contains the SQL schema for the database tables.
# Uses MySQL syntax.

create table `users` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `email` varchar(255) not null unique,
  `password` text not null
);

create table `user_time_log` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `user_id` CHAR(36) not null,
  `start_time` datetime,
  `end_time` datetime,
  `duration_minutes` int not null,
  `description` text not null,
  constraint `user_id_constraint` foreign key (`user_id`) references `users` (`id`)
);

create table `user_tags` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `user_id` CHAR(36) not null references `users` (`id`),
  `name` text not null,
  constraint `user_tags_user_id_constraint` foreign key (`user_id`) references `users` (`id`)
);

create table `user_time_log_has_tag` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `user_time_log_id` CHAR(36) not null, 
  `tag_id` CHAR(36) not null references `tags` (`id`),
  constraint `user_time_log_has_tag_user_time_log_id_constraint` foreign key (`user_time_log_id`) references `user_time_log` (`id`),
  constraint `user_time_log_has_tag_tag_id_constraint` foreign key (`tag_id`) references `user_tags` (`id`)
);

