import {
  mysqlTable,
  primaryKey,
  char,
  text,
  datetime,
  int,
  boolean,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";
import { InferModel, sql } from "drizzle-orm";
import {} from "drizzle-orm/mysql-core";
import type { AdapterAccount } from "next-auth/adapters";

export const user_tags = mysqlTable(
  "user_tags",
  {
    id: char("id", { length: 36 }).notNull(),
    user_id: char("user_id", { length: 36 })
      .notNull()
      .references(() => users.id),
    name: text("name").notNull(),
  },
  (table) => {
    return {
      user_tags_id: primaryKey({ columns: [table.id], name: "user_tags_id" }),
    };
  },
);

export type UserTags = InferModel<typeof user_tags>;

export const user_time_log = mysqlTable(
  "user_time_log",
  {
    id: char("id", { length: 36 }).notNull(),
    user_id: char("user_id", { length: 36 })
      .notNull()
      .references(() => users.id),
    start_time: datetime("start_time", { mode: "string" }),
    end_time: datetime("end_time", { mode: "string" }),
    duration_minutes: int("duration_minutes").notNull(),
    description: text("description").notNull(),
  },
  (table) => {
    return {
      user_time_log_id: primaryKey({
        columns: [table.id],
        name: "user_time_log_id",
      }),
    };
  },
);

export type UserTimeLog = InferModel<typeof user_time_log>;

export const user_time_log_has_tag = mysqlTable(
  "user_time_log_has_tag",
  {
    id: char("id", { length: 36 }).notNull(),
    user_time_log_id: char("user_time_log_id", { length: 36 })
      .notNull()
      .references(() => user_time_log.id),
    tag_id: char("tag_id", { length: 36 })
      .notNull()
      .references(() => user_tags.id),
  },
  (table) => {
    return {
      user_time_log_has_tag_id: primaryKey({
        columns: [table.id],
        name: "user_time_log_has_tag_id",
      }),
    };
  },
);

export type UserTimeLogHasTag = InferModel<typeof user_time_log_has_tag>;

export const users = mysqlTable(
  "users",
  {
    id: char("id", { length: 36 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    password: text("password").notNull(),
    name: varchar("name", { length: 255 }),
    emailVerified: timestamp("emailVerified", {
      mode: "date",
      fsp: 3,
    }),
    image: varchar("image", { length: 255 }),
  },
  (table) => {
    return {
      users_id: primaryKey({ columns: [table.id], name: "users_id" }),
      email: unique("email").on(table.email),
    };
  },
);

export type User = InferModel<typeof users>;

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).$type<AdapterAccount>().notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 2048 }),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = mysqlTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const authenticators = mysqlTable(
  "authenticator",
  {
    credentialID: varchar("credentialID", { length: 255 }).notNull().unique(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    credentialPublicKey: varchar("credentialPublicKey", {
      length: 255,
    }).notNull(),
    counter: int("counter").notNull(),
    credentialDeviceType: varchar("credentialDeviceType", {
      length: 255,
    }).notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: varchar("transports", { length: 255 }),
  },
  (authenticator) => ({
    compositePk: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);
