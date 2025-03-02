import { UserTimeLogSelect, UserTagSelect } from "./database-types";

export type FocusLogWithTags = UserTimeLogSelect & {
  tags: UserTagSelect[];
};
