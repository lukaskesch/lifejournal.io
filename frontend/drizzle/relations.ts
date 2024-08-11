import { relations } from "drizzle-orm/relations";
import { users, user_tags, user_time_log, user_time_log_has_tag } from "./schema";

export const user_tagsRelations = relations(user_tags, ({one, many}) => ({
	user: one(users, {
		fields: [user_tags.user_id],
		references: [users.id]
	}),
	user_time_log_has_tags: many(user_time_log_has_tag),
}));

export const usersRelations = relations(users, ({many}) => ({
	user_tags: many(user_tags),
	user_time_logs: many(user_time_log),
}));

export const user_time_logRelations = relations(user_time_log, ({one, many}) => ({
	user: one(users, {
		fields: [user_time_log.user_id],
		references: [users.id]
	}),
	user_time_log_has_tags: many(user_time_log_has_tag),
}));

export const user_time_log_has_tagRelations = relations(user_time_log_has_tag, ({one}) => ({
	user_tag: one(user_tags, {
		fields: [user_time_log_has_tag.tag_id],
		references: [user_tags.id]
	}),
	user_time_log: one(user_time_log, {
		fields: [user_time_log_has_tag.user_time_log_id],
		references: [user_time_log.id]
	}),
}));