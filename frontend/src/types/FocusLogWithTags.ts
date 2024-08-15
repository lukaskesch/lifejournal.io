import { UserTimeLog, UserTags } from "../../drizzle/schema";

export type FocusLogWithTags = UserTimeLog & {
  tags: UserTags[];
};
