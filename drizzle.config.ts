import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { parse } from "pg-connection-string"; // You can use this library to parse the connection string

config({ path: ".env" });

const dbConfig = parse(process.env.DATABASE_URL!);

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: dbConfig.host!,
    port: dbConfig.port ? parseInt(dbConfig.port) : undefined,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database!,
    ssl: dbConfig.ssl as boolean | undefined, // Adjust this as needed
  },
  verbose: true,
  strict: true,
});
