"use client";

import CommonInput from "@/components/commonComponents/CommonInput";
import { LogIn, LogInYourAccount, Welcome } from "@/constants";
import { authErrorMessage } from "@/lib/authErrorMessage";
import { getSupabaseBrowserClient, isLocalSupabase } from "@/lib/supabaseClient";
import { RouteList } from "@/utils/RouteList";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "reactstrap";

type LoginMainProps = {
  /** When true, renders as a standalone page (no modal toggling). */
  asPage?: boolean;
};

const LoginMain = ({ asPage = false }: LoginMainProps) => {
  const supabase = getSupabaseBrowserClient();
  const localAuth = isLocalSupabase();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingAction, setPendingAction] = useState<"password" | "magic-link" | "passkey" | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("error") === "invalid-link") {
      // Let the layout's toaster subscribe before publishing the notification.
      const timer = window.setTimeout(() => {
        toast.error("This sign-in link could not be verified. Request a new link and open it in this browser.", {
          id: "invalid-sign-in-link",
        });
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const loading = pendingAction !== null;
  const accountDestination = () => {
    if (typeof window === "undefined") return RouteList.Auth.Account;
    const requested = new URLSearchParams(window.location.search).get("next");
    if (!requested) return RouteList.Auth.Account;
    try {
      const parsed = new URL(requested, window.location.origin);
      return parsed.origin === window.location.origin &&
        (parsed.pathname === "/account" || parsed.pathname.startsWith("/account/"))
        ? parsed.pathname + parsed.search
        : RouteList.Auth.Account;
    } catch {
      return RouteList.Auth.Account;
    }
  };
  const accountRedirectUrl = () =>
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(accountDestination())}`
      : RouteList.Auth.Account;

  const validateEmail = () => {
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return false;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!validateEmail()) {
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setPendingAction("password");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      
      if (error) throw error;
      
      if (!data.session) {
        toast.error("Sign in failed. Please try again.");
        setPendingAction(null);
        return;
      }
      
      toast.success("Signed in successfully! Redirecting...");
      // Start a fresh server request with the saved session cookies.
      window.location.assign(accountDestination());
    } catch (err: unknown) {
      toast.error(authErrorMessage(err, "Unable to sign in. Please try again."));
      setPendingAction(null);
    }
  };

  const handleMagicLink = async () => {
    if (!validateEmail()) return;

    setPendingAction("magic-link");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false,
          emailRedirectTo: accountRedirectUrl(),
        },
      });

      if (error) throw error;
      toast.success(localAuth ? "Sign-in link sent to the local email inbox." : "Magic link sent. Check your email to continue to your account.");
    } catch (err: unknown) {
      toast.error(authErrorMessage(err, "Unable to send the sign-in link. Please try again."));
    } finally {
      setPendingAction(null);
    }
  };

  const handlePasskeyLogin = async () => {
    if (typeof window === "undefined" || !window.PublicKeyCredential) {
      toast.error("This browser does not support passkeys.");
      return;
    }

    setPendingAction("passkey");
    try {
      const { data, error } = await supabase.auth.signInWithPasskey();

      if (error) throw error;
      if (!data?.session) throw new Error("Passkey sign in failed.");

      toast.success("Signed in with passkey. Redirecting...");
      window.location.assign(accountDestination());
    } catch (err: unknown) {
      toast.error(authErrorMessage(err, "Unable to sign in with passkey."));
      setPendingAction(null);
    }
  };

  return (
    <div className='form-box auth-form-box'>
      <div className='login-title'>
        <h3>{Welcome}</h3>
        <h5>{LogInYourAccount}</h5>
      </div>
      <form className='login-form' onSubmit={handleSubmit}>
        <CommonInput
          inputType='email'
          placeholder='Enter Your Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete='email'
          required
          disabled={loading}
        />
        <CommonInput
          inputType='password'
          placeholder='Enter Your password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete='current-password'
          required
          disabled={loading}
        />
        {/* <div className='form-check-box'>
          <input type='checkbox' id='Remember' />
          <label htmlFor='Remember'>{Remember}</label>
        </div> */}
        <Button className='btn-solid' type='submit' disabled={loading}>
          {pendingAction === "password" ? "Signing in..." : LogIn}
        </Button>
        <div className='auth-alt-actions'>
          <Button className='btn-solid auth-secondary-action' type='button' onClick={handleMagicLink} disabled={loading}>
            {pendingAction === "magic-link" ? "Sending..." : "Email sign-in link"}
          </Button>
          {!localAuth && <Button className='btn-solid auth-secondary-action' type='button' onClick={handlePasskeyLogin} disabled={loading}>
            {pendingAction === "passkey" ? "Checking..." : "Passkey"}
          </Button>}
        </div>
        {/* <div className='text-divider'>
          <span>OR</span>
        </div>
        <ul className='login-social'>
          <li>
            <Link href='https://www.google.com/' target='_blank'>
              <img src={`${ImagePath}/other/google.png`} alt='facebook' className='img-fluid' />
              <span>{LogInWithGoogle}</span>
            </Link>
          </li>
          <li>
            <Link href='https://www.facebook.com/' target='_blank'>
              <img src={`${ImagePath}/other/facebook.png`} alt='facebook' className='img-fluid' />
              <span>{LogInWithFacebook}</span>
            </Link>
          </li>
        </ul> */}
        <div className='signup-box'>
          <h6>Accounts are available by invitation.</h6>
          <Link href={RouteList.Pages.Other.ContactUs1}>Contact us for access</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginMain;
