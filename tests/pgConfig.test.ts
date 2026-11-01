import { describe, expect, it } from "vitest";
import { pgPoolConfig } from "@/db/pgConfig.mjs";

const LENIENT_SSL = { rejectUnauthorized: false };

describe("pgPoolConfig", () => {
  it("uses SSL on Railway's public URL, without verifying its self-signed certificate", () => {
    expect(pgPoolConfig("postgresql://u:p@mainline.proxy.rlwy.net:12345/railway").ssl).toEqual(LENIENT_SSL);
  });

  it("does not use SSL on Railway's private network", () => {
    expect(pgPoolConfig("postgresql://u:p@postgres.railway.internal:5432/railway").ssl).toBe(false);
  });

  it.each(["localhost", "127.0.0.1", "[::1]", "postgres"])("does not use SSL on local host %s", (host) => {
    expect(pgPoolConfig(`postgresql://u:p@${host}:5432/db`).ssl).toBe(false);
  });

  it("lets sslmode in the URL win, and removes it so pg can't re-enable verification", () => {
    const disabled = pgPoolConfig("postgresql://u:p@mainline.proxy.rlwy.net:1/db?sslmode=disable");
    expect(disabled.ssl).toBe(false);
    expect(disabled.connectionString).not.toContain("sslmode");

    const required = pgPoolConfig("postgresql://u:p@postgres.railway.internal:5432/db?sslmode=require");
    expect(required.ssl).toEqual(LENIENT_SSL);
    expect(required.connectionString).not.toContain("sslmode");
  });

  it("keeps the credentials and other URL parts", () => {
    expect(pgPoolConfig("postgresql://u:p%40ss@host.example:5432/db?application_name=wedge").connectionString).toBe(
      "postgresql://u:p%40ss@host.example:5432/db?application_name=wedge",
    );
  });
});
