import { Href, SettingMenu } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUserDashboardSidebar } from "@/redux/reducers/LayoutSlice";
import Link from "next/link";
import { Col, TabContent, TabPane } from "reactstrap";
import DealerInfo from "../profile/DealerInfo";
import UploadBoat from "../profile/UploadBoat";
import BoatsListing from "../profile/BoatsListing";

const DashboardTabs = () => {
  const { activeTab } = useAppSelector((state) => state.layout);
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
        <TabPane tabId={"upload-boat"}>
          <UploadBoat />
        </TabPane>
        <TabPane tabId={"boats-listing"}>
          <BoatsListing />
        </TabPane>
      </TabContent>
    </Col>
  );
};

export default DashboardTabs;
