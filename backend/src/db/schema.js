import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
  "ALLOWED",
  "PROHIBITED",
  "CONDITIONAL",
]);

//First Table: items with columns: id, name, category
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 100 }),
});

//Second Table: items aliases will be set up
export const itemAliases = pgTable("item_aliases", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id, {
      onDelete: "cascade",
    }),
  alias: varchar("alias", {
    length: 255,
  })
    .notNull()
    .unique(),
});

//Third Table: rules with columns: id, itemId, status, reason, conditions
export const rules = pgTable("rules", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").references(() => items.id, {
    onDelete: "cascade",
  }),
  status: statusEnum("status").notNull(),
  reason: text("reason"),
  conditions: text("conditions"),
});
