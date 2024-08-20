import { Hono } from "hono";
import { handle } from "hono/vercel";
// import test from "node:test";
// import { z } from "zod";
// import { zValidator } from "@hono/zod-validator";
// import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import accounts from "./accounts";
// import { HTTPException } from "hono/http-exception";
export const runtime = "edge";

const app = new Hono().basePath("/api");

// app.onError((err, c) => {
//   if (err instanceof HTTPException) {
//     return err.getResponse();
//   }
//   return c.json(
//     {
//       error: "Internal error",
//     },
//     500
//   );
// });

const routes = app.route("/accounts", accounts);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;

// app.use("*", clerkMiddleware()).get("/home", clerkMiddleware(), (c) => {
//   const auth = getAuth(c);

//   if (!auth?.userId) {
//     return c.json({
//       message: "You are not logged in.",
//     });
//   }

//   return c.json({
//     message: "You are logged in!",
//     userId: auth.userId,
//   });
// });
// app
//   .get("/hello", (c) => {
//     return c.json({
//       message: "Hello Next.js!",
//     });
//   })
//   .get("/hello/:id", (c) => {
//     return c.json({
//       message: "It is my id",
//       test: test,
//     });
//   })
//   .post(
//     "/create/:postId",
//     zValidator(
//       "json",
//       z.object({
//         name: z.string(),
//         userId: z.number(),
//       })
//     ),
//     zValidator(
//       "param",
//       z.object({
//         postId: z.number(),
//       })
//     ),
//     (c) => {
//       const { name, userId } = c.req.valid("json");
//       const { postId } = c.req.valid("param");
//       // ... use your validated data
//       return c.json({});
//     }
//   );

// export const GET = handle(app);
// export const POST = handle(app);

// export type AppType = typeof routes;
