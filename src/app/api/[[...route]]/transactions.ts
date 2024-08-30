import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import {
  transactions,
  insertTransactionSchema,
  categories,
  accounts,
} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { subDays, parse } from "date-fns";
// import { HTTPException } from "hono/http-exception";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { from, to, accountId } = c.req.valid("query");

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      // Handle invalid dates
      try {
        const startDate = from
          ? parse(from, "yyyy-MM-dd", new Date())
          : defaultFrom;
        const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

        // Error handling for date parsing
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return c.json({ error: "Invalid date format" }, 400);
        }

        // Select only required columns
        const data = await db
          .select({
            id: transactions.id,
            date: transactions.date,
            category: categories.name,
            categoryId: transactions.categoriesId,
            payee: transactions.payee,
            amount: transactions.amount,
            note: transactions.notes,
            account: accounts.name,
            accountId: transactions.accountsId,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountsId, accounts.id))
          .leftJoin(categories, eq(transactions.categoriesId, categories.id))
          .where(
            and(
              accountId ? eq(transactions.accountsId, accountId) : undefined,
              eq(accounts.userId, auth.userId),
              gte(transactions.date, startDate),
              lte(transactions.date, endDate)
            )
          )
          .orderBy(desc(transactions.date));

        return c.json({ data });
      } catch (error) {
        console.error("Error parsing date:", error);
        return c.json({ error: "Invalid date format" }, 400);
      }
    }
  )
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        c.json({ error: "UnAuthorized" }, 401);
      }

      const userId = auth?.userId as string;

      try {
        const [data] = await db
          .select({
            id: transactions.id,
            date: transactions.date,

            categoryId: transactions.categoriesId,
            payee: transactions.payee,
            amount: transactions.amount,
            note: transactions.notes,
            accountId: transactions.accountsId,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountsId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, userId)));

        if (!data) {
          return c.json({ error: "not found" }, 404);
        }

        return c.json({ data });
      } catch (error) {
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertTransactionSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const [data] = await db
          .insert(transactions)
          .values({
            id: createId(),
            ...values,
          })
          .returning();

        return c.json({ data });
      } catch (error) {
        return c.json({ error: "Failed to insert transaction" }, 500);
      }
    }
  )
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        transactions: z.array(
          insertTransactionSchema.omit({
            id: true,
          })
        ),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const data = await db
        .insert(transactions)
        .values(
          values.transactions.map((value) => ({
            id: createId(),
            ...value,
          }))
        )
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      try {
        const transactionsToDelete = db.$with("traansactions_to_delete").as(
          db
            .select({
              id: transactions.id,
            })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountsId, accounts.id))
            .where(
              and(
                inArray(transactions.id, values.ids),
                eq(accounts.userId, auth.userId)
              )
            )
        );

        const data = await db
          .with(transactionsToDelete)
          .delete(transactions)
          .where(
            and(
              inArray(
                transactions.id,
                sql`(select id from $(transactionsToDelete))`
              )
            )
          )
          .returning({
            id: transactions.id,
          });

        return c.json({ data });
      } catch (error) {
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      "json",
      insertTransactionSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const transactionsToUpdate = db.$with("traansactions_to_delete").as(
          db
            .select({
              id: transactions.id,
            })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountsId, accounts.id))
            .where(
              and(eq(transactions.id, id), eq(accounts.userId, auth.userId))
            )
        );

        const [data] = await db
          .with(transactionsToUpdate)
          .update(transactions)
          .set(values)
          .where(
            and(
              inArray(
                transactions.id,
                sql`(select id from $(transactionsToUpdate))`
              )
            )
          )
          .returning();

        if (!data) {
          return c.json({ error: "not found" }, 404);
        }

        return c.json({ data });
      } catch (error) {
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const transactionToDelete = db.$with("traansaction_to_delete").as(
          db
            .select({
              id: transactions.id,
            })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountsId, accounts.id))
            .where(
              and(eq(transactions.id, id), eq(accounts.userId, auth.userId))
            )
        );

        const [data] = await db
          .with(transactionToDelete)
          .delete(transactions)
          .where(
            and(
              inArray(
                transactions.id,
                sql`(select id from $(transactionToDelete))`
              )
            )
          )
          .returning({
            id: transactions.id,
          });

        if (!data) {
          return c.json({ error: "not found" }, 404);
        }

        return c.json({ data });
      } catch (error) {
        return c.json({ error: "Internal server error to delete" }, 500);
      }
    }
  );

export default app;
