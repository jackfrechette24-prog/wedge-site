// Applies the SQL files in /drizzle to DATABASE_URL. Railway runs this as the pre-deploy command.
// Needs only production dependencies. A failure exits non-zero, which stops the deploy.
import { existsSync } from "node:fs";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import { pgPoolConfig } from "../src/db/pgConfig.mjs";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const pool = new pg.Pool({ ...pgPoolConfig(url), max: 1, connectionTimeoutMillis: 20000 });

try {
  await migrate(drizzle(pool), { migrationsFolder: "drizzle" });
  console.log("Migrations applied.");
} catch (error) {
  console.error("Migration failed:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
