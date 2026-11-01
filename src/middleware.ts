import { NextResponse, type NextRequest } from "next/server";

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };

function safeEqual(a: string, b: string) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function authorized(header: string | null) {
  const { ADMIN_USER, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_USER || !ADMIN_PASSWORD || !header?.startsWith("Basic ")) return false;
  let decoded: string;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return false;
  }
  const split = decoded.indexOf(":");
  if (split < 0) return false;
  const userOk = safeEqual(decoded.slice(0, split), ADMIN_USER);
  const passwordOk = safeEqual(decoded.slice(split + 1), ADMIN_PASSWORD);
  return userOk && passwordOk;
}

/** Browsers send Basic Auth automatically, so block POSTs that come from other sites. */
function crossSite(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (request.method !== "POST" || !origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  if (!authorized(request.headers.get("authorization"))) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Wedge admin"', "X-Robots-Tag": "noindex" },
    });
  }
  if (crossSite(request)) return new NextResponse("Forbidden", { status: 403 });
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex");
  return response;
}
