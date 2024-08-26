import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { categories, insertCategoriesSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

// import { HTTPException } from "hono/http-exception";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    // Retrieve authenticated user information using Clerk middleware
    const auth = getAuth(c);

    // Check if user is authenticated
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
      // throw new HTTPException(401, {
      //   res: c.json(
      //     {
      //       error: "Unauthorize",
      //     },
      //     401
      //   ),
      // });
    }

    try {
      // Build a query to fetch user data from `accounts` table with Drizzle ORM
      const data = await db
        .select({
          id: categories.id, // Select user ID
          name: categories.name, // Select user name
        })
        .from(categories)
        .where(eq(categories.userId, auth.userId)); // Filter by authenticated user ID

      // Return retrieved user data in JSON format
      return c.json({ data });
    } catch (error) {
      // Handle unexpected errors during data retrieval (optional, consider specific error handling)
      console.error("Error retrieving user data:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
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

      const [data] = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(and(eq(categories.userId, userId), eq(categories.id, id)));

      if (!data) {
        return c.json({ error: "not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertCategoriesSchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .insert(categories)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
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

      const data = await db
        .delete(categories)
        .where(
          and(
            eq(categories.userId, auth.userId),
            inArray(categories.id, values.ids)
          )
        )
        .returning({
          id: categories.id,
        });

      return c.json({ data });
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
      insertCategoriesSchema.pick({
        name: true,
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

      const [data] = await db
        .update(categories)
        .set(values)
        .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))
        .returning();

      if (!data) {
        return c.json({ error: "not found" }, 404);
      }

      return c.json({ data });
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

      const [data] = await db
        .delete(categories)
        .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))
        .returning({ id: categories.id });

      if (!data) {
        return c.json({ error: "not found" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
