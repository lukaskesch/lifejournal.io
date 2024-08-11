import { mysqlTable, mysqlSchema, AnyMySqlColumn, foreignKey, primaryKey, char, text, datetime, int, unique, varchar } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const user_tags = mysqlTable("user_tags", {
	id: char("id", { length: 36 }).notNull(),
	user_id: char("user_id", { length: 36 }).notNull().references(() => users.id),
	name: text("name").notNull(),
},
(table) => {
	return {
		user_tags_id: primaryKey({ columns: [table.id], name: "user_tags_id"}),
	}
});

export const user_time_log = mysqlTable("user_time_log", {
	id: char("id", { length: 36 }).notNull(),
	user_id: char("user_id", { length: 36 }).notNull().references(() => users.id),
	start_time: datetime("start_time", { mode: 'string'}),
	end_time: datetime("end_time", { mode: 'string'}),
	duration_minutes: int("duration_minutes").notNull(),
	description: text("description").notNull(),
},
(table) => {
	return {
		user_time_log_id: primaryKey({ columns: [table.id], name: "user_time_log_id"}),
	}
});

export const user_time_log_has_tag = mysqlTable("user_time_log_has_tag", {
	id: char("id", { length: 36 }).notNull(),
	user_time_log_id: char("user_time_log_id", { length: 36 }).notNull().references(() => user_time_log.id),
	tag_id: char("tag_id", { length: 36 }).notNull().references(() => user_tags.id),
},
(table) => {
	return {
		user_time_log_has_tag_id: primaryKey({ columns: [table.id], name: "user_time_log_has_tag_id"}),
	}
});

export const users = mysqlTable("users", {
	id: char("id", { length: 36 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	password: text("password").notNull(),
},
(table) => {
	return {
		users_id: primaryKey({ columns: [table.id], name: "users_id"}),
		email: unique("email").on(table.email),
	}
});