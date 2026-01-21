import type { Metadata } from "next";
import Signup3Container from "@/components/pages/others/signup3";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your account with Exelero Yachting.",
  alternates: { canonical: "/sign-up" },
};

export default function SignUpPage() {
  return <Signup3Container />;
}

