import { users, userTags, userTimeLog } from "./schema";

export type UserSelect = typeof users.$inferSelect;
export type UserTagSelect = typeof userTags.$inferSelect;
export type UserTimeLogSelect = typeof userTimeLog.$inferSelect;

export type UserInsert = typeof users.$inferInsert;
export type TagInsert = typeof userTags.$inferInsert;
export type TimeLogInsert = typeof userTimeLog.$inferInsert;
