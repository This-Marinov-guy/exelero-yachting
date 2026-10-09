import dynamic from "next/dynamic";
import type { AccountTabId } from "../accountTabs";
import styles from "../AdminShell.module.scss";
import PartnerManagerSkeleton from "../partners/PartnerManagerSkeleton";
import CharterInquirySkeleton from "../profile/CharterInquirySkeleton";
import AccountSkeleton from "../AccountSkeleton";
const DealerInfo = dynamic(() => import("../profile/DealerInfo"), { loading: () => <AccountSkeleton kind="dealers" /> });
const BoatDraftsList = dynamic(() => import("../profile/BoatDraftsList"), { loading: () => <AccountSkeleton kind="drafts" /> });
const UploadBoat = dynamic(() => import("../profile/UploadBoat"), { loading: () => <AccountSkeleton kind="boat-form" /> });
const BoatsListing = dynamic(() => import("../profile/BoatsListing"), { loading: () => <AccountSkeleton kind="boats" /> });
const CharterRequests = dynamic(() => import("../profile/CharterRequests"), { loading: () => <CharterInquirySkeleton /> });
const TransportationRequests = dynamic(() => import("../profile/TransportationRequests"), { loading: () => <CharterInquirySkeleton kind="transportation" /> });
const ContactInquiries = dynamic(() => import("../profile/ContactInquiries"), { loading: () => <CharterInquirySkeleton kind="boat" /> });
const AccountSettings = dynamic(() => import("../profile/AccountSettings"), { loading: () => <AccountSkeleton kind="settings" /> });
const PartnerManager = dynamic(() => import("../partners/PartnerManager"), { loading: PartnerManagerSkeleton });
const ServiceContentManager = dynamic(() => import("../serviceContent/ServiceContentManager"), { loading: () => <AccountSkeleton /> });
const TrackingDashboard = dynamic(() => import("../tracking/TrackingDashboard"), { loading: () => <AccountSkeleton kind="tracking" /> });
export default function DashboardTabs({ activeTab, onDirtyChange }: { activeTab: AccountTabId; onDirtyChange: (dirty: boolean) => void }) {
  if (activeTab === "tracking") return <TrackingDashboard />;
  if (activeTab === "partners") return <PartnerManager onDirtyChange={onDirtyChange} />;
  if (activeTab === "charter-content") return <ServiceContentManager key="charters" page="charters" />;
  if (activeTab === "transportation-content") return <ServiceContentManager key="transportation" page="transportation" />;
  return <div className={styles.legacy}>
    {activeTab === "dealer-info" && <DealerInfo />}
    {activeTab === "account-settings" && <AccountSettings />}
    {activeTab === "upload-boat" && <><UploadBoat /><BoatDraftsList /></>}
    {activeTab === "boats-listing" && <BoatsListing />}
    {activeTab === "boat-inquiries" && <ContactInquiries kind="boat" />}
    {activeTab === "partner-inquiries" && <ContactInquiries kind="partner" />}
    {activeTab === "charter-requests" && <CharterRequests />}
    {activeTab === "transportation-requests" && <TransportationRequests />}
  </div>;
}
