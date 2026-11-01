// Plain JS so the app and the migration script (run with plain node) share one connection rule.

const isPrivateHost = (hostname) =>
  !hostname.includes(".") ||
  hostname.endsWith(".railway.internal") ||
  hostname.startsWith("127.") ||
  hostname === "[::1]";

/**
 * Railway's public URL needs SSL and uses a self-signed certificate, so the certificate can't be
 * verified. The private network URL doesn't use SSL. A sslmode in the URL always wins.
 */
export function pgPoolConfig(databaseUrl) {
  const url = new URL(databaseUrl);
  const sslmode = url.searchParams.get("sslmode");
  // Removed because pg would otherwise read it and turn certificate verification back on.
  url.searchParams.delete("sslmode");
  const useSsl = sslmode ? sslmode !== "disable" : !isPrivateHost(url.hostname);
  return { connectionString: url.toString(), ssl: useSsl ? { rejectUnauthorized: false } : false };
}
