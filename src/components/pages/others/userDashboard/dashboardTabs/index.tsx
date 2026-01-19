import { Href, SettingMenu } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUserDashboardSidebar } from "@/redux/reducers/LayoutSlice";
import Link from "next/link";
import { Col, TabContent, TabPane } from "reactstrap";
import CreateProperty from "../createProperty";
import MyFavorites from "../myFavorites";
import MyProperty from "../MyProperty";
import Privacy from "../privacy";
import Profile from "../profile";
import Dashboard from "./dashboard";

const DashboardTabs = () => {
  const { activeTab } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  return (
    <Col lg={9}>
      <Link scroll={false} href={Href} className='btn-solid filter-btn mb-sm-4 mb-3' onClick={() => dispatch(setUserDashboardSidebar())}>
        {SettingMenu}
      </Link>
      <TabContent activeTab={activeTab}>
        <TabPane tabId={"dashboard"}>
          <Dashboard />
        </TabPane>
        <TabPane tabId={"listing"}>
          <MyProperty />
        </TabPane>
        <TabPane tabId={"property"}>
          <CreateProperty />
        </TabPane>
        <TabPane tabId={"profile"}>
          <Profile />
        </TabPane>
        <TabPane tabId={"favorites"}>
          <MyFavorites />
        </TabPane>
        <TabPane tabId={"privacy"}>
          <Privacy />
        </TabPane>
      </TabContent>
    </Col>
  );
};

export default DashboardTabs;
