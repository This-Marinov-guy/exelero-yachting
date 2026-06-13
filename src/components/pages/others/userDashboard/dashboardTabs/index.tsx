import { Href, SettingMenu } from "@/constants";
import { useAppDispatch } from "@/redux/hooks";
import { setUserDashboardSidebar } from "@/redux/reducers/LayoutSlice";
import Link from "next/link";
import { Col, TabContent, TabPane } from "reactstrap";
import DealerInfo from "../profile/DealerInfo";
import UploadBoat from "../profile/UploadBoat";
import BoatsListing from "../profile/BoatsListing";
import CharterRequests from "../profile/CharterRequests";
import TransportationRequests from "../profile/TransportationRequests";
import AccountSettings from "../profile/AccountSettings";
import { AccountTabId } from "../accountTabs";

type DashboardTabsProps = {
  activeTab: AccountTabId;
};

const DashboardTabs = ({ activeTab }: DashboardTabsProps) => {
  const dispatch = useAppDispatch();
  return (
    <Col lg={9} className="mt-3">
      <Link scroll={false} href={Href} className='btn-solid filter-btn mb-sm-4 mb-3' onClick={() => dispatch(setUserDashboardSidebar())}>
        {SettingMenu}
      </Link>
      <TabContent activeTab={activeTab}>
        <TabPane tabId={"dealer-info"}>
          <DealerInfo />
        </TabPane>
        <TabPane tabId={"account-settings"}>
          <AccountSettings />
        </TabPane>
        <TabPane tabId={"upload-boat"}>
          <UploadBoat />
        </TabPane>
        <TabPane tabId={"boats-listing"}>
          <BoatsListing />
        </TabPane>
        <TabPane tabId={"charter-requests"}>
          <CharterRequests />
        </TabPane>
        <TabPane tabId={"transportation-requests"}>
          <TransportationRequests />
        </TabPane>
      </TabContent>
    </Col>
  );
};

export default DashboardTabs;
