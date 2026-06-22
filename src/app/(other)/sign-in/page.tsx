import type { Metadata } from "next";
import Login3Container from "@/components/pages/others/login3";
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Exelero Yachting account.",
  openGraph: {
    title: "Sign In | Exelero Yachting",
    description: "Sign in to your Exelero Yachting account.",
    url: "/sign-in",
    type: "website",
    images: [breadcrumbOpenGraphImage("Sign In to Exelero Yachting")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In | Exelero Yachting",
    description: "Sign in to your Exelero Yachting account.",
    images: [DEFAULT_BREADCRUMB_IMAGE],
  },
  alternates: { canonical: "/sign-in" },
};

export default function SignInPage() {
  return <Login3Container />;
}

