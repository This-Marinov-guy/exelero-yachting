import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  isAccountPath,
  LOCALE_HEADER,
  localeFromPath,
  localizedPath,
  stripLocale,
} from "@/lib/publicLocale";

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
  "/pages/gallery": "/gallery",
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const pathLocale = localeFromPath(path);
  const publicPath = pathLocale ? stripLocale(path) : path;

  if (pathLocale && isAccountPath(publicPath)) {
    const destination = request.nextUrl.clone();
    destination.pathname = publicPath;
    return NextResponse.redirect(destination, 308);
  }

  if (publicPath === "/sign-up") {
    return new NextResponse("Invitation required", {
      status: 410,
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  }

  if (publicPath === "/sign-in") {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER, "en");
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  if (publicPath === "/auth" || publicPath.startsWith("/auth/")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER, "en");
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  if (publicPath.startsWith("/pages/")) {
    const destination = LEGACY_REDIRECTS[publicPath];
    if (destination) {
      const target = !isAccountPath(destination) ? localizedPath(pathLocale ?? "en", destination) : destination;
      const targetUrl = request.nextUrl.clone();
      targetUrl.pathname = target;
      const response = NextResponse.redirect(targetUrl, 308);
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

  if (pathLocale) {
    const destination = request.nextUrl.clone();
    destination.pathname = publicPath;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER, pathLocale);
    return NextResponse.rewrite(destination, { request: { headers: requestHeaders } });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, "en");

  if (!isAccountPath(path)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return new NextResponse("Account temporarily unavailable", {
      status: 503,
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  }

  let response = NextResponse.next({ request: { headers: requestHeaders } });
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: { headers: requestHeaders } });
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
  matcher: ["/((?!api|_next|assets|fonts|favicon.ico|manifest.json|robots.txt|sitemap.xml|.*\\..*).*)"],
};
