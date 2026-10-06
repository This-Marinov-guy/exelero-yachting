import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LEGACY_REDIRECTS: Record<string, string> = {
  "/pages/other/about-1": "/about",
  "/pages/other/about-2": "/about",
  "/pages/other/about-3": "/about",
  "/pages/other/contact-1": "/contact",
  "/pages/other/contact-2": "/contact",
  "/pages/other/contact-3": "/contact",
  "/pages/other/login-1": "/sign-in",
  "/pages/login-2": "/sign-in",
  "/pages/login-3": "/sign-in",
  "/pages/other/login-4": "/sign-in",
  "/pages/other/signup-1": "/sign-up",
  "/pages/signup-2": "/sign-up",
  "/pages/signup-3": "/sign-up",
  "/pages/other/user-dashboard": "/account",
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path === "/gallery") {
    return new NextResponse("Gone", {
      status: 410,
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  }

  if (path === "/sign-up") {
    return new NextResponse("Invitation required", {
      status: 410,
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  }

  if (path === "/sign-in") {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  if (path.startsWith("/pages/")) {
    const destination = LEGACY_REDIRECTS[path];
    if (destination) {
      const response = NextResponse.redirect(new URL(destination, request.url), 308);
      if (["/sign-in", "/sign-up", "/account"].includes(destination)) {
        response.headers.set("X-Robots-Tag", "noindex, nofollow");
        response.headers.set("Cache-Control", "private, no-store");
      }
      return response;
    }

    return new NextResponse("Gone", {
      status: 410,
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return new NextResponse("Account temporarily unavailable", {
      status: 503,
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
        Object.entries(headers).forEach(([name, value]) =>
          response.headers.set(name, value)
        );
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) {
    const destination = new URL("/sign-in", request.url);
    destination.searchParams.set("next", path + request.nextUrl.search);
    const redirectResponse = NextResponse.redirect(destination);
    response.cookies.getAll().forEach((cookie) =>
      redirectResponse.cookies.set(cookie)
    );
    redirectResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
    redirectResponse.headers.set("Cache-Control", "private, no-store");
    return redirectResponse;
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/account/:path*", "/pages/:path*", "/gallery", "/sign-up", "/sign-in"],
};
