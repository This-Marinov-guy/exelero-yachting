"use client";

import CommonInput from "@/components/commonComponents/CommonInput";
import { AlreadyAnAccount, ConditionAccept, CreateAnAccount, Href, ImagePath, LogIn, LogInWithFacebook, LogInWithGoogle, PrivacyPolicy, SignUpAccount, Terms, Welcome } from "@/constants";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { RouteList } from "@/utils/RouteList";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { toast } from "sonner";
import { Button } from "reactstrap";

const SignUpMain: FC<{ classname?: string; asPage?: boolean }> = ({ classname, asPage = false }) => {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [fullName, setFullName] = useState("");
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

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: fullName ? { full_name: fullName } : undefined,
        },
      });
      
      if (error) {
        toast.error(error.message || "Unable to create account. Please try again.");
        setLoading(false);
        return;
      }

      if (data.session) {
        toast.success("Account created successfully! Redirecting...");
        router.push(RouteList.Auth.Account);
        return;
      }

      // If email confirmation is enabled, session can be null.
      toast.success("Account created! Please check your email to confirm your account, then sign in.");
      router.push(RouteList.Auth.SignIn);
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className={`${classname ? classname : ""} form-box auth-form-box`}>
      <div className='login-title'>
        <h3>{Welcome}</h3>
        <h5>{SignUpAccount}</h5>
      </div>
      <form className='login-form' onSubmit={handleSubmit}>
        <CommonInput
          inputType='text'
          placeholder='Enter Your Full Name'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete='name'
          disabled={loading}
        />
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
          autoComplete='new-password'
          required
          disabled={loading}
        />
        {/* <div className='form-check-box align-items-start'>
          <input type='checkbox' id='Remember' />
          <label htmlFor='Remember' className='line-height-change'>
            {ConditionAccept}
            <Link href={RouteList.Pages.Other.Condition} className='text-decoration-underline theme-color'>
              {Terms}
            </Link>
            {"as well as the"}
            <Link href={RouteList.Pages.Other.Privacy} className='text-decoration-underline theme-color'>
              {PrivacyPolicy}
            </Link>
          </label>
        </div> */}
        <Button className='btn-solid' type='submit' disabled={loading}>
          {loading ? "Creating account..." : CreateAnAccount}
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
          <h6>{AlreadyAnAccount}</h6>
          <Link href={RouteList.Auth.SignIn}>{LogIn}</Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpMain;
