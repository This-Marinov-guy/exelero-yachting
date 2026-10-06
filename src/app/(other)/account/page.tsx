import UserDashboardContainer from "@/components/pages/others/userDashboard";
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";
import type { Metadata } from "next";
import { requireAuthenticatedUser } from "@/lib/supabaseAuthServer";

export const metadata: Metadata = {
  title: "Site admin",
  description: "Manage website content, inquiries, traffic reports and account settings.",
  openGraph: {
    title: "Site admin",
    description: "Manage website content, inquiries, traffic reports and account settings.",
    url: "/account",
    type: "website",
    images: [breadcrumbOpenGraphImage("Exelero Yachting Account")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Site admin",
    description: "Manage website content, inquiries, traffic reports and account settings.",
    images: [DEFAULT_BREADCRUMB_IMAGE],
  },
  robots: { index: false, follow: false },
};

const AccountPage = async () => {
  await requireAuthenticatedUser();
  return <div data-clarity-mask="true"><UserDashboardContainer /></div>;
};

export default AccountPage;
