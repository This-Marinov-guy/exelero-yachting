import { Metadata } from "next";
import UserDashboardContainer from "@/components/pages/others/userDashboard";
import { DEFAULT_BREADCRUMB_IMAGE, breadcrumbOpenGraphImage } from "@/utils/socialMetadata";

export const metadata: Metadata = {
  title: "User-dashboard | Exelero Yachting",
  description: "Exelero Yachting - User-dashboard - luxury yachts, brokerage, charters and marine services.",
  openGraph: {
    title: "User-dashboard | Exelero Yachting",
    description: "Exelero Yachting - User-dashboard - luxury yachts, brokerage, charters and marine services.",
    url: "/pages/other/user-dashboard",
    type: "website",
    images: [breadcrumbOpenGraphImage("Exelero Yachting User Dashboard")],
  },
  twitter: {
    card: "summary_large_image",
    title: "User-dashboard | Exelero Yachting",
    description: "Exelero Yachting - User-dashboard - luxury yachts, brokerage, charters and marine services.",
    images: [DEFAULT_BREADCRUMB_IMAGE],
  },
};

const UserDashboard = () => {
  return <UserDashboardContainer />;
};

export default UserDashboard;
