# This file contains the SQL schema for the database tables.
# Uses MySQL syntax.

create table `users` (
  `id` uuid not null primary key default uuid_generate_v4(),
  `email` text not null unique,
  `password` text not null,
);

create table `user_time_log` (
  `id` uuid not null primary key default uuid_generate_v4(),
  `user_id` uuid not null references `users` (`id`),
  `start_time` datetime,
  `end_time` datetime,
  `duration_minutes` int not null
  `description` text not null
);

create table `user_tags` (
  `id` uuid not null primary key default uuid_generate_v4(),
  `user_id` uuid not null references `users` (`id`),
  `name` text not null
);

create table `user_time_log_has_tag` (
  `id` uuid not null primary key default uuid_generate_v4(),
  `user_time_log_id` uuid not null references `user_time_log` (`id`),
  `tag_id` uuid not null references `tags` (`id`)
);

