import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, foreignKey, primaryKey, char, varchar, text, mysqlEnum, int, tinyint, datetime, date, unique } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const habit = mysqlTable("habit", {
	id: char({ length: 36 }).notNull(),
	userId: char("user_id", { length: 36 }).notNull().references(() => users.id),
	tagId: char("tag_id", { length: 36 }).references(() => userTags.id, { onDelete: "set null" } ),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	periodUnit: mysqlEnum("period_unit", ['day','week','month']).default('day').notNull(),
	targetCount: int("target_count").default(1).notNull(),
	daysOfWeekMask: tinyint("days_of_week_mask", { unsigned: true }),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	index("habit_tag_idx").on(table.tagId),
	index("habit_user_idx").on(table.userId),
	primaryKey({ columns: [table.id], name: "habit_id"}),
]);

export const habitCheck = mysqlTable("habit_check", {
	id: char({ length: 36 }).notNull(),
	habitId: char("habit_id", { length: 36 }).notNull().references(() => habit.id, { onDelete: "cascade" } ),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	datetime: date({ mode: 'string' }).notNull(),
	note: text(),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	index("habit_check_habit_idx").on(table.habitId),
]);

export const promptAnswer = mysqlTable("prompt_answer", {
	id: char({ length: 36 }).notNull(),
	promptId: char("prompt_id", { length: 36 }).notNull().references(() => userPrompt.id),
	answer: text().notNull(),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "prompt_answer_id"}),
]);

export const userPrompt = mysqlTable("user_prompt", {
	id: char({ length: 36 }).notNull(),
	userId: char("user_id", { length: 36 }).notNull().references(() => users.id),
	prompt: varchar({ length: 2048 }).notNull(),
	frequency: mysqlEnum(['daily','weekly','monthly','quarterly','yearly']).default('daily').notNull(),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "user_prompt_id"}),
]);

export const userTags = mysqlTable("user_tags", {
	id: char({ length: 36 }).notNull(),
	userId: char("user_id", { length: 36 }).notNull().references(() => users.id).references(() => users.id),
	name: text().notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "user_tags_id"}),
]);

export const userTimeLog = mysqlTable("user_time_log", {
	id: char({ length: 36 }).notNull(),
	userId: char("user_id", { length: 36 }).notNull().references(() => users.id).references(() => users.id),
	startTime: datetime("start_time", { mode: 'string'}),
	endTime: datetime("end_time", { mode: 'string'}),
	durationMinutes: int("duration_minutes").notNull(),
	description: text().notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "user_time_log_id"}),
]);

export const userTimeLogHasTag = mysqlTable("user_time_log_has_tag", {
	id: char({ length: 36 }).notNull(),
	userTimeLogId: char("user_time_log_id", { length: 36 }).notNull().references(() => userTimeLog.id, { onDelete: "cascade" } ).references(() => userTimeLog.id).references(() => userTimeLog.id),
	tagId: char("tag_id", { length: 36 }).notNull().references(() => userTags.id, { onDelete: "cascade" } ).references(() => userTags.id).references(() => userTags.id),
},
(table) => [
	primaryKey({ columns: [table.id], name: "user_time_log_has_tag_id"}),
]);

export const users = mysqlTable("users", {
	id: char({ length: 36 }).notNull(),
	googleUserId: varchar("google_user_id", { length: 255 }),
	email: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }),
	image: varchar({ length: 255 }),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "users_id"}),
	unique("email").on(table.email),
]);
