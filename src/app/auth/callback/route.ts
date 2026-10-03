import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const OTP_TYPES = new Set([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

export async function GET(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return new NextResponse("Authentication unavailable", {
      status: 503,
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  }

  const requestedNext = request.nextUrl.searchParams.get("next") || "/account";
  let next = "/account";
  try {
    const nextUrl = new URL(requestedNext, request.url);
    if (
      nextUrl.origin === request.nextUrl.origin &&
      (nextUrl.pathname === "/account" || nextUrl.pathname.startsWith("/account/"))
    ) {
      next = nextUrl.pathname + nextUrl.search;
    }
  } catch {
    // Malformed return paths fall back to the account page.
  }

  const response = NextResponse.redirect(new URL(next, request.url));
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
        Object.entries(headers).forEach(([name, value]) =>
          response.headers.set(name, value)
        );
      },
    },
  });

  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const result = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type && OTP_TYPES.has(type)
      ? await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as "signup" | "invite" | "magiclink" | "recovery" | "email_change" | "email",
        })
      : null;

  if (!result || result.error) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("error", "invalid-link");
    const failed = NextResponse.redirect(signIn);
    response.cookies.getAll().forEach((cookie) => failed.cookies.set(cookie));
    failed.headers.set("X-Robots-Tag", "noindex, nofollow");
    failed.headers.set("Cache-Control", "private, no-store");
    return failed;
  }

  return response;
}
