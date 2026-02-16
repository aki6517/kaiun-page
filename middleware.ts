import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const REALM = "Tracking Settings";

function notFoundResponse() {
  return new NextResponse("Not Found", { status: 404 });
}

function unauthorizedResponse() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`
    }
  });
}

function isAuthorized(request: NextRequest, username: string, password: string): boolean {
  const header = request.headers.get("authorization");
  if (!header || !header.startsWith("Basic ")) return false;

  try {
    const encoded = header.slice("Basic ".length).trim();
    const decoded = atob(encoded);
    const [inputUser, ...rest] = decoded.split(":");
    const inputPassword = rest.join(":");
    return inputUser === username && inputPassword === password;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const username = process.env.TRACKING_ADMIN_USER;
  const password = process.env.TRACKING_ADMIN_PASSWORD;

  if (!username || !password) {
    return notFoundResponse();
  }

  if (!isAuthorized(request, username, password)) {
    return unauthorizedResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/settings/tracking-tags/:path*"]
};
