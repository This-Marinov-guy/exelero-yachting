import type { Metadata } from "next";
import Login3Container from "@/components/pages/others/login3";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Exelero Yachting account.",
  alternates: { canonical: "/sign-in" },
};

export default function SignInPage() {
  return <Login3Container />;
}

