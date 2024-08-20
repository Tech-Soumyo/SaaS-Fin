import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { accounts } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
// import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";

const app = new Hono().get("/", clerkMiddleware(), async (c) => {
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
        id: accounts.id, // Select user ID
        name: accounts.name, // Select user name
      })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId)); // Filter by authenticated user ID

    // Return retrieved user data in JSON format
    return c.json({ data });
  } catch (error) {
    // Handle unexpected errors during data retrieval (optional, consider specific error handling)
    console.error("Error retrieving user data:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
