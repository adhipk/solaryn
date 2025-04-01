// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `solaryn_${name}`);


export const users = createTable(
  "user",
  (d) => ({
    id: d.text("user_id").primaryKey(),
    name: d.text("name").notNull(),
    likes: d.integer("likes").default(0).notNull(),
    isVerified: d.boolean("is_verified").default(false).notNull(),
    openForProject: d.boolean("open_for_project").default(false).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const content = createTable(
  "content",
  (d) => ({
    id: d.integer("id").primaryKey().generatedByDefaultAsIdentity(),
    title: d.text("title").notNull(),
    image: d.text("image").notNull(),
    details: d.jsonb("details").notNull(),
    userId: d.text("user_id").references(() => users.id).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("title_idx").on(t.title)],
);
