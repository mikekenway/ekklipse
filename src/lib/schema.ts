import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const snippets = pgTable("snippets", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 21 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  language: varchar("language", { length: 50 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
