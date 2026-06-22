import type { Metadata } from "next";
import Signup3Container from "@/components/pages/others/signup3";
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your account with Exelero Yachting.",
  openGraph: {
    title: "Sign Up | Exelero Yachting",
    description: "Create your account with Exelero Yachting.",
    url: "/sign-up",
    type: "website",
    images: [breadcrumbOpenGraphImage("Sign Up for Exelero Yachting")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up | Exelero Yachting",
    description: "Create your account with Exelero Yachting.",
    images: [DEFAULT_BREADCRUMB_IMAGE],
  },
  alternates: { canonical: "/sign-up" },
};

export default function SignUpPage() {
  return <Signup3Container />;
}

