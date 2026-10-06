import { isAuthError } from "@supabase/supabase-js";

export function authErrorMessage(error: unknown, fallback: string): string {
  if (isAuthError(error)) {
    switch (error.code) {
      case "invalid_credentials":
        return "Invalid email or password. Try again or use an email sign-in link.";
      case "email_not_confirmed":
        return "Confirm your email using your invitation before signing in.";
      case "email_provider_disabled":
        return "Email sign-in is disabled. Contact the site administrator.";
      case "user_banned":
        return "This account is disabled. Contact the site administrator.";
      case "over_request_rate_limit":
      case "over_email_send_rate_limit":
        return "Too many attempts. Wait a few minutes and try again.";
    }

    if (error.status === 429) return "Too many attempts. Wait a few minutes and try again.";
    if (error.status && error.status >= 500) {
      return "The sign-in service is temporarily unavailable. Please try again.";
    }
    if (error.name === "AuthRetryableFetchError") {
      return "Cannot reach the sign-in service. Check your connection and try again.";
    }
  }

  return error instanceof Error && error.message ? error.message : fallback;
}
