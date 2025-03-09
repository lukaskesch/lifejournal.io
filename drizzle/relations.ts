import { relations } from "drizzle-orm/relations";
import {
  userPrompt,
  promptAnswer,
  users,
  userTags,
  userTimeLog,
  userTimeLogHasTag,
} from "../src/types/schema";

export const promptAnswerRelations = relations(promptAnswer, ({ one }) => ({
  userPrompt: one(userPrompt, {
    fields: [promptAnswer.promptId],
    references: [userPrompt.id],
  }),
}));

export const userPromptRelations = relations(userPrompt, ({ one, many }) => ({
  promptAnswers: many(promptAnswer),
  user: one(users, {
    fields: [userPrompt.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  userPrompts: many(userPrompt),
  userTags_userId: many(userTags, {
    relationName: "userTags_userId_users_id",
  }),
  userTags_userId: many(userTags, {
    relationName: "userTags_userId_users_id",
  }),
  userTimeLogs_userId: many(userTimeLog, {
    relationName: "userTimeLog_userId_users_id",
  }),
  userTimeLogs_userId: many(userTimeLog, {
    relationName: "userTimeLog_userId_users_id",
  }),
}));

export const userTagsRelations = relations(userTags, ({ one, many }) => ({
  user_userId: one(users, {
    fields: [userTags.userId],
    references: [users.id],
    relationName: "userTags_userId_users_id",
  }),
  user_userId: one(users, {
    fields: [userTags.userId],
    references: [users.id],
    relationName: "userTags_userId_users_id",
  }),
  userTimeLogHasTags_tagId: many(userTimeLogHasTag, {
    relationName: "userTimeLogHasTag_tagId_userTags_id",
  }),
  userTimeLogHasTags_tagId: many(userTimeLogHasTag, {
    relationName: "userTimeLogHasTag_tagId_userTags_id",
  }),
  userTimeLogHasTags_tagId: many(userTimeLogHasTag, {
    relationName: "userTimeLogHasTag_tagId_userTags_id",
  }),
}));

export const userTimeLogRelations = relations(userTimeLog, ({ one, many }) => ({
  user_userId: one(users, {
    fields: [userTimeLog.userId],
    references: [users.id],
    relationName: "userTimeLog_userId_users_id",
  }),
  user_userId: one(users, {
    fields: [userTimeLog.userId],
    references: [users.id],
    relationName: "userTimeLog_userId_users_id",
  }),
  userTimeLogHasTags_userTimeLogId: many(userTimeLogHasTag, {
    relationName: "userTimeLogHasTag_userTimeLogId_userTimeLog_id",
  }),
  userTimeLogHasTags_userTimeLogId: many(userTimeLogHasTag, {
    relationName: "userTimeLogHasTag_userTimeLogId_userTimeLog_id",
  }),
  userTimeLogHasTags_userTimeLogId: many(userTimeLogHasTag, {
    relationName: "userTimeLogHasTag_userTimeLogId_userTimeLog_id",
  }),
}));

export const userTimeLogHasTagRelations = relations(
  userTimeLogHasTag,
  ({ one }) => ({
    userTag_tagId: one(userTags, {
      fields: [userTimeLogHasTag.tagId],
      references: [userTags.id],
      relationName: "userTimeLogHasTag_tagId_userTags_id",
    }),
    userTimeLog_userTimeLogId: one(userTimeLog, {
      fields: [userTimeLogHasTag.userTimeLogId],
      references: [userTimeLog.id],
      relationName: "userTimeLogHasTag_userTimeLogId_userTimeLog_id",
    }),
    userTag_tagId: one(userTags, {
      fields: [userTimeLogHasTag.tagId],
      references: [userTags.id],
      relationName: "userTimeLogHasTag_tagId_userTags_id",
    }),
    userTag_tagId: one(userTags, {
      fields: [userTimeLogHasTag.tagId],
      references: [userTags.id],
      relationName: "userTimeLogHasTag_tagId_userTags_id",
    }),
    userTimeLog_userTimeLogId: one(userTimeLog, {
      fields: [userTimeLogHasTag.userTimeLogId],
      references: [userTimeLog.id],
      relationName: "userTimeLogHasTag_userTimeLogId_userTimeLog_id",
    }),
    userTimeLog_userTimeLogId: one(userTimeLog, {
      fields: [userTimeLogHasTag.userTimeLogId],
      references: [userTimeLog.id],
      relationName: "userTimeLogHasTag_userTimeLogId_userTimeLog_id",
    }),
  })
);
