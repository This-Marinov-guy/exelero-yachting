import UserDashboardContainer from "@/components/pages/others/userDashboard";
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Exelero Yachting",
  description: "Manage your Exelero Yachting account, profile, and preferences.",
  openGraph: {
    title: "My Account | Exelero Yachting",
    description: "Manage your Exelero Yachting account, profile, and preferences.",
    url: "/account",
    type: "website",
    images: [breadcrumbOpenGraphImage("Exelero Yachting Account")],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Account | Exelero Yachting",
    description: "Manage your Exelero Yachting account, profile, and preferences.",
    images: [DEFAULT_BREADCRUMB_IMAGE],
  },
};

const AccountPage = () => {
  return <UserDashboardContainer />;
};

export default AccountPage;
