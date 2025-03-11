import { promptAnswer, userPrompt, users, userTags, userTimeLog } from "./schema";

export type UserSelect = typeof users.$inferSelect;
export type UserTagSelect = typeof userTags.$inferSelect;
export type UserTimeLogSelect = typeof userTimeLog.$inferSelect;
export type PromptAnswerSelect = typeof promptAnswer.$inferSelect;
export type UserPromptSelect = typeof userPrompt.$inferSelect;

export type UserInsert = typeof users.$inferInsert;
export type TagInsert = typeof userTags.$inferInsert;
export type TimeLogInsert = typeof userTimeLog.$inferInsert;
export type PromptAnswerInsert = typeof promptAnswer.$inferInsert;
export type UserPromptInsert = typeof userPrompt.$inferInsert;
