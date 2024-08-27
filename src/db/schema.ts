import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export const transactions = pgTable("transactions", {
  id: text("id"),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountsId: text("accounts_id")
    .references(() => accounts.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoriesId: text("categories_id").references(() => categories.id, {
    onDelete: "set null",
  }),
});

export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  accounts: one(accounts, {
    fields: [transactions.accountsId],
    references: [accounts.id],
  }),
  categories: one(categories, {
    fields: [transactions.categoriesId],
    references: [categories.id],
  }),
}));

export const insertAccountsSchema = createInsertSchema(accounts);
export const insertCategoriesSchema = createInsertSchema(categories);
export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});
