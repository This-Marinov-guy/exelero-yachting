import { createClient } from "@supabase/supabase-js";

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env vars. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createClient(url, anonKey);
}

// Public SSR reads should fail promptly so a Supabase outage does not stall page rendering.
export function getSupabasePublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing public Supabase configuration.");
  }

  return createClient(url, anonKey, {
    db: { retry: false },
    global: {
      fetch: (input, init) => {
        const signal = init?.signal ?? (input instanceof Request ? input.signal : undefined);
        return fetch(input, {
          ...init,
          signal: signal
            ? AbortSignal.any([signal, AbortSignal.timeout(5000)])
            : AbortSignal.timeout(5000),
        });
      },
    },
  });
}

export function logPublicDataError(context: string, error: unknown) {
  const message = error && typeof error === "object" && "message" in error && typeof error.message === "string"
    ? error.message
    : String(error);
  console.error(`${context}: ${message}`);
}
