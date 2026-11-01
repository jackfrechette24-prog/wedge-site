import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// The HTTP driver holds no open sockets, so a suspended Neon database simply wakes on the next query.
function createDb(url: string) {
  // Lets tests point the driver at a local HTTP proxy in front of Postgres.
  if (process.env.NEON_FETCH_ENDPOINT) neonConfig.fetchEndpoint = process.env.NEON_FETCH_ENDPOINT;
  return drizzle(neon(url), { schema });
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
