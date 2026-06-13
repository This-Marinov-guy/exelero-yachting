"use client";
import { useState } from "react";
import { Col, Row } from "reactstrap";
import { Menu } from "lucide-react";
import ProfileSidebar from "./ProfileSidebar";
import DealerInfo from "./DealerInfo";
import UploadBoat from "./UploadBoat";
import BoatsListing from "./BoatsListing";
import CharterRequests from "./CharterRequests";
import TransportationRequests from "./TransportationRequests";

const TAB_LABELS: Record<string, string> = {
  "dealer-info": "Dealer Info",
  "upload-boat": "Upload Boat",
  "boats-listing": "Boats Listing",
  "charter-requests": "Charter Requests",
  "transportation-requests": "Transportation Requests",
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState("dealer-info");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleDealerInfoChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className='profile-main'>
      {/* Mobile header row */}
      <div className="profile-mobile-header d-lg-none">
        <button className="profile-menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <span className="profile-mobile-title">{TAB_LABELS[activeTab]}</span>
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div className="profile-sidebar-backdrop d-lg-none" onClick={() => setSidebarOpen(false)} />
      )}

      <Row>
        <Col lg={3}>
          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            refreshTrigger={refreshTrigger}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </Col>
        <Col lg={9}>
          <div className="profile-content">
            {activeTab === "dealer-info" && <DealerInfo onDataChange={handleDealerInfoChange} />}
            {activeTab === "upload-boat" && <UploadBoat />}
            {activeTab === "boats-listing" && <BoatsListing />}
            {activeTab === "charter-requests" && <CharterRequests />}
            {activeTab === "transportation-requests" && <TransportationRequests />}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
