import { relations, sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ many }) => ({
  scores: many(scores),
}));

export const scores = sqliteTable("scores", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  score: integer("score").notNull().unique(),
  difficulty: text("difficulty", {
    enum: ["easy", "Medium", "Hard"],
  }).notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  userId: integer("user_id").references(() => users.id),
});

export const scoresRelations = relations(scores, ({ one }) => ({
  author: one(users, {
    fields: [scores.userId],
    references: [users.id],
  }),
}));
