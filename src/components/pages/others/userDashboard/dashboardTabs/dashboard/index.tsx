import { Row } from "reactstrap";
import LatestOrder from "../latestOrder";
import AmazingDeal from "./AmazingDeal";
import JobApplyBanner from "./JobApplyBanner";
import JobApplySlider from "./JobApplySlider";
import MapCard from "./MapCard";
import SaleBanner from "./SaleBanner";
import SalesData from "./SalesData";

const Dashboard = () => {
  return (
    <div className='common-card'>
      <Row className='gy-4'>
        <SalesData />
        <AmazingDeal />
        <LatestOrder />
        <SaleBanner />
        <MapCard />
        <JobApplyBanner />
        <JobApplySlider />
      </Row>
    </div>
  );
};

export default Dashboard;
