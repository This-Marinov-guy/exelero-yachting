"use client";

import CommonInput from "@/components/commonComponents/CommonInput";
import { NotAccount, LogIn, LogInYourAccount, SignUp, Welcome } from "@/constants";
import { getStoredPasskey } from "@/lib/passkeyStorage";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { RouteList } from "@/utils/RouteList";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "reactstrap";

type LoginMainProps = {
  /** When true, renders as a standalone page (no modal toggling). */
  asPage?: boolean;
};

const LoginMain = ({ asPage = false }: LoginMainProps) => {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingAction, setPendingAction] = useState<"password" | "magic-link" | "passkey" | null>(null);

  const loading = pendingAction !== null;
  const accountRedirectUrl = () =>
    typeof window !== "undefined" ? `${window.location.origin}${RouteList.Auth.Account}` : RouteList.Auth.Account;

  const validateEmail = () => {
    if (!email) {
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error("Invalid email or password. Please try again.");
        setPendingAction(null);
        return;
      }
      
      if (!data.session) {
        toast.error("Sign in failed. Please try again.");
        setPendingAction(null);
        return;
      }
      
      toast.success("Signed in successfully! Redirecting...");
      router.push(RouteList.Auth.Account);
    } catch (err: any) {      
      toast.error(err?.message || "An unexpected error occurred. Please try again.");
      setPendingAction(null);
    }
  };

  const handleMagicLink = async () => {
    if (!validateEmail()) return;

    setPendingAction("magic-link");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: accountRedirectUrl(),
        },
      });

      if (error) throw error;
      toast.success("Magic link sent. Check your email to continue to your account.");
    } catch (err: any) {
      toast.error(err?.message || "Unable to send the magic link.");
    } finally {
      setPendingAction(null);
    }
  };

  const handlePasskeyLogin = async () => {
    if (!validateEmail()) return;

    if (typeof window === "undefined" || !window.PublicKeyCredential) {
      toast.error("This browser does not support passkeys.");
      return;
    }

    const storedPasskey = getStoredPasskey(email);
    if (!storedPasskey?.factorId) {
      toast.error("No passkey is saved for this email on this browser. Sign in first, then add a passkey in account settings.");
      return;
    }

    setPendingAction("passkey");
    try {
      const { data, error } = await supabase.auth.mfa.webauthn.authenticate({
        factorId: storedPasskey.factorId,
        webauthn: {
          rpId: window.location.hostname,
          rpOrigins: [window.location.origin],
        },
      });

      if (error) throw error;
      if (!data) throw new Error("Passkey sign in failed.");

      toast.success("Signed in with passkey. Redirecting...");
      router.push(RouteList.Auth.Account);
    } catch (err: any) {
      toast.error(err?.message || "Unable to sign in with passkey.");
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
            {pendingAction === "magic-link" ? "Sending..." : "Reset pass"}
          </Button>
          <Button className='btn-solid auth-secondary-action' type='button' onClick={handlePasskeyLogin} disabled={loading}>
            {pendingAction === "passkey" ? "Checking..." : "Passkey"}
          </Button>
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
          <h6>{NotAccount}</h6>
          <Link href={RouteList.Auth.SignUp}>{SignUp}</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginMain;
