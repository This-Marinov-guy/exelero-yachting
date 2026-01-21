"use client";

import CommonInput from "@/components/commonComponents/CommonInput";
import { NotAccount, ImagePath, LogIn, LogInWithFacebook, LogInWithGoogle, LogInYourAccount, Remember, SignUp, Welcome, Href } from "@/constants";
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }
      
      if (!data.session) {
        toast.error("Sign in failed. Please try again.");
        setLoading(false);
        return;
      }
      
      toast.success("Signed in successfully! Redirecting...");
      router.push(RouteList.Auth.Account);
    } catch (err: any) {      
      toast.error(err?.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
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
          {loading ? "Signing in..." : LogIn}
        </Button>
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
