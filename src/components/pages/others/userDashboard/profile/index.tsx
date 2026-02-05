"use client";
import { useState } from "react";
import { Col, Row } from "reactstrap";
import ProfileSidebar from "./ProfileSidebar";
import DealerInfo from "./DealerInfo";
import UploadBoat from "./UploadBoat";
import BoatsListing from "./BoatsListing";
import CharterRequests from "./CharterRequests";
import TransportationRequests from "./TransportationRequests";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("dealer-info");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDealerInfoChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className='profile-main'>
      <Row>
        <Col lg={3}>
          <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} refreshTrigger={refreshTrigger} />
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
