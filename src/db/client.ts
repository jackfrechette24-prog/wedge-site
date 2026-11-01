import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { pgPoolConfig } from "./pgConfig.mjs";
import * as schema from "./schema";

function createDb(url: string) {
  const pool = new Pool({
    ...pgPoolConfig(url),
    max: 5,
    // Fail fast when the database is down, so the lead can still go to the webhook.
    connectionTimeoutMillis: 5000,
    query_timeout: 10000,
    idleTimeoutMillis: 30000,
    keepAlive: true,
  });
  // Without this listener, a dropped idle connection would crash the server.
  pool.on("error", (error) => console.error("[db] idle connection error", error));
  return drizzle(pool, { schema });
}

let db: ReturnType<typeof createDb> | undefined;

/** Throws if DATABASE_URL is missing. Callers treat that like any other database failure. */
export function getDb() {
  if (db) return db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  db = createDb(url);
  return db;
}
